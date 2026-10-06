import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CoursesFilterBar } from "@/components/courses/CoursesFilterBar";
import { CoursesGrid } from "@/components/courses/CoursesGrid";
import { Course } from "@/components/courses/CourseCard";
import coursesData from "@/data/courses.json";

export function CoursesTab() {
  const courses = coursesData as Course[];
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const result = courses.filter((c) => {
      const matchesCategory = category === "All" || c.category === category;
      const q = search.toLowerCase();
      const matchesSearch =
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

    const priority = ["apna college", "striver", "code with harry", "codewithharry", "love babbar", "codehelp"];
    
    return result.sort((a, b) => {
      const aInst = a.instructor.toLowerCase();
      const bInst = b.instructor.toLowerCase();
      const aScore = priority.some(p => aInst.includes(p)) ? 1 : 0;
      const bScore = priority.some(p => bInst.includes(p)) ? 1 : 0;
      return bScore - aScore;
    });
  }, [courses, search, category]);

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4"
      >
        <CoursesFilterBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          total={courses.length}
          filtered={filtered.length}
        />
      </motion.div>

      {/* Grid */}
      <CoursesGrid courses={filtered} />
    </div>
  );
}
