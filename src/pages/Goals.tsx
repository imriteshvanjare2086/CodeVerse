import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Sparkles, Plus, Flag, Loader2, ListPlus, Check } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Goal } from "@/components/goals/types";
import { GoalCard } from "@/components/goals/GoalCard";
import { AddGoalModal } from "@/components/goals/AddGoalModal";
import { type GoalRecommendation } from "@/components/goals/RecommendationCard";
import { useDashboard } from "@/hooks/useDashboard";

import { useRecommendations } from "@/hooks/useRecommendations";
import { aiErrorMessage } from "@/services/ai";

type Tab = "goals" | "recommendations";

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-muted/10 p-3">
      <p className="font-mono text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-heading text-lg font-black text-foreground">{value}</p>
    </div>
  );
}

export default function Goals() {
  const [activeTab, setActiveTab] = useState<Tab>("goals");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: dashboard, isLoading: isLoadingDashboard } = useDashboard();
  const { data: recommendations = [], isLoading: isLoadingRecommendations, error: recommendationError, refetch: retryRecommendations, isFetching: isFetchingRecommendations } = useRecommendations(dashboard?.profile, activeTab === "recommendations");
  const addedRecommendationIds = useMemo(
    () => new Set(goals.map((goal) => goal.id.split("-added-")[0])),
    [goals]
  );

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("codecraft_goals");
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse goals", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("codecraft_goals", JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = (newGoal: Goal) => {
    setGoals((prev) => [newGoal, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleAddRecommendationGoal = (recommendation: GoalRecommendation) => {
    if (addedRecommendationIds.has(recommendation.id)) return;

    const newGoal: Goal = {
      id: `${recommendation.id}-added-${Date.now()}`,
      title: recommendation.goalTitle,
      category: recommendation.goalCategory,
      targetNumber: recommendation.targetNumber,
      status: "Not Started",
      progress: 0,
    };

    setGoals((prev) => [newGoal, ...prev]);
  };

  const handleCompleteGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, status: "Completed", progress: 100 } : g
      )
    );
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8">
        <PageHeader
          title="Goals & Recommendations"
          description="Track your daily targets and get AI-powered problem suggestions."
        />

        {/* Top Tabs */}
        <div className="flex border-b-2 border-border/60">
          <button
            onClick={() => setActiveTab("goals")}
            className={`flex items-center gap-2 px-6 py-4 font-heading font-semibold text-sm transition-all relative ${
              activeTab === "goals"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Target className="h-4 w-4" />
            My Goals
            {activeTab === "goals" && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`flex items-center gap-2 px-6 py-4 font-heading font-semibold text-sm transition-all relative ${
              activeTab === "recommendations"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Recommendations
            {activeTab === "recommendations" && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "goals" && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-heading text-lg font-semibold text-foreground">Active Targets</h2>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="gap-2 rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                  Add Goal
                </Button>
              </div>

              {goals.length === 0 ? (
                <div className="glass rounded-3xl border border-dashed border-border/50 p-12 text-center flex flex-col items-center justify-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/20 border border-border/40">
                    <Flag className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-foreground">No goals added yet</h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      Set a daily target to stay focused on your learning journey.
                    </p>
                  </div>
                  <Button onClick={() => setIsAddModalOpen(true)} variant="outline" className="mt-4 gap-2 rounded-xl">
                    <Plus className="h-4 w-4" /> Create First Goal
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {goals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        onComplete={handleCompleteGoal}
                        onDelete={handleDeleteGoal}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "recommendations" && (
            <motion.div
              key="recs"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-6"
            >
              {isLoadingDashboard || isLoadingRecommendations ? (
                <div className="glass rounded-3xl border border-border/50 p-12 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="mt-4 font-mono text-sm text-muted-foreground">Preparing personalized recommendations...</p>
                </div>
              ) : (
                <>
                  <div className="glass overflow-hidden rounded-3xl border border-border/50">
                    <div className="flex flex-col gap-5 border-b border-border/40 p-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="max-w-2xl">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                          <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="font-heading text-xl font-black text-foreground">
                          Recommendation List
                        </h2>
                        <p className="mt-2 font-mono text-sm leading-relaxed text-muted-foreground">
                          Gemma 4 prioritizes your next milestones using your connected platform stats.
                        </p>
                      </div>

                      <div className="grid w-full grid-cols-2 gap-3 lg:max-w-md">
                        <StatTile label="Problems" value={dashboard?.heroStats.totalProblems || 0} />
                        <StatTile label="Contests" value={dashboard?.heroStats.totalContests || 0} />
                      </div>
                    </div>

                    {recommendations.length === 0 ? (
                      <div className="p-12 text-center">
                        <h3 className="font-heading text-lg font-bold text-foreground">{recommendationError ? "Could not load recommendations" : "No recommendations right now"}</h3>
                        <p className="mt-2 font-mono text-sm text-muted-foreground">
                          {recommendationError ? aiErrorMessage(recommendationError) : "No recommendations available yet."}
                        </p>
                        {recommendationError && <Button className="mt-4" disabled={isFetchingRecommendations} onClick={() => retryRecommendations()}>Try again</Button>}
                      </div>
                    ) : (
                      <div className="divide-y divide-border/35">
                        {recommendations.map((recommendation) => {
                          const isAdded = addedRecommendationIds.has(recommendation.id);

                          return (
                            <motion.div
                              key={recommendation.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="grid grid-cols-1 gap-4 p-5 transition-all hover:bg-white/[0.035] lg:grid-cols-[1fr_auto] lg:items-center"
                            >
                              <div className="min-w-0">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  <span className="rounded-full border border-border/50 bg-muted/20 px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    {recommendation.platform}
                                  </span>
                                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-primary">
                                    {recommendation.metric}
                                  </span>
                                  <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-amber-300">
                                    {recommendation.current} / {recommendation.target}
                                  </span>
                                </div>
                                <h3 className="font-heading text-base font-black leading-snug text-foreground">
                                  {recommendation.title}
                                </h3>
                                <p className="mt-1 max-w-3xl font-mono text-xs leading-relaxed text-muted-foreground">
                                  {recommendation.description}
                                </p>
                                {recommendation.weakArea && (
                                  <div className="mt-2.5 text-xs font-mono text-rose-500 dark:text-rose-400 font-bold flex items-center gap-1.5 bg-rose-500/5 dark:bg-rose-500/10 w-fit px-2.5 py-1 rounded-lg border border-rose-500/10">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                                    Weak Area: {recommendation.weakArea}
                                  </div>
                                )}
                                <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                                  {recommendation.actions[0]}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAddRecommendationGoal(recommendation)}
                                disabled={isAdded}
                                className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 font-mono text-[10px] font-black uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground disabled:border-green-400/25 disabled:bg-green-400/10 disabled:text-green-400"
                              >
                                {isAdded ? <Check className="h-4 w-4" /> : <ListPlus className="h-4 w-4" />}
                                {isAdded ? "Added" : "Add to list"}
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <AddGoalModal
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleAddGoal}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
