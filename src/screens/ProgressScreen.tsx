import type { Workout } from "../types";
export function ProgressScreen({ workouts }: { workouts: Workout[]; initialExerciseId?: string }) {
  return <div className="screen"><h1>Progress</h1><p>{workouts.length} workouts</p></div>;
}
