const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const keyMatch = envLocal.match(/ANTHROPIC_API_KEY=(.*)/);

const anthropic = new Anthropic({
    apiKey: keyMatch[1].trim()
});

async function run() {
    console.log('Testing Anthropic API Connection...');
    try {
        const stream = await anthropic.messages.stream({
            model: 'claude-3-5-sonnet-latest',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'hello' }]
        });

        for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                process.stdout.write(chunk.delta.text);
            }
        }
        console.log('\nSuccess!');
    } catch (err) {
        console.error('\nERROR JSON:', JSON.stringify(err, null, 2));
        console.error('RAW ERROR:', err);
    }
}
run();
