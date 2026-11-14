export interface ComponentNode {
  id: string;
  label: string;
  isMemoized: boolean;
  hasChildren: boolean;
  depth: 0 | 1;
}

export const COMPONENT_TREE: ComponentNode[] = [
  { id: "app", label: "App", isMemoized: false, hasChildren: true, depth: 0 },
  { id: "header", label: "Header (memo)", isMemoized: true, hasChildren: false, depth: 1 },
  { id: "counter", label: "Counter", isMemoized: false, hasChildren: false, depth: 1 },
  { id: "list", label: "List", isMemoized: false, hasChildren: false, depth: 1 },
];

export const COUNTER_RENDER_PATH = ["app", "counter"];
export const LIST_RENDER_PATH = ["app", "list"];
export const FLASH_DURATION_MS = 700;
