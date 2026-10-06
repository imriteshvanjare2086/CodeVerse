# CodeTrack

**Track your progress. Understand your next step. Practice with purpose.**

CodeTrack is a coding progress and learning companion for students and competitive programmers, bringing LeetCode, Codeforces and CodeChef together with personalized guidance powered by **Gemma 4**.

## The Problem & Our Idea

Coding activity is spread across multiple platforms. Learners can see their scores, but deciding what to practice next can still be difficult.

CodeTrack connects that progress to action: a unified dashboard shows where you stand, AI recommendations suggest practical goals, and CodeT helps you understand and implement solutions.

## Where Gemma 4 Makes a Difference

| Feature | How Gemma 4 helps |
| --- | --- |
| **CodeT Assistant** | Explains an approach before implementation, provides code when requested, and uses conversation context for follow-up questions. Replies stream as they are generated. |
| **Personalized Recommendations** | Uses connected profile statistics, contest experience and recent rating history to suggest up to five milestones with practice targets and review steps. |

Recommendations use recorded statistics; topic focus areas are suggestions, not claimed diagnoses of weaknesses. AI credentials remain on the backend.

## Key Features

- **One dashboard:** Compare solved counts, ratings and contest progress across three coding platforms.
- **Goals & achievements:** Turn practice plans into trackable milestones.
- **Friends & Battle Arena:** Compare profiles and explore overall and friends-only leaderboards.
- **Study Hub:** Find DSA sheets, courses, roadmaps and contest information.
- **Personal workspace:** Google or email sign-in, editable profiles and chat history saved per account in the same browser.

## Demo Journey

**Sign in → Connect coding profiles → Explore progress → Get Gemma 4 recommendations → Ask CodeT for an approach, then code → Compare with friends**

For demonstrations, **Ari** and **Sam** provide clearly synthetic coding statistics for Friends and Battle Arena comparisons.

## Tech Stack

**Frontend:** React · TypeScript · Vite · Tailwind CSS  
**Backend:** Node.js · Express · MongoDB  
**AI:** Gemma 4 · **Authentication:** Google OAuth & JWT

## What We Built

A working local application connecting progress tracking, AI guidance and peer comparison. Local checks cover real Gemma requests, chat persistence, recommendation caching and temporary-error recovery. Provider availability and platform data freshness can affect results.

**Our goal:** Help learners spend less time switching between dashboards and more time making deliberate progress.
