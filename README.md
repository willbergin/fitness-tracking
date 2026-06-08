# Bergfit

A personal hybrid fitness tracker built with vanilla HTML, CSS, and JavaScript. Designed for goal-based running training and strength training — no frameworks, no build tools, just open `index.html` in a browser.

## What It Does

Bergfit is a two-mode training companion:

- **Running Mode** — Set any running goal (race, time trial, etc.), create custom training plans, log runs, view a calendar, and track weekly mileage and pace trends.
- **Strength Mode** — Track Push/Pull/Legs sessions. Log exercises with weight and sets/reps, view progress over time with per-exercise weight charts.

Both modes store data in `localStorage`, so everything persists between sessions on the same device. Use the Export/Import feature to sync between devices.

## Key Features

- **Dynamic goal system** — Set any upcoming goal with a target time, custom paces, and linked training plan
- Race/goal countdown timer (days, hours, minutes, seconds)
- **Multiple training plans** — Default Bucharest Marathon plan plus create/edit/delete your own custom plans via free text input
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
**https://willbergin.github.io/fitness-tracking/**

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
