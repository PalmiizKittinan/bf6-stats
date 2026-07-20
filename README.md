# Palmiiz BF6 Stats Dashboard

[![CI/CD](https://github.com/PalmiizKittinan/bf6-stats/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/PalmiizKittinan/bf6-stats/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A web application for viewing your **Battlefield 6** multiplayer statistics, built with [Next.js](https://nextjs.org) and [Bootstrap 5.3](https://getbootstrap.com/).

Data is powered by the [GameTools Network API](https://gametools.network).

---

## Features

### 👤 Profile Page (`/profile`)

- 🏅 **Rank & Title** — Rank image, rank number, title, badges, dog tags
- 🏆 **Competitive Ranks** — Redsec modes with rank names
- 📊 **Profile Overview** — Score, Kills, Deaths, K/D, Matches, Wins, Win %
- 🔫 **Combat Stats** — Assists, Damage, Headshots, Human Kills, Multi Kills, Accuracy
- 🩹 **Support & Teamplay** — Revives, Squad Revives, Heals, Repairs, Spotted
- 🏴 **Objective Stats** — Captured, Neutralized, Objective Time, Vehicles Destroyed
- 🎖️ **Class Stats** — Assault, Engineer, Support, Recon with kills, deaths, K/D, score, time
- 🔫 **Weapon Type Kills** — AR, Carbine, DMR, MG, SMG, Sniper, Pistol, Shotgun
- 🚶 **Distance & Travel** — On Foot, Vehicle, Passenger, Driving/Flying Time

### 📊 Stats Page (`/stats`)

- 📊 **Core Combat Stats** — Kills, Deaths, K/D Ratio, Score, Assists
- 📈 **Performance Metrics** — Kills/Min, Kills/Match, Damage, DPM, Headshot %, Accuracy
- 🏆 **Match Stats** — Matches Played, Wins, Losses, Win Rate, Multi Kills
- 🩹 **Support & Teamplay** — Revives, Heals, Resupplies, Repairs, Squad Revives
- 🔫 **Kill Breakdown** — ADS, Hipfire, Long Distance, Grenades, Vehicle, Human Kills
- 🏴 **Objective Stats** — Captured, Neutralized, Objective Time
- 💥 **Damage Breakdown** — Human, Explosive, Passenger, Vehicle (with % bars)
- 🤝 **Assists Breakdown** — Human, Passenger, Spot, Driver, Pilot
- 🎖️ **Classes** — Assault, Engineer, Support, Recon
- 🎮 **Game Modes** — Conquest, Breakthrough with mode-specific stats
- 📅 **Season Stats** — Per-season and per-mode statistics
- 🔫 **Weapons Table** — All weapons with images, sortable/searchable DataTable
- 🚗 **Vehicles Table** — All vehicles with images, sortable/searchable DataTable
- 🗺️ **Maps Table** — All maps with thumbnails, sortable/searchable DataTable
- 🧰 **Gadgets Table** — All gadgets with images, sortable/searchable DataTable

### 🎨 UI Features

- 🌙 **Dark/Light/System Theme** — Toggle with `useSyncExternalStore` for OS sync
- 🔍 **Player Search** — Search any BF6 player by username across EA, PC, Xbox, PlayStation
- 📊 **DataTable Component** — Generic reusable table with search, column sorting, pagination

---

## Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Framework    | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language     | TypeScript                              |
| UI Library   | [Bootstrap 5.3](https://getbootstrap.com/) |
| Font         | Google Sans (Google Fonts)              |
| API          | [GameTools Network](https://api.gametools.network/) REST API |
| CI/CD        | GitHub Actions + semantic-release       |
| Container    | Docker + Docker Compose                 |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm

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

Open [http://localhost:3022](http://localhost:3022) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 🐳 Docker

```bash
# 1. Build Docker image
docker compose build

# 2. Start container
docker compose up -d

# 3. Access at http://localhost:3022
```

---

## Project Structure

```text
src/
├── app/
│   ├── globals.css              # Global styles, Bootstrap, Google Sans, dark/light CSS variables
│   ├── layout.tsx               # Root layout: ThemeProvider, SearchProvider, Navbar, Footer
│   ├── page.tsx                 # Entry page → redirects to /profile
│   ├── profile/
│   │   └── page.tsx             # /profile route: player profile from profile API
│   └── stats/
│       └── page.tsx             # /stats route: full stats dashboard from stats API
├── components/
│   ├── Navbar.tsx               # Shared navbar: tabs (👤 Profile, 📊 Stats), search bar, ThemeToggle
│   ├── SearchProvider.tsx       # React Context for shared search state across pages
│   ├── Profile.tsx              # Profile page: rank, card, competitive ranks, detailed stats
│   ├── PlayerHeader.tsx         # Player avatar, name, platform, time played, XP
│   ├── StatCards.tsx            # Grid of stat cards
│   ├── DamageBreakdown.tsx      # Damage & assists breakdown with progress bars
│   ├── ClassesTable.tsx         # Class cards (Assault, Engineer, Support, Recon)
│   ├── GameModesTable.tsx       # Game mode cards (Conquest, Breakthrough)
│   ├── WeaponsTable.tsx         # Weapons DataTable with images
│   ├── VehiclesTable.tsx        # Vehicles DataTable with images
│   ├── MapsTable.tsx            # Maps DataTable with thumbnails
│   ├── GadgetsTable.tsx         # Gadgets DataTable with images
│   ├── DataTable.tsx            # Generic reusable DataTable (search, sort, pagination)
│   ├── ThemeProvider.tsx        # Context provider for theme (dark/light/system)
│   ├── ThemeToggle.tsx          # UI toggle buttons for theme selection
│   └── Footer.tsx               # Shared footer with copyright, GitHub link, version
└── types/
    └── bf6.ts                   # TypeScript interfaces for all API response types
```

---

## Routing

| Route       | Description                                    |
| ----------- | ---------------------------------------------- |
| `/`         | Redirects to `/profile`                        |
| `/profile`  | Player profile page (default landing)          |
| `/stats`    | Full stats dashboard                           |

---

## API Reference

### Stats Endpoint

```text
GET https://api.gametools.network/bf6/stats/?categories=multiplayer&raw=false&format_values=true&seperation=false&name={playerName}&platform={platform}&skip_battlelog=true&lang=en-us
```

### Profile Endpoint

```text
GET https://api.gametools.network/bf6/profile/?name={playerName}&platform={platform}&skip_battlelog=true&lang=en-us
```

| Parameter  | Description       | Values                    |
| ---------- | ----------------- | ------------------------- |
| `name`     | Player username   | Any BF6 username          |
| `platform` | Gaming platform   | `ea`, `pc`, `xbox`, `psn` |
| `lang`     | Language          | `en-us`, and others       |

---

## License

This project is for personal / educational use. Game data is provided by the [GameTools Network](https://gametools.network) third-party API.
