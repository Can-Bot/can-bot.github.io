import AppConfig from "../AppConfig.js";

/**
 * Runs a series of environment checks before the app starts.
 * Returns an array of error strings — empty means all clear.
 *
 * These checks catch the most common setup mistakes:
 * - Forgetting to edit AppConfig.js after forking
 * - jsmediatags failing to load from the CDN (e.g. offline or blocked)
 * - Browsers that don't support required APIs
 */
export function runPreflight(config) {
    const errors = [];

    // Check AppConfig has been filled in — the placeholder value is a
    // reliable sentinel that the user hasn't completed the setup steps
    if (
        !AppConfig.SPOTIFY_CLIENT_ID ||
        AppConfig.SPOTIFY_CLIENT_ID === "your_client_id_here"
    ) {
        errors.push(
            "Spotify Client ID has not been set. Edit src/AppConfig.js and add your Client ID from the Spotify Developer Dashboard."
        );
    }

    // jsmediatags is loaded via a CDN <script> tag in index.html.
    // If the network request failed, window.jsmediatags will be undefined
    // and all ID3 reading will silently fall back to filename matching.
    if (typeof window.jsmediatags === "undefined") {
        errors.push(
            "jsmediatags failed to load. Check your internet connection — ID3 tag reading requires the CDN script to load."
        );
    }

    // Web Workers are required for matching. They are blocked in some
    // restricted browser environments (certain enterprise policies, etc.)
    if (typeof Worker === "undefined") {
        errors.push(
            "Web Workers are not supported in this browser. Matching cannot run."
        );
    }

    // localStorage is required for Spotify token persistence.
    // It can be blocked in private browsing on some browsers.
    try {
        localStorage.setItem("__preflight__", "1");
        localStorage.removeItem("__preflight__");
    } catch {
        errors.push(
            "localStorage is not available. Spotify authentication requires localStorage — try disabling private browsing mode."
        );
    }

    return errors;
}