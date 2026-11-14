export const ROUTES = [
  { path: "/home", label: "Home", icon: "⌂" },
  { path: "/dashboard", label: "Dashboard", icon: "▦" },
  { path: "/settings", label: "Settings", icon: "⚙" },
] as const;

export type RoutePath = (typeof ROUTES)[number]["path"];

export const HOME_STACK = ["Angular", "TypeScript", "RxJS"];
export const DASHBOARD_STATS = [
  { label: "Projects", value: "14" },
  { label: "Tests", value: "342" },
  { label: "Coverage", value: "87%" },
];
export const SETTINGS = ["Dark mode: true", "Notifications: false", "Debug: false"];
