const fs = require('fs');
const results = JSON.parse(fs.readFileSync('eslint_output_final.json', 'utf8'));

results.forEach(file => {
    file.messages.forEach(msg => {
        if (msg.ruleId === 'react/no-array-index-key' || msg.ruleId === 'no-nested-ternary') {
            console.log(`${file.filePath}:${msg.line} - ${msg.ruleId}`);
        }
    });
});
