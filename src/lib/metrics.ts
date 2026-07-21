import type { Workout, WorkoutExercise, WorkoutSet } from "../types";

export type SessionPoint = {
  workoutId: string;
  date: string;
  bestWeight: number;
  bestReps: number;
  bestEstimatedMax: number;
  volume: number;
};

export function completedSets(exercise: WorkoutExercise): WorkoutSet[] {
  return exercise.sets.filter(
    (set) => set.completed && set.weight !== null && set.reps !== null && set.reps > 0,
  );
}

export function estimatedMax(weight: number, reps: number) {
  return weight * (1 + reps / 30);
}

export function exerciseSessions(workouts: Workout[], exerciseId: string): SessionPoint[] {
  return workouts
    .filter((workout) => workout.completedAt)
    .map((workout) => {
      const exercise = workout.exercises.find((item) => item.exerciseId === exerciseId);
      if (!exercise) return null;
      const sets = completedSets(exercise);
      if (!sets.length) return null;
      return {
        workoutId: workout.id,
        date: workout.completedAt ?? workout.startedAt,
        bestWeight: Math.max(...sets.map((set) => set.weight ?? 0)),
        bestReps: Math.max(...sets.map((set) => set.reps ?? 0)),
        bestEstimatedMax: Math.max(...sets.map((set) => estimatedMax(set.weight ?? 0, set.reps ?? 0))),
        volume: sets.reduce((total, set) => total + (set.weight ?? 0) * (set.reps ?? 0), 0),
      };
    })
    .filter((point): point is SessionPoint => Boolean(point))
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
}

export function previousComparable(
  workouts: Workout[],
  exerciseId: string,
  before = new Date().toISOString(),
): Workout | undefined {
  return workouts
    .filter(
      (workout) =>
        workout.completedAt &&
        Date.parse(workout.completedAt) < Date.parse(before) &&
        workout.exercises.some((item) => item.exerciseId === exerciseId && completedSets(item).length),
    )
    .sort((a, b) => Date.parse(b.completedAt!) - Date.parse(a.completedAt!))[0];
}

export function repsAtWeight(workouts: Workout[], exerciseId: string, weight: number) {
  return exerciseSessions(workouts, exerciseId)
    .map((session) => {
      const workout = workouts.find((item) => item.id === session.workoutId)!;
      const exercise = workout.exercises.find((item) => item.exerciseId === exerciseId)!;
      const reps = completedSets(exercise)
        .filter((set) => set.weight === weight)
        .map((set) => set.reps ?? 0);
      return reps.length ? { date: session.date, reps: Math.max(...reps) } : null;
    })
    .filter((point): point is { date: string; reps: number } => Boolean(point));
}

export function sessionDelta(current: WorkoutExercise, previous?: WorkoutExercise) {
  const currentSets = completedSets(current);
  const previousSets = previous ? completedSets(previous) : [];
  const summarize = (sets: WorkoutSet[]) => ({
    bestWeight: Math.max(0, ...sets.map((set) => set.weight ?? 0)),
    volume: sets.reduce((sum, set) => sum + (set.weight ?? 0) * (set.reps ?? 0), 0),
  });
  const now = summarize(currentSets);
  const before = summarize(previousSets);
  return {
    weight: now.bestWeight - before.bestWeight,
    volume: now.volume - before.volume,
  };
}

export function formatSetSummary(exercise: WorkoutExercise) {
  return completedSets(exercise)
    .map((set) => `${set.weight ?? 0} × ${set.reps ?? 0}`)
    .join(" · ");
}
