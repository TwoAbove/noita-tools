# Upgrade and Refresh Plan

## Current State Analysis
The codebase is a mature React application (`v34.2.0`) with a mix of patterns accumulated over time.
- **Styling**: Uses `react-bootstrap` and extensive inline styles (`style={{ ... }}`). This leads to inconsistent UI and performance overhead.
- **TypeScript**: While present, usage is loose. Implicit `any` is common, and `eslint-disable` is used to bypass checks.
- **State Management**: heavily relies on prop drilling (e.g., passing `infoProvider` deep into the tree).
- **Architecture**: Feature-based folder structure exists (`src/components/SeedInfo`, `src/components/SearchSeeds`), which is good, but component internals often mix logic and view concerns.

## Proposed Best Practices ("v0 Style")
To modernize the application and align with current React ecosystem standards (often championed by Vercel/v0), we propose the following changes:

### 1. Styling: Tailwind CSS
- **Why**: Utility-first CSS provides consistency, smaller bundle sizes (via purging), and faster development.
- **Action**:
    - Install Tailwind CSS.
    - Replace `react-bootstrap` components with standard HTML elements styled with Tailwind or headless UI primitives (like Radix UI / shadcn/ui).
    - Remove inline styles.

### 2. TypeScript: Strict Mode
- **Why**: Catch errors at compile time, improve developer experience (autocompletion).
- **Action**:
    - Enable `strict: true` in `tsconfig.json`.
    - Define explicit interfaces for all component props.
    - Remove `any` types.
    - Remove `eslint-disable` directives and fix the underlying issues.

### 3. Component Architecture
- **Why**: improve maintainability and testability.
- **Action**:
    - **Functional Components**: Ensure all components are functional (already mostly the case).
    - **Composition**: Use React Context or Composition (children prop) to avoid prop drilling.
    - **Separation of Concerns**: Move logic into custom hooks (`useSeedInfo`, `useConfiguration`).

### 4. Performance
- **Why**: Ensure smooth user experience, especially with heavy data processing.
- **Action**:
    - Continue using `React.lazy` for route-level code splitting.
    - Memoize expensive calculations with `useMemo`.

## Migration Roadmap

### Phase 1: Foundation (Immediate)
- [ ] Install and configure Tailwind CSS.
- [ ] Establish strict TypeScript guidelines.
- [ ] Refactor a core component (`SeedInfo.tsx`) as a Proof of Concept (POC).

### Phase 2: Core Components (Short-term)
- [ ] Migrate `App.tsx` layout to Tailwind.
- [ ] Refactor `Header`, `Footer`, and `Settings` components.
- [ ] Set up a shared UI library (e.g., `src/components/ui`) for reusable atoms (Buttons, Inputs).

### Phase 3: Global Cleanup (Long-term)
- [ ] Remove `react-bootstrap` dependency.
- [ ] Full pass on `strict` TypeScript errors.
- [ ] Implement unit tests for all refactored components.
