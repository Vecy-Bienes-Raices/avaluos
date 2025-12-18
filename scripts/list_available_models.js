
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

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

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", json.error);
            } else {
                console.log("✅ Available Models:");
                if (json.models) {
                    json.models.forEach(m => {
                        if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                            console.log(`- ${m.name}`);
                        }
                    });
                } else {
                    console.log("No models found in response:", json);
                }
            }
        } catch (e) {
            console.error("Error parsing response:", e);
            console.log("Raw response:", data);
        }
    });
}).on('error', (err) => {
    console.error("Network Error:", err);
});
