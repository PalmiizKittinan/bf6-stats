# BF6 Stats Dashboard

A web application for viewing your **Battlefield 6** multiplayer statistics, built with [Next.js](https://nextjs.org) and [Bootstrap 5.3](https://getbootstrap.com/).

Data is powered by the [GameTools Network API](https://gametools.network).

## Features

- 🎮 **Player Search** — Search any BF6 player by username across EA, PC, Xbox, and PlayStation platforms
- 📊 **Core Stats** — Kills, Deaths, K/D Ratio, Score, Assists, and more
- 🎯 **Performance Metrics** — Kills/Min, Damage/Min, Headshot %, Accuracy
- 🏆 **Match Stats** — Wins, Losses, Win Rate, Multi Kills
- 🩹 **Support & Teamplay** — Revives, Heals, Resupplies, Repairs
- 🔫 **Kill Breakdown** — ADS, Hipfire, Long Distance, Grenades, Vehicle Kills
- 💥 **Damage Breakdown** — Human, Explosive, Passenger, Vehicle damage with visual progress bars
- 🔫 **Weapon Types** — Kill distribution across AR, SMG, DMR, Sniper, MG, Shotgun, Pistol
- 🚗 **Vehicle Stats** — Kills, damage, spawns, distance traveled per vehicle type
- 📅 **Season Stats** — Per-season and per-mode statistics

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript
- **UI:** Bootstrap 5.3 (dark theme)
- **API:** [GameTools Network](https://api.gametools.network/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm, yarn, pnpm, or bun

### Installation

```bash
git clone https://github.com/your-username/bf6-stats.git
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

```
src/
├── app/
│   ├── globals.css          # Global styles & Bootstrap import
│   ├── layout.tsx           # Root layout (dark theme)
│   └── page.tsx             # Main page entry point
├── components/
│   ├── Dashboard.tsx        # Main dashboard with search & API fetch
│   ├── PlayerHeader.tsx     # Player avatar, name, platform info
│   ├── StatCards.tsx         # Core stats grid cards
│   ├── DamageBreakdown.tsx  # Damage breakdown with progress bars
│   ├── WeaponTypesChart.tsx # Weapon type kill distribution
│   ├── WeaponsTable.tsx     # Top weapons table
│   ├── VehiclesTable.tsx    # Vehicle stats table
│   └── SeasonStats.tsx      # Season & game mode stats
└── types/
    └── bf6.ts               # TypeScript interfaces for API data
```

## API Reference

The application fetches data from:

```
https://api.gametools.network/bf6/stats/?categories=multiplayer&raw=false&format_values=true&seperation=false&name={playerName}&platform={platform}&skip_battlelog=true&lang=en-us
```

| Parameter  | Description                            | Values                          |
| ---------- | -------------------------------------- | ------------------------------- |
| `name`     | Player username                        | Any BF6 username                |
| `platform` | Gaming platform                        | `ea`, `pc`, `xbox`, `psn`       |
| `lang`     | Language                               | `en-us`, and others             |

## Deployment

Deploy easily on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/bf6-stats)

## License

This project is for personal / educational use. Game data is provided by the [GameTools Network](https://gametools.network) third-party API.