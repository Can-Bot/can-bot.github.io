import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { SpotifyPlaylistFetch } from "./lib/SpotifyPlaylistFetch.js";
import AppConfig from "./AppConfig.js";

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