import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { SpotifyPlaylistFetch } from "./lib/SpotifyPlaylistFetch.js";
import AppConfig from "./AppConfig.js";
import { runPreflight } from "./lib/preflight.js";

const preflightErrors = runPreflight(AppConfig);

if (preflightErrors.length > 0) {
  // Render a plain error page without React — if something fundamental
  // is broken we don't want to depend on the React tree being healthy
  document.getElementById("root").innerHTML = `
    <div style="font-family: monospace; padding: 2rem; color: #ff6b6b; background: #0f1220; min-height: 100vh;">
      <h2 style="color: #e6e7ef">⚠ Setup incomplete</h2>
      ${preflightErrors.map(e => `<p>• ${e}</p>`).join("")}
    </div>
  `;
} else {
  // Automatically select the correct redirect URI based on whether we are
  // running locally or deployed to GitHub Pages.
  const redirectUri =
    window.location.hostname === "127.0.0.1"
      ? AppConfig.DEV_URL
      : AppConfig.GITHUB_PAGES_URL;

  // Initialise Spotify before React mounts so the ?code= redirect param
  // is always caught before any component renders.
  const spotifyReady = SpotifyPlaylistFetch.init(
    AppConfig.SPOTIFY_CLIENT_ID,
    redirectUri
  );

  spotifyReady.then(() => {
    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  });
}