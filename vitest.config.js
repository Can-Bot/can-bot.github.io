// vitest.config.js — place this at the project root alongside vite.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // 'jsdom' simulates a browser environment including localStorage,
        // window, document, and other browser globals that your code depends on.
        environment: "jsdom",
        globals: true, // so we can use describe, it, expect without importing
        // This tells Vitest where to find your test files
        include: ["src/tests/**/*.test.js"],
    },
});