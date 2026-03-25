## Project Overview

This software implements an **Extract-Transform-Load (ETL)** framework:
- **Extract:** An intuitive contributor interface for crowd-sourced toy modifications.
- **Transform:** A universal schema that validates data and ensures high accessibility standards (Alt-text, Braille-readiness).
- **Load:** A headless content design that serves manuals as HTML, adjustable-size text, or downloadable formats.

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend/Logic:** C++ (Data Processing & Schema Validation)
- **Database & Storage:** Supabase (PostgreSQL & S3-compatible buckets for photos)
- **API:** RESTful architecture for resource discoverability

## Project Structure

- `/src`: React components and TypeScript interfaces.
- `/cpp`: Core C++ logic for high-performance data transformation.
- `/supabase`: Database migrations and schema definitions.

## Getting Started

1. **Clone the repo**
2. **Install dependencies:** `npm install`
3. **Configure Environment:** Create a `.env.local` with your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
4. **Run Dev Server:** `npm run dev`

## Accessibility Goals

Our mission is to ensure that no "accessibility silo" prevents a child from playing. We prioritize:
- Automatic Alt-text enforcement.
- Low-bandwidth data transfer for rural access.
- Native support for screen readers and Braille translation.


