
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.VITE_GEMINI_API_KEY;

async function listModels(version) {
    console.log(`\n--- Listing Models for API ${version} ---`);
    try {
        const url = `https://generativelanguage.googleapis.com/${version}/models?key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.models) {
            data.models.forEach(m => console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`));
        } else {
            console.log(`No models found or error: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        console.error(`Error listing ${version}:`, error.message);
    }
}

async function run() {
    await listModels('v1');
    await listModels('v1beta');
}

run();
