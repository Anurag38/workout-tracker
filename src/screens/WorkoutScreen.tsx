import { useEffect, useRef, useState } from "react";
import { ExercisePicker } from "../components/ExercisePicker";
import { RestTimer } from "../components/RestTimer";
import { EXERCISE_BY_ID } from "../data/exercises";
import { createId } from "../lib/ids";
import { formatDate, formatDuration, formatSigned } from "../lib/format";
import { completedSets, formatSetSummary, previousComparable, sessionDelta } from "../lib/metrics";
import type { Workout, WorkoutExercise, WorkoutSet } from "../types";

type WorkoutProps = {
  workout: Workout;
  history: Workout[];
  restSeconds: number;
  focusExerciseId?: string;
  onChange: (workout: Workout) => void;
  onFinish: () => void;
  onExit: () => void;
  onDiscard: () => void;
};

function blankSet(): WorkoutSet {
  return { id: createId("set"), weight: null, reps: null, completed: false };
}

export function WorkoutScreen({ workout, history, restSeconds, focusExerciseId, onChange, onFinish, onExit, onDiscard }: WorkoutProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [restKey, setRestKey] = useState(0);
  const [showRest, setShowRest] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const focusRef = useRef<HTMLElement | null>(null);
  const finishDialogRef = useRef<HTMLElement | null>(null);
  const exitDialogRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (focusExerciseId) window.setTimeout(() => focusRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }, [focusExerciseId]);

  useEffect(() => {
    const dialog = showFinish ? finishDialogRef.current : showExit ? exitDialogRef.current : null;
    if (!dialog) return;
    dialog.querySelector<HTMLElement>("button")?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        showFinish ? setShowFinish(false) : setShowExit(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showExit, showFinish]);

  const replaceExercise = (id: string, recipe: (exercise: WorkoutExercise) => WorkoutExercise) => {
    onChange({ ...workout, exercises: workout.exercises.map((exercise) => exercise.id === id ? recipe(exercise) : exercise) });
  };

  const updateSet = (exerciseId: string, setId: string, patch: Partial<WorkoutSet>) => {
    replaceExercise(exerciseId, (exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set) => set.id === setId ? { ...set, ...patch } : set),
    }));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    replaceExercise(exerciseId, (exercise) => ({
      ...exercise,
      sets: exercise.sets.length > 1 ? exercise.sets.filter((set) => set.id !== setId) : exercise.sets,
    }));
  };

  const toggleComplete = (exerciseId: string, set: WorkoutSet) => {
    if (!set.completed && (
      set.weight === null || !Number.isFinite(set.weight) || set.weight < 0 ||
      set.reps === null || !Number.isInteger(set.reps) || set.reps <= 0
    )) return;
    updateSet(exerciseId, set.id, { completed: !set.completed, completedAt: !set.completed ? new Date().toISOString() : undefined });
    if (!set.completed) {
      setRestKey((key) => key + 1);
      setShowRest(true);
    }
  };

  const copyPrevious = (exercise: WorkoutExercise, previous: WorkoutExercise) => {
    replaceExercise(exercise.id, (current) => ({
      ...current,
      sets: completedSets(previous).map((set) => ({ ...set, id: createId("set"), completed: false, completedAt: undefined })),
    }));
  };

  const addExercise = (exerciseId: string) => {
    if (workout.exercises.some((exercise) => exercise.exerciseId === exerciseId)) return;
    onChange({ ...workout, exercises: [...workout.exercises, { id: createId("exercise"), exerciseId, sets: [blankSet()] }] });
    setPickerOpen(false);
  };

  const totalCompleted = workout.exercises.reduce((sum, exercise) => sum + completedSets(exercise).length, 0);

  return (
    <div className="screen workout-screen">
      <header className="workout-header">
        <button className="back-button" type="button" onClick={() => setShowExit(true)}>× Exit</button>
        <div className="workout-running"><span className="live-dot" /> <strong>{workout.name}</strong><small>{formatDuration(workout.startedAt)}</small></div>
        <button className="finish-button" type="button" onClick={() => setShowFinish(true)} disabled={!totalCompleted}>Finish</button>
      </header>
      <div className="workout-intro">
        <span className="eyebrow">TODAY’S SESSION</span>
        <h1>Choose your next set.</h1>
        <p>Exercises stay open—work in any order.</p>
      </div>
      <div className="workout-exercise-list">
        {workout.exercises.map((exercise, exerciseIndex) => {
          const definition = EXERCISE_BY_ID.get(exercise.exerciseId);
          const previousWorkout = previousComparable(history, exercise.exerciseId, workout.startedAt);
          const previousExercise = previousWorkout?.exercises.find((item) => item.exerciseId === exercise.exerciseId);
          const delta = sessionDelta(exercise, previousExercise);
          return (
            <article
              className="workout-exercise-card"
              key={exercise.id}
              ref={focusExerciseId === exercise.exerciseId ? (element) => { focusRef.current = element; } : undefined}
            >
              <div className="exercise-card-heading">
                <span className="exercise-index">{String(exerciseIndex + 1).padStart(2, "0")}</span>
                <div><h2>{definition?.name ?? "Exercise"}</h2><small>{definition?.family} · {definition?.equipment}</small></div>
                {completedSets(exercise).length > 0 && <span className="set-count-badge">{completedSets(exercise).length} done</span>}
              </div>
              <div className="previous-strip">
                <div>
                  <span className="eyebrow">PREVIOUS COMPARABLE</span>
                  {previousWorkout && previousExercise ? (
                    <><strong>{formatDate(previousWorkout.completedAt!)} · {formatSetSummary(previousExercise)}</strong>{completedSets(exercise).length > 0 && <small>{formatSigned(delta.weight, " lb best")} · {formatSigned(delta.volume, " lb volume")}</small>}</>
                  ) : <strong>No earlier result yet</strong>}
                </div>
                {previousExercise && <button type="button" onClick={() => copyPrevious(exercise, previousExercise)}>Copy</button>}
              </div>
              <div className="sets-table">
                <div className="set-header"><span>SET</span><span>WEIGHT (LB)</span><span>REPS</span><span>DONE</span><span aria-hidden="true" /></div>
                {exercise.sets.map((set, index) => (
                  <div className={set.completed ? "set-row is-complete" : "set-row"} key={set.id}>
                    <span className="set-number">{index + 1}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.5"
                      placeholder={definition?.equipment === "Bodyweight" ? "0" : "—"}
                      value={set.weight ?? ""}
                      onChange={(event) => updateSet(exercise.id, set.id, { weight: event.target.value === "" ? null : Number(event.target.value), completed: false, completedAt: undefined })}
                      aria-label={`${definition?.name} set ${index + 1} weight in pounds`}
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      min="1"
                      step="1"
                      placeholder="—"
                      value={set.reps ?? ""}
                      onChange={(event) => updateSet(exercise.id, set.id, { reps: event.target.value === "" ? null : Number(event.target.value), completed: false, completedAt: undefined })}
                      aria-label={`${definition?.name} set ${index + 1} reps`}
                    />
                    <button className="complete-set-button" type="button" onClick={() => toggleComplete(exercise.id, set)} aria-pressed={set.completed} aria-label={`${set.completed ? "Unmark" : "Complete"} ${definition?.name} set ${index + 1}`}>✓</button>
                    <button
                      className="remove-set-button"
                      type="button"
                      onClick={() => removeSet(exercise.id, set.id)}
                      disabled={exercise.sets.length === 1}
                      aria-label={`Remove ${definition?.name} set ${index + 1}`}
                      title={exercise.sets.length === 1 ? "Each exercise needs at least one set" : "Remove set"}
                    >−</button>
                  </div>
                ))}
              </div>
              <div className="exercise-card-actions">
                <button type="button" onClick={() => replaceExercise(exercise.id, (current) => ({ ...current, sets: [...current.sets, blankSet()] }))}>+ Add set</button>
                <button type="button" onClick={() => onChange({ ...workout, exercises: workout.exercises.filter((item) => item.id !== exercise.id) })}>Remove exercise</button>
              </div>
            </article>
          );
        })}
        {!workout.exercises.length && <div className="large-empty-state compact-empty"><span aria-hidden="true">＋</span><h2>Build this workout as you go</h2><p>Add an exercise, then log each set independently.</p></div>}
      </div>
      <button className="secondary-button add-workout-exercise" type="button" onClick={() => setPickerOpen(true)}>+ Add exercise</button>
      {showRest && <RestTimer key={restKey} initialSeconds={restSeconds} onSkip={() => setShowRest(false)} />}
      {pickerOpen && <ExercisePicker selectedIds={workout.exercises.map((exercise) => exercise.exerciseId)} onChoose={addExercise} onClose={() => setPickerOpen(false)} />}

      {showFinish && (
        <div className="modal-backdrop centered-modal" role="presentation">
          <section ref={finishDialogRef} className="confirm-card" role="dialog" aria-modal="true" aria-labelledby="finish-title">
            <span className="confirm-icon" aria-hidden="true">✓</span>
            <span className="eyebrow">WORKOUT COMPLETE</span>
            <h2 id="finish-title">Finish {workout.name}?</h2>
            <p>{totalCompleted} completed sets across {workout.exercises.filter((exercise) => completedSets(exercise).length).length} exercises · {formatDuration(workout.startedAt)}</p>
            <button className="primary-button" type="button" onClick={onFinish}>Save workout</button>
            <button className="text-button" type="button" onClick={() => setShowFinish(false)}>Keep training</button>
          </section>
        </div>
      )}
      {showExit && (
        <div className="modal-backdrop centered-modal" role="presentation">
          <section ref={exitDialogRef} className="confirm-card" role="dialog" aria-modal="true" aria-labelledby="exit-title">
            <span className="eyebrow">LEAVE WORKOUT</span>
            <h2 id="exit-title">Keep this session?</h2>
            <p>Your unfinished workout can stay on this phone so you can resume it later.</p>
            <button className="primary-button" type="button" onClick={onExit}>Save & exit</button>
            <button className="secondary-button" type="button" onClick={onDiscard}>Discard workout</button>
            <button className="text-button" type="button" onClick={() => setShowExit(false)}>Cancel</button>
          </section>
        </div>
      )}
    </div>
  );
}
