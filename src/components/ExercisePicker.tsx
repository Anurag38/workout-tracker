import { useEffect, useMemo, useState } from "react";
import { searchExercises } from "../data/exercises";
import type { Equipment } from "../types";

const FILTERS: Array<Equipment | "All"> = ["All", "Dumbbell", "Barbell", "EZ Bar", "Cable", "Machine", "Bodyweight"];

type ExercisePickerProps = {
  selectedIds: string[];
  multi?: boolean;
  title?: string;
  onChoose: (exerciseId: string) => void;
  onClose: () => void;
};

export function ExercisePicker({ selectedIds, multi = false, title = "Add exercise", onChoose, onClose }: ExercisePickerProps) {
  const [query, setQuery] = useState("");
  const [equipment, setEquipment] = useState<Equipment | "All">("All");
  const results = useMemo(() => searchExercises(query, equipment), [equipment, query]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="sheet exercise-picker" role="dialog" aria-modal="true" aria-labelledby="exercise-picker-title">
        <div className="sheet-grabber" />
        <header className="sheet-header">
          <div>
            <span className="eyebrow">EXERCISE LIBRARY</span>
            <h2 id="exercise-picker-title">{title}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close exercise library">×</button>
        </header>
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Bench, cable, hamstrings…"
            aria-label="Search exercises"
          />
        </label>
        <div className="chip-row filter-row" aria-label="Filter by equipment">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              className={equipment === filter ? "chip is-selected" : "chip"}
              type="button"
              onClick={() => setEquipment(filter)}
              aria-pressed={equipment === filter}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="exercise-results">
          {results.map((exercise) => {
            const selected = selectedIds.includes(exercise.id);
            return (
              <button
                key={exercise.id}
                className="exercise-result"
                type="button"
                onClick={() => onChoose(exercise.id)}
                disabled={!multi && selected}
              >
                <span className="result-copy">
                  <strong>{exercise.name}</strong>
                  <small>{exercise.family} · {exercise.equipment}{exercise.angle ? ` · ${exercise.angle}` : ""}</small>
                </span>
                <span className={selected ? "result-check is-selected" : "result-check"} aria-hidden="true">{selected ? "✓" : "+"}</span>
              </button>
            );
          })}
          {!results.length && <p className="empty-copy">No matches. Try a muscle, family, or equipment name.</p>}
        </div>
        {multi && <button className="primary-button sticky-action" type="button" onClick={onClose}>Done</button>}
      </section>
    </div>
  );
}
