const fs = require('fs');

const files = [
    'src/app/api/email-registration/send-otp/route.ts',
    'src/app/api/email-registration/verify-otp/route.ts',
    'src/app/api/id-verification/send-otp/route.ts',
    'src/app/api/id-verification/verify-otp/route.ts',
    'src/app/api/userdata/override/route.ts',
    'src/app/api/userdata/route.ts',
    'src/app/identity-verification/kyc-status/page.tsx',
    'src/components/screens/AuthScreens/VerificationCodeScreen.tsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\|\|/g, '??');
    fs.writeFileSync(file, content);
});

console.log("Replaced || with ?? in the remaining files.");
