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
