## Husky Manual Engine

Husky Manual Engine is an early-stage platform for turning toy adaptation knowledge into structured, accessible manuals.

The project started from a pretty simple frustration: a lot of adaptation knowledge lives in Word docs and PDFs, which makes it hard to search, update, translate, or reuse. The goal here is to move that knowledge into a format that is easier to contribute to and easier to publish in multiple accessible outputs later.

In practical terms, the project is trying to do three things:
- capture toy and manual data through a contributor-friendly workflow
- store that information in a schema that can support accessibility and localization
- use that structured data as the source for future manual views, cards, exports, and other formats

## Where The Project Is Right Now

This repository is still early. The React app is mostly a scaffold, while the strongest product thinking currently lives in the shared types, Supabase setup, and the prototype files.

The most important files right now are:
- `src/types.ts` for the current shared data model
- `src/constants/languages.ts` for supported language codes
- `src/utils/supabaseClient.ts` for the Supabase client
- `prototyping/` for the current UI and schema experiments
- `supabase/migrations/` for the checked-in schema and migration direction

At the moment, the app does not yet implement the full end-to-end workflow in React. The prototypes are doing a lot of the heavy lifting while the architecture and data model are being clarified.

## Data Model Direction

The current model is built around a few ideas:
- localized text fields are stored as language-keyed objects
- toys, pictures, and instruction steps are separate records
- pictures can be reused across steps through a join table instead of being locked to a single step

That means the project is moving toward:
- `ToyMetadata` for core toy information
- `PictureMetadata` for reusable media records
- `InstructionStep` for ordered manual steps
- a step-picture relationship layer so one step can have many pictures and one picture can appear in more than one step

The current SQL direction on `main` lives in:
- `supabase/migrations/20260325_000001_initial_schema.sql`

That file currently models:
- `toy_metadata`
- `pictures`
- `instruction_steps`
- `instruction_step_pictures`

## Tech Stack

- Frontend: React 19, TypeScript, Vite
- Database and storage: Supabase
- Prototyping: static HTML prototypes for contributor flows and manual output concepts

## Project Structure

- `src/`: app entry point, shared types, constants, assets, and Supabase setup
- `prototyping/`: HTML prototypes for manual entry and preview exploration
- `supabase/migrations/`: migration files for the evolving database design

## Getting Started

1. Install dependencies with `npm install`
2. Add the environment variables your frontend needs:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Start the app with `npm run dev`

## Accessibility Direction

The long-term point of this project is not just to digitize manuals. It is to reduce the accessibility silo created by static document workflows.

That includes:
- building manual content that can be rendered in more than one format
- keeping alt text and captions as first-class fields instead of afterthoughts
- supporting multilingual content from the data model upward
- making future low-bandwidth, screen-reader-friendly, or other accessibility-focused outputs possible

## Suggested Next 3 Steps

1. Build the first real React form that maps directly to the shared TypeScript types.
2. Connect one complete toy record to Supabase, including step records and picture relationships.
3. Render that saved data back into a simple manual preview so the project has one working end-to-end slice.
