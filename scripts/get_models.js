import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

let API_KEY = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
    if (match) {
        API_KEY = match[1].trim();
    }
} catch (e) {
    console.error("Error reading .env:", e);
}

if (!API_KEY) {
    console.error("❌ Error: VITE_GEMINI_API_KEY not found in .env");
    process.exit(1);
}

async function listModels() {
    console.log("🔍 Conectando con Google AI para listar modelos...");
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Just to instantiate
        // Note: The SDK might not expose listModels directly easily in all versions, 
        // but let's try the standard way if available, or just test a few key ones.
        
        // Actually, listing models usually requires the Admin SDK or specific endpoint.
        // For standard API keys, we often just text if specific models work.
        // However, let's try to infer from a known list or checking capabilities.
        
        console.log("✅ API Key válida. Probando modelos específicos para autonomía...");

        const candidates = [
            "gemini-2.0-flash-exp",
            "gemini-1.5-pro",
            "gemini-1.5-flash",
            "gemini-1.0-pro"
        ];

        for (const modelName of candidates) {
            try {
                process.stdout.write(`Testing ${modelName}... `);
                const m = genAI.getGenerativeModel({ model: modelName });
                const result = await m.generateContent("Ping");
                const response = await result.response;
                console.log(`✅ OK`);
            } catch (e) {
                console.log(`❌ FAILED: ${e.message}`);
            }
        }

    } catch (error) {
        console.error("Error general:", error);
    }
}

listModels();
