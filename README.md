# M3U8 Maker

A browser-based `.m3u8` playlist generator built with **React + Vite**. Point it at your local music library and a Spotify playlist or album link (or a CSV export), and it fuzzy-matches your tracks and generates a ready-to-use M3U8 file — ideal for Rockbox and other media players that support the format.

All processing happens locally in your browser — no audio, metadata, or credentials are ever uploaded to a server.

---

## Features

- **Three playlist sources** — Spotify (playlists and albums, via PKCE OAuth), CSV export (e.g. from [Exportify](https://exportify.net/)), or a local directory
- **Album ordering** — Spotify album links return tracks in disc/track order, making M3U8 Maker ideal for preserving intended album sequence in Rockbox
- **ID3-aware matching** — reads artist and title tags from your audio files for more accurate results than filename matching alone
- **Fuzzy matching** — LCS + token overlap algorithm tolerates minor differences in punctuation, formatting, and metadata
- **Rich M3U8 output** — includes `#EXTINF` durations, `#PLAYLIST`, `#ARTIST`, and `#DATE` headers
- **Web Worker** — matching runs off the main thread so the UI stays responsive on large libraries
- **Supports MP3, FLAC, WAV, M4A, OGG, AAC**

---

## Setting Up Your Own Fork

Because Spotify's API requires each user to authenticate through a registered Developer app, you need to fork this repository and point it at your own Spotify app before deploying. The process takes around 5 minutes.

### Step 1 — Fork the repository

Click **Fork** at the top of the GitHub page. This creates your own copy of the project under your account, which you can deploy and modify freely.

### Step 2 — Create a Spotify Developer app

Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) and log in with your Spotify account. Click **Create app**, give it any name and description, and save it. You don't need to fill in a website URL.

Once created, open the app and click **Settings**. You'll find your **Client ID** on this page — copy it.

### Step 3 — Add Redirect URIs

Still in your Spotify app settings, scroll down to **Redirect URIs** and add both of the following, saving after each:

```
http://127.0.0.1:8080
https://your-github-username.github.io/your-repo-name
```

The first is used when running the app locally for development. The second is your live GitHub Pages URL. If your repository is named `<username>.github.io` (a user page), there is no subdirectory and the URL is simply `https://your-username.github.io`. The URIs must match exactly — no trailing slashes.

### Step 4 — Add yourself to the allowlist

Under **Settings → User Management**, click **Add new user** and enter your Spotify account's name and email address. This is required because new Spotify apps start in Development Mode, which restricts API access to explicitly listed users.

### Step 5 — Edit `AppConfig.js`

Open `src/AppConfig.js` in your forked repository. This is the only file you need to change. Update the three values:

```js
const AppConfig = {
  SPOTIFY_CLIENT_ID: "your_client_id_here",        // paste your Client ID from Step 2
  GITHUB_PAGES_URL: "https://your-username.github.io",  // your GitHub Pages URL from Step 3
  DEV_URL: "http://127.0.0.1:8080",                // leave this unchanged
};
```

Commit and push the change.

### Step 6 — Enable GitHub Pages

In your forked repository, go to **Settings → Pages**. Under **Build and deployment → Source**, select **GitHub Actions**. The included workflow (`.github/workflows/deploy.yml`) will automatically build and deploy the app every time you push to `main`.

After the first push following Step 5, your app will be live at your GitHub Pages URL within a minute or two. You can monitor the build in the **Actions** tab.

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080).

### Building for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── AppConfig.js              # ← The only file you need to edit when forking
├── components/
│   ├── ErrorBanner.jsx       # Dismissible error notification
│   ├── PlaylistSource.jsx    # Mode switcher: Spotify / CSV / Directory
│   ├── MusicLibrary.jsx      # Music folder picker + progress bar
│   └── GenerateSection.jsx   # Generate button + colourised log output
├── hooks/
│   └── useGenerator.js       # All generation logic as a React hook
├── lib/
│   ├── matcherUtils.js       # normalise(), STOPWORDS, MIN_SIMILARITY
│   ├── Song.js               # Audio file model + ID3 tag loading
│   ├── MDatabase.js          # Batched ingestion + bucket index
│   ├── Playlist.js           # CSV/Spotify/dir parsing + M3U8 output
│   └── SpotifyPlaylistFetch.js   # PKCE OAuth + Spotify API
├── workers/
│   └── matcher.worker.js     # Fuzzy matching (off main thread)
├── styles/
│   └── index.css
├── App.jsx
└── main.jsx
```

---

## How Matching Works

Your music files are read in parallel batches. ID3 tags (artist and title) are loaded where available, with filenames used as a fallback for untagged files. Each song is normalised — lowercased, stripped of bracketed content, punctuation, and junk words like `remastered` or `official` — and placed into an alphabet bucket for fast lookup.

When matching begins, the worker takes each track name from your playlist, normalises it the same way, and scores it against candidates in the same bucket using a weighted formula: 70% Longest Common Subsequence similarity and 30% token overlap. Scores above 0.8 are high confidence (`✔`), scores between 0.6 and 0.8 are medium confidence (`⚠`), and anything below 0.6 is discarded (`✘`).

---

## M3U8 Output Format

```m3u8
#EXTM3U
#PLAYLIST:OK Computer
#ARTIST:Radiohead
#DATE:2026-04-09

#EXTINF:228,Radiohead - Paranoid Android
Music/Radiohead/OK Computer/03 - Paranoid Android.flac

#EXTINF:261,Radiohead - Exit Music (For a Film)
Music/Radiohead/OK Computer/04 - Exit Music (For a Film).flac
```

Paths are relative to the root of the folder you selected, so the file works on any device as long as the folder structure is preserved.

---

## Spotify Quota Limitations

Spotify Developer apps created after May 2025 are limited to **5 allowlisted users** in Development Mode. Extended Quota Mode — which removes this limit — is no longer available to individual developers. This is why the setup process requires each user to register their own app rather than using a shared one. For personal and small-group use, the 5-user limit of your own app is sufficient. See [Spotify's quota documentation](https://developer.spotify.com/documentation/web-api/concepts/quota-modes) for details.

---

## Known Limitations

**Spotify quota** — each app is limited to 5 allowlisted users in Development Mode, as described above. **FLAC duration** — browsers cannot decode FLAC for duration probing, so FLAC tracks are written with duration `-1`; most players handle this gracefully. **Short track names** — titles that normalise to fewer than 4 characters are not matched to avoid false positives. **Untagged files** — files without ID3 tags fall back to filename-based matching, which is less accurate for numerically named files.

---

## Dependencies

| Package | Purpose |
|---|---|
| `react` / `react-dom` | UI |
| `vite` + `@vitejs/plugin-react` | Build tooling |
| `papaparse` | CSV parsing |
| `jsmediatags` (CDN) | ID3 tag reading |

---

## Privacy

No data leaves your browser. Music files are read locally via the File API. Spotify authentication uses PKCE — no client secret, no server-side component. Your Client ID and tokens are stored only in your browser's `localStorage`.