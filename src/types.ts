export type Equipment =
  | "Barbell"
  | "EZ Bar"
  | "Dumbbell"
  | "Cable"
  | "Machine"
  | "Bodyweight";

export type Exercise = {
  id: string;
  name: string;
  family: string;
  primaryMuscles: string[];
  equipment: Equipment;
  angle?: "Flat" | "Incline" | "Decline" | "High to low" | "Low to high";
};

export type WorkoutSet = {
  id: string;
  weight: number | null;
  reps: number | null;
  completed: boolean;
  completedAt?: string;
};

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
};

export type Workout = {
  id: string;
  name: string;
  templateId: string | null;
  startedAt: string;
  completedAt: string | null;
  exercises: WorkoutExercise[];
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  focus: string;
  exerciseIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type AppSettings = {
  restSeconds: number;
  didOnboard: boolean;
};

export type AppState = {
  templates: WorkoutTemplate[];
  workouts: Workout[];
  settings: AppSettings;
};

export type LiftLogExport = AppState & {
  schemaVersion: 1;
  exportedAt: string;
};
