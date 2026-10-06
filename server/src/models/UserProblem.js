import mongoose from "mongoose";

const UserProblemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true, index: true },
    status: { type: String, enum: ["solved", "attempted", "unsolved"], default: "unsolved" },
    accuracy: { type: Number, default: 0 },
    solvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

UserProblemSchema.index({ userId: 1, problemId: 1 }, { unique: true });

export const UserProblem = mongoose.model("UserProblem", UserProblemSchema);

