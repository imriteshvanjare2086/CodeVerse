# Gemma 4 integration — local development

## Architecture inspected

- Frontend: React 18, TypeScript, Vite, Tailwind/shadcn, React Query; npm lockfiles are present (older Bun lockfiles also exist).
- Running backend: Express 5 in `server/index.js`, Mongoose, JWT/bcrypt and Google OAuth. The active user model is `server/models/User.js`.
- `server/src/routes/api.js` and its separate models are legacy/unmounted in the current server entry point. They were not rewired.
- Platform synchronization for LeetCode, Codeforces and CodeChef lives in `server/index.js`. Dashboard data is composed by `src/hooks/useDashboard.ts` from the profile API. Friends, rankings, achievements, Battle Arena, Study Hub, Problems and routes remain intact.
- Previous chatbot: `src/pages/CodeT.tsx` called the Gradio Space `aaryanpethkar48/student-coding-assistant` directly. Its actual underlying model is not specified by this repository.
- Previous recommendations: deterministic frontend rules in `useDashboard.ts` and `Goals.tsx`, not an AI model. There were no active chatbot/recommendation backend endpoints to preserve.

## Integration

`CodeT.tsx → POST /api/ai/chat → server/lib/gemma.js → Google Gemini API → existing chat UI`

`Goals.tsx / SmartRecommendations.tsx → useRecommendations → POST /api/ai/recommendations → persisted profile + existing goal milestone candidates → Gemma 4 → validated existing card shape`

Provider: **Google Gemini API**. Model: **`gemma-4-26b-a4b-it`**. The service also permits the documented `gemma-4-31b-it`; all other identifiers are rejected. No alternate model or static recommendation fallback exists.

Official documentation: https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api

Both paths use the documented REST interface with a server-only `x-goog-api-key` header. The old Gradio call is removed. The unused dependency remains to avoid unrelated lockfile changes.

The chatbot UI now requests `stream: true` on the same authenticated endpoint. Its backend calls Google's `streamGenerateContent?alt=sse` and relays text chunks into the existing chat bubble. The legacy non-streaming JSON response remains supported for API callers; recommendations continue using structured non-streaming inference. Both use the same configured Gemma 4 model. Chat replies are concise by default, and local history is saved after streaming finishes. Closing the chat cancels its request, and interrupted replies retain their received text plus an explicit error.

Latency check: the original non-streaming coding/code example took **20.45 seconds** before any text was available. A shorter streamed explanation began after **1.76 seconds**, completed after **3.04 seconds**, and arrived in four chunks. These are different prompts, so they are observational samples rather than a controlled speedup ratio. Provider latency still varies. During checks the provider also returned temporary errors and interrupted a code sample with `RECITATION`; partial or interrupted replies are not reported as successfully complete. `node verify-chat-speed.mjs --stream` measures real first-text and completion times locally.

The streaming change passed TypeScript, local build and six backend checks, including fragmented SSE/UTF-8 decoding. Both ordinary chat and recommendations passed real API regression checks afterward. Browser sends and error rendering were verified; the final browser attempts received upstream HTTP 500 errors, so successful end-to-end browser streaming remains unverified in this run. A stale active-session ID could also prevent sends after hot reload; the send handler now creates a new session if its referenced session is missing.

Gemma chooses and orders milestones and supplies reasoning/actions/priority and optional suggested focus areas in the existing Weak Area field. Existing calculations retain goal IDs, factual current values, targets and add-to-goal values. Model-supplied IDs must match candidates; unknown/duplicate IDs and malformed output are rejected. Passwords, email, JWTs and friends are excluded from prompts. Only connected platforms' persisted stats and recent rating history are supplied; topic weaknesses are not stored and must not be asserted as facts. Model prose remains probabilistic and should be reviewed. Thinking is set to the documented `minimal` level so the output token budget is available for replies.

## Local setup

Existing `.env` files and deployment configuration were left untouched. Git-ignored local overrides were created:

- `.env.local`: `VITE_API_URL=http://localhost:4100/api`
- `server/.env.local`: local port 4100, isolated `mongodb://127.0.0.1:27017/codetrack_gemma_local`, local-only JWT secret, `GEMMA_MODEL=gemma-4-26b-a4b-it`, and the configured server-only `GEMMA_API_KEY` (ignored by Git).

Put a Google AI Studio key with Gemma API access into **`server/.env.local`**. Never put it in a `VITE_` variable or commit it. Restart the backend after changing this file. Environment variables already set in the launching process take precedence; ensure they point to this local setup.

From `CodeTrack/server`:

```powershell
npm run dev
```

From `CodeTrack`:

```powershell
npm run dev -- --port 5180
```

Open http://localhost:5180. No deployment step is needed or authorized.

## Verification performed

- Local frontend build passed (`npm run build`); this only produces local files.
- TypeScript passed (`npx tsc --noEmit -p tsconfig.app.json`).
- Existing Vitest test passed (`npm test`).
- Four backend checks passed (`node --test lib/gemma.test.js`): configuration restrictions, input validation, private-field exclusion, and factual milestone preservation. No AI responses were mocked.
- Backend started locally and connected to `codetrack_gemma_local`.
- `node verify-local.mjs` passed local registration/login/profile and authentication rejection on both AI endpoints. It creates/reuses one clearly named local test account.
- Browser login, dashboard, Problems/platform links, Battle Arena and Study Hub loaded. Successful live browser verification also passed: Goals rendered personalized cards using the local profile's 1,245 solved problems, 32 contests, platform ratings and recent rating history; CodeT rendered a Gemma explanation of binary search and a profile-based practice suggestion. Missing-key failure states were also tested earlier without crashes.
- After configuring the key and reloading the local backend, `node verify-local.mjs` passed **both independent real inference requests**: `/api/ai/chat` returned a nonempty reply and `/api/ai/recommendations` returned validated recommendations. Both reported `gemma-4-26b-a4b-it` through Google Gemini API. No provider responses were mocked. The UI displays the backend's specific error message on failure; recommendation panels include a retry button.
- Live platform synchronization with user accounts and exhaustive regression testing remain unverified. No fabricated platform data was inserted.

Existing warnings observed: React Router future flags, Google sign-in button width, nested buttons in chatbot history, ChatBubble animation refs, and Vite's chunk-size/stale Browserslist warnings. No new compilation errors were found. Timeout, network/provider errors, rate limits and malformed responses have explicit error paths; missing credentials were tested, but other live provider failure cases were not deliberately induced.

## Files changed

- Chatbot: `src/pages/CodeT.tsx` (backend call; existing static operational claim replaced with model name).
- Recommendations: `src/pages/Goals.tsx`, `src/hooks/useDashboard.ts`, `src/components/dashboard/SmartRecommendations.tsx`; shared request hook `src/hooks/useRecommendations.ts`.
- Backend: `server/index.js` mounts authenticated AI routes and loads local overrides; `server/lib/aiRoutes.js`, `server/lib/gemma.js`, `server/lib/recommendationCandidates.js` implement inference and retained milestone calculations.
- Setup/checks: `server/.env.example`, ignored local environment files, `server/lib/gemma.test.js`, `server/verify-local.mjs`, this report.

Gemma 4 integration tested locally. Production deployment was not modified. Production database, remote repositories and hosting settings were not modified. No push or deployment command was run.
