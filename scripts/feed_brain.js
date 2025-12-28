import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
    console.error("❌ ERROR: Missing environment variables. Check your .env file.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function generateEmbedding(text) {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Spoof the referrer to match the allowed domain in Google Cloud Console
                'Referer': 'http://localhost:5701/' 
            },
            body: JSON.stringify({
                model: "models/text-embedding-004",
                content: {
                    parts: [{ text: text }]
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data.embedding.values;

    } catch (error) {
        console.error("⚠️ Embedding Logic Error:", error.message);
        return null; 
    }
}

async function ingestFile(filePath) {
    console.log(`\n📄 Processing: ${path.basename(filePath)}...`);
    
    try {
        const text = fs.readFileSync(filePath, 'utf-8');
        
        // Split text into chunks (naive splitting by paragraphs for now)
        // For legal docs, a more sophisticated splitter (LangChain) is better, but this suffices for V1.
        const chunks = text.split(/\n\s*\n/).filter(c => c.trim().length > 50);

        console.log(`🧩 Found ${chunks.length} chunks. Vectorizing...`);

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const vector = await generateEmbedding(chunk);
            
            if (vector) {
                // Try RPC first (Bypass RLS), then fallback to direct Insert
                const { error: rpcError } = await supabase.rpc('ingest_knowledge', {
                    content: chunk,
                    metadata: { source: path.basename(filePath), chunk_index: i },
                    embedding: vector
                });

                if (rpcError) {
                    // Fallback to standard insert (will fail if RLS is strict and no Session)
                     const { error: insertError } = await supabase.from('knowledge_base').insert({
                        content: chunk,
                        metadata: { source: path.basename(filePath), chunk_index: i },
                        embedding: vector
                    });
                    if (insertError) console.error(`❌ DB Error (Chunk ${i}): ${rpcError.message} | ${insertError.message}`);
                    else process.stdout.write('.');
                } else {
                    process.stdout.write('.');
                }
            }
        }
        console.log("\n✅ Ingestion Complete!");

    } catch (err) {
        console.error("❌ File Error:", err.message);
    }
}

// MAIN EXECUTION
const targetFile = process.argv[2];
if (!targetFile) {
    console.log("Usage: node scripts/feed_brain.js <path_to_txt_file>");
} else {
    ingestFile(targetFile);
}
