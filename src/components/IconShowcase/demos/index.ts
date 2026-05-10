import type React from "react";
import type { IconDemoMeta } from "../../../data/icon-demos";

export type DemoComponent =
  | React.ComponentType
  | React.ComponentType<{ name: string; meta: IconDemoMeta }>;

export const CUSTOM_DEMOS: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  react: () => import("./ReactDemo"),
  "node-js": () => import("./NodeDemo"),
  typescript: () => import("./TypeScriptDemo"),
  jest: () => import("./JestDemo"),
  tailwindcss: () => import("./TailwindDemo"),
};
