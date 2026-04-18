import { describe, it, expect } from "vitest";

// These functions live in the worker file. We test them here by
// importing the module directly — Vitest runs in Node, not a browser,
// so the worker context doesn't matter for pure function tests.
// We need to pull the functions out, so the worker file should export
// them (see note below about a small worker refactor).
import { similarity, tokenScore, findBestMatch } from "../workers/matcherCore.js";

describe("similarity()", () => {
    it("returns 1 for identical strings", () => {
        expect(similarity("paranoid android", "paranoid android")).toBe(1);
    });

    it("returns 0 for completely different strings", () => {
        expect(similarity("abc", "xyz")).toBe(0);
    });

    it("gives a high score for strings with minor differences", () => {
        // This simulates a common real-world case: the Spotify title has
        // slightly different punctuation or spacing than the local filename
        const score = similarity("exit music for a film", "exit music film");
        expect(score).toBeGreaterThan(0.7);
    });
});

describe("tokenScore()", () => {
    it("returns 1 for identical word sets", () => {
        expect(tokenScore("ok computer", "ok computer")).toBe(1);
    });

    it("returns 0 for no shared words", () => {
        expect(tokenScore("dog", "cat")).toBe(0);
    });

    it("is order-independent", () => {
        // Token score should be the same regardless of word order,
        // since it uses Set intersection rather than sequence matching
        expect(tokenScore("karma police", "police karma")).toBe(1);
    });
});

describe("findBestMatch()", () => {
    // The index is keyed by the first character of the normalised
    // artist + title string, exactly as MDatabase.ingest() produces it.
    // "radiohead paranoid android" → bucket "r"
    // "radiohead karma police"     → bucket "r"
    const index = {
        r: [
            {
                norm: "radiohead paranoid android",
                path: "Radiohead/OK Computer/03 - Paranoid Android.flac",
                artist: "Radiohead",
                title: "Paranoid Android",
                duration: 188,
            },
            {
                norm: "radiohead karma police",
                path: "Radiohead/OK Computer/05 - Karma Police.flac",
                artist: "Radiohead",
                title: "Karma Police",
                duration: 264,
            },
        ],
    };

    it("finds an exact match", () => {
        const result = findBestMatch("Radiohead Paranoid Android", index);
        expect(result).not.toBeNull();
        expect(result.level).toBe("high");
        expect(result.path).toContain("Paranoid Android");
    });

    it("returns null for a track with no reasonable match", () => {
        const result = findBestMatch("Completely Unrelated Track Name", index);
        expect(result).toBeNull();
    });

    it("returns null for very short normalised keys", () => {
        expect(findBestMatch("Dog", index)).toBeNull();
    });
});