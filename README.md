# Tennis Paddle Booking System

A modern web-based booking system for tennis paddle rentals, built with SvelteKit, TailwindCSS, and Supabase.

## Quick Start

### Prerequisites
- Node.js 22+
- npm
- Supabase account (free tier works)

### Installation

```bash
npm install
cp .env.example .env.local  # Configure with your Supabase credentials
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
├── src/
│   ├── lib/           # Reusable components, utilities, types
│   ├── routes/        # SvelteKit routes (pages, API endpoints)
│   └── app.html       # Main HTML template
├── SPECS.md           # Product specifications & feature breakdown
├── AGENTS.md          # Development workflow for Samantha
└── package.json       # Dependencies & scripts
```

## Development

- **`npm run dev`** — Start dev server
- **`npm run build`** — Build for production
- **`npm run preview`** — Preview production build
- **`npm run lint`** — Check code style
- **`npm run format`** — Auto-format code

## Architecture

- **Frontend:** SvelteKit + Svelte + TypeScript
- **Styling:** TailwindCSS + DaisyUI
- **Database:** Supabase (PostgreSQL)
- **Auth:** Auth.js + Supabase
- **Hosting:** Vercel (or Docker)

## Features (In Development)

See `SPECS.md` for detailed feature list and prioritization.

## Contributing

See `AGENTS.md` for the development workflow.

## License

MIT
