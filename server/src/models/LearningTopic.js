import mongoose from "mongoose";

const SubtopicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    solved: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

const LearningTopicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: "📘" },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
    totalProblems: { type: Number, default: 0 },
    solved: { type: Number, default: 0 },
    subtopics: { type: [SubtopicSchema], default: [] },
  },
  { timestamps: true }
);

export const LearningTopic = mongoose.model("LearningTopic", LearningTopicSchema);

