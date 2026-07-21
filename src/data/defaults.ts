import type { AppState, WorkoutTemplate } from "../types";

const createdAt = "2026-01-01T00:00:00.000Z";

export const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: "template-chest",
    name: "Chest",
    focus: "Chest",
    exerciseIds: ["incline-dumbbell-press", "machine-chest-press", "cable-fly", "high-low-cable-fly", "chest-dip"],
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: "template-back",
    name: "Back",
    focus: "Back",
    exerciseIds: ["pull-up", "wide-lat-pulldown", "chest-supported-row", "seated-cable-row", "straight-arm-pulldown"],
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: "template-legs",
    name: "Legs",
    focus: "Legs",
    exerciseIds: ["back-squat", "barbell-rdl", "leg-press", "seated-leg-curl", "standing-calf-raise"],
    createdAt,
    updatedAt: createdAt,
  },
];

export function createDefaultState(): AppState {
  return {
    templates: DEFAULT_TEMPLATES.map((template) => ({ ...template, exerciseIds: [...template.exerciseIds] })),
    workouts: [],
    settings: { restSeconds: 90, didOnboard: false },
  };
}
