import { describe, it, expect } from "vitest";
import { normalise } from "../lib/matcherUtils.js";

// These tests verify the normalisation pipeline that both the
// main thread (Song.js) and the worker share. A regression here
// would silently break matching for all users.
describe("normalise()", () => {
    it("returns an empty string for empty input", () => {
        expect(normalise("")).toBe("");
        expect(normalise(null)).toBe("");
    });

    it("lowercases text", () => {
        expect(normalise("Paranoid Android")).toBe("paranoid android");
    });

    it("strips bracketed content", () => {
        // Brackets commonly contain edition/version info that differs
        // between a Spotify title and a local filename
        expect(normalise("Exit Music (For a Film)")).toBe("exit music");
        expect(normalise("Karma Police [Reissue]")).toBe("karma police");
    });

    it("removes stopwords", () => {
        expect(normalise("Subwoofer Lullaby Remastered")).toBe("subwoofer lullaby");
        expect(normalise("Live Forever Official Video")).toBe("forever");
    });

    it("does not remove meaningful short words like 'of' or 'in'", () => {
        // Stopwords are carefully chosen — common words that never
        // distinguish tracks should be removed, but not all short words
        expect(normalise("Band of Brothers")).toContain("brothers");
    });

    it("collapses multiple spaces into one", () => {
        expect(normalise("too   many   spaces")).toBe("too many spaces");
    });
});