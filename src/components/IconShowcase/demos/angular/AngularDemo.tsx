import { useState, type ComponentType } from "react";
import CodePanel from "../components/CodePanel";
import DemoShell from "../components/DemoShell";
import { ROUTES, type RoutePath } from "./constants";
import { DashboardView, HomeView, SettingsView } from "./RouteViews";
import {
  ACCENT_TEXT, ANGULAR_COLOR, BROWSER, COMPONENT_NAME, ROUTER_BAR, ROUTING_CODE, TAB_ACTIVE, TAB_BAR, TAB_IDLE, VIEWPORT,
} from "./styles";

const ROUTE_VIEWS: Record<RoutePath, ComponentType> = {
  "/home": HomeView,
  "/dashboard": DashboardView,
  "/settings": SettingsView,
};

function RoutingModule() {
  return (
    <CodePanel accent={ANGULAR_COLOR} className={ROUTING_CODE}>
      <div className="text-muted">{"// app-routing.module.ts"}</div>
      {ROUTES.map(route => (
        <div key={route.path}>
          <span className="text-muted">{"  { path: '"}</span>
          <span className={ACCENT_TEXT}>{route.path.slice(1)}</span>
          <span className="text-muted">{"', component: "}</span>
          <span className={COMPONENT_NAME}>{route.label}Component</span>
          <span className="text-muted">{" },"}</span>
        </div>
      ))}
    </CodePanel>
  );
}

export default function AngularDemo() {
  const [activePath, setActivePath] = useState<RoutePath>("/home");
  const ActiveView = ROUTE_VIEWS[activePath];

  return (
    <DemoShell>
      <div className={BROWSER}>
        <div className={TAB_BAR}>
          {ROUTES.map(route => (
            <button key={route.path} type="button" onClick={() => setActivePath(route.path)} className={route.path === activePath ? TAB_ACTIVE : TAB_IDLE}>
              {route.icon} {route.label}
            </button>
          ))}
        </div>
        <div className={ROUTER_BAR}>
          <span className="text-muted">router.navigate(</span>
          <span className={ACCENT_TEXT}>'{activePath}'</span>
          <span className="text-muted">)</span>
        </div>
        <div className={VIEWPORT}>
          <ActiveView />
        </div>
      </div>
      <RoutingModule />
    </DemoShell>
  );
}
