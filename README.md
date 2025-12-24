# cinema

A tiny web app that picks a random movie from a curated list with *no repeats* until the entire list has been played.

## Files

- `index.html` — the UI (movie ticket) and entry point.
- `movies.js` — canonical movie list (38 entries).
- `movie.js` — **deprecated** copy of the list (kept for history; use `movies.js`).
- `picker.js` — testable picker utility (shuffle + queue).
- `app.js` — UI wiring (uses `Picker` and `movies`).

## Development & Testing

Open `index.html` in a browser (or use Live Server) to try the app. Click the ticket (or press Enter/Space) to pick a random movie. Use **Reset & Shuffle** to start a new round.

Run the tests locally:

```bash
npm test
```

The test verifies the `Picker` queue behavior (no duplicates until depletion and reset behavior).

## Notes

- I deprecated `movie.js` so the app has a single source of truth (`movies.js`).
- Want me to remove `movie.js` entirely or add features (filter by genre, export JSON, sort, or styles)? Let me know.

---

## Deployment

This project is configured to auto-deploy to **GitHub Pages** on push to `main` via GitHub Actions. After the next successful push, your site will be available at:

`https://MitchellLeybaCale.github.io/cinema/`

If you prefer a custom domain or want me to fully automate image icons/manifests for a PWA, say the word and I'll add them.
