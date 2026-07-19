# Palmiiz BF6 Stats Dashboard

A web application for viewing your **Battlefield 6** multiplayer statistics, built with [Next.js](https://nextjs.org) and [Bootstrap 5.3](https://getbootstrap.com/).

Data is powered by the [GameTools Network API](https://gametools.network).

## Features

- 🎮 **Player Search** — Search any BF6 player by username across EA, PC, Xbox, and PlayStation platforms
- 📊 **Core Combat Stats** — Kills, Deaths, K/D Ratio, Score, Assists, and more
- 📈 **Performance Metrics** — Kills/Min, Kills/Match, Damage, DPM, Headshot %, Accuracy
- 🏆 **Match Stats** — Matches Played, Wins, Losses, Win Rate, Multi Kills, Savior Kills
- 🩹 **Support & Teamplay** — Revives, Heals, Resupplies, Repairs, Squad Revives, Spots
- 🔫 **Kill Breakdown** — ADS, Hipfire, Long Distance, Grenades, Vehicle, Human Kills
- 🏴 **Objective Stats** — Captured, Neutralized, Objective Time, Attacked/Defended
- 💥 **Damage Breakdown** — Human, Explosive, Passenger, Vehicle Driver, To/With Vehicle (with % bars)
- 🤝 **Assists Breakdown** — Human, Passenger, Spot, Driver, Pilot assists
- 🎖️ **Classes** — Assault, Engineer, Support, Recon with detailed per-class stats
- 🎮 **Game Modes** — Conquest, Breakthrough with mode-specific K/D, objectives, headshots
- 📅 **Season Stats** — Per-season and per-mode statistics
- 🔫 **Weapons Table** — All weapons with images, sortable/searchable DataTable (kills, damage, accuracy, headshots, etc.)
- 🚗 **Vehicles Table** — All vehicles with images, sortable/searchable DataTable (kills, damage, distance, etc.)
- 🗺️ **Maps Table** — All maps with thumbnail images, sortable/searchable DataTable (matches, wins, win %, time)
- 🧰 **Gadgets Table** — All gadgets with images, sortable/searchable DataTable (kills, damage, uses, repairs)
- 🔍 **DataTable Component** — Generic reusable table with search, column sorting, and pagination

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript
- **UI:** [Bootstrap 5.3](https://getbootstrap.com/) (dark theme with custom gaming styles)
- **API:** [GameTools Network](https://api.gametools.network/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm, yarn, pnpm, or bun

### Installation

```bash
git clone https://github.com/PalmiizKittinan/bf6-stats.git
cd bf6-stats
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```text
src/
├── app/
│   ├── globals.css              # Global styles, Bootstrap import, custom dark theme
│   ├── layout.tsx               # Root layout with Bootstrap dark theme
│   └── page.tsx                 # Main page entry point
├── components/
│   ├── Dashboard.tsx            # Main dashboard: search bar, API fetch, layout orchestration
│   ├── PlayerHeader.tsx         # Player avatar, username, platform, time played, XP
│   ├── StatCards.tsx            # Grid cards: combat, performance, match, support, kill, objective stats
│   ├── DamageBreakdown.tsx      # Damage & assists breakdown with color-coded progress bars
│   ├── ClassesTable.tsx         # Class cards (Assault, Engineer, Support, Recon) with per-class stats
│   ├── GameModesTable.tsx       # Game mode cards (Conquest, Breakthrough) with mode stats
│   ├── WeaponsTable.tsx         # Weapons DataTable with images, sortable columns
│   ├── VehiclesTable.tsx        # Vehicles DataTable with images, sortable columns
│   ├── MapsTable.tsx            # Maps DataTable with thumbnails, sortable columns
│   ├── GadgetsTable.tsx         # Gadgets DataTable with images, sortable columns
│   └── DataTable.tsx            # Generic reusable DataTable (search, sort, pagination)
└── types/
    └── bf6.ts                   # TypeScript interfaces for all API response types
```

## 🐳 Docker

```bash
# 1. Build Docker
docker compose --build


# 2. Docker compose up
docker compose up -d

# 3. Go to Web UI
http://localhost:3022
```

## API Reference

The application fetches data from:

```text
https://api.gametools.network/bf6/stats/?categories=multiplayer&raw=false&format_values=true&seperation=false&name={playerName}&platform={platform}&skip_battlelog=true&lang=en-us
```

| Parameter  | Description                            | Values                          |
| ---------- | -------------------------------------- | ------------------------------- |
| `name`     | Player username                        | Any BF6 username                |
| `platform` | Gaming platform                        | `ea`, `pc`, `xbox`, `psn`       |
| `lang`     | Language                               | `en-us`, and others             |

## Screenshots

### The dashboard features a dark gaming-themed UI with

- Gradient header with player avatar and info
- Color-coded stat cards organized in responsive grids
- Sortable & searchable data tables for weapons, vehicles, maps, and gadgets
- Progress bars for damage/assists breakdowns
- Class and game mode summary cards

## Deployment

Deploy easily on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PalmiizKittinan/bf6-stats)

## License

This project is for personal / educational use. Game data is provided by the [GameTools Network](https://gametools.network) third-party API.
