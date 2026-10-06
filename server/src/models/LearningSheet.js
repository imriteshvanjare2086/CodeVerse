import mongoose from "mongoose";

const LearningSheetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    totalProblems: { type: Number, default: 0 },
    solved: { type: Number, default: 0 },
    topics: { type: [String], default: [] },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
  },
  { timestamps: true }
);

export const LearningSheet = mongoose.model("LearningSheet", LearningSheetSchema);

