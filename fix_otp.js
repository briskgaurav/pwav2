const fs = require('fs');
let content = fs.readFileSync('src/components/ui/otp-input.tsx', 'utf8');
content = content.replace(
  /const digits = useMemo\(\r?\n\s*const DIGIT_KEYS = useMemo\(\(\) => Array\.from\(\{ length: maxLength \}, \(\) => crypto\.randomUUID\(\)\), \[maxLength\]\)\r?\n/,
  "const DIGIT_KEYS = useMemo(() => Array.from({ length: maxLength }, () => crypto.randomUUID()), [maxLength]);\n\n  const digits = useMemo(\n"
);
fs.writeFileSync('src/components/ui/otp-input.tsx', content);
