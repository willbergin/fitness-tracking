# Bergfit

A personal hybrid fitness tracker built with vanilla HTML, CSS, and JavaScript. Designed for goal-based running training and strength training — no frameworks, no build tools, just open `index.html` in a browser.

## What It Does

Bergfit is a two-mode training companion:

- **Running Mode** — Set any running goal (race, time trial, etc.), create custom training plans, log runs, view a calendar, and track weekly mileage and pace trends.
- **Strength Mode** — Track Push/Pull/Legs sessions. Log exercises with weight and sets/reps, view progress over time with per-exercise progress charts.

Both modes store data in `localStorage`, so everything persists between sessions on the same device. Use the Export/Import feature to sync between devices.

## Key Features

- Running goal overview — Set any upcoming goal with a target time, custom paces, and linked training plan, with goal countdown timer
- Training plans — Create/edit/delete your own custom plans
- Run logging with type, distance, pace, and notes
- Monthly calendar view with click-to-inspect day detail, using logged session data for running and strength sessions
- Stats Charts - To track Weekly mileage and average pace charts, as well as weight progression per strength excercise (canvas-based, no libraries)
- Strength session logging with multi-exercise support and multiple sets per exercise
- Export/Import data as JSON for syncing between devices (desktop ↔ mobile)
- Responsive design — works on desktop and mobile browsers

## Project Structure

```
hybrid-fitness-tracker/
├── PROJECT-FILES/
│   ├── index.html    # Main app entry point
│   ├── styles.css    # All styling (CSS custom properties, flexbox/grid layout)
│   ├── app.js        # Application logic (mode selection, running, strength)
│   └── data.js       # Training plan data and exercise definitions
├── index.html        # Redirect to PROJECT-FILES/index.html (for GitHub Pages)
├── README.md         # This file
└── USER-GUIDE.md     # Full user documentation
```

## How to Run

1. Clone or download the repo
2. Open `PROJECT-FILES/index.html` in any modern browser (double-click or drag into browser)
3. That's it — no server, no installs, no build step

Or visit the live version via GitHub Pages:
**https://willbergin.github.io/hybrid-fitness-tracker/**

## Syncing Data Between Devices

Data lives in your browser's `localStorage` (per device). To sync:

1. On device A: click **⬇ Export Data** on the home screen — downloads a JSON backup
2. Transfer the file (OneDrive, email, AirDrop, etc.)
3. On device B: click **⬆ Import Data** and select the file
4. Choose to **merge** (keep data from both devices) or **replace** (overwrite)

Exported data includes runs, strength sessions, your current goal, and any custom training plans.

## Tech Stack

- HTML5
- CSS3 (custom properties, flexbox, grid)
- Vanilla JavaScript (ES6+)
- Canvas API for charts
- localStorage for persistence
- Zero dependencies

## Technical Decisions & Tradeoffs

### Why vanilla JS with no framework?

The goal was a working personal tool in under an hour, usable immediately via `file://` or a static host. Frameworks like React or Vue add a build step, dependency management, and tooling complexity that weren't justified for a single-user app with simple state. The tradeoff is more verbose DOM manipulation and no component reuse system — acceptable for this scope, but would become painful if the app grew significantly.

### localStorage over a database

localStorage gives instant persistence with zero infrastructure. The tradeoff is:
- **No cross-device sync** — solved with manual Export/Import (JSON file transfer).
- **~5MB storage limit** — more than enough for years of run/session logs at ~0.5KB per entry.
- **No concurrent access** — fine for single-user, but would break if multiple tabs made conflicting writes.

A cloud database (Firebase, Supabase) would solve all three but introduces auth, network dependency, and cost. The Export/Import approach was chosen as a pragmatic middle ground.

### Canvas API for charts instead of a charting library

Chart.js or D3 would give better interactivity (tooltips, zoom, responsive resizing) but add 60-200KB of dependencies and require either a CDN or bundler. Hand-drawn Canvas charts keep the app at zero dependencies and work on `file://`. The tradeoff is limited interactivity and more manual code for axes/labels.

### Single IIFE instead of modules

ES modules (`import`/`export`) fail on `file://` in most browsers due to CORS restrictions. Wrapping everything in an IIFE avoids global pollution while remaining compatible with direct file opening. The tradeoff is a large single file (~1000 lines) that would benefit from splitting in a production context.

### Free-text custom plans instead of structured input

Custom plans are stored as plain text rather than parsed into a structured week/day format. This was a deliberate speed-vs-structure tradeoff:
- **Pro:** Users can paste any plan format without learning a schema. Creation takes seconds.
- **Con:** Free-text plans can't auto-populate the "This Week" view or integrate with the calendar. Only the default Bucharest Marathon plan (hardcoded in `data.js`) supports week-by-week rendering.

A future iteration could add optional structured input (or AI-assisted parsing) to unlock richer plan integration.

### Merge-by-ID for import deduplication

When importing data, records are deduplicated by their `id` field (a timestamp + random suffix generated at creation). This is simple and reliable for a single-user workflow but isn't a true sync mechanism — it can't handle edits to the same record on two devices. Last-import-wins for conflicts. A proper sync solution would need vector clocks or a server-side merge strategy.

### Responsive CSS without media-query-heavy approach

The layout uses CSS Grid with `auto-fit` / `minmax()` patterns that naturally collapse on smaller screens, supplemented by a few breakpoint overrides. This keeps the CSS maintainable but means some views (particularly the calendar) are tighter on mobile. A mobile-first redesign with separate navigation patterns (bottom tabs, slide-out menus) would improve the phone experience.

### Data embedded in JS rather than fetched

Training plan data lives in `data.js` as global objects rather than a JSON file loaded via `fetch()`. This is because `fetch()` doesn't work on `file://` protocol. The tradeoff is that data changes require editing a JS file, but it guarantees the app works offline by double-clicking `index.html`.
