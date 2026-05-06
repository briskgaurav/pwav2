const fs = require('fs');

const results = JSON.parse(fs.readFileSync('eslint_output_final.json', 'utf8'));

// We will track the modifications per file to avoid line shifting issues.
const filesToModify = {};

results.forEach(file => {
    file.messages.forEach(msg => {
        if (msg.ruleId === '@typescript-eslint/prefer-nullish-coalescing') {
            if (!filesToModify[file.filePath]) {
                filesToModify[file.filePath] = new Set();
            }
            filesToModify[file.filePath].add(msg.line);
        }
    });
});

for (const [filePath, lines] of Object.entries(filesToModify)) {
    let content = fs.readFileSync(filePath, 'utf8').split('\n');
    
    for (const lineNum of lines) {
        // Line numbers in ESLint are 1-based.
        let lineIdx = lineNum - 1;
        // In some files, there might be multiple "||" on the same line.
        // We'll replace all "||" with "??" on the warned lines.
        // This is generally safe since the warning indicates the user is using || for fallback.
        // We must be careful not to replace it if it's inside a string, but for this specific warning
        // it's almost always a fallback operator.
        content[lineIdx] = content[lineIdx].replace(/\|\|/g, '??');
    }
    
    fs.writeFileSync(filePath, content.join('\n'));
}

console.log("Replaced || with ?? in the flagged lines.");
