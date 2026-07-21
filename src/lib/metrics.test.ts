import { describe, expect, it } from "vitest";
import type { Workout } from "../types";
import { exerciseSessions, previousComparable, repsAtWeight, sessionDelta } from "./metrics";

const workouts: Workout[] = [
  {
    id: "old",
    name: "Chest",
    templateId: null,
    startedAt: "2026-07-01T12:00:00.000Z",
    completedAt: "2026-07-01T13:00:00.000Z",
    exercises: [{
      id: "old-press",
      exerciseId: "press",
      sets: [
        { id: "a", weight: 40, reps: 8, completed: true },
        { id: "b", weight: 40, reps: 10, completed: true },
      ],
    }],
  },
  {
    id: "new",
    name: "Chest",
    templateId: null,
    startedAt: "2026-07-08T12:00:00.000Z",
    completedAt: "2026-07-08T13:00:00.000Z",
    exercises: [{
      id: "new-press",
      exerciseId: "press",
      sets: [{ id: "c", weight: 45, reps: 8, completed: true }],
    }],
  },
];

describe("progress metrics", () => {
  it("orders working-weight sessions and calculates volume", () => {
    const sessions = exerciseSessions(workouts, "press");
    expect(sessions.map((session) => session.bestWeight)).toEqual([40, 45]);
    expect(sessions[0].volume).toBe(720);
  });

  it("finds the immediately previous comparable session", () => {
    expect(previousComparable(workouts, "press", "2026-07-09T00:00:00.000Z")?.id).toBe("new");
  });

  it("tracks best reps at a selected weight", () => {
    expect(repsAtWeight(workouts, "press", 40)).toEqual([
      { date: "2026-07-01T13:00:00.000Z", reps: 10 },
    ]);
  });

  it("compares the current and previous exercise volume", () => {
    const delta = sessionDelta(workouts[1].exercises[0], workouts[0].exercises[0]);
    expect(delta).toEqual({ weight: 5, volume: -360 });
  });
});
