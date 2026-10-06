import { Router } from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { AIError, chat, generateRecommendations, gemmaConfig, userContext } from './gemma.js';
import { createRecommendationCache } from './recommendationCache.js';
import { recommendationCandidates } from './recommendationCandidates.js';

export const aiRouter = Router();
const cachedRecommendations = createRecommendationCache();
aiRouter.use(auth);

async function profile(req) {
  gemmaConfig();
  const user = await User.findById(req.user.userId).select('skills leetcodeUsername codeforcesUsername codechefUsername leetcodeStats codeforcesStats codechefStats leetcodeRatingHistory codeforcesRatingHistory codechefRatingHistory').lean();
  if (!user) throw new AIError('User profile not found.', 404);
  return user;
}

function failure(res, error) {
  // Never log provider bodies, credentials, prompts, or database connection strings.
  console.warn('CodeTrack AI request failed:', error instanceof AIError ? error.status : 500);
  res.status(error instanceof AIError ? error.status : 500).json({ message: error instanceof AIError ? error.message : 'Unable to load your profile for AI assistance.' });
}

aiRouter.post('/chat', async (req, res) => {
  const controller = new AbortController();
  const cancel = () => { if (!res.writableEnded) controller.abort(); };
  res.on('close', cancel);
  const send = event => {
    if (res.destroyed) return;
    if (!res.headersSent) {
      res.set({ 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-cache, no-transform', 'X-Accel-Buffering': 'no' });
      res.flushHeaders();
    }
    res.write(JSON.stringify(event) + '\n');
  };
  try {
    const streaming = req.body?.stream === true;
    const result = await chat(await profile(req), req.body?.message, req.body?.history, {
      signal: controller.signal,
      ...(streaming ? { onChunk: text => send({ text }) } : {}),
    });
    if (streaming) { send({ done: true, model: result.model, provider: result.provider }); res.end(); }
    else res.json(result);
  } catch (error) {
    if (res.destroyed) return;
    if (res.headersSent) { send({ error: error instanceof AIError ? error.message : 'Gemma 4 could not finish this reply. Please try again.' }); res.end(); }
    else failure(res, error);
  } finally { res.off('close', cancel); }
});

aiRouter.post('/recommendations', async (req, res) => {
  try {
    const user = await profile(req);
    const data = Object.fromEntries(['leetcode', 'codeforces', 'codechef'].map(p => [`${p}Stats`, { ...user[`${p}Stats`], username: user[`${p}Username`] }]));
    const candidates = recommendationCandidates(data);
    const input = { model: gemmaConfig().model, profile: userContext(user), candidates };
    res.json(await cachedRecommendations(req.user.userId, input, () => generateRecommendations(user, candidates)));
  } catch (error) { failure(res, error); }
});
