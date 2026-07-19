<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# BF6 Stats Dashboard — Project Guide

> A web application for viewing **Battlefield 6** multiplayer statistics, built with **Next.js 16 (App Router)**, **TypeScript**, and **Bootstrap 5.3**.

Data is powered by the [GameTools Network API](https://gametools.network).

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [File Descriptions](#file-descriptions)
4. [API Integration](#api-integration)
5. [Component Architecture](#component-architecture)
6. [Theming System](#theming-system)
7. [DataTable Component](#datatable-component)
8. [State Management](#state-management)
9. [Development Commands](#development-commands)
10. [Environment & Config](#environment--config)
11. [Coding Conventions](#coding-conventions)
12. [Key Patterns](#key-patterns)

---

## Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack)      |
| Language     | TypeScript                              |
| UI Library   | Bootstrap 5.3                           |
| Styling      | Custom CSS with CSS variables (dark/light themes) |
| API          | GameTools Network REST API (external)   |
| Runtime      | Node.js 18+                             |
| Package Mgr  | npm                                     |

---

## Project Structure

```text
bf6-stats/
├── AGENTS.md                   # Project guide for AI agents (this file)
├── CLAUDE.md                   # Claude-specific instructions
├── README.md                   # User-facing documentation
├── next.config.ts              # Next.js configuration (image domains, etc.)
├── tsconfig.json               # TypeScript configuration
├── postcss.config.mjs          # PostCSS config (empty, no Tailwind)
├── eslint.config.mjs           # ESLint configuration
├── package.json                # Dependencies & scripts
├── Dockerfile                  # Docker build for development
├── docker-compose.yaml         # Docker Compose orchestration
│
├── public/                     # Static assets (empty)
│
└── src/
    ├── app/
    │   ├── globals.css         # Global styles, Bootstrap import, dark/light CSS variables
    │   ├── layout.tsx          # Root layout (html, body, ThemeProvider wrapper)
    │   └── page.tsx            # Entry page → renders <Dashboard />
    │
    ├── components/
    │   ├── Dashboard.tsx       # Main orchestrator: navbar, search, fetches API, renders all sections
    │   ├── PlayerHeader.tsx    # Player avatar, name, platform, time played, XP
    │   ├── StatCards.tsx        # Grid of stat cards (combat, performance, match, support, objectives)
    │   ├── DamageBreakdown.tsx  # Damage & assists breakdown with color-coded progress bars
    │   ├── ClassesTable.tsx    # Class cards (Assault, Engineer, Support, Recon)
    │   ├── GameModesTable.tsx  # Game mode cards (Conquest, Breakthrough)
    │   ├── WeaponsTable.tsx    # Weapons DataTable with images
    │   ├── VehiclesTable.tsx   # Vehicles DataTable with images
    │   ├── MapsTable.tsx       # Maps DataTable with thumbnails
    │   ├── GadgetsTable.tsx    # Gadgets DataTable with images
    │   ├── DataTable.tsx       # Generic reusable DataTable (search, sort, pagination)
    │   ├── ThemeProvider.tsx   # Context provider for theme (dark/light/system)
    │   └── ThemeToggle.tsx     # UI toggle buttons for theme selection
    │
    └── types/
        └── bf6.ts              # TypeScript interfaces for all API response types
```

---

## File Descriptions

### App Layer (`src/app/`)

| File          | Role | Details |
| ------------- | ---- | ------- |
| `layout.tsx`  | Root layout | Wraps `<html>` and `<body>`. Imports `globals.css`. Wraps children with `<ThemeProvider>`. Sets initial `data-bs-theme="dark"` on `<html>`. |
| `page.tsx`    | Page component | Simply renders `<Dashboard />`. All logic is in components. |
| `globals.css` | Global styles | Imports Bootstrap CSS. Defines CSS variables for both dark and light themes. Contains all custom styles for cards, tables, inputs, scrollbar, etc. |

### Components (`src/components/`)

| Component         | Type          | Purpose |
| ----------------- | ------------- | ------- |
| `Dashboard.tsx`   | Client Component | Main container. Manages API fetch state (loading, error, data). Contains navbar with search form and theme toggle. Renders all stat sections conditionally. |
| `PlayerHeader.tsx`| Client Component | Displays player avatar, username, platform, time played, XP. Uses `stats.avatar` from API. |
| `StatCards.tsx`    | Client Component | Grid of `<StatCard>` sub-components showing core combat, performance, match, support, kill breakdown, objective, and additional stats. |
| `DamageBreakdown.tsx` | Client Component | Shows damage types (human, explosive, passenger, etc.) and assist types with colored progress bars and percentages. |
| `ClassesTable.tsx` | Client Component | Displays class cards (Assault, Engineer, Support, Recon) with kills, deaths, K/D, KPM, score, spawns, assists, revives. |
| `GameModesTable.tsx` | Client Component | Game mode cards (Conquest, Breakthrough) with mode-specific stats including objectives. |
| `WeaponsTable.tsx` | Client Component | Wraps `<DataTable>` for weapons. Shows image, name, type, kills, K/M, damage, headshots, accuracy, etc. Default sorted by kills descending. |
| `VehiclesTable.tsx` | Client Component | Wraps `<DataTable>` for vehicles. Shows image, name, type, kills, damage, spawns, assists, distance, destroyed. Default sorted by kills descending. |
| `MapsTable.tsx`   | Client Component | Wraps `<DataTable>` for maps. Shows thumbnail, map name, matches, wins, losses, win %, time. Filters out "All" entry. |
| `GadgetsTable.tsx` | Client Component | Wraps `<DataTable>` for gadgets. Shows image, name, type, kills, damage, assists, uses, repairs. Default sorted by kills descending. |
| `DataTable.tsx`   | Client Component | **Generic reusable table** with: column sorting (click header), text search/filter, pagination (page size configurable). Accepts generic type `T extends { id: string }`. |
| `ThemeProvider.tsx` | Client Component (Context) | React Context provider for theme management. Supports `dark`, `light`, `system` modes. Persists to `localStorage`. Listens to OS theme changes when in `system` mode. Exposes `useTheme()` hook. |
| `ThemeToggle.tsx` | Client Component | Three toggle buttons (☀️ Light, 💻 OS, 🌙 Dark) for theme selection. Uses `useTheme()` hook. |

### Types (`src/types/`)

| File    | Contents |
| ------- | -------- |
| `bf6.ts` | All TypeScript interfaces: `BF6Stats`, `Season`, `GameMode`, `WeaponDetail`, `VehicleDetail`, `WeaponGroup`, `VehicleGroup`, `ClassDetail`, `MapDetail`, `GameModeDetail`, `GameModeGroup`, `GadgetDetail`, `GadgetGroup`, `MeleeDetail`, `MeleeGroup`, `VehicleArchetype` |

---

## API Integration

### Endpoint

```text
GET https://api.gametools.network/bf6/stats/
```

### Query Parameters

| Parameter         | Value              | Description |
| ----------------- | ------------------ | ----------- |
| `categories`      | `multiplayer`      | Stats category |
| `raw`             | `false`            | Formatted values |
| `format_values`   | `true`             | Human-readable values |
| `seperation`      | `false`            | No separation |
| `name`            | `{playerName}`     | Player username to search |
| `platform`        | `ea` / `pc` / `xbox` / `psn` | Platform selector |
| `skip_battlelog`  | `true`             | Skip Battlelog lookup |
| `lang`            | `en-us`            | Language |

### Fetching Pattern

Data is fetched client-side in `Dashboard.tsx` using the `fetch` API with `useCallback` + `useEffect`. There is **no server-side data fetching** — all data is loaded on the client after hydration.

```typescript
const fetchStats = useCallback(async (name: string, plat: string) => {
  const params = new URLSearchParams({ ... });
  const res = await fetch(`${API_BASE}?${params.toString()}`);
  const data: BF6Stats = await res.json();
  // ...
}, []);

useEffect(() => { fetchStats(playerName, platform); }, [playerName, platform, fetchStats]);
```

### Key Response Fields

The `BF6Stats` interface (in `src/types/bf6.ts`) defines the full API response shape. Key sections:

- **Core**: `userName`, `avatar`, `platform`, `kills`, `deaths`, `score`, `wins`, `loses`, `assists`, `timePlayed`, `matchesPlayed`
- **Ratios**: `killDeath`, `infantryKillDeath`, `killsPerMinute`, `damagePerMinute`, `accuracy`, `headshots`, `winPercent`
- **Breakdowns**: `dividedKills` (ADS, hipfire, grenades, vehicle, weapons), `devidedDamage` (human, explosive, passenger, vehicle), `devidedAssists`, `distanceTraveled`, `objective`
- **Arrays**: `weapons[]`, `vehicles[]`, `classes[]`, `maps[]`, `gameModes[]`, `gadgets[]`, `seasons[]`
- **XP**: `XP[]` array with `total`, `performance`, `accolades`

---

## Component Architecture

```text
page.tsx
  └── Dashboard.tsx (state: stats, loading, error, playerName, platform)
        ├── <nav>
        │     ├── ThemeToggle
        │     └── Search form (player name + platform selector)
        ├── PlayerHeader (when stats loaded)
        ├── StatCards (when stats loaded)
        ├── DamageBreakdown (when stats loaded)
        ├── ClassesTable (when stats loaded)
        ├── GameModesTable (when stats loaded)
        ├── SeasonStatsSection (inline in Dashboard.tsx, when seasons with modes exist)
        ├── WeaponsTable → DataTable<WeaponDetail> (when stats.weapons exists)
        ├── VehiclesTable → DataTable<VehicleDetail> (when stats.vehicles exists)
        ├── MapsTable → DataTable<MapDetail> (when stats.maps exists)
        ├── GadgetsTable → DataTable<GadgetDetail> (when stats.gadgets exists)
        └── <footer>
```

**Data flow**: `Dashboard` → fetch API → store in `useState` → pass as props to child components. Each child component handles its own rendering logic.

---

## Theming System

### Architecture

1. `ThemeProvider.tsx` — Context provider wrapping the entire app
2. `ThemeToggle.tsx` — UI buttons to switch modes
3. `globals.css` — CSS variables for both themes

### Theme Modes

| Mode     | Behavior |
| -------- | -------- |
| `dark`   | Forces dark theme via `data-bs-theme="dark"` |
| `light`  | Forces light theme via `data-bs-theme="light"` |
| `system` | Reads `prefers-color-scheme` media query, updates on OS change |

### Persistence

Theme mode is saved to `localStorage` key `bf6-theme` and restored on page load.

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

## State Management

No external state library is used. State is managed with:

- **React `useState`** for component-local state (search input, stats data, loading/error)
- **React Context** (`ThemeProvider`) for global theme state
- **`localStorage`** for theme persistence
- **`useCallback`** + **`useEffect`** for data fetching

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

---

## Coding Conventions

1. **All components are Client Components** (`"use client"`) since they use hooks, state, or event handlers.
2. **TypeScript strict mode** — all props and data are fully typed.
3. **Bootstrap classes** for layout (`container`, `row`, `col-*`, `g-3`, `d-flex`, etc.)
4. **Custom CSS classes** for theming (`stats-card`, `stat-value`, `stat-label`, `stat-highlight`, `section-title`, `search-input`, `bf6-navbar`, `weapon-bar`, `season-badge`, `theme-toggle-btn`)
5. **Emoji icons** used for visual indicators (💀, 🎯, 📊, 🏆, etc.)
6. **Conditional rendering** — sections only render when their data exists (`stats.weapons && <WeaponsTable />`)
7. **Images** use `onError` fallback handlers to hide broken images gracefully
8. **Number formatting** — `toLocaleString()` for large numbers, `toFixed()` for decimals

---

## Key Patterns

### Adding a New Stats Section

1. Define the TypeScript interface in `src/types/bf6.ts`
2. Create a new component in `src/components/`
3. Import and add it to `Dashboard.tsx` with conditional rendering
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

All dev dependencies are standard Next.js defaults (TypeScript, ESLint, Tailwind CSS PostCSS — though Tailwind is not used).
