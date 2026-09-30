import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Workaround for ESLint 10 + eslint-plugin-react@7.37.x:
  // "detect" triggers a React-version lookup via the removed context.getFilename() API.
  // Pinning an explicit version skips that code path.
  // See https://github.com/vercel/next.js/issues/89764
  { settings: { react: { version: "19.2.4" } } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
