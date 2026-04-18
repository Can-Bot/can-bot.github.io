import {findBestMatch } from "./matcherCore.js";

/* ─── Worker entry point ───────────────────────────────────── */

self.onmessage = (e) => {
  const { tracks, index } = e.data;
  const results = [];

  // Batch log updates — posting a message on every iteration causes
  // React to re-render the log panel for each track, which is slow for
  // large playlists. Post every 10 results instead.
  const PROGRESS_INTERVAL = 10;

  for (let i = 0; i < tracks.length; i++) {
    results.push(findBestMatch(tracks[i], index));

    if (i % PROGRESS_INTERVAL === 0) {
      self.postMessage({ progress: i + 1 });
    }
  }

  self.postMessage({ done: true, results });
};