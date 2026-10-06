import mongoose from "mongoose";

const ChallengeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    label: { type: String, required: true },
    target: { type: Number, required: true },
    current: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Challenge = mongoose.model("Challenge", ChallengeSchema);

