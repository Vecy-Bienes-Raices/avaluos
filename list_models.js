import fs from 'fs';

const models = [
    { name: 'Gemini 3 Pro Image Preview', id: 'gemini-3-pro-image-preview', tier: 'high' },
    { name: 'Gemini 2.5 Flash', id: 'gemini-2.5-flash', tier: 'fast' }
];

fs.writeFileSync('./models_list.json', JSON.stringify(models, null, 2));
console.log('✅ Models list updated.');
