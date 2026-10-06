# CodeVerse — CodeTrack with Gemma 4

A coding progress dashboard and AI coding companion for tracking LeetCode, Codeforces and CodeChef in one place. This repository contains the separate hackathon development version of CodeTrack. The application UI retains the CodeTrack name.

## Features

| Area | Implemented capabilities |
| --- | --- |
| Authentication | Email/password registration and login, hashed passwords, JWT-protected routes, Google sign-in, profile onboarding |
| Coding profiles | Connect/disconnect platform handles; synchronize solved counts, contest ratings, ranks and available rating history |
| Dashboard | Combined statistics, platform cards, rating graphs, contributions, achievements and leaderboard previews |
| CodeT chatbot | Authenticated Gemma 4 requests, streamed replies, recent conversation context, local chat history and explicit provider error messages |
| AI recommendations | Up to five personalized milestones using connected platform statistics and recent rating history; weekly practice targets, contest participation and review/upsolving actions |
| Goals | Goal tracking, progress displays and recommendation cards with factual milestone targets |
| Battle Arena | Compare CodeTrack users and their platform performance side by side |
| Friends | User search, friend requests, acceptance/rejection/cancellation, friend lists and friends leaderboard |
| Rankings and profiles | Overall leaderboard, public profile views, editable profile and achievements |
| Problems and contests | Platform practice links and aggregated contest information |
| Study Hub | DSA sheets, courses and domain-based learning roadmaps |
| Demo profiles | Optional local synthetic users including short names **Ari** and **Sam** for comparisons |

CodeChef stars are derived from current rating boundaries, avoiding an incorrect one-star fallback when scraped badge markup is missing.

## Gemma 4 integration

Both AI features call Google's Gemini API from the Express backend using `gemma-4-26b-a4b-it`. The API key stays on the server. The configuration also allows `gemma-4-31b-it`.

- Chat replies stream from the provider through the backend into the existing chat bubble. Replies are concise by default, with longer explanations when requested.
- Recommendations retain server-calculated milestone values; Gemma selects and explains the next steps.
- Only selected coding statistics, skills and recent rating history form the profile context. Passwords, email addresses, tokens and friend lists are excluded.
- Topic-level mistakes and weakness measurements are not available. Suggested focus areas must be presented as suggestions rather than invented diagnoses.
- Successful recommendations are cached in backend memory for ten minutes, separately for each user and relevant profile/model input. Changed statistics produce a new request. Simultaneous identical requests share inference; failures are not cached. Restarting the backend clears this cache.
- The frontend also caches recommendations with React Query. Provider latency, quotas and availability still affect first generation.

## Technology

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query and Framer Motion.

**Backend:** Node.js, Express 5, MongoDB/Mongoose, JWT, bcrypt and Google OAuth token verification. Gemma uses REST inference with SSE streaming for chat.

## Local setup

Prerequisites: Node.js (Node 24 was used for verification), npm, a local MongoDB instance and a Google AI Studio API key with access to the configured Gemma model. Google login additionally needs a development OAuth Web application client.

```powershell
git clone https://github.com/imriteshvanjare2086/CodeVerse.git
cd CodeVerse
npm ci
cd server
npm ci
cd ..
Copy-Item .env.example .env.local
Copy-Item server/.env.example server/.env.local
```

Edit the copied files locally. Never commit credentials.

Frontend `.env.local`:

```dotenv
VITE_API_URL=http://localhost:4100/api
VITE_GOOGLE_CLIENT_ID=YOUR_DEVELOPMENT_GOOGLE_CLIENT_ID
```

Backend `server/.env.local`:

```dotenv
PORT=4100
MONGO_URI=mongodb://127.0.0.1:27017/codetrack_gemma_local
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_LOCAL_SECRET
GOOGLE_CLIENT_ID=YOUR_DEVELOPMENT_GOOGLE_CLIENT_ID
GEMMA_API_KEY=YOUR_GOOGLE_AI_STUDIO_KEY
GEMMA_MODEL=gemma-4-26b-a4b-it
```

The frontend and backend must use the same OAuth client ID. In that development client's **Authorized JavaScript origins**, add `http://localhost` and `http://localhost:5180`. See [Google login setup](GOOGLE_LOGIN_LOCAL.md).

Start MongoDB locally, then use two terminals:

```powershell
# Terminal 1, from repository root
cd server
npm run dev
```

```powershell
# Terminal 2, from repository root
npm run dev -- --port 5180
```

Open **http://localhost:5180**. The explicit port overrides the existing Vite default of 8080. Register or sign in, connect your coding profiles, then use CodeT and Goals. MongoDB data and local environment files are not included in this repository.

## Local demo users

After creating your own local account:

```powershell
cd server
node seed-demo-users.mjs "--friend-of=YOUR_CODETRACK_USERNAME"
```

Use `--short-only` to create only **Ari** and **Sam**. Demo users have synthetic statistics and no login credentials; their placeholder platform handles should not be synchronized against real services. The script is restricted to the local `codetrack_gemma_local` database. See [demo data details](DEMO_USERS.md).

## Checks and verification

```powershell
# Repository root
npm run build
npm test
npx tsc --noEmit -p tsconfig.app.json

# Backend
cd server
node --test lib/gemma.test.js lib/sse.test.js lib/recommendationCache.test.js lib/codechefStars.test.js
```

With both local servers running and a working API key:

```powershell
# From server/
node verify-local.mjs
node verify-chat-speed.mjs --stream
node verify-recommendations-speed.mjs
```

These live checks use real inference and may consume API quota. `verify-local.mjs` creates/reuses a local test account; run it before the speed scripts. Offline checks cover profile privacy, input validation, SSE chunk decoding, cache isolation/invalidation/failure handling and CodeChef rating boundaries.

Observed local samples: a short streamed chat began after 1.76 seconds; five recommendations took about 16 seconds initially and 18 ms from backend cache. These are individual measurements, not latency guarantees. Temporary provider failures were observed. See [integration and verification notes](GEMMA_LOCAL.md) for the detailed scope and limitations.

## Project structure

```text
src/
  pages/              Dashboard, CodeT, Goals, Friends, Battle Arena and other views
  components/         Shared UI and feature components
  hooks/              Authentication, dashboard and recommendation queries
  services/ai.ts      Chat streaming and AI error handling
server/
  index.js            Active Express application and platform integrations
  models/             MongoDB models
  middleware/         Authentication middleware
  lib/                Gemma integration, recommendation generation/cache and tests
  seed-demo-users.mjs  Local-only demo data
```

The `server/src/` directory contains legacy code; `server/index.js` is the active backend entry point.

## Important limitations

- Platform synchronization depends on external platform/community endpoints and HTML formats; upstream changes can affect availability or freshness.
- Recommendation quality depends on the stored profile data. The app does not measure topic-level weaknesses or promise rating gains.
- Chat history is stored in the browser. Recommendation cache is temporary backend memory.
- Existing legacy development endpoints and components remain in this development clone; review and harden the backend before any future public hosting.
- Automated checks do not constitute exhaustive verification of every feature or every external platform.

## Development scope

This repository is for **local development and hackathon work**. No deployment is required by this setup. Do not connect it to the existing production CodeTrack database, credentials or hosting projects. Existing hosting configuration files are retained from the source project; they were not used to deploy these changes.

Production deployment was not modified.
