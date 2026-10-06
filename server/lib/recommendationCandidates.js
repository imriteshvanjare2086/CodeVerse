// Existing Goals milestone calculations moved here; Gemma supplies selection and reasoning.
function priorityFromGap(current, target) {
    const ratio = target > 0 ? current / target : 1;
    if (ratio < 0.5)
        return "High";
    if (ratio < 0.8)
        return "Medium";
    return "Low";
}
function getNextProblemMilestone(solved) {
    if (solved < 50)
        return 50;
    if (solved < 100)
        return 100;
    if (solved < 250)
        return 250;
    if (solved < 500)
        return 500;
    if (solved < 1000)
        return 1000;
    if (solved < 1500)
        return 1500;
    if (solved < 2000)
        return 2000;
    return Math.ceil((solved + 1) / 500) * 500;
}
function getNextContestMilestone(contests) {
    if (contests < 5)
        return 5;
    if (contests < 10)
        return 10;
    if (contests < 20)
        return 20;
    if (contests < 50)
        return 50;
    if (contests < 100)
        return 100;
    return Math.ceil((contests + 1) / 50) * 50;
}
function getNextCodeforcesRatingTarget(rating) {
    if (rating < 1200) {
        return { target: 1200, rank: "Pupil", actions: ["Practice 800-1100 rated greedy and implementation problems. Focus on speed and accuracy."] };
    }
    if (rating < 1400) {
        return { target: 1400, rank: "Specialist", actions: ["Practice 1100-1300 rated constructive algorithms, math, and complete searches."] };
    }
    if (rating < 1600) {
        return { target: 1600, rank: "Expert", actions: ["Practice 1300-1500 rated dynamic programming, binary search, and basic graph/tree algorithms."] };
    }
    if (rating < 1900) {
        return { target: 1900, rank: "Candidate Master", actions: ["Practice 1500-1800 rated segment trees, combinatorics, DFS/BFS tree queries."] };
    }
    if (rating < 2100) {
        return { target: 2100, rank: "Master", actions: ["Upsolve Div1 A/B problems. Focus on advanced dynamic programming and complex game theory/probability."] };
    }
    if (rating < 2300) {
        return { target: 2300, rank: "International Master", actions: ["Focus on Div1 C/D upsolves, centroid decomposition, and advanced math."] };
    }
    if (rating < 2400) {
        return { target: 2400, rank: "Grandmaster", actions: ["Train speed on Div1 C/D. Master flow networks, heavy-light decomposition, and FFT."] };
    }
    if (rating < 2600) {
        return { target: 2600, rank: "International Grandmaster", actions: ["Solve harder training camp sets, complex geometry, and top-tier math logic."] };
    }
    return { target: 3000, rank: "Legendary Grandmaster", actions: ["Focus on maximum speed on Div1 E/F problems. Compete at the highest competitive programming tier."] };
}
function getNextLeetCodeRatingTarget(rating) {
    if (rating < 1500) {
        return { target: 1500, rank: "Average Coder", actions: ["Solve LeetCode Easy/Medium questions. Master standard patterns like Two Pointers and sliding window."] };
    }
    if (rating < 1600) {
        return { target: 1600, rank: "Intermediate Coder", actions: ["Focus on Medium questions involving binary search, BFS/DFS, and basic back-tracking."] };
    }
    if (rating < 1850) {
        return { target: 1850, rank: "Knight", actions: ["Aim for the top 5% of users. Focus on standard dynamic programming, heaps, and graph traversals."] };
    }
    if (rating < 2190) {
        return { target: 2190, rank: "Guardian", actions: ["Aim for the top 1% of users. Solve contest Q3/Q4, focus on advanced DP, tries, and segment trees."] };
    }
    if (rating < 2500) {
        return { target: 2500, rank: "Top Guardian", actions: ["Practice hard contest questions. Focus on advanced graphs, shortest paths, and complex DP states."] };
    }
    return { target: Math.ceil((rating + 100) / 100) * 100, rank: "Elite Coder", actions: ["Upsolve hard problem sets. Focus on high-level speed and custom data structure implementations."] };
}
function getNextCodeChefRatingTarget(rating) {
    if (rating < 1400) {
        return { target: 1400, rank: "2 Star", actions: ["Solve basic arrays, sorting, implementation, and prefix sum problems."] };
    }
    if (rating < 1600) {
        return { target: 1600, rank: "3 Star", actions: ["Practice intermediate greedy algorithms, binary search, and basic recursion."] };
    }
    if (rating < 1800) {
        return { target: 1800, rank: "4 Star", actions: ["Focus on dynamic programming, BFS/DFS, and standard tree algorithms."] };
    }
    if (rating < 2000) {
        return { target: 2000, rank: "5 Star", actions: ["Upsolve contest problems, focus on number theory, advanced graph algorithms, and combinatorics."] };
    }
    if (rating < 2200) {
        return { target: 2200, rank: "6 Star", actions: ["Focus on Div1/Div2 hard problems. Master segment trees, LCA, and string matching."] };
    }
    return { target: 2500, rank: "7 Star", actions: ["Upsolve 7-star tier challenges. Focus on heavy implementations and advanced system/math queries."] };
}
export function recommendationCandidates(data) {
    if (!data)
        return [];
    const recs = [];
    const connectedPlatforms = [
        data.leetcodeStats.username,
        data.codeforcesStats.username,
        data.codechefStats.username,
    ].filter(Boolean).length;
    if (connectedPlatforms === 0) {
        return [
            {
                id: "connect-platforms",
                platform: "Overall",
                metric: "Rank",
                title: "Connect your coding profiles",
                description: "Add LeetCode, Codeforces, and CodeChef usernames so recommendations can use your real ratings, ranks, contests, and solved counts.",
                current: "0 connected",
                target: "3 connected",
                priority: "High",
                actions: ["Connect at least one platform from your profile page."],
                goalTitle: "Connect coding profiles",
                goalCategory: "Competitive Programming",
                targetNumber: "3",
            },
        ];
    }
    if (data.codeforcesStats.username) {
        const rating = data.codeforcesStats.currentRating || data.codeforcesStats.maxRating || 0;
        const solved = data.codeforcesStats.problemsSolved || 0;
        const contests = data.codeforcesStats.contestCount || 0;
        const rank = data.codeforcesStats.rank || "Unrated";
        const nextSolved = getNextProblemMilestone(solved);
        recs.push({
            id: "codeforces-problems",
            platform: "Codeforces",
            metric: "Problems",
            title: `Solve ${nextSolved} problems on Codeforces`,
            description: `You have solved ${solved} problems. Scale your problem solving depth to build speed and visual pattern recognition.`,
            current: `${solved}`,
            target: `${nextSolved}`,
            priority: priorityFromGap(solved, nextSolved),
            actions: ["Upsolve contest problems immediately and tag unsolved ones by category."],
            goalTitle: `Solve ${nextSolved} Codeforces problems`,
            goalCategory: "Codeforces",
            targetNumber: String(nextSolved - solved),
            gap: (nextSolved - solved) / nextSolved,
            weakArea: "Low problem-solving volume on Codeforces limits logic familiarity.",
        });
        const nextRatingObj = getNextCodeforcesRatingTarget(rating);
        let ratingWeakArea = "Struggling with advanced algorithms (queries, segment trees) and system-level math.";
        if (nextRatingObj.target <= 1200) {
            ratingWeakArea = "Struggling with basic implementation speed, greedy constructs, or brute force logic.";
        }
        else if (nextRatingObj.target <= 1400) {
            ratingWeakArea = "Struggling with constructive algorithms and simple math logic.";
        }
        else if (nextRatingObj.target <= 1600) {
            ratingWeakArea = "Struggling with dynamic programming, binary search, and basic trees.";
        }
        recs.push({
            id: "codeforces-rating",
            platform: "Codeforces",
            metric: "Rating",
            title: `Push Codeforces rating to ${nextRatingObj.target} (${nextRatingObj.rank})`,
            description: `Your rating is ${rating} (${rank}). Aiming for ${nextRatingObj.target} will establish your next rating rank.`,
            current: `${rating}`,
            target: `${nextRatingObj.target} (${nextRatingObj.rank})`,
            priority: priorityFromGap(rating, nextRatingObj.target),
            actions: nextRatingObj.actions,
            goalTitle: `Reach ${nextRatingObj.target} Codeforces rating`,
            goalCategory: "Codeforces",
            targetNumber: String(nextRatingObj.target - rating),
            gap: (nextRatingObj.target - rating) / nextRatingObj.target,
            weakArea: ratingWeakArea,
        });
        const nextContests = getNextContestMilestone(contests);
        recs.push({
            id: "codeforces-contests",
            platform: "Codeforces",
            metric: "Contests",
            title: `Participate in ${nextContests} Codeforces contests`,
            description: `You have competed in ${contests} contests. Participate in active contest setups for real rating calibration.`,
            current: `${contests}`,
            target: `${nextContests}`,
            priority: priorityFromGap(contests, nextContests),
            actions: ["Enter upcoming rounds, review editorial, and upsolve at least one problem you couldn't solve."],
            goalTitle: `Complete ${nextContests} Codeforces contests`,
            goalCategory: "Codeforces",
            targetNumber: String(nextContests - contests),
            gap: (nextContests - contests) / nextContests,
            weakArea: "Inconsistent contest participation; lacks simulated contest pressure practice.",
        });
    }
    if (data.codechefStats.username) {
        const rating = data.codechefStats.currentRating || 0;
        const contests = data.codechefStats.contestCount || 0;
        const solved = data.codechefStats.problemsSolved || 0;
        const stars = data.codechefStats.stars || "1★";
        const nextSolved = getNextProblemMilestone(solved);
        recs.push({
            id: "codechef-problems",
            platform: "CodeChef",
            metric: "Problems",
            title: `Solve ${nextSolved} problems on CodeChef`,
            description: `You have solved ${solved} problems. Solve more problems to cover a wider layout of competitive scenarios.`,
            current: `${solved}`,
            target: `${nextSolved}`,
            priority: priorityFromGap(solved, nextSolved),
            actions: ["Solve starter and practice problems on CodeChef logic topics."],
            goalTitle: `Solve ${nextSolved} CodeChef problems`,
            goalCategory: "CodeChef",
            targetNumber: String(nextSolved - solved),
            gap: (nextSolved - solved) / nextSolved,
            weakArea: "Low code depth on CodeChef platform.",
        });
        const nextRatingObj = getNextCodeChefRatingTarget(rating);
        recs.push({
            id: "codechef-rating",
            platform: "CodeChef",
            metric: "Rating",
            title: `Aim for CodeChef ${nextRatingObj.target} (${nextRatingObj.rank})`,
            description: `Your rating is ${rating} (${stars}). Focus on timed solvers to step up to ${nextRatingObj.target}.`,
            current: `${rating}`,
            target: `${nextRatingObj.target} (${nextRatingObj.rank})`,
            priority: priorityFromGap(rating, nextRatingObj.target),
            actions: nextRatingObj.actions,
            goalTitle: `Reach CodeChef ${nextRatingObj.target} rating`,
            goalCategory: "CodeChef",
            targetNumber: String(nextRatingObj.target - rating),
            gap: (nextRatingObj.target - rating) / nextRatingObj.target,
            weakArea: nextRatingObj.target <= 1600
                ? "Difficulty with basic implementation, strings, and introductory prefix sums."
                : "Difficulty with advanced dynamic programming and graph structures under contest conditions.",
        });
        const nextContests = getNextContestMilestone(contests);
        recs.push({
            id: "codechef-contests",
            platform: "CodeChef",
            metric: "Contests",
            title: `Participate in ${nextContests} CodeChef contests`,
            description: `You have completed ${contests} contests. Participate regularly to stabilize your rating.`,
            current: `${contests}`,
            target: `${nextContests}`,
            priority: priorityFromGap(contests, nextContests),
            actions: ["Participate in upcoming Starters rounds and practice the post-contest problems."],
            goalTitle: `Complete ${nextContests} CodeChef contests`,
            goalCategory: "CodeChef",
            targetNumber: String(nextContests - contests),
            gap: (nextContests - contests) / nextContests,
            weakArea: "Lacks consistent contest attendance to benchmark performance.",
        });
    }
    if (data.leetcodeStats.username) {
        const solved = data.leetcodeStats.problemsSolved || 0;
        const rating = data.leetcodeStats.contestRating || 0;
        const contests = data.leetcodeStats.contestCount || 0;
        const nextSolved = getNextProblemMilestone(solved);
        recs.push({
            id: "leetcode-problems",
            platform: "LeetCode",
            metric: "Problems",
            title: `Solve ${nextSolved} problems on LeetCode`,
            description: `You have solved ${solved} problems. Solve more Easy/Medium interview classics to master key patterns.`,
            current: `${solved}`,
            target: `${nextSolved}`,
            priority: priorityFromGap(solved, nextSolved),
            actions: ["Solve a balanced mix across Arrays, Trees, DP, and Graphs on LeetCode."],
            goalTitle: `Solve ${nextSolved} LeetCode problems`,
            goalCategory: "LeetCode",
            targetNumber: String(nextSolved - solved),
            gap: (nextSolved - solved) / nextSolved,
            weakArea: "Limited coverage of core interview topics (arrays, trees, stack, DP).",
        });
        const nextRatingObj = getNextLeetCodeRatingTarget(rating);
        let leetcodeWeakArea = "Struggling to crack hard contest Q4 questions (advanced graphs, tries, and segment trees).";
        if (nextRatingObj.target <= 1600) {
            leetcodeWeakArea = "Inability to solve contest Easy/Medium Q1/Q2 fast and cleanly.";
        }
        else if (nextRatingObj.target <= 1850) {
            leetcodeWeakArea = "Difficulty solving intermediate Medium contest Q2/Q3 (binary search, sliding window, basic DP).";
        }
        recs.push({
            id: "leetcode-rating",
            platform: "LeetCode",
            metric: "Rating",
            title: `Improve LeetCode rating to ${nextRatingObj.target} (${nextRatingObj.rank})`,
            description: `Your contest rating is ${rating}. Focus on speed to step up to ${nextRatingObj.target}.`,
            current: `${rating}`,
            target: `${nextRatingObj.target} (${nextRatingObj.rank})`,
            priority: priorityFromGap(rating, nextRatingObj.target),
            actions: nextRatingObj.actions,
            goalTitle: `Reach ${nextRatingObj.target} LeetCode rating`,
            goalCategory: "LeetCode",
            targetNumber: String(nextRatingObj.target - rating),
            gap: (nextRatingObj.target - rating) / nextRatingObj.target,
            weakArea: leetcodeWeakArea,
        });
        const nextContests = getNextContestMilestone(contests);
        recs.push({
            id: "leetcode-contests",
            platform: "LeetCode",
            metric: "Contests",
            title: `Participate in ${nextContests} LeetCode contests`,
            description: `You have participated in ${contests} contests. Timed contest sets build excellent interview pressure capacity.`,
            current: `${contests}`,
            target: `${nextContests}`,
            priority: priorityFromGap(contests, nextContests),
            actions: ["Attempt the Weekly and Biweekly contests. Focus on solving at least 3 problems within the time limit."],
            goalTitle: `Complete ${nextContests} LeetCode contests`,
            goalCategory: "LeetCode",
            targetNumber: String(nextContests - contests),
            gap: (nextContests - contests) / nextContests,
            weakArea: "Insufficient experience with timed interview coding formats.",
        });
    }
    return recs
        .sort((a, b) => b.gap - a.gap)
        .map(({ gap, description, actions, weakArea, priority, ...candidate }) => candidate);
}
