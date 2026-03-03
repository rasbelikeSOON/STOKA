const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const keyMatch = envLocal.match(/GEMINI_API_KEY=(.*)/);

if (!keyMatch) {
    console.error('No GEMINI_API_KEY found in .env.local');
    process.exit(1);
}

const ai = new GoogleGenAI({
    apiKey: keyMatch[1].trim()
});

async function run() {
    console.log('Testing Gemini API Connection...');
    try {
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: 'say hello world slowly so I can see the stream',
        });

        for await (const chunk of responseStream) {
            process.stdout.write(chunk.text);
        }
        console.log('\nSuccess!');
    } catch (err) {
        console.error('\nERROR JSON:', err.stack || err);
    }
}
run();
