import { useMemo, useState } from "react";
import { BottomNav, type MainTab } from "./components/BottomNav";
import { EXERCISE_BY_ID } from "./data/exercises";
import { createDefaultState } from "./data/defaults";
import { createId } from "./lib/ids";
import { useStore } from "./hooks/useStore";
import { HistoryScreen } from "./screens/HistoryScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { ProgressScreen } from "./screens/ProgressScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { EditTemplateScreen, TemplateScreen } from "./screens/TemplateScreen";
import { WorkoutScreen } from "./screens/WorkoutScreen";
import type { Workout, WorkoutExercise, WorkoutSet, WorkoutTemplate } from "./types";

type Screen = MainTab | "choose" | "template" | "edit-template" | "workout";

const blankSet = (): WorkoutSet => ({ id: createId("set"), weight: null, reps: null, completed: false });
const workoutExercise = (exerciseId: string): WorkoutExercise => ({
  id: createId("exercise"),
  exerciseId,
  sets: [blankSet()],
});

function ChooseWorkout({ templates, activeWorkout, onBack, onChoose, onEmpty, onResume }: {
  templates: WorkoutTemplate[];
  activeWorkout?: Workout;
  onBack: () => void;
  onChoose: (id: string) => void;
  onEmpty: () => void;
  onResume: () => void;
}) {
  return (
    <div className="screen detail-screen choose-screen">
      <header className="subpage-header"><button className="back-button" type="button" onClick={onBack}>← Back</button></header>
      <div className="template-title-block"><span className="eyebrow">START WORKOUT</span><h1>What are you training?</h1><p>Pick a template, or build a session as you go.</p></div>
      {activeWorkout && <button className="resume-card choose-resume" type="button" onClick={onResume}><span className="live-dot" /><span><strong>Resume {activeWorkout.name}</strong><small>Your unfinished sets are saved</small></span><span>→</span></button>}
      <div className="choose-template-list">
        {templates.map((template) => (
          <button className="choose-template-card" type="button" key={template.id} onClick={() => onChoose(template.id)}>
            <span className="template-monogram">{template.name.slice(0, 2).toUpperCase()}</span>
            <span><strong>{template.name}</strong><small>{template.exerciseIds.length} exercises</small></span>
            <span aria-hidden="true">→</span>
          </button>
        ))}
      </div>
      <button className="secondary-button empty-workout-button" type="button" onClick={onEmpty}>+ Start an empty workout</button>
    </div>
  );
}

