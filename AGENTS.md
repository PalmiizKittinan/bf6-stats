<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# BF6 Stats Dashboard — Project Guide

> A web application for viewing **Battlefield 6** multiplayer statistics, built with **Next.js 16 (App Router)**, **TypeScript**, **Bootstrap 5.3**, **Tailwind CSS 4**, and **Zustand** for state management.

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
9. [Dual CSS Framework](#dual-css-framework)
10. [DataTable Component](#datatable-component)
11. [Development Commands](#development-commands)
12. [Docker](#docker)
13. [CI/CD & Semantic Release](#cicd--semantic-release)
14. [Environment & Config](#environment--config)
15. [Coding Conventions](#coding-conventions)
16. [Key Patterns](#key-patterns)

---

## Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack)      |
| Language     | TypeScript                              |
| UI Library   | Bootstrap 5.3 + Tailwind CSS 4          |
| Font         | Google Sans (Google Fonts)              |
| Styling      | CSS variables (dark/light themes) + Tailwind `@theme` tokens |
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
├── postcss.config.mjs              # PostCSS config (Tailwind CSS v4 plugin)
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
    │   ├── globals.css             # Global styles: Bootstrap + Tailwind imports, CSS variables, theme overrides
    │   ├── layout.tsx              # Root layout: ThemeProvider, CSSFrameworkProvider, SearchProvider
    │   ├── page.tsx                # Entry page → redirects to /profile
    │   ├── profile/
    │   │   └── page.tsx            # /profile route: switches Bootstrap/Tailwind Profile
    │   └── stats/
    │       └── page.tsx            # /stats route: switches Bootstrap/Tailwind Stats
    │
    ├── components/
    │   ├── Navbar.tsx              # Bootstrap navbar with BS/TW toggle
    │   ├── NavbarWrapper.tsx       # Switches between Bootstrap/Tailwind navbar
    │   ├── FooterWrapper.tsx       # Switches between Bootstrap/Tailwind footer
    │   ├── CSSFrameworkProvider.tsx # Context for Bootstrap/Tailwind selection (persisted to localStorage)
    │   ├── SearchProvider.tsx      # Thin React Context wrapper delegating to Zustand store
    │   ├── Profile.tsx             # Bootstrap Profile page (reads from Zustand store)
    │   ├── PlayerHeader.tsx        # Bootstrap player header (avatar, name, best class, time, XP)
    │   ├── StatCards.tsx            # Bootstrap stat cards grid
    │   ├── DamageBreakdown.tsx     # Damage & assists breakdown with progress bars
    │   ├── ClassesTable.tsx        # Class cards (Assault, Engineer, Support, Recon)
    │   ├── GameModesTable.tsx      # Game mode cards (Conquest, Breakthrough)
    │   ├── WeaponsTable.tsx        # Weapons DataTable with images
    │   ├── VehiclesTable.tsx       # Vehicles DataTable with images
    │   ├── MapsTable.tsx           # Maps DataTable with thumbnails
    │   ├── GadgetsTable.tsx        # Gadgets DataTable with images
    │   ├── DataTable.tsx           # Generic reusable DataTable (search, sort, pagination)
    │   ├── ThemeProvider.tsx       # Context provider for theme (dark/light/system) using useSyncExternalStore
    │   ├── ThemeToggle.tsx         # Bootstrap theme toggle buttons
    │   ├── Dashboard.tsx           # Legacy single-page dashboard (unused by routing)
    │   ├── Footer.tsx              # Bootstrap footer
    │   └── tailwind/               # Tailwind CSS theme components
    │       ├── NavbarTW.tsx        # Tailwind navbar (CSS variables, cyan accent)
    │       ├── ThemeToggleTW.tsx   # Tailwind theme toggle buttons
    │       ├── FooterTW.tsx        # Tailwind footer
    │       ├── PlayerHeaderTW.tsx  # Tailwind player header with glow effects
    │       ├── StatCardsTW.tsx     # Tailwind glass-morphism stat cards
    │       ├── ProfileTW.tsx       # Full Tailwind Profile page
    │       └── StatsPageTW.tsx     # Full Tailwind Stats page (reuses shared sub-components)
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
| `layout.tsx`      | Root layout | Wraps `<html>` and `<body>`. Imports `globals.css`, Google Sans font. Wraps children with `ThemeProvider` → `CSSFrameworkProvider` → `SearchProvider` → `NavbarWrapper` + `<main>` + `FooterWrapper`. Sets initial `data-bs-theme="dark"` on `<html>`. |
| `page.tsx`        | Entry page | Server component that redirects `/` to `/profile`. |
| `profile/page.tsx`| Profile page | Client component. Reads framework from `useCSSFramework()`, renders Bootstrap `<Profile />` or Tailwind `<ProfileTW />`. |
| `stats/page.tsx`  | Stats page | Client component. Reads framework from `useCSSFramework()`, renders Bootstrap `StatsPageBootstrap` or Tailwind `<StatsPageTW />`. |
| `globals.css`     | Global styles | Imports Tailwind CSS + Bootstrap CSS. Defines CSS variables for dark/light themes. `[data-framework="tailwind"]` selector overrides variables for Tailwind theme (cyan accent, navy background). Glass-morphism card classes. |

### Components (`src/components/`)

| Component         | Type          | Purpose |
| ----------------- | ------------- | ------- |
| `Navbar.tsx`      | Client Component | Bootstrap navbar. Contains: tabs, search form, saved names (localStorage), BS/TW toggle, ThemeToggle. |
| `NavbarWrapper.tsx` | Client Component | Switches between `Navbar.tsx` (Bootstrap) and `NavbarTW.tsx` (Tailwind) based on `useCSSFramework()`. |
| `FooterWrapper.tsx` | Client Component | Switches between `Footer.tsx` (Bootstrap) and `FooterTW.tsx` (Tailwind) based on `useCSSFramework()`. |
| `CSSFrameworkProvider.tsx` | Client Component (Context) | Manages Bootstrap/Tailwind selection. Persists to localStorage key `bf6-css-framework`. Sets `data-framework` attribute on `<html>` for CSS variable overrides. |
| `SearchProvider.tsx`| Client Component (Context) | Thin React Context wrapper that delegates all state to the Zustand store (`usePlayerStore`). |
| `Profile.tsx`     | Client Component | Bootstrap Profile page. Reads profile data from Zustand store. |
| `PlayerHeader.tsx`| Client Component | Bootstrap player header. Best class calculated from classes data (excluding "All"). |
| `StatCards.tsx`    | Client Component | Bootstrap stat cards grid. |
| `tailwind/NavbarTW.tsx` | Client Component | Tailwind navbar using CSS variables for theme-aware colors. All colors use `var(--bf6-*)` — no hardcoded hex. |
| `tailwind/ProfileTW.tsx` | Client Component | Full Tailwind Profile page using glass-morphism cards (`tw-glass-card`). |
| `tailwind/StatsPageTW.tsx` | Client Component | Tailwind Stats page. Reuses Bootstrap sub-components (DamageBreakdown, ClassesTable, etc.) since they use shared CSS classes. |

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
  │   └── CSSFrameworkProvider
  │       └── SearchProvider (delegates to Zustand store)
  │           ├── NavbarWrapper
  │           │   ├── Bootstrap: Navbar.tsx (with BS/TW toggle + ThemeToggle)
  │           │   └── Tailwind: NavbarTW.tsx (with BS/TW toggle + ThemeToggleTW)
  │           ├── <main>
  │           │   └── {children} (page.tsx)
  │           │       ├── /profile → switches Profile.tsx / ProfileTW.tsx
  │           │       └── /stats → switches StatsPageBootstrap / StatsPageTW.tsx
  │           │           ├── PlayerHeader / PlayerHeaderTW
  │           │           ├── StatCards / StatCardsTW
  │           │           ├── DamageBreakdown (shared)
  │           │           ├── ClassesTable (shared)
  │           │           ├── GameModesTable (shared)
  │           │           ├── WeaponsTable → DataTable (shared)
  │           │           ├── VehiclesTable → DataTable (shared)
  │           │           ├── MapsTable → DataTable (shared)
  │           │           └── GadgetsTable → DataTable (shared)
  │           └── FooterWrapper
  │               ├── Bootstrap: Footer.tsx
  │               └── Tailwind: FooterTW.tsx
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
- **React Context** (`CSSFrameworkProvider`) for Bootstrap/Tailwind selection, persisted to localStorage
- **React Context** (`SearchProvider`) — thin wrapper delegating to Zustand store
- **`localStorage`** for theme persistence (`bf6-theme`), CSS framework persistence (`bf6-css-framework`), and saved player names (`bf6-saved-names`)

Key behaviors:
- **Search-on-click**: Data is only fetched when user clicks Search or selects a saved name — no auto-fetch on page load
- **Cross-page persistence**: Data persists in Zustand when navigating between `/profile` and `/stats`
- **10-second timeout**: API requests are aborted with a timeout error message if no response within 10 seconds
- **Refresh**: Each page has its own refresh button to re-fetch its specific data

---

## Theming System

### Architecture

1. `ThemeProvider.tsx` — Context provider wrapping the entire app
2. `ThemeToggle.tsx` / `ThemeToggleTW.tsx` — UI buttons to switch modes (in Navbar)
3. `globals.css` — CSS variables for both themes + Tailwind overrides

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

## Dual CSS Framework

The app supports both **Bootstrap** and **Tailwind CSS** simultaneously. Users can switch via **BS/TW** toggle buttons in the navbar.

### How it Works

1. **`CSSFrameworkProvider.tsx`** — React Context storing `"bootstrap"` or `"tailwind"`. Persisted to `localStorage` key `bf6-css-framework`. Sets `data-framework` attribute on `<html>`.

2. **`globals.css`** — Contains `[data-framework="tailwind"]` selector that overrides CSS variables for Tailwind theme:
   - **Dark**: Cyan accent (#06b6d4), navy background (#080b14)
   - **Light**: Teal accent (#0891b2), sky blue background (#f0f9ff)

3. **Wrapper components** (`NavbarWrapper`, `FooterWrapper`) — Conditionally render Bootstrap or Tailwind components.

4. **Page components** (`profile/page.tsx`, `stats/page.tsx`) — Use `useCSSFramework()` to render Bootstrap or Tailwind versions.

### Bootstrap Theme
- Red accent (#e94560), blue-gray gradient background
- Bootstrap classes: `container`, `row`, `col-*`, `d-flex`, `btn`, etc.
- Custom CSS classes: `stats-card`, `stat-value`, `stat-highlight`

### Tailwind Theme
- Cyan accent (#06b6d4), dark navy gradient background
- Glass-morphism cards (`tw-glass-card`) with backdrop-filter blur
- Accent glow effects (`tw-accent-glow`)
- Tailwind utility classes: `flex`, `rounded-md`, `border`, etc.
- Uses CSS variables via inline styles for theme-aware colors

### Shared Components
Some components (DamageBreakdown, ClassesTable, GameModesTable, WeaponsTable, VehiclesTable, MapsTable, GadgetsTable, DataTable) use shared custom CSS classes that work in both frameworks. Tailwind pages reuse these Bootstrap sub-components.

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

Configured with `@tailwindcss/postcss` plugin for Tailwind CSS v4.

### ESLint Config

- Extends `next/core-web-vitals` and `next/typescript`
- Disabled rules: `react-hooks/set-state-in-effect` (needed for data fetching pattern), `@next/next/no-img-element` (external API images)

---

## Coding Conventions

1. **All components are Client Components** (`"use client"`) since they use hooks, state, or event handlers.
2. **TypeScript strict mode** — all props and data are fully typed.
3. **Bootstrap components** use Bootstrap classes (`container`, `row`, `col-*`, `g-3`, `d-flex`, etc.)
4. **Tailwind components** use Tailwind utility classes + CSS variables via inline styles for theme-aware colors
5. **Custom CSS classes** shared between frameworks (`stats-card`, `stat-value`, `stat-label`, `stat-highlight`, `section-title`, `weapon-bar`, `season-badge`, `header-section`)
6. **Tailwind-specific classes** (`tw-glass-card`, `tw-accent-glow`, `tw-bar-fill`)
7. **Emoji icons** used for visual indicators (💀, 🎯, 📊, 🏆, etc.)
8. **Conditional rendering** — sections only render when their data exists
9. **Images** use `onError` fallback handlers to hide broken images gracefully
10. **Number formatting** — `toLocaleString()` for large numbers, `toFixed()` for decimals
11. **Font** — Google Sans as primary font family
12. **Footer** — Version from `package.json` displayed as a badge

---

## Key Patterns

### Adding a New Page

1. Create `src/app/<route>/page.tsx` as a client component
2. Read data from `usePlayerStore()` (Zustand) for playerName/platform/stats/profile
3. Use `useCSSFramework()` to conditionally render Bootstrap or Tailwind version
4. Add navigation link in `Navbar.tsx` and `NavbarTW.tsx` using `next/link`

### Adding a New Stats Section

1. Define the TypeScript interface in `src/types/bf6.ts`
2. Create Bootstrap component in `src/components/`
3. Create Tailwind component in `src/components/tailwind/`
4. Import and add to both page versions with conditional rendering
5. For table-heavy data, wrap `<DataTable>` with column definitions

### Adding a Tailwind Component

1. Create file in `src/components/tailwind/`
2. Use CSS variables via inline styles: `style={{ color: "var(--bf6-accent)" }}`
3. Use Tailwind utility classes for layout: `flex`, `rounded-md`, `border`
4. Use `tw-glass-card` class for card elements (glass-morphism)
5. Use `tw-accent-glow` class for highlighted text (glow effect)
6. Register in the appropriate wrapper/page component

### Modifying Theme Colors

- **Bootstrap**: Edit CSS variables in `src/app/globals.css` under `[data-bs-theme="dark"]` or `[data-bs-theme="light"]`
- **Tailwind**: Edit under `[data-framework="tailwind"]` or `[data-framework="tailwind"][data-bs-theme="light"]`

---

## Dependencies

| Package    | Version | Purpose |
| ---------- | ------- | ------- |
| `next`     | 16.2.x  | React framework with App Router |
| `react`    | 19.x    | UI library |
| `react-dom`| 19.x    | React DOM rendering |
| `bootstrap`| 5.3.3   | CSS framework (Bootstrap theme) |
| `tailwindcss` | 4.x  | CSS framework (Tailwind theme) |
| `@tailwindcss/postcss` | 4.x | PostCSS plugin for Tailwind v4 |
| `zustand`  | 5.x     | State management |

All dev dependencies are standard Next.js defaults (TypeScript, ESLint, semantic-release).