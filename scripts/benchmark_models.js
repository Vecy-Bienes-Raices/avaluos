
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.VITE_GEMINI_API_KEY;

async function testGeneration(modelName, apiVersion) {
    console.log(`\n📡 Testing Generation: ${modelName} (${apiVersion})...`);
    try {
        const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${apiKey}`;
        const body = {
            contents: [{ parts: [{ text: "Responde solo con la palabra: OK" }] }]
        };
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'http://localhost:5701',
                'Origin': 'http://localhost:5701'
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            console.log(`✅ SUCCESS: ${data.candidates[0].content.parts[0].text.trim()}`);
            return true;
        } else {
            console.log(`❌ FAILURE: ${JSON.stringify(data)}`);
            return false;
        }
    } catch (error) {
        console.error(`Error testing ${modelName}:`, error.message);
        return false;
    }
}

async function run() {
    console.log("🚀 Starting Model Benchmark (2.5 - 3.1)...");
    
    // Testing the power houses
    await testGeneration('gemini-3.1-pro-preview', 'v1beta');
    await testGeneration('gemini-3-pro-preview', 'v1beta');
    await testGeneration('gemini-2.5-pro', 'v1');
    
    // Testing the speedsters
    await testGeneration('gemini-3-flash-preview', 'v1beta');
    await testGeneration('gemini-2.5-flash', 'v1');
}

run();
