// Local hackathon fixtures only. Never loads copied production environment files.
import mongoose from 'mongoose';
import User from './models/User.js';
import assert from 'node:assert/strict';

const uri = 'mongodb://127.0.0.1:27017/codetrack_gemma_local';
const demoDomain = '@demo.codetrack.test';
const fixtures = [
  { username: 'Ari', solved: [180, 75, 45], ratings: [1510, 1120, 1380], contests: [8, 10, 9], streak: 14, cfRank: 'Newbie', ccStars: '1★', lcBadge: 'None', ranking: 115000 },
  { username: 'Sam', solved: [650, 420, 230], ratings: [2030, 1840, 1930], contests: [38, 52, 41], streak: 39, cfRank: 'Expert', ccStars: '4★', lcBadge: 'Knight', ranking: 11000 },
  { username: 'DemoBeginner', solved: [85, 30, 25], ratings: [1320, 920, 1180], contests: [3, 4, 5], streak: 6, cfRank: 'Newbie', ccStars: '1★', lcBadge: 'None', ranking: 280000 },
  { username: 'DemoRisingStar', solved: [280, 150, 110], ratings: [1680, 1380, 1560], contests: [14, 18, 16], streak: 24, cfRank: 'Pupil', ccStars: '2★', lcBadge: 'None', ranking: 65000 },
  { username: 'DemoDSAMentor', solved: [850, 190, 160], ratings: [2070, 1650, 1760], contests: [45, 25, 23], streak: 48, cfRank: 'Expert', ccStars: '3★', lcBadge: 'Knight', ranking: 8000 },
  { username: 'DemoContestAce', solved: [420, 670, 380], ratings: [1920, 2230, 2160], contests: [48, 82, 66], streak: 35, cfRank: 'Master', ccStars: '5★', lcBadge: 'Knight', ranking: 16000 },
  { username: 'DemoCodeChefStar', solved: [250, 180, 820], ratings: [1750, 1530, 2340], contests: [22, 30, 95], streak: 42, cfRank: 'Specialist', ccStars: '6★', lcBadge: 'None', ranking: 44000 },
  { username: 'DemoAlgorithmKing', solved: [1100, 950, 550], ratings: [2520, 2610, 2510], contests: [90, 125, 110], streak: 78, cfRank: 'International Grandmaster', ccStars: '7★', lcBadge: 'Guardian', ranking: 750 },
];

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  assert.equal(mongoose.connection.name, 'codetrack_gemma_local');
  const members = await User.find({ email: { $not: /@demo\.codetrack\.test$/ } }).select('username friends').lean();
  if (process.argv.includes('--list')) {
    console.log(JSON.stringify(members.map(u => ({ username: u.username, friends: u.friends?.length || 0 })), null, 2));
  } else {
    const friendName = process.argv.find(a => a.startsWith('--friend-of='))?.slice('--friend-of='.length);
    const owner = friendName ? members.find(u => u.username === friendName) : members.length === 1 ? members[0] : null;
    if (!owner) throw new Error('Choose an existing local account with --friend-of=USERNAME (use --list to see local account names).');
    const ids = [];
    const selectedFixtures = process.argv.includes('--short-only') ? fixtures.filter(f => ['Ari', 'Sam'].includes(f.username)) : fixtures;
    for (const fixture of selectedFixtures) {
      const [lc, cf, cc] = fixture.solved;
      const [lr, fr, cr] = fixture.ratings;
      const history = (rating, platform) => [-180, -120, -65, 0].map((offset, i) => ({ contest: `Demo ${platform} Contest ${i + 1}`, rating: Math.max(0, rating + offset) }));
      const email = fixture.username.toLowerCase() + demoDomain;
      const existing = await User.findOne({ username: fixture.username });
      if (existing && existing.email !== email) throw new Error(`Refusing to overwrite existing user ${fixture.username}.`);
      const user = await User.findOneAndUpdate({ email }, { $set: {
        username: fixture.username,
        skills: ['Demo profile — synthetic hackathon statistics', 'DSA'],
        streak: fixture.streak, problemsSolved: lc + cf + cc,
        platformStats: { leetcode: lc, codeforces: cf, codechef: cc },
        leetcodeUsername: fixture.username, codeforcesUsername: fixture.username, codechefUsername: fixture.username,
        leetcodeStats: { problemsSolved: lc, contestRating: lr, ranking: fixture.ranking, contestCount: fixture.contests[0], badge: fixture.lcBadge },
        codeforcesStats: { problemsSolved: cf, currentRating: fr, maxRating: fr + 40, rank: fixture.cfRank, contestCount: fixture.contests[1] },
        codechefStats: { problemsSolved: cc, currentRating: cr, stars: fixture.ccStars, contestCount: fixture.contests[2] },
        leetcodeRatingHistory: history(lr, 'LeetCode'), codeforcesRatingHistory: history(fr, 'Codeforces'), codechefRatingHistory: history(cr, 'CodeChef'),
      } }, { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true });
      ids.push(user._id);
      assert.equal(user.problemsSolved, user.platformStats.leetcode + user.platformStats.codeforces + user.platformStats.codechef);
      console.log(`${user.username}: ${user.problemsSolved} solved; ratings LC ${lr}, CF ${fr}, CC ${cr}`);
    }
    // Make the demo profiles immediately visible in the requested local Friends list.
    await User.updateOne({ _id: owner._id }, { $addToSet: { friends: { $each: ids } } });
    await User.updateMany({ _id: { $in: ids } }, { $addToSet: { friends: owner._id } });
    const refreshed = await User.findById(owner._id).lean();
    assert.ok(ids.every(id => refreshed.friends.some(friend => String(friend) === String(id))));
    console.log(`Added ${ids.length} demo friends to ${owner.username} in ${mongoose.connection.name}. Rerunning does not duplicate users or friendships.`);
  }
} finally {
  await mongoose.disconnect();
}
