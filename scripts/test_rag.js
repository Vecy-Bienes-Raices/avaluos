import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

// Manual "ragService" logic for testing (since we can't easily import from src without babel/vite in plain node)

async function generateEmbedding(text) {
    try {
         const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`;
         const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'http://localhost:5701/' 
            },
            body: JSON.stringify({
                model: "models/text-embedding-004",
                content: { parts: [{ text: text }] }
            })
        });
        const data = await response.json();
        return data.embedding.values;
    } catch (e) { console.error(e); return null; }
}

async function runTest() {
    const query = "Vecina, ¿qué impacto tiene el tratamiento de Renovación Urbana en un inmueble cerca al Corredor de la Séptima según el POT 2022?";
    console.log(`\n🧠 PREGUNTA: "${query}"\n`);
    console.log("... Generando vector de búsqueda ...");

    const embedding = await generateEmbedding(query);
    if (!embedding) return;

    console.log("... Consultando 'knowledge_base' en Supabase ...");

    const { data: documents, error } = await supabase.rpc('match_knowledge', {
        query_embedding: embedding,
        match_threshold: 0.5, 
        match_count: 3
    });

    if (error) {
        console.error("❌ Error RPC:", error.message);
        return;
    }

    if (documents && documents.length > 0) {
        console.log("\n✅ RAG RETRIEVAL EXITOSO:\n");
        documents.forEach((doc, i) => {
            console.log(`[DOC ${i+1}] (Similitud: ${(doc.similarity * 100).toFixed(1)}%)`);
            console.log(`Fuente: ${doc.metadata?.source || 'Desconocida'}`);
            console.log(`Contenido: ${doc.content.substring(0, 150)}...\n`);
        });
    } else {
        console.log("\n⚠️ CEREBRO VACÍO: No se encontraron coincidencias. (¿Ya ejecutaste la ingesta?)");
    }
}

runTest();
