# Palmiiz BF6 Stats Dashboard

[![CI/CD](https://github.com/PalmiizKittinan/bf6-stats/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/PalmiizKittinan/bf6-stats/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-0891B2?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-5-FF6B00?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A web application for viewing your **Battlefield 6** multiplayer statistics — player profile, class/weapon/vehicle breakdowns, and full season stats — built with [Next.js](https://nextjs.org), [Bootstrap 5.3](https://getbootstrap.com/), [Tailwind CSS 4](https://tailwindcss.com/), and [Zustand](https://github.com/pmndrs/zustand) for state management.

Data is powered by the [GameTools Network API](https://gametools.network).

---

## Features

### 🔍 Search & State

- **Search-on-click** — Data is only fetched when the user clicks Search or selects a saved name
- **Cross-page persistence** — Data persists in Zustand store when navigating between `/profile` and `/stats`
- **10-second timeout** — API requests abort automatically with an error message if no response within 10 seconds
- **Saved player names** — Save frequently searched players to localStorage for quick access
- **Refresh buttons** — Each page has its own refresh button to re-fetch its specific data

### 🎨 Dual CSS Framework (Bootstrap + Tailwind)

- **UI toggle** — Switch between Bootstrap and Tailwind themes via **BS** / **TW** buttons in the navbar
- **Persistent choice** — Framework selection is saved to localStorage
- **Distinct themes** — Bootstrap uses red accent (#e94560), Tailwind uses teal accent (#0891B2) with glass-morphism cards
- **Dark/Light themes** — Both frameworks support dark, light, and system theme modes

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
| UI Library   | [Bootstrap 5.3](https://getbootstrap.com/) + [Tailwind CSS 4](https://tailwindcss.com/) |
| Font         | Google Sans (Google Fonts)              |
| State Mgmt   | [Zustand 5.x](https://github.com/pmndrs/zustand) |
| API          | [GameTools Network](https://api.gametools.network/) REST API |
| CI/CD        | GitHub Actions + semantic-release       |
| Container    | Docker + Docker Compose                 |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.9.0 or later (required by Next.js 16)
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

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
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

The compose setup mounts `src/` and `public/` into the container, so code changes are picked up via hot reload without rebuilding the image.

---

## Project Structure

```text
src/
├── app/
│   ├── globals.css              # Global styles, Bootstrap + Tailwind, CSS variables, dark/light themes
│   ├── layout.tsx               # Root layout: ThemeProvider, CSSFrameworkProvider, SearchProvider, Navbar, Footer
│   ├── page.tsx                 # Entry page → redirects to /profile
│   ├── profile/
│   │   └── page.tsx             # /profile route: switches between Bootstrap/Tailwind Profile
│   └── stats/
│       └── page.tsx             # /stats route: switches between Bootstrap/Tailwind Stats
├── components/
│   ├── Navbar.tsx               # Bootstrap navbar with BS/TW toggle
│   ├── NavbarWrapper.tsx        # Switches between Bootstrap/Tailwind navbar
│   ├── FooterWrapper.tsx        # Switches between Bootstrap/Tailwind footer
│   ├── CSSFrameworkProvider.tsx  # Context for Bootstrap/Tailwind selection (persisted)
│   ├── SearchProvider.tsx       # Thin React Context wrapper delegating to Zustand store
│   ├── Profile.tsx              # Bootstrap Profile page (reads from Zustand store)
│   ├── PlayerHeader.tsx         # Bootstrap player header
│   ├── StatCards.tsx            # Bootstrap stat cards grid
│   ├── DamageBreakdown.tsx      # Damage & assists breakdown with progress bars
│   ├── ClassesTable.tsx         # Class cards (Assault, Engineer, Support, Recon)
│   ├── GameModesTable.tsx       # Game mode cards (Conquest, Breakthrough)
│   ├── WeaponsTable.tsx         # Weapons DataTable with images
│   ├── VehiclesTable.tsx        # Vehicles DataTable with images
│   ├── MapsTable.tsx            # Maps DataTable with thumbnails
│   ├── GadgetsTable.tsx         # Gadgets DataTable with images
│   ├── DataTable.tsx            # Generic reusable DataTable (search, sort, pagination)
│   ├── ThemeProvider.tsx        # Context provider for theme (dark/light/system)
│   ├── ThemeToggle.tsx          # Bootstrap theme toggle buttons
│   ├── Dashboard.tsx            # Legacy single-page dashboard (unused)
│   ├── Footer.tsx               # Bootstrap footer
│   ├── tailwind/                # Tailwind CSS theme components
│   │   ├── NavbarTW.tsx         # Tailwind navbar with glass-morphism, teal accent
│   │   ├── ThemeToggleTW.tsx    # Tailwind theme toggle buttons
│   │   ├── FooterTW.tsx         # Tailwind footer
│   │   ├── PlayerHeaderTW.tsx   # Tailwind player header with glow effects
│   │   ├── StatCardsTW.tsx      # Tailwind glass-morphism stat cards
│   │   ├── ProfileTW.tsx        # Full Tailwind Profile page
│   │   └── StatsPageTW.tsx      # Full Tailwind Stats page
├── store/
│   └── usePlayerStore.ts        # Zustand store: search, stats, profile, fetching, timeout
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

## State Management

The app uses **Zustand** (`src/store/usePlayerStore.ts`) as a centralized store for all application state:

- **Search state**: `searchInput`, `playerName`, `platform`
- **Stats data**: `stats`, `statsLoading`, `statsError`
- **Profile data**: `profile`, `profileLoading`, `profileError`
- **Fetching**: Uses `AbortController` with 10-second timeout
- **Cross-page persistence**: Data survives navigation between `/profile` and `/stats`
- **Local-only fetch**: Data is only fetched on user action (Search, Refresh) — never on page load

Additional state:
- **CSSFrameworkProvider** — Manages Bootstrap/Tailwind selection, persisted to localStorage
- **ThemeProvider** — Manages dark/light/system theme, persisted to localStorage

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

No API key or authentication is required — the GameTools Network API is public.

---

## Contributing

This is a personal project, but bug reports and suggestions are welcome via [GitHub Issues](https://github.com/PalmiizKittinan/bf6-stats/issues). Commit messages follow the [Angular convention](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit) (`feat:`, `fix:`, `docs:`, etc.) since releases are automated with semantic-release.

---

## License

This project is for personal / educational use. Game data is provided by the [GameTools Network](https://gametools.network) third-party API.
