/**
 * AppConfig.js
 *
 * All values in this file need to be changed when you fork this project.
 * See README.md for a step-by-step setup guide.
 *
 * ─── What you need to do ───────────────────────────────────────────────────
 *
 * 1. Create a free app at https://developer.spotify.com/dashboard
 * 2. Copy your Client ID and paste it into SPOTIFY_CLIENT_ID below
 * 3. In your Spotify app settings, add both redirect URIs below to the
 *    "Redirect URIs" list
 * 4. Add your own Spotify account email under Settings → User Management
 *
 * ──────────────────────────────────────────────────────────────────────────
 */

const AppConfig = {
    /**
     * Your Spotify Developer app's Client ID.
     * Found at: https://developer.spotify.com/dashboard → your app → Settings
     */
    SPOTIFY_CLIENT_ID: "e96819b4ea994c588fa3f09e9af3a496",

    /**
     * The URL your app is deployed at on GitHub Pages.
     * Pattern: https://<your-github-username>.github.io
     *
     * If your repo is named <username>.github.io (a user page), there is
     * no subdirectory — the URL is just your username.github.io.
     *
     * If your repo has any other name (a project page), it would be:
     * https://<username>.github.io/<repo-name>
     */
    GITHUB_PAGES_URL: "https://can-bot.github.io",

    /**
     * The URL used when running the app locally during development.
     * You should not need to change this unless you run the dev server
     * on a different port.
     */
    DEV_URL: "http://127.0.0.1:8080",
};

export default AppConfig;