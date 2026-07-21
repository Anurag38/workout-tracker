import type { Workout } from "../types";
export function HistoryScreen({ workouts }: { workouts: Workout[] }) {
  return <div className="screen"><h1>History</h1><p>{workouts.length} workouts</p></div>;
}
