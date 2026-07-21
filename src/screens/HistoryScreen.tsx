import { useState } from "react";
import { EXERCISE_BY_ID } from "../data/exercises";
import { formatDate, formatDuration } from "../lib/format";
import { completedSets, formatSetSummary } from "../lib/metrics";
import type { Workout } from "../types";

export function HistoryScreen({ workouts }: { workouts: Workout[] }) {
  const completed = workouts
    .filter((workout) => workout.completedAt)
    .sort((a, b) => Date.parse(b.completedAt!) - Date.parse(a.completedAt!));
  const [expanded, setExpanded] = useState<string | null>(completed[0]?.id ?? null);

  return (
    <div className="screen">
      <header className="page-header">
        <div><span className="eyebrow">YOUR LOG</span><h1>History</h1></div>
        <span className="header-count">{completed.length}</span>
      </header>
      {completed.length ? (
        <div className="history-list">
          {completed.map((workout) => {
            const isOpen = expanded === workout.id;
            const totalSets = workout.exercises.reduce((sum, exercise) => sum + completedSets(exercise).length, 0);
            return (
              <article className={isOpen ? "history-card is-open" : "history-card"} key={workout.id}>
                <button className="history-summary" type="button" onClick={() => setExpanded(isOpen ? null : workout.id)} aria-expanded={isOpen}>
                  <span className="date-tile"><strong>{new Date(workout.completedAt!).getDate()}</strong><small>{new Intl.DateTimeFormat(undefined, { month: "short" }).format(new Date(workout.completedAt!)).toUpperCase()}</small></span>
                  <span className="history-copy"><strong>{workout.name}</strong><small>{formatDuration(workout.startedAt, workout.completedAt)} · {workout.exercises.length} exercises · {totalSets} sets</small></span>
                  <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="history-detail">
                    {workout.exercises.map((exercise) => (
                      <div className="history-exercise" key={exercise.id}>
                        <strong>{EXERCISE_BY_ID.get(exercise.exerciseId)?.name ?? "Exercise"}</strong>
                        <small>{formatSetSummary(exercise) || "No completed sets"}</small>
                      </div>
                    ))}
                    <span className="history-date">Completed {formatDate(workout.completedAt!, { dateStyle: "full" })}</span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="large-empty-state">
          <span aria-hidden="true">↺</span>
          <h2>No completed workouts yet</h2>
          <p>Your finished sessions will appear here with every set intact.</p>
        </div>
      )}
    </div>
  );
}
