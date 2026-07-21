import { useRef, useState } from "react";
import { parseImport, serializeState } from "../lib/db";
import type { AppState } from "../types";

type SettingsProps = {
  state: AppState;
  onRestChange: (seconds: number) => void;
  onImport: (state: AppState) => Promise<void>;
  onReset: () => void;
};

export function SettingsScreen({ state, onRestChange, onImport, onReset }: SettingsProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const exportData = () => {
    const blob = new Blob([serializeState(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `liftlog-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Backup exported.");
  };

  const importData = async (file?: File) => {
    if (!file) return;
    try {
      await onImport(parseImport(await file.text()));
      setMessage("Backup restored.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "That backup could not be restored.");
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  return (
    <div className="screen settings-screen">
      <header className="page-header">
        <div><span className="eyebrow">MAKE IT YOURS</span><h1>Settings</h1></div>
        <span className="header-count">•••</span>
      </header>

      <section className="settings-card">
        <div className="settings-heading"><span><strong>Default rest timer</strong><small>Starts whenever you complete a set</small></span></div>
        <div className="segmented-control" aria-label="Default rest duration">
          {[60, 90, 120, 180].map((seconds) => (
            <button key={seconds} className={state.settings.restSeconds === seconds ? "is-active" : ""} type="button" onClick={() => onRestChange(seconds)} aria-pressed={state.settings.restSeconds === seconds}>
              {seconds < 120 ? `${seconds}s` : `${seconds / 60}m`}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-card data-card">
        <div className="settings-heading"><span><strong>Your data</strong><small>{state.workouts.filter((workout) => workout.completedAt).length} completed workouts · stored on this device</small></span><span className="privacy-dot" /></div>
        <button className="settings-row" type="button" onClick={exportData}><span><strong>Export JSON backup</strong><small>Save or share a portable copy</small></span><span aria-hidden="true">↓</span></button>
        <button className="settings-row" type="button" onClick={() => fileInput.current?.click()}><span><strong>Import JSON backup</strong><small>Replace local data from a LiftLog file</small></span><span aria-hidden="true">↑</span></button>
        <input ref={fileInput} hidden type="file" accept="application/json,.json" onChange={(event) => importData(event.target.files?.[0])} />
        {message && <p className="settings-message" role="status">{message}</p>}
      </section>

      <section className="settings-card install-card">
        <span className="install-icon" aria-hidden="true">⌂</span>
        <div><span className="eyebrow">INSTALL ON IPHONE</span><h2>Keep LiftLog on your Home Screen</h2><p>In Safari, tap Share, then “Add to Home Screen.” It will open like an app and remain available offline.</p></div>
      </section>

      <section className="settings-card">
        <div className="settings-heading"><span><strong>Optional private backup</strong><small>A private-GitHub adapter is ready for a future connection screen. Credentials are accepted only at runtime and never included in the published app.</small></span></div>
      </section>

      <button className="danger-button" type="button" onClick={onReset}>Reset all local data</button>
      <p className="version-copy">LIFTLOG · LOCAL-FIRST MVP · POUNDS</p>
    </div>
  );
}
