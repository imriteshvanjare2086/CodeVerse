import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, PlayCircle, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { CoursesTab } from "@/components/courses/CoursesTab";
import { DSASheetsTab } from "@/components/courses/DSASheetsTab";
import coursesData from "@/data/courses.json";
import dsaSheetsData from "@/data/dsaSheets.json";

type Tab = "courses" | "sheets";

export default function Courses() {
  const [activeTab, setActiveTab] = useState<Tab>("courses");

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          title="Learning Hub"
          description="Curated courses and structured DSA sheets from top educators to accelerate your learning."
        />

        {/* Hero stats strip & Tabs Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-5"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Header / Stats Info */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-heading font-bold text-foreground text-lg">
                  {coursesData.length} Courses & {dsaSheetsData.length} Sheets
                </p>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">
                  Organized by category and content type
                </p>
              </div>
            </div>

            {/* Top Tabs */}
            <div className="flex items-center bg-muted/20 p-1.5 rounded-2xl border border-border/40 w-fit">
              <button
                onClick={() => setActiveTab("courses")}
                className={`flex items-center gap-2 rounded-xl px-5 py-2 font-mono text-sm font-semibold transition-all duration-300 ${
                  activeTab === "courses"
                    ? "bg-card shadow-sm border border-border/60 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <PlayCircle className="h-4 w-4" />
                Video Courses
              </button>
              <button
                onClick={() => setActiveTab("sheets")}
                className={`flex items-center gap-2 rounded-xl px-5 py-2 font-mono text-sm font-semibold transition-all duration-300 ${
                  activeTab === "sheets"
                    ? "bg-card shadow-sm border border-border/60 text-rose-500"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="h-4 w-4" />
                DSA Sheets
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Content Rendering */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {activeTab === "courses" ? <CoursesTab /> : <DSASheetsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
