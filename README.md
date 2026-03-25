## Husky Manual Engine

Husky Manual Engine is an early-stage toy adaptation platform focused on turning hands-on adaptation knowledge into structured, accessible manuals.

The core idea is:
- collect toy metadata and adaptation details from contributors
- store that information in a reusable schema
- publish manuals in formats that are easier to search, translate, and adapt for accessibility

Right now the repository is a mix of:
- a lightweight React + TypeScript app scaffold
- shared TypeScript data models for toy metadata, pictures, and instruction steps
- Supabase client wiring
- product and UI prototypes exploring the contributor flow, manual output, and schematic tooling

## Current State

The live app code is still minimal. The most important source-of-truth files at the moment are:
- `src/types.ts` for the shared data model
- `src/constants/languages.ts` for supported language codes
- `src/utils/supabaseClient.ts` for database connection setup
- `prototyping/` for UI and schema exploration

The app does not yet implement the full end-to-end workflow. The prototypes currently carry most of the product thinking.

## Tech Stack

- Frontend: React 19 + TypeScript + Vite
- Database and storage: Supabase
- Data model direction: localized JSON fields plus relational records for toys, pictures, and instruction steps

## Project Structure

- `src/`: app entry point, shared types, constants, and Supabase setup
- `prototyping/`: HTML and SQL prototypes for manual rendering, ingestion flows, and schema design
- `src/assets/`: static images used by the frontend

## Getting Started

1. Install dependencies with `npm install`
2. Add environment variables in `.env` or `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Start the dev server with `npm run dev`

## Accessibility Direction

The project is aimed at reducing accessibility silos in toy adaptation documentation. The long-term goals include:
- accessible manual output instead of only static documents
- structured alt text and captions for images
- multilingual content support
- reusable manual data that can be reformatted for different needs later

## Suggested Next 3 Steps

1. Build a real contributor form in React that maps directly to `ToyMetadata` from `src/types.ts`.
2. Save one complete toy record to Supabase, including at least one picture and one instruction step.
3. Render that saved record back into a simple manual preview so the project has one full end-to-end slice.