export default function App() {
  const { state, error, clearError, update, replace } = useStore();
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);
  const [editingNew, setEditingNew] = useState(false);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const [focusExerciseId, setFocusExerciseId] = useState<string | undefined>();
  const [progressExerciseId, setProgressExerciseId] = useState<string | undefined>();

  const activeWorkout = useMemo(
    () => state?.workouts.find((workout) => workout.id === activeWorkoutId) ?? state?.workouts.find((workout) => !workout.completedAt),
    [activeWorkoutId, state?.workouts],
  );

  if (!state) {
    return (
      <main className="app-shell loading-shell">
        <section className="empty-state" aria-live="polite"><span className="brand-mark">LL</span><p>{error ?? "Opening your local workout log…"}</p></section>
      </main>
    );
  }

  const navigateMain = (tab: MainTab) => {
    setScreen(tab);
    setProgressExerciseId(undefined);
  };

  const openTemplate = (id: string) => {
    setSelectedTemplateId(id);
    setScreen("template");
  };

  const startWorkout = (template?: WorkoutTemplate, firstExerciseId?: string) => {
    const workout: Workout = {
      id: createId("workout"),
      name: template?.name ?? "Open workout",
      templateId: template?.id ?? null,
      startedAt: new Date().toISOString(),
      completedAt: null,
      exercises: template?.exerciseIds.map(workoutExercise) ?? [],
    };
    update((current) => ({ ...current, workouts: [workout, ...current.workouts] }));
    setActiveWorkoutId(workout.id);
    setFocusExerciseId(firstExerciseId);
    setScreen("workout");
  };

  const updateWorkout = (workout: Workout) => {
    update((current) => ({ ...current, workouts: current.workouts.map((item) => item.id === workout.id ? workout : item) }));
  };

  const finishWorkout = () => {
    if (!activeWorkout) return;
    update((current) => ({
      ...current,
      workouts: current.workouts.map((workout) => workout.id === activeWorkout.id ? { ...workout, completedAt: new Date().toISOString() } : workout),
    }));
    setActiveWorkoutId(null);
    setFocusExerciseId(undefined);
    setScreen("home");
  };

  const discardWorkout = () => {
    if (!activeWorkout) return;
    update((current) => ({ ...current, workouts: current.workouts.filter((workout) => workout.id !== activeWorkout.id) }));
    setActiveWorkoutId(null);
    setScreen("home");
  };

  const editTemplate = (template: WorkoutTemplate, isNew = false) => {
    setEditingTemplate({ ...template, exerciseIds: [...template.exerciseIds] });
    setEditingNew(isNew);
    setScreen("edit-template");
  };

  const saveTemplate = (template: WorkoutTemplate) => {
    update((current) => ({
      ...current,
      templates: editingNew ? [...current.templates, template] : current.templates.map((item) => item.id === template.id ? template : item),
    }));
    setSelectedTemplateId(template.id);
    setEditingTemplate(null);
    setEditingNew(false);
    setScreen("template");
  };

  const selectedTemplate = state.templates.find((template) => template.id === selectedTemplateId);
  const mainScreen = ["home", "history", "progress", "settings"].includes(screen);

  return (
    <main className="app-shell">
      <div className="app-frame">
        {screen === "home" && (
          <HomeScreen
            state={state}
            activeWorkout={activeWorkout}
            onStart={() => setScreen("choose")}
            onResume={() => { if (activeWorkout) { setActiveWorkoutId(activeWorkout.id); setScreen("workout"); } }}
            onOpenTemplate={openTemplate}
            onEditTemplate={(id) => { const template = state.templates.find((item) => item.id === id); if (template) editTemplate(template); }}
            onCreateTemplate={() => editTemplate({ id: createId("template"), name: "", focus: "", exerciseIds: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, true)}
            onViewProgress={(id) => { setProgressExerciseId(id); setScreen("progress"); }}
            onDismissIntro={() => update((current) => ({ ...current, settings: { ...current.settings, didOnboard: true } }))}
          />
        )}
        {screen === "history" && <HistoryScreen workouts={state.workouts} />}
        {screen === "progress" && <ProgressScreen key={progressExerciseId ?? "progress"} workouts={state.workouts} initialExerciseId={progressExerciseId} />}
        {screen === "settings" && (
          <SettingsScreen
            state={state}
            onRestChange={(restSeconds) => update((current) => ({ ...current, settings: { ...current.settings, restSeconds } }))}
            onImport={replace}
            onReset={() => { if (window.confirm("Reset every local workout and template? This cannot be undone without an export.")) replace(createDefaultState()); }}
          />
        )}
        {screen === "choose" && <ChooseWorkout templates={state.templates} activeWorkout={activeWorkout} onBack={() => setScreen("home")} onChoose={openTemplate} onEmpty={() => startWorkout()} onResume={() => { if (activeWorkout) { setActiveWorkoutId(activeWorkout.id); setScreen("workout"); } }} />}
        {screen === "template" && selectedTemplate && <TemplateScreen template={selectedTemplate} workouts={state.workouts} onBack={() => setScreen("choose")} onEdit={() => editTemplate(selectedTemplate)} onStart={(exerciseId) => startWorkout(selectedTemplate, exerciseId)} />}
        {screen === "edit-template" && editingTemplate && (
          <EditTemplateScreen
            template={editingTemplate}
            isNew={editingNew}
            onCancel={() => setScreen(editingNew ? "home" : "template")}
            onSave={saveTemplate}
            onDelete={!editingNew ? () => {
              if (window.confirm(`Delete the ${editingTemplate.name} template? Workout history will stay intact.`)) {
                update((current) => ({ ...current, templates: current.templates.filter((item) => item.id !== editingTemplate.id) }));
                setSelectedTemplateId(null);
                setEditingTemplate(null);
                setScreen("home");
              }
            } : undefined}
          />
        )}
        {screen === "workout" && activeWorkout && (
          <WorkoutScreen
            workout={activeWorkout}
            history={state.workouts.filter((workout) => workout.id !== activeWorkout.id)}
            restSeconds={state.settings.restSeconds}
            focusExerciseId={focusExerciseId}
            onChange={updateWorkout}
            onFinish={finishWorkout}
            onExit={() => setScreen("home")}
            onDiscard={discardWorkout}
          />
        )}
        {mainScreen && <BottomNav active={screen as MainTab} onChange={navigateMain} />}
        {error && <button className="error-toast" type="button" onClick={clearError}>{error} <span>×</span></button>}
      </div>
    </main>
  );
}
