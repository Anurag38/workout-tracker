import { useState } from "react";
import { ExercisePicker } from "../components/ExercisePicker";
import { EXERCISE_BY_ID } from "../data/exercises";
import { formatDate } from "../lib/format";
import { formatSetSummary, previousComparable } from "../lib/metrics";
import type { Workout, WorkoutTemplate } from "../types";

export function TemplateScreen({ template, workouts, onBack, onEdit, onStart }: {
  template: WorkoutTemplate;
  workouts: Workout[];
  onBack: () => void;
  onEdit: () => void;
  onStart: (firstExerciseId?: string) => void;
}) {
  return (
    <div className="screen detail-screen">
      <header className="subpage-header">
        <button className="back-button" type="button" onClick={onBack}>← Back</button>
        <button className="text-button" type="button" onClick={onEdit}>Edit</button>
      </header>
      <div className="template-title-block">
        <span className="eyebrow">{template.focus.toUpperCase()} TEMPLATE</span>
        <h1>{template.name}</h1>
        <p>Start with any exercise. Everything stays open while you train.</p>
      </div>
      <div className="plan-list">
        {template.exerciseIds.map((exerciseId, index) => {
          const exercise = EXERCISE_BY_ID.get(exerciseId);
          const previous = previousComparable(workouts, exerciseId);
          const previousExercise = previous?.exercises.find((item) => item.exerciseId === exerciseId);
          return (
            <button className="plan-exercise" type="button" key={exerciseId} onClick={() => onStart(exerciseId)}>
              <span className="plan-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="plan-copy">
                <strong>{exercise?.name ?? "Exercise"}</strong>
                <small>{previous && previousExercise ? `Last ${formatDate(previous.completedAt!)} · ${formatSetSummary(previousExercise)}` : `${exercise?.equipment ?? ""} · no previous session`}</small>
              </span>
              <span className="plan-play" aria-hidden="true">▶</span>
            </button>
          );
        })}
      </div>
      <div className="bottom-action-bar">
        <button className="primary-button" type="button" onClick={() => onStart()}>Start {template.name} workout</button>
      </div>
    </div>
  );
}

export function EditTemplateScreen({ template, isNew = false, onCancel, onSave, onDelete }: {
  template: WorkoutTemplate;
  isNew?: boolean;
  onCancel: () => void;
  onSave: (template: WorkoutTemplate) => void;
  onDelete?: () => void;
}) {
  const [draft, setDraft] = useState(template);
  const [pickerOpen, setPickerOpen] = useState(false);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draft.exerciseIds.length) return;
    const ids = [...draft.exerciseIds];
    [ids[index], ids[target]] = [ids[target], ids[index]];
    setDraft({ ...draft, exerciseIds: ids });
  };

  const toggle = (id: string) => {
    setDraft((current) => ({
      ...current,
      exerciseIds: current.exerciseIds.includes(id)
        ? current.exerciseIds.filter((exerciseId) => exerciseId !== id)
        : [...current.exerciseIds, id],
    }));
  };

  return (
    <div className="screen detail-screen edit-template-screen">
      <header className="subpage-header">
        <button className="back-button" type="button" onClick={onCancel}>Cancel</button>
        <button className="text-button" type="button" onClick={() => onSave({ ...draft, name: draft.name.trim() || "Untitled", focus: draft.focus.trim() || "Custom", updatedAt: new Date().toISOString() })} disabled={!draft.exerciseIds.length}>Save</button>
      </header>
      <div className="template-title-block">
        <span className="eyebrow">{isNew ? "NEW TEMPLATE" : "EDIT TEMPLATE"}</span>
        <input className="title-input" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} aria-label="Template name" placeholder="Workout name" />
        <input className="focus-input" value={draft.focus} onChange={(event) => setDraft({ ...draft, focus: event.target.value })} aria-label="Body focus" placeholder="Body focus" />
        <p>Templates store exercises only. Each workout gets fresh sets with your previous results alongside.</p>
      </div>
      <div className="edit-exercise-list">
        {draft.exerciseIds.map((id, index) => (
          <div className="edit-exercise-row" key={id}>
            <span className="drag-mark" aria-hidden="true">≡</span>
            <span><strong>{EXERCISE_BY_ID.get(id)?.name}</strong><small>{EXERCISE_BY_ID.get(id)?.equipment} · {EXERCISE_BY_ID.get(id)?.family}</small></span>
            <div className="reorder-actions">
              <button type="button" onClick={() => move(index, -1)} aria-label="Move exercise up" disabled={index === 0}>↑</button>
              <button type="button" onClick={() => move(index, 1)} aria-label="Move exercise down" disabled={index === draft.exerciseIds.length - 1}>↓</button>
              <button type="button" onClick={() => toggle(id)} aria-label="Remove exercise">×</button>
            </div>
          </div>
        ))}
      </div>
      <button className="secondary-button add-exercise-button" type="button" onClick={() => setPickerOpen(true)}>+ Add exercise</button>
      {!isNew && onDelete && <button className="danger-button" type="button" onClick={onDelete}>Delete template</button>}
      {pickerOpen && <ExercisePicker selectedIds={draft.exerciseIds} multi title="Edit exercises" onChoose={toggle} onClose={() => setPickerOpen(false)} />}
    </div>
  );
}
