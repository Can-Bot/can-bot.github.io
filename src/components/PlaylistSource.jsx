import { SpotifyPlaylistFetch } from "../lib/SpotifyPlaylistFetch.js";

export function PlaylistSource({
  mode,
  onModeChange,
  spotifyConnected,
  spotifyUrl,
  onSpotifyUrlChange,
  onSpotifyLogin,
  onSpotifyDisconnect,
  csvFile,
  onCsvChange,
  dirFiles,
  onDirChange,
}) {
  return (
    <div className="card">
      <h2>1. Playlist Source</h2>

      {/* Mode tabs */}
      <div className="mode-tabs">
        {["spotify", "csv", "dir"].map((m) => (
          <label key={m} className={`mode-tab ${mode === m ? "active" : ""}`}>
            <input
              type="radio"
              name="mode"
              value={m}
              checked={mode === m}
              onChange={() => onModeChange(m)}
            />
            {m === "spotify" ? "Spotify Playlist" : m === "csv" ? "CSV Playlist" : "Directory"}
          </label>
        ))}
      </div>

      {/* Spotify */}
      {mode === "spotify" && (
        <div className="mode-panel">
          {spotifyConnected ? (
            <>
              <p className="connected-badge">● Connected to Spotify</p>
              <label>Spotify Playlist or Album URL</label>
              <input
                type="text"
                placeholder="https://open.spotify.com/playlist/… or https://open.spotify.com/album/…"
                value={spotifyUrl}
                onChange={(e) => onSpotifyUrlChange(e.target.value)}
              />
              <button
                style={{
                  marginTop: "10px", background: "none", border: "1px solid var(--border)",
                  color: "var(--muted)", borderRadius: "8px", padding: "6px 12px",
                  fontSize: "0.8rem", cursor: "pointer"
                }}
                onClick={onSpotifyDisconnect}
              >
                Disconnect Spotify account
              </button>
            </>
          ) : (
            <button className="spotify-btn" onClick={onSpotifyLogin}>
              <SpotifyIcon />
              Log in to Spotify
            </button>
          )}
        </div>
      )}

      {/* CSV */}
      {mode === "csv" && (
        <div className="mode-panel">
          <label>
            Playlist CSV (e.g. from{" "}
            <a href="https://exportify.net/" target="_blank" rel="noreferrer">
              Exportify
            </a>
            )
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => onCsvChange(e.target.files[0])}
          />
          {csvFile && (
            <p className="file-hint">Selected: {csvFile.name}</p>
          )}
        </div>
      )}

      {/* Directory */}
      {mode === "dir" && (
        <div className="mode-panel">
          <label>Select playlist directory</label>
          <input
            type="file"
            webkitdirectory="true"
            multiple
            onChange={(e) => onDirChange(Array.from(e.target.files))}
          />
          <p className="muted">
            Playlist will contain all supported audio files in this directory.
          </p>
          {dirFiles?.length > 0 && (
            <p className="file-hint">{dirFiles.length} file(s) selected</p>
          )}
        </div>
      )}
    </div>
  );
}

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}
