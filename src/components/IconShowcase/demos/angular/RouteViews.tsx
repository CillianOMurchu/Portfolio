import { DASHBOARD_STATS, HOME_STACK, SETTINGS } from "./constants";
import { ACCENT_TEXT, STACK_TAG, STAT_CARD, STAT_VALUE, VIEW_TITLE } from "./styles";

export function HomeView() {
  return (
    <div className="space-y-2">
      <p className={VIEW_TITLE}>Welcome, Cillian</p>
      <p className="text-sm text-muted">This is the HomeComponent. It bootstrapped from AppModule.</p>
      <div className="mt-2 flex gap-2">
        {HOME_STACK.map(tech => <span key={tech} className={STACK_TAG}>{tech}</span>)}
      </div>
    </div>
  );
}

export function DashboardView() {
  return (
    <div className="space-y-2">
      <p className={VIEW_TITLE}>DashboardComponent</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {DASHBOARD_STATS.map(stat => (
          <div key={stat.label} className={STAT_CARD}>
            <p className={STAT_VALUE}>{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsView() {
  return (
    <div className="space-y-2">
      <p className={VIEW_TITLE}>SettingsComponent</p>
      <div className="mt-1 space-y-2">
        {SETTINGS.map(setting => (
          <div key={setting} className="flex items-center gap-2 font-mono text-sm text-muted">
            <span className={ACCENT_TEXT}>@Input()</span> {setting}
          </div>
        ))}
      </div>
    </div>
  );
}
