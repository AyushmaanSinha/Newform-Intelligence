# NewForm Intelligence - Article Recommendation System

A highly premium, editorial-style React/Next.js (Vite) application that curates and scores daily news dispatches based on personalized thematic vectors (Macroeconomics, AI Frontiers, Geopolitics, etc.).

## Features
- **Vector Preference Alignment**: 20 adjustable weights allowing fine-tuned cognitive interest distribution.
- **Dynamic Scoring Engine**: Ranks articles client-side using a cross-multiplied vector weighting algorithm.
- **Modern Glassmorphic UI**: Powered by Tailwind CSS with complete Light & Dark mode support.
- **Theme Palette Selection**: Choose from 6 custom color swatches (Organic Forest, Midnight Noir, Aurora Indigo, Desert Amber, Rose Quartz, Ocean Slate).
- **Session Telemetry**: Tracks reading statistics, average WPM, and historical read logs.
- **API Pipelines**: Configurable data gateways utilizing GNews or NewsAPI.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Architecture & Codebase structure
- `src/App.jsx`: Global state (telemetry, preferences, themes) and view router.
- `src/views/*`: Core functional screens (`HomeFeed`, `LoginScreen`, `OnboardingScreen`, `ProfileDashboard`, `SearchDiscover`).
- `src/components/*`: Reusable UI modules (`Header`, `Preloader`).
- `src/api.js`: Abstraction layer for fetching external news APIs and scoring algorithms.
- `src/index.css`: Global Tailwind configurations, CSS custom properties, and theme definitions.

## Styling System
This app utilizes a pure CSS-variable driven theme system overlayed on Tailwind. All color classes (e.g. `bg-[var(--bg-color)]`) point directly to dynamic CSS variables which rotate gracefully via the palette selector.
