import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import security from "eslint-plugin-security";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  // ─── Next.js recommended presets ──────────────────────────────
  ...nextVitals,
  ...nextTs,
  // ─── Global ignores ───────────────────────────────────────────
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "public/pdf.worker.min.js",
    "scripts/**",
    "*.config.{js,mjs,cjs,ts}",
  ]),
  // ─── Type-aware linting ───────────────────────────────────────
  {
    name: "typescript-type-aware",
    files: ["**/*.ts", "**/*.tsx", "**/*.mts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // ─── TypeScript strictness ────────────────────────────────────
  {
    name: "typescript-strict",
    files: ["**/*.ts", "**/*.tsx", "**/*.mts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": true,
          "ts-nocheck": true,
        },
      ],
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "@typescript-eslint/consistent-type-exports": [
        "error",
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/only-throw-error": "error",
      // ─── Unsafe type usage (warn, not error) ─────────────────
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      // ─── Async correctness ───────────────────────────────────
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/return-await": ["error", "in-try-catch"],
    },
  },
  // ─── Unused imports auto-removal ──────────────────────────────
  {
    name: "unused-imports",
    plugins: { "unused-imports": unusedImports },
    rules: {
      "unused-imports/no-unused-imports": "error",
    },
  },
  // ─── Import ordering & hygiene ────────────────────────────────
  {
    name: "import-hygiene",
    plugins: { "import-x": importX },
    rules: {
      "import-x/no-duplicates": ["error", { "prefer-inline": true }],
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "type",
          ],
          pathGroups: [
            { pattern: "react", group: "builtin", position: "before" },
            { pattern: "next/**", group: "builtin", position: "after" },
            { pattern: "@/**", group: "internal", position: "before" },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import-x/no-cycle": ["error", { maxDepth: 4 }],
      "import-x/no-self-import": "error",
      "import-x/no-useless-path-segments": "error",
      // ─── Banned packages (bundle size) ────────────────────────
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lodash",
              message:
                "Import from lodash-es or use native methods to reduce SDK bundle size.",
            },
            {
              name: "moment",
              message:
                "Use date-fns or the Temporal API. Moment is deprecated and bloats SDK bundles.",
            },
          ],
        },
      ],
    },
  },
  // ─── General code quality ─────────────────────────────────────
  {
    name: "code-quality",
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-var": "error",
      "prefer-const": "error",
      "no-debugger": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-cond-assign": ["error", "except-parens"],
      "no-unreachable": "error",
      "no-duplicate-case": "error",
      "no-empty-pattern": "error",
      "no-fallthrough": "error",
      "prefer-template": "warn",
      "prefer-arrow-callback": "warn",
      "no-nested-ternary": "error",
      curly: ["error", "all"],
      // ─── SDK: restrict direct browser storage access ─────────
      "no-restricted-globals": [
        "error",
        {
          name: "event",
          message: "Use local event parameter instead.",
        },
        {
          name: "localStorage",
          message: "Use the SDK storage abstraction instead.",
        },
        {
          name: "sessionStorage",
          message: "Use the SDK storage abstraction instead.",
        },
      ],
      // ─── Banned syntax patterns (banking-specific) ───────────
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.object.name='Math'][callee.property.name='random']",
          message:
            "Math.random() is not cryptographically secure. Use crypto.getRandomValues() for tokens, IDs, or anything security-sensitive.",
        },
        {
          selector: "NewExpression[callee.name='Date'][arguments.length=0]",
          message:
            "Use Date.now() for timestamps. Be explicit about timezone handling for transactions.",
        },
      ],
    },
  },
  // ─── Security rules ───────────────────────────────────────────
  {
    name: "security",
    plugins: { security },
    rules: {
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-possible-timing-attacks": "error",
      "security/detect-non-literal-fs-filename": "error",
      "security/detect-unsafe-regex": "error",
    },
  },
  // ─── React-specific rules ─────────────────────────────────────
  {
    name: "react-rules",
    files: ["**/*.tsx", "**/*.jsx"],
    rules: {
      "react/jsx-key": [
        "error",
        { checkFragmentShorthand: true, warnOnDuplicates: true },
      ],
      "react/no-array-index-key": "error",
      "react/no-find-dom-node": "error",
      "react/no-string-refs": "error",
      "react/self-closing-comp": "error",
      "react/no-unused-state": "warn",
      "react/no-danger": "error",
    },
  },
  // ─── Next.js app router conventions ──────────────────────────
  {
    name: "nextjs-conventions",
    files: [
      "src/app/**/page.tsx",
      "src/app/**/layout.tsx",
      "src/app/**/loading.tsx",
      "src/app/**/error.tsx",
      "src/app/**/not-found.tsx",
      "src/app/**/template.tsx",
    ],
    rules: {
      "import-x/no-default-export": "off",
    },
  },
  // ─── Test files — relaxed rules ───────────────────────────────
  {
    name: "test-overrides",
    files: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "**/__tests__/**",
      "**/test/**",
      "cypress/**/*.ts",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "no-console": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/require-await": "off",
      "security/detect-object-injection": "off",
      "no-restricted-syntax": "off",
    },
  },
  // ─── Prettier compat (must be last) ───────────────────────────
  eslintConfigPrettier,
]);

export default eslintConfig;