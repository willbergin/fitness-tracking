/**
 * Bergin PFT — Data Layer
 * Training plan data for marathon + strength exercise definitions.
 */

const MARATHON_CONFIG = {
  raceName: "Bucharest Marathon",
  raceDate: "2026-10-11",
  targetTime: "3:45:00",
  targetPace: "5:20–5:25/km"
};

const TRAINING_PACES = [
  { type: "Recovery", pace: "5:50–6:20/km" },
  { type: "Easy", pace: "5:35–5:55/km" },
  { type: "Long Run", pace: "5:45–6:00/km" },
  { type: "Marathon Pace", pace: "5:20–5:25/km" },
  { type: "Tempo", pace: "4:50–5:00/km" },
  { type: "Intervals", pace: "4:20–4:40/km" }
];

const TRAINING_PLAN = [
  {
    week: 1,
    label: "Week 1",
    dates: "8–14 June 2026",
    startDate: "2026-06-08",
    volume: "~28 km",
    days: [
      { day: 1, title: "7 km Easy", detail: "Pace: 5:35–5:50/km" },
      { day: 2, title: "7 km Steady Intervals", detail: "5 × 3 min @ 5:00–5:10/km. Recover at easy pace" },
      { day: 3, title: "14 km Long Run", detail: "Pace: 5:45–6:00/km" }
    ]
  },
  {
    week: 2,
    label: "Week 2",
    dates: "15–21 June 2026",
    startDate: "2026-06-15",
    volume: "~32 km",
    days: [
      { day: 1, title: "8 km Hill Session", detail: "6 × 60 sec uphill. Easy pace between efforts" },
      { day: 2, title: "8 km Tempo", detail: "4 km @ 4:55–5:00/km" },
      { day: 3, title: "16 km Long Run", detail: "Pace: 5:45–6:00/km" }
    ]
  },
  {
    week: 3,
    label: "Week 3",
    dates: "22–28 June 2026",
    startDate: "2026-06-22",
    volume: "~36 km",
    days: [
      { day: 1, title: "8 km Easy", detail: "Pace: 5:35–5:50/km" },
      { day: 2, title: "10 km Tempo", detail: "5 km @ 4:55/km" },
      { day: 3, title: "18 km Long Run", detail: "Pace: 5:45–6:00/km" }
    ]
  },
  {
    week: 4,
    label: "Week 4",
    dates: "29 June–5 July 2026",
    startDate: "2026-06-29",
    volume: "~38 km",
    days: [
      { day: 1, title: "8 km Hill Session", detail: "8 × 60 sec uphill" },
      { day: 2, title: "10 km Tempo", detail: "5 km @ 4:55/km" },
      { day: 3, title: "20 km Long Run", detail: "Pace: 5:45–6:00/km" }
    ]
  },
  {
    week: 5,
    label: "Week 5",
    dates: "6–12 July 2026",
    startDate: "2026-07-06",
    volume: "~46 km",
    days: [
      { day: 1, title: "8 km Intervals", detail: "5 × 1 km @ 4:30–4:40/km" },
      { day: 2, title: "10 km Marathon Pace", detail: "5 km @ 5:20–5:25/km" },
      { day: 3, title: "6 km Easy", detail: "Pace: 5:35–5:55/km" },
      { day: 4, title: "22 km Long Run", detail: "Pace: 5:45–6:00/km" }
    ]
  },
  {
    week: 6,
    label: "Week 6",
    dates: "13–19 July 2026",
    startDate: "2026-07-13",
    volume: "~50 km",
    days: [
      { day: 1, title: "8 km Hills", detail: "8 × 75 sec uphill" },
      { day: 2, title: "10 km Tempo", detail: "6 km @ 4:55/km" },
      { day: 3, title: "8 km Easy", detail: "Pace: 5:35–5:55/km" },
      { day: 4, title: "24 km Long Run", detail: "Pace: 5:45–6:00/km" }
    ]
  },
  {
    week: 7,
    label: "Week 7",
    dates: "20–26 July 2026",
    startDate: "2026-07-20",
    volume: "~56 km",
    days: [
      { day: 1, title: "10 km Intervals", detail: "6 × 1 km @ 4:30–4:40/km" },
      { day: 2, title: "12 km Marathon Pace", detail: "6 km @ 5:20–5:25/km" },
      { day: 3, title: "8 km Easy", detail: "Pace: 5:35–5:55/km" },
      { day: 4, title: "26 km Long Run", detail: "Pace: 5:45–6:00/km" }
    ]
  },
  {
    week: 8,
    label: "Week 8 — Cutback",
    dates: "27 July–2 August 2026",
    startDate: "2026-07-27",
    volume: "~42 km",
    days: [
      { day: 1, title: "8 km Easy", detail: "Pace: 5:35–5:55/km" },
      { day: 2, title: "8 km Tempo", detail: "4 km @ 4:55/km" },
      { day: 3, title: "6 km Easy", detail: "Pace: 5:35–5:55/km" },
      { day: 4, title: "20 km Long Run", detail: "Pace: 5:45–6:00/km" }
    ]
  },
  {
    week: 9,
    label: "Week 9",
    dates: "3–9 August 2026",
    startDate: "2026-08-03",
    volume: "~58 km",
    days: [
      { day: 1, title: "10 km Intervals", detail: "6 × 1 km @ 4:25–4:40/km" },
      { day: 2, title: "12 km Marathon Pace", detail: "8 km @ 5:20–5:25/km" },
      { day: 3, title: "8 km Easy", detail: "Pace: 5:35–5:55/km" },
      { day: 4, title: "28 km Long Run", detail: "Pace: 5:45–6:00/km" }
    ]
  },
  {
    week: 10,
    label: "Week 10",
    dates: "10–16 August 2026",
    startDate: "2026-08-10",
    volume: "~60 km",
    days: [
      { day: 1, title: "10 km Hills", detail: "8 × 90 sec uphill" },
      { day: 2, title: "12 km Tempo", detail: "6 km @ 4:50–4:55/km" },
      { day: 3, title: "8 km Easy", detail: "Pace: 5:35–5:55/km" },
      { day: 4, title: "30 km Long Run", detail: "Pace: 5:45–6:00/km" }
    ]
  },
  {
    week: 11,
    label: "Week 11",
    dates: "17–23 August 2026",
    startDate: "2026-08-17",
    volume: "~64 km",
    days: [
      { day: 1, title: "10 km Intervals", detail: "5 × 1.2 km @ 4:25–4:40/km" },
      { day: 2, title: "14 km Marathon Pace", detail: "8 km @ 5:20–5:25/km" },
      { day: 3, title: "8 km Easy", detail: "Pace: 5:35–5:55/km" },
      { day: 4, title: "32 km Long Run", detail: "Pace: 5:45–6:00/km" }
    ]
  },
  {
    week: 12,
    label: "Week 12 — Cutback",
    dates: "24–30 August 2026",
    startDate: "2026-08-24",
    volume: "~50 km",
    days: [
      { day: 1, title: "8 km Easy", detail: "" },
      { day: 2, title: "10 km Tempo", detail: "5 km @ 4:55/km" },
      { day: 3, title: "8 km Easy", detail: "" },
      { day: 4, title: "24 km Long Run", detail: "" }
    ]
  },
  {
    week: 13,
    label: "Week 13",
    dates: "31 August–6 September 2026",
    startDate: "2026-08-31",
    volume: "~64 km",
    days: [
      { day: 1, title: "10 km Intervals", detail: "" },
      { day: 2, title: "14 km Marathon Pace", detail: "8 km @ 5:20–5:25/km" },
      { day: 3, title: "8 km Easy", detail: "" },
      { day: 4, title: "32 km Long Run", detail: "" }
    ]
  },
  {
    week: 14,
    label: "Week 14 — Peak Week",
    dates: "7–13 September 2026",
    startDate: "2026-09-07",
    volume: "~66 km",
    days: [
      { day: 1, title: "10 km Hills", detail: "8 × 90 sec" },
      { day: 2, title: "14 km Marathon Pace", detail: "10 km @ 5:20–5:25/km" },
      { day: 3, title: "8 km Easy", detail: "" },
      { day: 4, title: "34 km Long Run", detail: "Pace: 5:45–6:00/km" }
    ]
  },
  {
    week: 15,
    label: "Week 15",
    dates: "14–20 September 2026",
    startDate: "2026-09-14",
    volume: "~60 km",
    days: [
      { day: 1, title: "10 km Intervals", detail: "" },
      { day: 2, title: "12 km Marathon Pace", detail: "" },
      { day: 3, title: "8 km Easy", detail: "" },
      { day: 4, title: "30 km Long Run", detail: "First 20 km @ 5:50/km, Last 10 km @ 5:20–5:25/km" }
    ]
  },
  {
    week: 16,
    label: "Week 16",
    dates: "21–27 September 2026",
    startDate: "2026-09-21",
    volume: "~50 km",
    days: [
      { day: 1, title: "8 km Tempo", detail: "" },
      { day: 2, title: "10 km Marathon Pace", detail: "" },
      { day: 3, title: "8 km Easy", detail: "" },
      { day: 4, title: "24 km Long Run", detail: "Last 8 km at marathon pace" }
    ]
  },
  {
    week: 17,
    label: "Week 17",
    dates: "28 September–4 October 2026",
    startDate: "2026-09-28",
    volume: "~36 km",
    days: [
      { day: 1, title: "6 km Easy", detail: "" },
      { day: 2, title: "8 km Marathon Pace", detail: "4 km MP" },
      { day: 3, title: "6 km Easy", detail: "" },
      { day: 4, title: "16 km Long Run", detail: "" }
    ]
  },
  {
    week: 18,
    label: "Week 18 — Race Week",
    dates: "5–11 October 2026",
    startDate: "2026-10-05",
    volume: "Race Week",
    days: [
      { day: 1, title: "5 km Easy + 4–6 strides", detail: "" },
      { day: 2, title: "4 km Easy", detail: "" },
      { day: 3, title: "Rest", detail: "" },
      { day: 4, title: "Marathon – 42.2 km", detail: "Target Pace: 5:20–5:25/km. Target Finish Time: 3:45–3:49" }
    ]
  }
];


