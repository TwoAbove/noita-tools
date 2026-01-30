# Noitool Upgrade & Refresh Plan

This document outlines a comprehensive plan to modernize the Noitool codebase, refactoring both the libraries and the underlying architecture to align with modern React best practices (as recommended by Vercel) and improve maintainability, performance, and developer experience.

## 1. Architectural Overhaul

The current architecture relies heavily on a class-based `GameInfoProvider` that mixes state management, business logic, and event dispatching (`EventTarget`). The UI uses `react-bootstrap` and older routing patterns.

### 1.1. State Management Migration
**Current State:** `GameInfoProvider` class with `EventTarget` for updates.
**Target State:**
-   **Server State (Async Logic):** Use **TanStack Query (React Query)**.
    -   The heavy lifting (WASM interaction, seed calculations) should be extracted into "Service" functions that are pure (or as pure as possible).
    -   Use `useQuery` hooks to call these services. This handles caching, loading states, and deduplication out of the box.
    -   *Benefit:* Eliminates the need for manual `loadPromise` management and event listeners.
-   **Client State (UI):** Use **Zustand** or **Jotai**.
    -   For global UI state (settings, theme, active tabs), use a lightweight store like Zustand.
    -   *Benefit:* Removes Prop Drilling and heavy Context providers.

### 1.2. Component Architecture
-   **Decouple Logic from View:** Components should not instantiate `GameInfoProvider`. Instead, they should consume data via custom hooks (e.g., `useSeedInfo(seed)`).
-   **Separation of Concerns:**
    -   `components/ui`: Dumb UI components (buttons, inputs) - heavily reusable.
    -   `components/features`: Feature-specific components (e.g., `PerkSelector`) that connect to stores/queries.

### 1.3. Routing & Data Fetching
**Current State:** `useEffect` based fetching and `MountOnEnter` tabs.
**Target State:** **React Router v6.4+ Data APIs**.
-   Use `loaders` to fetch data (or trigger WASM readiness) *before* rendering the route.
-   This eliminates "Render -> Loading Spinner -> Fetch -> Render" waterfalls.
-   *Vercel Best Practice:* **Eliminate Waterfalls**. Move data requirements to the route boundary.

---

## 2. Library Upgrades

### 2.1. UI Framework
**Current:** `react-bootstrap` (Bootstrap 5).
**Target:** **Tailwind CSS** + **Radix UI** (or **shadcn/ui**).
-   *Why?* Tailwind offers better performance (smaller bundle size via purging) and easier customization. Radix UI provides headless, accessible primitives that are highly composable.
-   *Migration:* Install Tailwind, configure generic theme tokens, and progressively replace Bootstrap components.

### 2.2. Virtualization
**Current:** `react-virtualized`.
**Target:** **@tanstack/react-virtual**.
-   *Why?* Lighter weight, headless (works perfectly with Tailwind), and more modern API.

### 2.3. Tooling
-   **Vite**: Keep as is (it's already modern).
-   **React**: Keep on v19.

---

## 3. Vercel React Best Practices Implementation

Based on Vercel's engineering guidelines, the following specific refactors will be applied:

### 3.1. Immutability & Modern Array Methods
-   **Rule:** Avoid mutating arrays (e.g., `sort()`). Use `toSorted()`, `toReversed()`, etc.
-   **Action:** Audit codebase for `.sort()` calls and replace with `.toSorted()` to prevent unexpected side effects in React state.

### 3.2. Stable Callbacks & Effects
-   **Rule:** Prevent unnecessary effect re-runs.
-   **Action:**
    -   Use `useEffectEvent` (experimental/polyfill) or `useCallback` ref pattern for event handlers inside `useEffect` that shouldn't trigger re-runs.
    -   **Hoist Static Logic:** Move RegExp creation and constant objects *outside* the component render scope or use `useMemo`.

### 3.3. Early Returns & Clean Code
-   **Rule:** Use early returns to reduce nesting and computation.
-   **Action:** Refactor complex `if/else` blocks in `InfoProviders` logic to fail fast.

### 3.4. Efficient Lookups
-   **Rule:** Use `Set` or `Map` for O(1) lookups instead of `Array.includes` (O(n)).
-   **Action:** Critical for `SeedInfo` providers where large lists of spells/perks are checked.

---

## 4. Execution Roadmap

### Phase 1: Foundation (No Logic Changes)
1.  Install **Tailwind CSS** and **Prettier Plugin for Tailwind**.
2.  Install **Zustand** and **TanStack Query** (ensure it's configured).
3.  Set up the `QueryClientProvider` at the root.

### Phase 2: Logic Extraction (The Hard Part)
1.  Pick one "easy" provider (e.g., `MaterialInfoProvider`).
2.  Refactor its logic to be a standalone function that accepts `randoms` and `config` and returns data.
3.  Create a `useMaterialInfo(seed)` hook using `useQuery`.
4.  Replace the usage in UI components with the new hook.
5.  *Repeat* for other providers.

### Phase 3: UI Migration
1.  Replace `react-bootstrap` `Container`, `Row`, `Col` with Tailwind Grid/Flex classes.
2.  Replace `Button`, `Modal`, `Tabs` with Radix UI primitives.

### Phase 4: Routing & Optimization
1.  Refactor `Body.tsx` tabs to be true nested routes (e.g., `/seed/:seed/info`, `/seed/:seed/search`).
2.  Implement `loaders` for these routes to ensure WASM is ready before showing the UI.

## 5. Summary of Benefits

| Feature | Old Architecture | New Architecture |
| :--- | :--- | :--- |
| **State** | Mutable Class + EventTarget | Immutable Hooks + React Query |
| **UI** | Bootstrap (Heavy, inflexible) | Tailwind + Headless (Light, composable) |
| **Data Flow** | Waterfall (Component -> Fetch) | Parallel / Prefetched (Route -> Load) |
| **Performance** | Risk of unnecessary renders | Fine-grained reactivity |
