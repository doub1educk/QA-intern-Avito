import * as js from "@eslint/js";
import * as globals from "globals";
import tseslint from "typescript-eslint";
import {defineConfig, globalIgnores} from "eslint/config";

export default defineConfig([
    globalIgnores(["node_modules/**"]),
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: {js},
        extends: ["js/recommended"],
        languageOptions: {globals: globals.browser}
    },
    {

        rules: {
            "quotes": "error",
            "eol-last": "error",
            "semi": "error",
            "indent": "error",
            "linebreak-style": "error",
            "prefer-const": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "caughtErrorsIgnorePattern": "^_"
                }
            ]

        },
    },

    tseslint.configs.recommended,
]);
