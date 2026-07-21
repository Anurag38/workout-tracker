export type MainTab = "home" | "history" | "progress" | "settings";

const tabs: Array<{ id: MainTab; label: string; symbol: string }> = [
  { id: "home", label: "Home", symbol: "⌂" },
  { id: "history", label: "History", symbol: "↺" },
  { id: "progress", label: "Progress", symbol: "↗" },
  { id: "settings", label: "Settings", symbol: "•••" },
];

export function BottomNav({ active, onChange }: { active: MainTab; onChange: (tab: MainTab) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={active === tab.id ? "nav-item is-active" : "nav-item"}
          type="button"
          onClick={() => onChange(tab.id)}
          aria-current={active === tab.id ? "page" : undefined}
        >
          <span className="nav-symbol" aria-hidden="true">{tab.symbol}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
