export interface Goal {
  id: string;
  title: string;
  category: string;
  targetNumber?: string;
  deadline?: string;
  status: "Not Started" | "Completed";
  progress: number;
}
