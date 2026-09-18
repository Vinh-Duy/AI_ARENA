# Việt's Vibe

Việt's Vibe is a fashion editorial experience for discovering, remixing, and styling Vietnamese traditional clothing.

## Run locally

```bash
cd viets-vibe
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Stack

- Next.js App Router and TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide React
- Google Gemini via `@google/genai`

## Gemini setup

Copy `.env.example` to `.env.local` and add a Gemini API key:

```bash
cp .env.example .env.local
```

The key is used only by the server route at `/api/style`.

## Routes

- `/` — editorial homepage and Việt phục gallery
- `/mix-match` — upload a clothing item or choose an occasion for styling advice
- `POST /api/style` — returns a structured Vietnamese styling suggestion
