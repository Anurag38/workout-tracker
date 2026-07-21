import type { AppState } from "../types";
export function SettingsScreen(_props: { state: AppState; onRestChange: (seconds: number) => void; onImport: (state: AppState) => Promise<void>; onReset: () => void }) {
  return <div className="screen"><h1>Settings</h1></div>;
}
