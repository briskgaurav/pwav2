const fs = require('fs');
let results;
try {
    results = JSON.parse(fs.readFileSync('eslint_output_final.json', 'utf8'));
} catch (e) {
    console.error("Error parsing JSON:", e);
    process.exit(1);
}

results.forEach(file => {
    file.messages.forEach(msg => {
        if (msg.ruleId === '@typescript-eslint/prefer-nullish-coalescing') {
            console.log(`${file.filePath}:${msg.line}`);
        }
    });
});
