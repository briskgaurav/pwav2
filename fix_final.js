const fs = require('fs');

const filesToFix = [
    'src/components/screens/AuthScreens/CardPinAuth.tsx',
    'src/components/screens/AuthScreens/CardPinVerificationDrawer.tsx',
    'src/components/screens/AuthScreens/PinSetupFormScreen.tsx',
    'src/components/screens/AuthScreens/VerificationCodeScreen.tsx',
    'src/components/screens/ClaimGiftCardScreens/EnterOneTimeActivationCode.tsx',
    'src/components/ui/otp-input.tsx'
];

filesToFix.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add useMemo if not exists
    if (!content.includes('useMemo')) {
        content = content.replace(/import\s+{([^}]*)}\s+from\s+'react'/, "import { $1, useMemo } from 'react'");
    }

    // Add DIGIT_KEYS
    if (!content.includes('const DIGIT_KEYS = useMemo(() => Array.from({ length: maxLength }')) {
        content = content.replace(
            /(const digits = .*?\n|const digits = .*?\[.*?\]\n)/s,
            `$1  const DIGIT_KEYS = useMemo(() => Array.from({ length: maxLength }, () => crypto.randomUUID()), [maxLength])\n`
        );
    }
    
    // Replace key
    content = content.replace(/key=\{`[^`]+-\$\{i\}`\}/g, 'key={DIGIT_KEYS[i]}');
    content = content.replace(/key=\{`[^`]+-\$\{index\}`\}/g, 'key={DIGIT_KEYS[index]}');
    
    fs.writeFileSync(file, content);
});

// Fix Keypad.tsx
let keypadContent = fs.readFileSync('src/components/ui/Keypad.tsx', 'utf8');
keypadContent = keypadContent.replace(/key=\{`row-\$\{rowIndex\}`\}/g, 'key={row.join("")}');
fs.writeFileSync('src/components/ui/Keypad.tsx', keypadContent);

// Fix kyc-status/page.tsx
let kycContent = fs.readFileSync('src/app/identity-verification/kyc-status/page.tsx', 'utf8');
kycContent = kycContent.replace(/\{bvnNumber\s*\?\s*`BVN : \$\{maskNumber\(bvnNumber\)\}`\s*:\s*ninNumber\s*\?\s*`NIN : \$\{maskNumber\(ninNumber\)\}`\s*:\s*'BVN\/NIN : Not provided'\}/g,
  "{(bvnNumber && `BVN : ${maskNumber(bvnNumber)}`) || (ninNumber && `NIN : ${maskNumber(ninNumber)}`) || 'BVN/NIN : Not provided'}"
);
fs.writeFileSync('src/app/identity-verification/kyc-status/page.tsx', kycContent);
