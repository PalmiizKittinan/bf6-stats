# 🎮 BF6 Stats Dashboard

A web app for viewing **Battlefield 6 Multiplayer statistics** — player profile, per-class breakdowns, weapons, vehicles, and seasonal stats

Data is powered by the [GameTools Network API](https://gametools.network) (public API, no API key required)

---

## ✨ Features

### 🔍 Player Search

- Search any BF6 player on **EA / PC / Xbox / PlayStation**
- Data only loads when you click Search (no auto-fetch on page load)
- **Save frequently searched player names** in your browser and select them with one click
- **Per-page Refresh button** — refreshes only the data on the current page
- Requests are aborted after 10 seconds with an error message displayed

### 🎨 Dual UI Themes

Switch between **Bootstrap** and **Tailwind CSS** with the **BS / TW** button in the navbar (your choice is remembered in the browser):

| Theme | Appearance |
| --- | --- |
| Bootstrap | Red accent (#e94560), classic look |
| Tailwind | Dark teal accent (#0891B2), glass-morphism, modern look |

Both themes support **Dark / Light / System** — switch anytime

### 📄 Pages

| Page | What you see |
| --- | --- |
| `/profile` | Player profile — Rank, Score, Kills/Deaths/K/D, per-class stats (Assault, Engineer, Support, Recon), close/long-range kills, vehicle time, etc. |
| `/stats` | Full stats — Kills, Damage, Headshot %, Accuracy, damage breakdown, per-mode stats (Conquest, Breakthrough), seasonal stats, weapons/vehicles/maps/gadgets tables (search/sort/paginate) |

---

## 🚀 How to Use

1. Open the app
2. Type a player name in the search box (and pick a platform)
3. Click **Search** — data will load and display

> 💡 Tip: Click the save button to save the name for quick repeat searches

---

## 🛠️ Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Bootstrap 5.3** + **Tailwind CSS 4**
- **Zustand** for all state management
- Google Sans font

---

## 📡 Data Source

All data comes from the public [GameTools Network](https://gametools.network) API — no login, no tokens, and the app **does not store any player data on a server** — everything runs in your browser

---

## 📝 Notes

- This app is **read-only** — it displays stats only and cannot modify any player data
- Numbers reflect the moment you searched — use Refresh to load the latest figures
- Weapon/vehicle/map images come from EA's servers — some images may fail to load (the app automatically hides broken images)

---

## ⚡ Powered by Local LLM — Ollama QWEN 3.8