/* ===== Strength Training Data ===== */

const STRENGTH_EXERCISES = {
  Push: [
    "Flat Dumbbell Press",
    "Incline Dumbbell Press",
    "Mid Cable Flys",
    "Downwards Cable Flys",
    "Bench Dumbbell Flys",
    "Machine Chest Press",
    "Dips",
    "Dumbbell Shoulder Press",
    "Dumbbell Shoulder Raises",
    "Machine Shoulder Press",
    "Barbell Shoulder Press",
    "Downwards Tricep Rope Extensions",
    "Upwards Tricep Rope Extensions",
    "Standing Away Tricep Rope Extensions",
    "Cable Tricep Extensions"
  ],
  Pull: [
    "Pull Ups",
    "Dumbbell Rows",
    "Barbell Rows",
    "Rope Pulls",
    "Cable Pulls",
    "Lat Pull Downs",
    "Cable Rows",
    "Isolated Bicep Curls",
    "Seated Bicep Curls",
    "Hammer Curls",
    "Side Curls",
    "Rope Curls"
  ],
  Legs: [
    "Leg Press",
    "Lunges",
    "Calf Raises",
    "Leg Extensions"
  ]
};

const STRENGTH_GOAL = {
  description: "120KG Bench / 45KG Dumbbell Press",
  targetDate: "May 2027"
};
