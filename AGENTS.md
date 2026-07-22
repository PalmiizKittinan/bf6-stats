<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# BF6 Stats Dashboard — Project Guide

> A web application for viewing **Battlefield 6** multiplayer statistics, built with **Next.js 16 (App Router)**, **TypeScript**, **Bootstrap 5.3**, and **Zustand** for state management.

Data is powered by the [GameTools Network API](https://gametools.network).

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [File Descriptions](#file-descriptions)
4. [Routing](#routing)
5. [API Integration](#api-integration)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [Theming System](#theming-system)
9. [DataTable Component](#datatable-component)
10. [Development Commands](#development-commands)
11. [Docker](#docker)
12. [CI/CD & Semantic Release](#cicd--semantic-release)
13. [Environment & Config](#environment--config)
14. [Coding Conventions](#coding-conventions)
15. [Key Patterns](#key-patterns)

---

## Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack)      |
| Language     | TypeScript                              |
| UI Library   | Bootstrap 5.3                           |
| Font         | Google Sans (Google Fonts)              |
| Styling      | Custom CSS with CSS variables (dark/light themes) |
| State Mgmt   | Zustand 5.x                             |
| API          | GameTools Network REST API (external)   |
| Runtime      | Node.js 20+                             |
| Package Mgr  | npm                                     |
| CI/CD        | GitHub Actions + semantic-release       |
| Container    | Docker + Docker Compose                 |

---

## Project Structure

```text
bf6-stats/
├── AGENTS.md                       # Project guide for AI agents (this file)
├── CLAUDE.md                       # Claude-specific instructions
├── README.md                       # User-facing documentation with badges
├── next.config.ts                  # Next.js configuration (image domains, etc.)
├── tsconfig.json                   # TypeScript configuration
├── postcss.config.mjs              # PostCSS config (empty, no Tailwind)
├── eslint.config.mjs               # ESLint configuration
├── package.json                    # Dependencies & scripts
├── Dockerfile                      # Docker build (node:20-alpine)
├── docker-compose.yaml             # Docker Compose for development
├── .dockerignore                   # Docker ignore rules
├── .releaserc.json                 # semantic-release config (branches: [master])
├── CHANGELOG.md                    # Auto-generated changelog
│
├── .github/
│   └── workflows/
│       ├── ci.yml                  # CI: build & lint on push/PR to master
│       └── release.yml             # Release: semantic-release on push to master
│
├── public/                         # Static assets
│
└── src/
    ├── app/
    │   ├── globals.css             # Global styles, Bootstrap import, Google Sans font, dark/light CSS variables
    │   ├── layout.tsx              # Root layout: ThemeProvider, SearchProvider, Navbar, Footer
    │   ├── page.tsx                # Entry page → redirects to /profile
    │   ├── profile/
    │   │   └── page.tsx            # /profile route: renders <Profile /> component
    │   └── stats/
    │       └── page.tsx            # /stats route: renders stats UI from Zustand store
    │
    ├── components/
    │   ├── Navbar.tsx              # Shared navbar: tabs, search bar, saved names, ThemeToggle
    │   ├── SearchProvider.tsx      # Thin React Context wrapper delegating to Zustand store
    │   ├── Profile.tsx             # Profile page component (reads from Zustand store)
    │   ├── PlayerHeader.tsx        # Player avatar, name, platform, best class, time played, XP
    │   ├── StatCards.tsx            # Grid of stat cards (combat, performance, match, support, objectives)
    │   ├── DamageBreakdown.tsx     # Damage & assists breakdown with color-coded progress bars
    │   ├── ClassesTable.tsx        # Class cards (Assault, Engineer, Support, Recon)
    │   ├── GameModesTable.tsx      # Game mode cards (Conquest, Breakthrough)
    │   ├── WeaponsTable.tsx        # Weapons DataTable with images
    │   ├── VehiclesTable.tsx       # Vehicles DataTable with images
    │   ├── MapsTable.tsx           # Maps DataTable with thumbnails
    │   ├── GadgetsTable.tsx        # Gadgets DataTable with images
    │   ├── DataTable.tsx           # Generic reusable DataTable (search, sort, pagination)
    │   ├── ThemeProvider.tsx       # Context provider for theme (dark/light/system) using useSyncExternalStore
    │   ├── ThemeToggle.tsx         # UI toggle buttons for theme selection
    │   ├── Dashboard.tsx           # Legacy single-page dashboard (unused by routing)
    │   └── Footer.tsx              # Shared footer with copyright, GitHub link, version from package.json
    │
    ├── store/
    │   └── usePlayerStore.ts       # Zustand store: search state, stats/profile data, fetching, timeout
    │
    └── types/
        └── bf6.ts                  # TypeScript interfaces for all API response types
```

---

## File Descriptions

### App Layer (`src/app/`)

| File              | Role | Details |
| ----------------- | ---- | ------- |
| `layout.tsx`      | Root layout | Wraps `<html>` and `<body>`. Imports `globals.css`, Google Sans font. Wraps children with `ThemeProvider` → `SearchProvider` → `Navbar` + `<main>` + `Footer`. Sets initial `data-bs-theme="dark"` on `<html>`. |
| `page.tsx`        | Entry page | Server component that redirects `/` to `/profile`. |
| `profile/page.tsx`| Profile page | Client component. Renders `<Profile />` (no props — reads from Zustand store). |
| `stats/page.tsx`  | Stats page | Client component. Reads stats data from Zustand store, renders all stats sections. |
| `globals.css`     | Global styles | Imports Bootstrap CSS. Defines CSS variables for dark/light themes. Google Sans as primary font. Custom classes for cards, tables, navbar, scrollbar, theme toggle. |

### Components (`src/components/`)

| Component         | Type          | Purpose |
| ----------------- | ------------- | ------- |
| `Navbar.tsx`      | Client Component | Shared navbar across all pages. Contains: tabs (👤 Profile, 📊 Stats) using `next/link`, search form (player name + platform), saved names (localStorage), ThemeToggle. Uses `usePathname()` for active tab highlighting and `useSearch()` for search state. |
| `SearchProvider.tsx`| Client Component (Context) | Thin React Context wrapper that delegates all state to the Zustand store (`usePlayerStore`). Provides `playerName`, `platform`, `searchInput`, `setSearchInput`, `setPlatform`, `handleSearch`, `resetToDefault`. |
| `Profile.tsx`     | Client Component | Reads profile data from Zustand store. Displays rank image, rank name, badges, dog tags, competitive ranks, profile overview stats, combat stats, support stats, objective stats, class stats cards, weapon type kills, distance & travel. Has refresh button. |
| `PlayerHeader.tsx`| Client Component | Displays player avatar, username, platform, best class (calculated from classes data, excluding "All"), time played, XP from stats API. |
| `StatCards.tsx`    | Client Component | Grid of `<StatCard>` sub-components showing core combat, performance, match, support, kill breakdown, objective, and additional stats. |
| `DamageBreakdown.tsx` | Client Component | Shows damage types (human, explosive, passenger, etc.) and assist types with colored progress bars and percentages. |
| `ClassesTable.tsx` | Client Component | Displays class cards (Assault, Engineer, Support, Recon) with kills, deaths, K/D, KPM, score, spawns, assists, revives. |
| `GameModesTable.tsx` | Client Component | Game mode cards (Conquest, Breakthrough) with mode-specific stats including objectives. |
| `WeaponsTable.tsx` | Client Component | Wraps `<DataTable>` for weapons. Shows image, name, type, kills, K/M, damage, headshots, accuracy, etc. Default sorted by kills descending. |
| `VehiclesTable.tsx` | Client Component | Wraps `<DataTable>` for vehicles. Shows image, name, type, kills, damage, spawns, assists, distance, destroyed. Default sorted by kills descending. |
| `MapsTable.tsx`   | Client Component | Wraps `<DataTable>` for maps. Shows thumbnail, map name, matches, wins, losses, win %, time. Filters out "All" entry. |
| `GadgetsTable.tsx` | Client Component | Wraps `<DataTable>` for gadgets. Shows image, name, type, kills, damage, assists, uses, repairs. Default sorted by kills descending. |
| `DataTable.tsx`   | Client Component | **Generic reusable table** with: column sorting (click header), text search/filter, pagination (page size configurable). Accepts generic type `T extends { id: string }`. |
| `ThemeProvider.tsx` | Client Component (Context) | React Context provider for theme management. Supports `dark`, `light`, `system` modes. Uses `useSyncExternalStore` for OS theme sync. Persists to `localStorage`. Exposes `useTheme()` hook. |
| `ThemeToggle.tsx` | Client Component | Three toggle buttons (☀️ Light, 💻 OS, 🌙 Dark) for theme selection. Uses `useTheme()` hook. |
| `Dashboard.tsx`   | Client Component | Legacy single-page dashboard with inline navbar. **Not used by current routing** — kept for reference only. |
| `Footer.tsx`      | Server Component | Shared footer across all pages. Shows copyright with current year, GitHub link, and version badge from `package.json`. |

### Store (`src/store/`)

| File              | Contents |
| ----------------- | -------- |
| `usePlayerStore.ts` | Zustand store managing all app state: search (`searchInput`, `playerName`, `platform`), stats data (`stats`, `statsLoading`, `statsError`), profile data (`profile`, `profileLoading`, `profileError`). Handles fetching with AbortController, 10-second timeout, and shared state across pages. |

### Types (`src/types/`)

| File    | Contents |
| ------- | -------- |
| `bf6.ts` | All TypeScript interfaces: `BF6Stats`, `Season`, `GameMode`, `WeaponDetail`, `VehicleDetail`, `WeaponGroup`, `VehicleGroup`, `ClassDetail`, `MapDetail`, `GameModeDetail`, `GameModeGroup`, `GadgetDetail`, `GadgetGroup`, `MeleeDetail`, `MeleeGroup`, `VehicleArchetype`, `ProfileStat`, `PlayerCard`, `CompetitiveRank`, `BF6Profile` |

---

## Routing

| Route       | Page Component | Description |
| ----------- | -------------- | ----------- |
| `/`         | `page.tsx`     | Redirects to `/profile` |
| `/profile`  | `profile/page.tsx` | Player profile page (default landing) |
| `/stats`    | `stats/page.tsx`   | Full stats dashboard |
| `/_not-found` | (auto)       | 404 page |

Navigation between pages is handled by `next/link` in the `Navbar` component. Tab state is URL-based (not in React state).

---

## API Integration

### Stats Endpoint

```text
GET https://api.gametools.network/bf6/stats/?categories=multiplayer&raw=false&format_values=true&seperation=false&name={playerName}&platform={platform}&skip_battlelog=true&lang=en-us
```

### Profile Endpoint

```text
GET https://api.gametools.network/bf6/profile/?name={playerName}&platform={platform}&skip_battlelog=true&lang=en-us
```

### Query Parameters

| Parameter         | Value              | Description |
| ----------------- | ------------------ | ----------- |
| `name`            | `{playerName}`     | Player username to search |
| `platform`        | `ea` / `pc` / `xbox` / `psn` | Platform selector |
| `skip_battlelog`  | `true`             | Skip Battlelog lookup |
| `lang`            | `en-us`            | Language |

### Fetching Pattern

Data is fetched client-side from the Zustand store (`usePlayerStore`). The store uses `AbortController` with a **10-second timeout**. Fetching is triggered only when the user clicks the Search button — not on page load or page navigation.

```typescript
// In usePlayerStore.ts
const timeoutId = setTimeout(() => controller.abort(), 10_000);
const res = await fetch(url, { signal: controller.signal });
```

Data persists in the Zustand store across page navigation (`/profile` ↔ `/stats`). It is only cleared on browser refresh or when the user clicks "Clear Search".

---

## Component Architecture

```text
layout.tsx
  ├── ThemeProvider
  │   └── SearchProvider (delegates to Zustand store)
  │       ├── Navbar (tabs: /profile, /stats + search bar + saved names + ThemeToggle)
  │       ├── <main>
  │       │   └── {children} (page.tsx)
  │       │       ├── /profile → Profile.tsx (reads profile from Zustand)
  │       │       │   └── 🔄 Refresh button (re-fetches profile)
  │       │       └── /stats → stats/page.tsx (reads stats from Zustand)
  │       │           ├── 🔄 Refresh button (re-fetches stats)
  │       │           ├── PlayerHeader
  │       │           ├── StatCards
  │       │           ├── DamageBreakdown
  │       │           ├── ClassesTable
  │       │           ├── GameModesTable
  │       │           ├── SeasonStatsSection (inline)
  │       │           ├── WeaponsTable → DataTable
  │       │           ├── VehiclesTable → DataTable
  │       │           ├── MapsTable → DataTable
  │       │           └── GadgetsTable → DataTable
  │       └── Footer
```

**Data flow**: The Zustand store (`usePlayerStore`) holds all shared state — search input, player name, platform, stats data, and profile data. When the user clicks Search, both `fetchStats()` and `fetchProfile()` are called. Pages read directly from the store — no prop drilling or page-local fetching.

---

## State Management

State is managed with **Zustand** (`src/store/usePlayerStore.ts`):

| State              | Description |
| ------------------ | ----------- |
| `searchInput`      | Current text in the search input |
| `playerName`       | Active searched player name (set on Search click) |
| `platform`         | Selected platform (ea/pc/xbox/psn) |
| `stats` / `statsLoading` / `statsError` | Stats API data and fetch status |
| `profile` / `profileLoading` / `profileError` | Profile API data and fetch status |

Additional state:
- **React Context** (`ThemeProvider`) for global theme state using `useSyncExternalStore`
- **React Context** (`SearchProvider`) — thin wrapper delegating to Zustand store
- **`localStorage`** for theme persistence (`bf6-theme`) and saved player names (`bf6-saved-names`)

Key behaviors:
- **Search-on-click**: Data is only fetched when user clicks Search or selects a saved name — no auto-fetch on page load
- **Cross-page persistence**: Data persists in Zustand when navigating between `/profile` and `/stats`
- **10-second timeout**: API requests are aborted with a timeout error message if no response within 10 seconds
- **Refresh**: Each page has its own refresh button to re-fetch its specific data

---

## Theming System

### Architecture

1. `ThemeProvider.tsx` — Context provider wrapping the entire app
2. `ThemeToggle.tsx` — UI buttons to switch modes (in Navbar)
3. `globals.css` — CSS variables for both themes

### Theme Modes

| Mode     | Behavior |
| -------- | -------- |
| `dark`   | Forces dark theme via `data-bs-theme="dark"` |
| `light`  | Forces light theme via `data-bs-theme="light"` |
| `system` | Uses `useSyncExternalStore` to listen to OS `prefers-color-scheme` |

### Persistence

Theme mode is saved to `localStorage` key `bf6-theme` and restored after hydration via `useEffect`.

### CSS Variables

All colors use CSS custom properties defined under `[data-bs-theme="dark"]` and `[data-bs-theme="light"]` selectors in `globals.css`. Key variables: `--bf6-bg`, `--bf6-text`, `--bf6-text-strong`, `--bf6-text-muted`, `--bf6-accent`, `--bf6-border`, `--bf6-card-gradient`, `--bf6-header-bg`, `--bf6-search-bg`, `--bf6-bar-bg`.

---

## DataTable Component

### Usage Pattern

```tsx
import DataTable from "./DataTable";

<DataTable
  columns={columns}           // Column definitions with key, label, sortable, align, render
  data={items}                // Array of items extending { id: string }
  pageSize={10}               // Items per page
  searchable                  // Enable search input
  searchKeys={["name", "type"]} // Fields to search on
  searchPlaceholder="Search..."
  title="Section Title"
  icon="🔫"
  defaultSortKey="kills"      // Initial sort column
  defaultSortDir="desc"       // Initial sort direction
/>
```

### Features

- **Sorting**: Click column headers to toggle asc/desc. Supports numeric and string comparison.
- **Search**: Filters rows by matching `searchKeys` against input text.
- **Pagination**: Page navigation with first/prev/page numbers/next/last buttons. Shows max 5 page buttons.
- **Custom renderers**: Each column can have a `render` function for custom cell content (images, badges, formatted numbers).

---

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Turbopack) on http://localhost:3000
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint
```

---

## Docker

### Dockerfile

Multi-stage build using `node:20-alpine` (Next.js 16 requires Node.js >= 20.9.0).

```bash
# Development
docker compose up --build
# Access at http://localhost:3000
```

### docker-compose.yaml

- Mounts `src/` and `public/` for live code editing (hot reload)
- Maps port 3000:3000
- Sets `NODE_ENV=development`

---

## CI/CD & Semantic Release

### GitHub Actions

- **`ci.yml`**: Runs `npm ci` → `npm run lint` → `npm run build` on push/PR to `master`
- **`release.yml`**: Runs build, lint, then `npx semantic-release` on push to `master` (skips `[skip ci]` commits)

### Semantic Release (`.releaserc.json`)

- Branches: `master`
- Commit conventions: Angular preset
  - `feat:` → minor release
  - `fix:`, `perf:`, `refactor:` → patch release
  - `docs:`, `chore:`, `ci:`, `test:`, `style:`, `build:` → no release
- Plugins: commit-analyzer, release-notes-generator, changelog, npm (no publish), git (commits package.json + CHANGELOG.md), github (creates GitHub Release)

---

## Environment & Config

### `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "eaassets-a.akamaihd.net" },
    ],
  },
};
```

No environment variables are needed — the API is public and requires no authentication.

### `postcss.config.mjs`

Empty plugins — Bootstrap is imported directly via CSS `@import`.

### ESLint Config

- Extends `next/core-web-vitals` and `next/typescript`
- Disabled rules: `react-hooks/set-state-in-effect` (needed for data fetching pattern), `@next/next/no-img-element` (external API images)

---

## Coding Conventions

1. **All components are Client Components** (`"use client"`) since they use hooks, state, or event handlers.
2. **TypeScript strict mode** — all props and data are fully typed.
3. **Bootstrap classes** for layout (`container`, `row`, `col-*`, `g-3`, `d-flex`, etc.)
4. **Custom CSS classes** for theming (`stats-card`, `stat-value`, `stat-label`, `stat-highlight`, `section-title`, `search-input`, `bf6-navbar`, `weapon-bar`, `season-badge`, `theme-toggle-btn`)
5. **Emoji icons** used for visual indicators (💀, 🎯, 📊, 🏆, etc.)
6. **Conditional rendering** — sections only render when their data exists
7. **Images** use `onError` fallback handlers to hide broken images gracefully
8. **Number formatting** — `toLocaleString()` for large numbers, `toFixed()` for decimals
9. **Font** — Google Sans as primary font family
10. **Footer** — Version from `package.json` displayed as a badge

---

## Key Patterns

### Adding a New Page

1. Create `src/app/<route>/page.tsx` as a client component
2. Read data from `usePlayerStore()` (Zustand) for playerName/platform/stats/profile
3. Add navigation link in `Navbar.tsx` using `next/link`

### Adding a New Stats Section

1. Define the TypeScript interface in `src/types/bf6.ts`
2. Create a new component in `src/components/`
3. Import and add it to the relevant page with conditional rendering
4. For table-heavy data, wrap `<DataTable>` with column definitions

### Adding a New Column to DataTable

In the relevant table component (e.g., `WeaponsTable.tsx`), add an entry to the `columns` array:

```typescript
{ key: "fieldName", label: "Display Name", sortable: true, align: "end" as const, render: (item) => item.fieldName.toLocaleString() }
```

### Modifying Theme Colors

Edit CSS variables in `src/app/globals.css` under `[data-bs-theme="dark"]` or `[data-bs-theme="light"]` selectors.

---

## Dependencies

| Package    | Version | Purpose |
| ---------- | ------- | ------- |
| `next`     | 16.2.x  | React framework with App Router |
| `react`    | 19.x    | UI library |
| `react-dom`| 19.x    | React DOM rendering |
| `bootstrap`| 5.3.3   | CSS framework |
| `zustand`  | 5.x     | State management |

All dev dependencies are standard Next.js defaults (TypeScript, ESLint, Tailwind CSS PostCSS — though Tailwind is not used).