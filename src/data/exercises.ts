import type { Exercise } from "../types";

export const EXERCISES: Exercise[] = [
  { id: "barbell-bench", name: "Flat barbell bench press", family: "Bench press", primaryMuscles: ["Chest", "Triceps"], equipment: "Barbell", angle: "Flat" },
  { id: "incline-barbell-bench", name: "Incline barbell bench press", family: "Bench press", primaryMuscles: ["Chest", "Shoulders"], equipment: "Barbell", angle: "Incline" },
  { id: "decline-barbell-bench", name: "Decline barbell bench press", family: "Bench press", primaryMuscles: ["Chest", "Triceps"], equipment: "Barbell", angle: "Decline" },
  { id: "dumbbell-bench", name: "Flat dumbbell press", family: "Bench press", primaryMuscles: ["Chest", "Triceps"], equipment: "Dumbbell", angle: "Flat" },
  { id: "incline-dumbbell-press", name: "Incline dumbbell press", family: "Bench press", primaryMuscles: ["Chest", "Shoulders"], equipment: "Dumbbell", angle: "Incline" },
  { id: "machine-chest-press", name: "Machine chest press", family: "Bench press", primaryMuscles: ["Chest", "Triceps"], equipment: "Machine", angle: "Flat" },
  { id: "pec-deck", name: "Pec deck fly", family: "Chest fly", primaryMuscles: ["Chest"], equipment: "Machine" },
  { id: "cable-fly", name: "Cable chest fly", family: "Chest fly", primaryMuscles: ["Chest"], equipment: "Cable", angle: "Flat" },
  { id: "high-low-cable-fly", name: "High-to-low cable fly", family: "Chest fly", primaryMuscles: ["Chest"], equipment: "Cable", angle: "High to low" },
  { id: "low-high-cable-fly", name: "Low-to-high cable fly", family: "Chest fly", primaryMuscles: ["Chest", "Shoulders"], equipment: "Cable", angle: "Low to high" },
  { id: "chest-dip", name: "Chest-focused dip", family: "Dip", primaryMuscles: ["Chest", "Triceps"], equipment: "Bodyweight" },
  { id: "push-up", name: "Push-up", family: "Push-up", primaryMuscles: ["Chest", "Triceps"], equipment: "Bodyweight" },
  { id: "pull-up", name: "Pull-up", family: "Vertical pull", primaryMuscles: ["Back", "Biceps"], equipment: "Bodyweight" },
  { id: "neutral-pull-up", name: "Neutral-grip pull-up", family: "Vertical pull", primaryMuscles: ["Back", "Biceps"], equipment: "Bodyweight" },
  { id: "wide-lat-pulldown", name: "Wide-grip lat pulldown", family: "Lat pulldown", primaryMuscles: ["Back", "Biceps"], equipment: "Cable" },
  { id: "neutral-lat-pulldown", name: "Neutral-grip lat pulldown", family: "Lat pulldown", primaryMuscles: ["Back", "Biceps"], equipment: "Cable" },
  { id: "straight-arm-pulldown", name: "Cable pullover", family: "Pullover", primaryMuscles: ["Back"], equipment: "Cable" },
  { id: "barbell-row", name: "Barbell row", family: "Row", primaryMuscles: ["Back", "Biceps"], equipment: "Barbell" },
  { id: "landmine-row", name: "Landmine row", family: "Row", primaryMuscles: ["Back", "Biceps"], equipment: "Barbell" },
  { id: "chest-supported-row", name: "Chest-supported dumbbell row", family: "Row", primaryMuscles: ["Back", "Biceps"], equipment: "Dumbbell" },
  { id: "single-arm-db-row", name: "Single-arm dumbbell row", family: "Row", primaryMuscles: ["Back", "Biceps"], equipment: "Dumbbell" },
  { id: "seated-cable-row", name: "Seated cable row", family: "Row", primaryMuscles: ["Back", "Biceps"], equipment: "Cable" },
  { id: "machine-high-row", name: "Machine high row", family: "Row", primaryMuscles: ["Back", "Biceps"], equipment: "Machine" },
  { id: "back-squat", name: "Barbell back squat", family: "Squat", primaryMuscles: ["Quads", "Glutes"], equipment: "Barbell" },
  { id: "front-squat", name: "Barbell front squat", family: "Squat", primaryMuscles: ["Quads", "Glutes"], equipment: "Barbell" },
  { id: "hack-squat", name: "Hack squat", family: "Squat", primaryMuscles: ["Quads", "Glutes"], equipment: "Machine" },
  { id: "leg-press", name: "Leg press", family: "Squat", primaryMuscles: ["Quads", "Glutes"], equipment: "Machine" },
  { id: "bulgarian-split-squat", name: "Bulgarian split squat", family: "Split squat", primaryMuscles: ["Quads", "Glutes"], equipment: "Dumbbell" },
  { id: "walking-lunge", name: "Walking lunge", family: "Lunge", primaryMuscles: ["Quads", "Glutes"], equipment: "Dumbbell" },
  { id: "leg-extension", name: "Leg extension", family: "Knee extension", primaryMuscles: ["Quads"], equipment: "Machine" },
  { id: "seated-leg-curl", name: "Seated leg curl", family: "Leg curl", primaryMuscles: ["Hamstrings"], equipment: "Machine" },
  { id: "lying-leg-curl", name: "Lying leg curl", family: "Leg curl", primaryMuscles: ["Hamstrings"], equipment: "Machine" },
  { id: "barbell-rdl", name: "Barbell Romanian deadlift", family: "Hip hinge", primaryMuscles: ["Hamstrings", "Glutes"], equipment: "Barbell" },
  { id: "dumbbell-rdl", name: "Dumbbell Romanian deadlift", family: "Hip hinge", primaryMuscles: ["Hamstrings", "Glutes"], equipment: "Dumbbell" },
  { id: "hip-thrust", name: "Barbell hip thrust", family: "Hip thrust", primaryMuscles: ["Glutes"], equipment: "Barbell" },
  { id: "standing-calf-raise", name: "Standing calf raise", family: "Calf raise", primaryMuscles: ["Calves"], equipment: "Machine" },
  { id: "seated-calf-raise", name: "Seated calf raise", family: "Calf raise", primaryMuscles: ["Calves"], equipment: "Machine" },
  { id: "barbell-overhead-press", name: "Barbell overhead press", family: "Shoulder press", primaryMuscles: ["Shoulders", "Triceps"], equipment: "Barbell" },
  { id: "dumbbell-shoulder-press", name: "Dumbbell shoulder press", family: "Shoulder press", primaryMuscles: ["Shoulders", "Triceps"], equipment: "Dumbbell" },
  { id: "machine-shoulder-press", name: "Machine shoulder press", family: "Shoulder press", primaryMuscles: ["Shoulders", "Triceps"], equipment: "Machine" },
  { id: "dumbbell-lateral-raise", name: "Dumbbell lateral raise", family: "Lateral raise", primaryMuscles: ["Shoulders"], equipment: "Dumbbell" },
  { id: "cable-lateral-raise", name: "Cable lateral raise", family: "Lateral raise", primaryMuscles: ["Shoulders"], equipment: "Cable" },
  { id: "reverse-pec-deck", name: "Reverse pec deck", family: "Rear delt fly", primaryMuscles: ["Shoulders", "Back"], equipment: "Machine" },
  { id: "face-pull", name: "Face pull", family: "Rear delt row", primaryMuscles: ["Shoulders", "Back"], equipment: "Cable" },
  { id: "barbell-curl", name: "Barbell curl", family: "Curl", primaryMuscles: ["Biceps"], equipment: "Barbell" },
  { id: "ez-bar-curl", name: "EZ-bar curl", family: "Curl", primaryMuscles: ["Biceps"], equipment: "EZ Bar" },
  { id: "ez-bar-reverse-curl", name: "EZ-bar reverse curl", family: "Reverse curl", primaryMuscles: ["Biceps", "Forearms"], equipment: "EZ Bar" },
  { id: "dumbbell-curl", name: "Dumbbell curl", family: "Curl", primaryMuscles: ["Biceps"], equipment: "Dumbbell" },
  { id: "hammer-curl", name: "Hammer curl", family: "Curl", primaryMuscles: ["Biceps"], equipment: "Dumbbell" },
  { id: "cable-curl", name: "Cable curl", family: "Curl", primaryMuscles: ["Biceps"], equipment: "Cable" },
  { id: "preacher-curl", name: "Preacher curl", family: "Curl", primaryMuscles: ["Biceps"], equipment: "Machine" },
  { id: "rope-pushdown", name: "Rope triceps pushdown", family: "Triceps extension", primaryMuscles: ["Triceps"], equipment: "Cable" },
  { id: "bar-pushdown", name: "Bar triceps pushdown", family: "Triceps extension", primaryMuscles: ["Triceps"], equipment: "Cable" },
  { id: "overhead-cable-extension", name: "Overhead cable triceps extension", family: "Triceps extension", primaryMuscles: ["Triceps"], equipment: "Cable" },
  { id: "skull-crusher", name: "Barbell skull crusher", family: "Triceps extension", primaryMuscles: ["Triceps"], equipment: "Barbell" },
  { id: "cable-crunch", name: "Cable crunch", family: "Spinal flexion", primaryMuscles: ["Core"], equipment: "Cable" },
  { id: "hanging-leg-raise", name: "Hanging leg raise", family: "Leg raise", primaryMuscles: ["Core"], equipment: "Bodyweight" },
  { id: "plank", name: "Plank", family: "Brace", primaryMuscles: ["Core"], equipment: "Bodyweight" }
];

export const EXERCISE_BY_ID = new Map(EXERCISES.map((exercise) => [exercise.id, exercise]));

export function searchExercises(query: string, equipment = "All") {
  const normalized = query.trim().toLowerCase();
  return EXERCISES.filter((exercise) => {
    const matchesEquipment = equipment === "All" || exercise.equipment === equipment;
    const haystack = [exercise.name, exercise.family, exercise.equipment, exercise.angle, ...exercise.primaryMuscles]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return matchesEquipment && (!normalized || haystack.includes(normalized));
  });
}
