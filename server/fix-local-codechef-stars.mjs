import mongoose from 'mongoose';
import assert from 'node:assert/strict';
import User from './models/User.js';
import { codechefStars } from './lib/codechefStars.js';

// Deliberately fixed to the isolated local database; never load production env.
await mongoose.connect('mongodb://127.0.0.1:27017/codetrack_gemma_local');
try {
  const users = await User.find({ codechefUsername: 'im_ritesh_20' });
  assert.ok(users.length, 'Local CodeChef profile not found');
  for (const user of users) {
    const rating = user.codechefStats.currentRating;
    const stars = codechefStars(rating);
    await User.updateOne({ _id: user._id }, { $set: { 'codechefStats.stars': stars } });
    const saved = await User.findById(user._id);
    assert.equal(saved.codechefStats.stars, stars);
    console.log(`Verified local im_ritesh_20: rating ${rating}, ${stars}`);
  }
} finally { await mongoose.disconnect(); }
