import { describe, it, expect } from "vitest";
import { Playlist } from "../lib/Playlist.js";

describe("generateM3U8()", () => {
    it("includes #ARTIST header when all tracks share one artist", () => {
        const playlist = new Playlist("Test Album");
        playlist.tracksToFind = ["Artist - Track 1", "Artist - Track 2"];
        playlist.matchedTracks = [
            { path: "Music/Track1.flac", artist: "Radiohead", title: "Track 1", duration: 200 },
            { path: "Music/Track2.flac", artist: "Radiohead", title: "Track 2", duration: 180 },
        ];

        const { content } = playlist.generateM3U8();
        expect(content).toContain("#ARTIST:Radiohead");
    });

    it("omits #ARTIST header when tracks have different artists", () => {
        const playlist = new Playlist("Various");
        playlist.tracksToFind = ["Track 1", "Track 2"];
        playlist.matchedTracks = [
            { path: "a.flac", artist: "Radiohead", title: "Track 1", duration: 200 },
            { path: "b.flac", artist: "Portishead", title: "Track 2", duration: 180 },
        ];

        const { content } = playlist.generateM3U8();
        expect(content).not.toContain("#ARTIST:");
    });

    it("trims artist whitespace before deduplication", () => {
        // "Radiohead" and "Radiohead " (trailing space) should be treated
        // as the same artist — without trimming, two entries appear in the
        // Set and the header is incorrectly omitted.
        const playlist = new Playlist("Test");
        playlist.tracksToFind = ["t1", "t2"];
        playlist.matchedTracks = [
            { path: "a.flac", artist: "Radiohead", title: "Track 1", duration: 100 },
            { path: "b.flac", artist: "Radiohead ", title: "Track 2", duration: 100 },
        ];

        const { content } = playlist.generateM3U8();
        expect(content).toContain("#ARTIST:Radiohead");
    });

    it("reports count and total correctly", () => {
        const playlist = new Playlist("Test");
        playlist.tracksToFind = ["t1", "t2", "t3"];
        // One track didn't match — matchedTracks contains null for unmatched
        playlist.matchedTracks = [
            { path: "a.flac", artist: "Artist", title: "Track 1", duration: 100 },
            null,
            { path: "c.flac", artist: "Artist", title: "Track 3", duration: 100 },
        ];

        const { count, total } = playlist.generateM3U8();
        expect(count).toBe(2);
        expect(total).toBe(3);
    });
});