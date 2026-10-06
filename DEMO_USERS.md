# Local hackathon demo profiles

These profiles contain **synthetic statistics** for demonstrations. They exist only in `codetrack_gemma_local` on localhost. Their profile skills identify them as synthetic. Platform usernames are placeholders; do not sync them against real platform services.

| Username | Problems solved | LeetCode rating | Codeforces rating | CodeChef rating |
| --- | ---: | ---: | ---: | ---: |
| Ari | 300 | 1510 | 1120 | 1380 |
| Sam | 1300 | 2030 | 1840 | 1930 |
| DemoBeginner | 140 | 1320 | 920 | 1180 |
| DemoRisingStar | 540 | 1680 | 1380 | 1560 |
| DemoDSAMentor | 1200 | 2070 | 1650 | 1760 |
| DemoContestAce | 1470 | 1920 | 2230 | 2160 |
| DemoCodeChefStar | 1250 | 1750 | 1530 | 2340 |
| DemoAlgorithmKing | 2600 | 2520 | 2610 | 2510 |

All eight were added as friends of the existing local `Gemma Local Test` account. Refresh Friends and select **My Friends** or **Circle Board**. For a quick Battle Arena comparison, enter **Ari** and **Sam**. You can also compare your own CodeTrack username against any demo profile.

To reseed from `CodeTrack/server`:

```powershell
node seed-demo-users.mjs "--friend-of=Gemma Local Test"
```

The script uses a fixed local database URI, does not load production environment settings, and preserves existing users and friendships. Rerunning updates the eight fixtures without duplicates. Add `--short-only` to seed only Ari and Sam. No login credentials are created for demo profiles.
