import { EXERCISE_BY_ID, EXERCISES } from "../data/exercises";
import { formatDate } from "../lib/format";
import { exerciseSessions } from "../lib/metrics";
import type { AppState } from "../types";

type HomeProps = {
  state: AppState;
  activeWorkout?: AppState["workouts"][number];
  onStart: () => void;
  onResume: () => void;
  onOpenTemplate: (id: string) => void;
  onEditTemplate: (id: string) => void;
  onCreateTemplate: () => void;
  onViewProgress: (exerciseId?: string) => void;
  onDismissIntro: () => void;
};

export function HomeScreen({ state, activeWorkout, onStart, onResume, onOpenTemplate, onEditTemplate, onCreateTemplate, onViewProgress, onDismissIntro }: HomeProps) {
  const now = new Date();
  const progress = EXERCISES.map((exercise) => ({ exercise, sessions: exerciseSessions(state.workouts, exercise.id) }))
    .filter((item) => item.sessions.length > 1)
    .map((item) => {
      const previous = item.sessions.at(-2)!;
      const latest = item.sessions.at(-1)!;
      return { ...item, latest, delta: latest.bestWeight - previous.bestWeight };
    })
    .sort((a, b) => Date.parse(b.latest.date) - Date.parse(a.latest.date))
    .slice(0, 2);

  const lastUsed = (templateId: string) =>
    state.workouts
      .filter((workout) => workout.templateId === templateId && workout.completedAt)
      .sort((a, b) => Date.parse(b.completedAt!) - Date.parse(a.completedAt!))[0];

  return (
    <div className="screen home-screen">
      <header className="hero-header">
        <div>
          <span className="eyebrow">{new Intl.DateTimeFormat(undefined, { weekday: "long", month: "short", day: "numeric" }).format(now).toUpperCase()}</span>
          <h1>Ready to train?</h1>
        </div>
        <span className="offline-badge"><i /> OFFLINE READY</span>
      </header>

      <button className="start-workout-button" type="button" onClick={onStart}>
        <span className="play-mark" aria-hidden="true">▶</span>
        <span><strong>Start workout</strong><small>Template or empty session</small></span>
        <span className="button-arrow" aria-hidden="true">→</span>
      </button>

      {activeWorkout && (
        <button className="resume-card" type="button" onClick={onResume}>
          <span className="live-dot" />
          <span><strong>Resume {activeWorkout.name}</strong><small>Started {new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(activeWorkout.startedAt))}</small></span>
          <span aria-hidden="true">→</span>
        </button>
      )}

      {!state.settings.didOnboard && (
        <section className="info-card">
          <button className="text-button info-close" type="button" onClick={onDismissIntro} aria-label="Dismiss privacy note">×</button>
          <span className="eyebrow">YOURS, ON THIS PHONE</span>
          <h2>No account. No cloud required.</h2>
          <p>LiftLog saves to this device and keeps working without service. Export a backup whenever you like.</p>
        </section>
      )}

      <section className="content-section">
        <div className="section-heading">
          <div><span className="eyebrow">QUICK START</span><h2>Templates</h2></div>
          <button className="text-button" type="button" onClick={onCreateTemplate}>+ New</button>
        </div>
        <div className="template-list">
          {state.templates.map((template) => {
            const previous = lastUsed(template.id);
            return (
              <article className="template-card" key={template.id}>
                <button className="template-main" type="button" onClick={() => onOpenTemplate(template.id)}>
                  <span className="template-monogram">{template.name.slice(0, 2).toUpperCase()}</span>
                  <span className="template-copy">
                    <strong>{template.name}</strong>
                    <small>{template.exerciseIds.length} exercises · {previous ? `last ${formatDate(previous.completedAt!)}` : "ready to use"}</small>
                  </span>
                  <span aria-hidden="true">→</span>
                </button>
                <button className="template-edit" type="button" onClick={() => onEditTemplate(template.id)} aria-label={`Edit ${template.name} template`}>•••</button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section progress-preview">
        <div className="section-heading">
          <div><span className="eyebrow">RECENT SIGNALS</span><h2>Progress</h2></div>
          <button className="text-button" type="button" onClick={() => onViewProgress()}>View all</button>
        </div>
        {progress.length ? progress.map((item) => (
          <button className="progress-row" key={item.exercise.id} type="button" onClick={() => onViewProgress(item.exercise.id)}>
            <span><strong>{item.exercise.name}</strong><small>{formatDate(item.latest.date)} · {item.latest.bestWeight} lb best set</small></span>
            <span className={item.delta >= 0 ? "delta positive" : "delta"}>{item.delta > 0 ? "+" : ""}{item.delta} lb</span>
          </button>
        )) : (
          <div className="empty-panel">
            <span className="empty-icon" aria-hidden="true">↗</span>
            <div><strong>Your trends will show here</strong><p>Finish two sessions with the same exercise to see a comparison.</p></div>
          </div>
        )}
      </section>
    </div>
  );
}
