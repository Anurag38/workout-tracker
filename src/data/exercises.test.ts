import { describe, expect, it } from "vitest";
import { searchExercises } from "./exercises";

describe("exercise search", () => {
  it("includes EZ-bar curl variations", () => {
    expect(searchExercises("reverse curl").map((exercise) => exercise.id)).toContain("ez-bar-reverse-curl");
    expect(searchExercises("", "EZ Bar").map((exercise) => exercise.id)).toEqual([
      "ez-bar-curl",
      "ez-bar-reverse-curl",
    ]);
  });
});
