# CodeTrack

**Your coding progress, connected.**

CodeTrack brings coding profiles, learning goals and AI guidance into one dashboard. This repository contains the hackathon edition originally developed as CodeVerse, with Gemma 4 powering its coding assistant and personalized recommendations.

## Key Features

| Feature | What it offers |
| --- | --- |
| Unified dashboard | Track solved problems, ratings, contest participation and available rating history across LeetCode, Codeforces and CodeChef. |
| CodeT assistant | Get an approach first, or request code directly. Follow-up requests use the conversation context, and replies stream as they arrive. |
| Personalized recommendations | Receive up to five suggested milestones with practice targets and contest review steps based on connected profile statistics. |
| Goals and achievements | Set learning goals, follow progress and view achievements. |
| Battle Arena | Compare users and their coding performance side by side. |
| Friends and leaderboards | Find users, manage friend requests and compare overall or friends-only rankings. |
| Problems and contests | Explore platform practice links and upcoming contest information. |
| Study Hub | Browse DSA sheets, courses and learning roadmaps. |
| Accounts and profiles | Sign in with Google or email/password, edit your profile and connect coding handles. |

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Design and charts | Tailwind CSS, shadcn/ui, Framer Motion, Recharts |
| Navigation and data | React Router, TanStack Query, Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | Google OAuth, JWT, bcrypt |
| AI | Gemma 4 |
| Testing | Vitest, React Testing Library, Node.js test runner |

## Application Flow

1. **Sign in** and create your CodeTrack profile.
2. **Connect coding handles** from LeetCode, Codeforces and CodeChef.
3. **Sync your statistics** to see progress in one dashboard.
4. **Choose your next step** through personalized recommendations and goals.
5. **Practice with CodeT**—understand an approach, ask for implementation, or discuss your code.
6. **Learn and compare** using Study Hub, Friends, Battle Arena and leaderboards.

## How Gemma 4 Helps

**CodeT** supports algorithms, debugging and programming questions. It is configured to explain the approach first unless code is explicitly requested, then return code without extra prose. Short follow-ups reuse the current conversation, with sensible defaults when details are omitted.

**Recommendations** combine saved coding statistics, contest experience and recent rating history to suggest practical next steps. Topic focus areas are suggestions, not measured weaknesses. Saved results load quickly while updates run in the background.

Chat conversations are saved separately for each account in the same browser and remain available after reload or logout. Clearing browser storage removes this history. AI response time depends on provider availability, with bounded retries for temporary failures.

## Demo Experience

Local demo profiles, including **Ari** and **Sam**, provide synthetic statistics for showcasing friends, rankings and Battle Arena comparisons. They are demonstration data rather than real coding achievements.

---

Built to help programmers practice consistently, understand their progress and choose what to learn next. This edition is maintained for local development and hackathon demonstrations.
