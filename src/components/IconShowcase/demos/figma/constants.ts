export type ElementId = "hero-btn" | "nav-link" | "card" | "badge";

export interface DesignElement {
  id: ElementId;
  label: string;
  type: "Component" | "Link" | "Frame";
  /** The fill as a design token, shown in the inspector and CSS export. */
  fill: string;
  radius: number;
  paddingY: number;
  paddingX: number;
  fontSize: number;
  fontWeight: number;
}

export const ELEMENTS: DesignElement[] = [
  { id: "hero-btn", label: "Hero Button", type: "Component", fill: "var(--success)", radius: 6, paddingY: 10, paddingX: 20, fontSize: 14, fontWeight: 600 },
  { id: "nav-link", label: "Nav Link", type: "Link", fill: "transparent", radius: 0, paddingY: 4, paddingX: 14, fontSize: 14, fontWeight: 400 },
  { id: "card", label: "Project Card", type: "Frame", fill: "var(--surface-inset)", radius: 12, paddingY: 20, paddingX: 24, fontSize: 16, fontWeight: 500 },
  { id: "badge", label: "Status Badge", type: "Component", fill: "var(--success-soft)", radius: 99, paddingY: 4, paddingX: 10, fontSize: 12, fontWeight: 600 },
];

export const cssExport = (element: DesignElement) => [
  ["background", element.fill],
  ["border-radius", `${element.radius}px`],
  ["padding", `${element.paddingY}px ${element.paddingX}px`],
  ["font-size", `${element.fontSize}px`],
  ["font-weight", String(element.fontWeight)],
];
