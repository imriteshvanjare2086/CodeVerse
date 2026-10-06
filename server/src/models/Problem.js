import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    platform: { type: String, enum: ["leetcode", "codeforces", "codechef"], required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    tags: { type: [String], default: [] },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

ProblemSchema.index({ platform: 1, title: 1 });

export const Problem = mongoose.model("Problem", ProblemSchema);

