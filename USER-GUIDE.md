# Bergin PFT — User Guide

## Getting Started

Open the app by visiting **https://willbergin.github.io/fitness-tracking/** in any browser, or double-click `index.html` if you have the files locally.

You'll see the home screen with two training modes to choose from:

- **Running** — Marathon training tracker
- **Strength** — Push/Pull/Legs session logger

Tap either card to enter that mode. Use the **← Bergin PFT** button in the top-left corner to return to the home screen at any time.

---

## Running Mode

### Overview

The Overview screen shows:

- **Race Countdown** — Live countdown to the Bucharest Marathon (11th October 2026) in days, hours, minutes, and seconds.
- **Target Goal Time** — 3:45:00 with target pace of 5:20–5:25/km.
- **Training Paces** — Reference table showing the pace range for each run type (Recovery, Easy, Long Run, Marathon Pace, Tempo, Intervals).
- **This Week** — Shows the current week's training sessions from the 18-week plan.

### Plan

A full view of the 18-week marathon training programme. Each week shows:

- Week label and dates
- Total weekly volume (km)
- Individual sessions (day number, title, pace/detail)

The current week is highlighted with a blue border and a "Current" badge.

### Log Run

Record a training run with the following fields:

| Field | Required | Description |
|-------|----------|-------------|
| Date | Yes | Defaults to today. Can be changed to log past runs. |
| Run Type | Yes | Easy, Long Run, Tempo, Intervals, Marathon Pace, Hills, Recovery, or Race. |
| Distance (km) | Yes | e.g. 10.5 |
| Pace (min:sec per km) | Yes | Enter minutes and seconds separately. e.g. 5 and 25 for 5:25/km. |
| Notes | No | Free text. e.g. "Felt strong on the hills" |

Click **Save Run** to store it. Your recent runs appear below the form, most recent first. Click the **×** button on any run to delete it.

### Calendar

A monthly calendar showing all logged runs. Each day cell shows the run type(s) as coloured tags.

- Use the **← Previous** and **Next →** buttons to navigate months.
- Today's date is highlighted.
- Click any day to open a detail popup showing the runs for that date.
- From the popup, you can delete runs or click **+ Log a Run on this date** to jump to the log form with that date pre-filled.

### Stats

Displays key metrics and trend charts:

- **Runs This Week** — Number of runs logged in the current Monday–Sunday week.
- **Runs This Month** — Total runs in the current calendar month.
- **km This Week / km This Month** — Total distance for each period.
- **Weekly Running Mileage** — Line chart showing total km per week over time.
- **Average Pace by Week** — Line chart showing average pace (min:sec/km) per week. Lower is faster — the chart is inverted so "faster" appears higher.

Charts update automatically as you log more runs.

---

## Strength Mode

### Overview

Shows at-a-glance info:

- **Sessions This Month** — Count of strength sessions logged in the current month.
- **Goal** — Current strength goal (45KG Dumbbell Press, target May 2027).
- **Exercise Lists** — Three cards (Push, Pull, Legs) showing every exercise with the heaviest weight and sets/reps you've ever recorded for it. Shows "—" if no data yet.

### Log Session

Record a strength training session:

1. **Select Date** — Defaults to today.
2. **Select Type** — Choose Push, Pull, or Legs.
3. **Select Exercises** — Checkboxes appear grouped by Push/Pull/Legs. Tick the exercises you performed.
4. **Enter Weight & Sets/Reps** — For each selected exercise, enter the weight in kg and sets/reps in format like `4x10` (4 sets of 10 reps).
5. **Multiple entries per exercise** — Click **+ Add another** to record different weights/rep schemes for the same exercise (e.g. warm-up set at 20kg then working sets at 35kg).
6. Click **Save Session**.

Recent sessions appear below the form. Click **×** to delete.

### Calendar

Same layout as the Running calendar but shows strength sessions. Sessions appear as purple tags showing the type (Push/Pull/Legs).

Click a day to see session details. From the popup you can:

- **Edit** — Modify weights and sets/reps for any exercise in the session.
- **Delete** — Remove the session entirely.

### Stats

Shows weight progression charts for each exercise, grouped by Push, Pull, and Legs.

- Each exercise gets its own line chart showing your maximum weight per month over time.
- Only exercises with logged data appear.
- The x-axis shows months, the y-axis shows weight in kg.

Use these charts to track progressive overload and identify plateaus.

---

## Syncing Data Between Devices

Your data is stored in your browser's local storage, which means it doesn't automatically sync between devices. Use the Export/Import feature on the home screen:

### Exporting

1. Go to the home screen (the mode selection screen).
2. Click **⬇ Export Data**.
3. A JSON file downloads named `bergin-pft-backup-YYYY-MM-DD.json` containing all your runs and strength sessions.

### Importing

1. Go to the home screen.
2. Click **⬆ Import Data**.
3. Select a previously exported JSON file.
4. If you already have data on this device, you'll be asked:
   - **OK (Merge)** — Keeps existing data and adds any new records from the file. Duplicates are skipped automatically.
   - **Cancel (Replace)** — Overwrites all existing data with the imported file.

### Recommended Workflow

- After logging a session on your phone, export and save the file to OneDrive (or email it to yourself).
- On your other device, import that file.
- The merge option means you can safely import multiple times without creating duplicates.

---

## Tips

- **Add to Home Screen** — On mobile, use your browser's "Add to Home Screen" option to launch the app like a native app.
- **Data is per-browser** — If you use Chrome on one device and Safari on another, they have separate storage even on the same device.
- **No internet required** — Once loaded, the app works fully offline (except for the initial page load from GitHub Pages).
- **Back button** — The **← Bergin PFT** text in the navigation bar takes you back to mode selection from either Running or Strength mode.

---

## Exercises Available

### Push
Flat Dumbbell Press, Incline Dumbbell Press, Mid Cable Flys, Downwards Cable Flys, Bench Dumbbell Flys, Machine Chest Press, Dips, Dumbbell Shoulder Press, Dumbbell Shoulder Raises, Machine Shoulder Press, Barbell Shoulder Press, Downwards Tricep Rope Extensions, Upwards Tricep Rope Extensions, Standing Away Tricep Rope Extensions, Cable Tricep Extensions

### Pull
Pull Ups, Dumbbell Rows, Barbell Rows, Rope Pulls, Cable Pulls, Lat Pull Downs, Cable Rows, Isolated Bicep Curls, Seated Bicep Curls, Hammer Curls, Side Curls, Rope Curls

### Legs
Leg Press, Lunges, Calf Raises, Leg Extensions
