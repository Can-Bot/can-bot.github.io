// MDatabase.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MDatabase } from "../lib/MDatabase.js";

vi.mock("../lib/Song.js", () => ({
    // Use class syntax — arrow functions cannot be called with 'new'
    Song: class {
        constructor(file) {
            this.rawSource = file;
            this.relativePath = `Music/${file.name}`;
            this.filename = file.name;
            // Simulate what normalise() would produce from the filename
            this.normalizedName = file.name.replace(".flac", "").toLowerCase();
            this.meta = { title: file.name.replace(".flac", ""), artist: "Test Artist" };
            this.duration = 180;
        }

        getBucketChar() {
            return this.normalizedName[0];
        }

        // loadMetadata is async in the real Song — the mock must also return
        // a Promise so that the await in MDatabase.ingest() works correctly
        loadMetadata() {
            return Promise.resolve(true);
        }
    },
}));

const fakeFile = (name) => ({ name, webkitRelativePath: `Music/${name}` });

describe("MDatabase.ingest()", () => {
    it("builds an index with the correct bucket keys", async () => {
        const db = new MDatabase();
        await db.ingest([fakeFile("paranoid.flac"), fakeFile("karma.flac")]);

        expect(db.index["p"]).toBeDefined();
        expect(db.index["p"][0].path).toBe("Music/paranoid.flac");
    });

    it("deduplicates files with the same relativePath", async () => {
        const db = new MDatabase();
        const file = fakeFile("paranoid.flac");
        await db.ingest([file, file]);

        const total = Object.values(db.index).flat().length;
        expect(total).toBe(1);
    });

    it("calls onProgress with the correct values", async () => {
        const db = new MDatabase();
        const progress = [];
        await db.ingest(
            [fakeFile("a.flac"), fakeFile("b.flac")],
            (done, total) => progress.push({ done, total })
        );

        progress.forEach(({ done, total }) =>
            expect(done).toBeLessThanOrEqual(total)
        );
        const last = progress[progress.length - 1];
        expect(last.done).toBe(last.total);
    });
});