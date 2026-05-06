const fs = require('fs');
const results = JSON.parse(fs.readFileSync('eslint_output_final.json', 'utf8'));

let errors = {};
let warnings = {};

results.forEach(file => {
    file.messages.forEach(msg => {
        const type = msg.severity === 2 ? errors : warnings;
        type[msg.ruleId] = (type[msg.ruleId] || 0) + 1;
    });
});

console.log("Errors:");
console.log(JSON.stringify(errors, null, 2));
console.log("Warnings:");
console.log(JSON.stringify(warnings, null, 2));
