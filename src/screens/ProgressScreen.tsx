import { useMemo, useState } from "react";
import { EXERCISE_BY_ID, EXERCISES } from "../data/exercises";
import { formatDate, formatSigned } from "../lib/format";
import { exerciseSessions, repsAtWeight } from "../lib/metrics";
import type { Workout } from "../types";

function TrendChart({ values, dates }: { values: number[]; dates: string[] }) {
  if (!values.length) return null;
  const width = 340;
  const height = 154;
  const left = 18;
  const right = 322;
  const top = 18;
  const bottom = 122;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(5, max - min);
  const points = values.map((value, index) => {
    const x = values.length === 1 ? (left + right) / 2 : left + (index / (values.length - 1)) * (right - left);
    const y = bottom - ((value - min) / range) * (bottom - top);
    return { x, y, value };
  });

  return (
    <svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Working weight trend from ${values[0]} to ${values.at(-1)} pounds`}>
      {[top, (top + bottom) / 2, bottom].map((y) => <line key={y} x1={left} x2={right} y1={y} y2={y} />)}
      <polyline points={points.map((point) => `${point.x},${point.y}`).join(" ")} />
      {points.map((point, index) => <circle key={`${point.x}-${index}`} cx={point.x} cy={point.y} r={index === points.length - 1 ? 5 : 3.5} />)}
      <text x={left} y="148">{formatDate(dates[0])}</text>
      <text x={right} y="148" textAnchor="end">{formatDate(dates.at(-1)!)}</text>
    </svg>
  );
}

export function ProgressScreen({ workouts, initialExerciseId }: { workouts: Workout[]; initialExerciseId?: string }) {
  const exerciseIdsWithData = useMemo(
    () => EXERCISES.filter((exercise) => exerciseSessions(workouts, exercise.id).length).map((exercise) => exercise.id),
    [workouts],
  );
  const [exerciseId, setExerciseId] = useState(initialExerciseId ?? exerciseIdsWithData[0] ?? EXERCISES[0].id);
  const sessions = exerciseSessions(workouts, exerciseId);
  const latest = sessions.at(-1);
  const previous = sessions.at(-2);
  const first = sessions[0];
  const selectedWeight = latest?.bestWeight ?? 0;
  const repTrend = selectedWeight ? repsAtWeight(workouts, exerciseId, selectedWeight) : [];
  const exercise = EXERCISE_BY_ID.get(exerciseId)!;

  return (
    <div className="screen">
      <header className="page-header">
        <div><span className="eyebrow">THE LONG VIEW</span><h1>Progress</h1></div>
        <span className="header-count">↗</span>
      </header>
      <label className="select-field">
        <span>Exercise</span>
        <select value={exerciseId} onChange={(event) => setExerciseId(event.target.value)}>
          {EXERCISES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>

      {sessions.length ? (
        <>
          <div className="stat-grid">
            <article className="stat-card dark-card">
              <span className="eyebrow">LATEST BEST</span>
              <strong>{latest!.bestWeight}<small> lb</small></strong>
              <p>{Math.round(latest!.bestEstimatedMax)} lb estimated max</p>
            </article>
            <article className="stat-card">
              <span className="eyebrow">SINCE FIRST LOG</span>
              <strong className={latest!.bestWeight - first.bestWeight >= 0 ? "positive-text" : ""}>{formatSigned(latest!.bestWeight - first.bestWeight, " lb")}</strong>
              <p>{sessions.length} comparable session{sessions.length === 1 ? "" : "s"}</p>
            </article>
          </div>

          <section className="chart-card">
            <div className="section-heading compact-heading">
              <div><span className="eyebrow">WORKING WEIGHT</span><h2>{exercise.name}</h2></div>
              {previous && <span className={latest!.bestWeight >= previous.bestWeight ? "delta positive" : "delta"}>{formatSigned(latest!.bestWeight - previous.bestWeight, " lb")}</span>}
            </div>
            <TrendChart values={sessions.map((session) => session.bestWeight)} dates={sessions.map((session) => session.date)} />
          </section>

          <section className="detail-card">
            <div className="section-heading compact-heading"><div><span className="eyebrow">REP PROGRESS</span><h2>At {selectedWeight} lb</h2></div></div>
            <div className="metric-row"><span>Current best</span><strong>{repTrend.at(-1)?.reps ?? latest!.bestReps} reps</strong></div>
            <div className="metric-row"><span>First recorded</span><strong>{repTrend[0]?.reps ?? latest!.bestReps} reps</strong></div>
            <div className="metric-row"><span>Improvement</span><strong className="positive-text">{formatSigned((repTrend.at(-1)?.reps ?? latest!.bestReps) - (repTrend[0]?.reps ?? latest!.bestReps), " reps")}</strong></div>
          </section>

          <section className="detail-card">
            <div className="section-heading compact-heading"><div><span className="eyebrow">PERSONAL RECORDS</span><h2>Best performances</h2></div></div>
            <div className="record-row"><span className="record-medal">1</span><span><strong>Heaviest set</strong><small>{formatDate(sessions.reduce((best, session) => session.bestWeight > best.bestWeight ? session : best).date)}</small></span><strong>{Math.max(...sessions.map((session) => session.bestWeight))} lb</strong></div>
            <div className="record-row"><span className="record-medal">2</span><span><strong>Best estimated max</strong><small>Across all completed sets</small></span><strong>{Math.round(Math.max(...sessions.map((session) => session.bestEstimatedMax)))} lb</strong></div>
          </section>
        </>
      ) : (
        <div className="large-empty-state progress-empty">
          <span aria-hidden="true">↗</span>
          <h2>No data for {exercise.name}</h2>
          <p>Complete this exercise in a workout to begin its weight and rep trends.</p>
        </div>
      )}
    </div>
  );
}
