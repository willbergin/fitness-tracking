# Bergin PFT

A personal fitness tracker built with vanilla HTML, CSS, and JavaScript. Designed for marathon training and strength training — no frameworks, no build tools, just open `index.html` in a browser.

## What It Does

Bergin PFT is a two-mode training companion:

- **Running Mode** — Built around an 18-week Bucharest Marathon training plan (target: 3:45:00). Log runs, view a calendar, track weekly mileage and pace trends, and count down to race day.
- **Strength Mode** — Track Push/Pull/Legs sessions. Log exercises with weight and sets/reps, view progress over time with per-exercise weight charts.

Both modes store data in `localStorage`, so everything persists between sessions on the same device.

## Key Features

- Race countdown timer (days, hours, minutes, seconds to Bucharest Marathon)
- Full 18-week training plan with weekly structure and target paces
- Run logging with type, distance, pace, and notes
- Monthly calendar view with click-to-inspect day detail
- Weekly mileage and average pace charts (canvas-based, no libraries)
- Strength session logging with multi-exercise support and multiple sets per exercise
- Exercise weight progression charts grouped by Push/Pull/Legs
- Export/Import data as JSON for syncing between devices (desktop ↔ mobile)
- Responsive design — works on desktop and mobile browsers

## Project Structure

```
fitness-tracking/
├── index.html    # Main entry point — open this in your browser
├── styles.css    # All styling (CSS custom properties, flexbox/grid layout)
├── app.js        # Application logic (mode selection, running, strength)
├── data.js       # Training plan data and exercise definitions
└── README.md     # This file
```

## How to Run

1. Clone or download the repo
2. Open `index.html` in any modern browser (double-click or drag into browser)
3. That's it — no server, no installs, no build step

Or visit the live version via GitHub Pages:
**https://willbergin.github.io/fitness-tracking/**

## Syncing Data Between Devices

Data lives in your browser's `localStorage` (per device). To sync:

1. On device A: click **⬇ Export Data** on the home screen — downloads a JSON backup
2. Transfer the file (OneDrive, email, AirDrop, etc.)
3. On device B: click **⬆ Import Data** and select the file
4. Choose to **merge** (keep data from both devices) or **replace** (overwrite)

## Tech Stack

- HTML5
- CSS3 (custom properties, flexbox, grid)
- Vanilla JavaScript (ES6+)
- Canvas API for charts
- localStorage for persistence
- Zero dependencies
