const fs = require('fs');
const results = JSON.parse(fs.readFileSync('eslint_output_final.json', 'utf8'));

results.forEach(file => {
    file.messages.forEach(msg => {
        if (msg.ruleId === '@typescript-eslint/prefer-nullish-coalescing') {
            console.log(`${file.filePath}:${msg.line}`);
        }
    });
});
