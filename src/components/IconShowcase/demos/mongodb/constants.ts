export interface ProjectDocument {
  _id: string;
  name: string;
  stack: string[];
  year: number;
  status: "live" | "deployed";
}

export const DOCUMENTS: ProjectDocument[] = [
  { _id: "a1b2", name: "Portfolio", stack: ["React", "TypeScript", "Tailwind"], year: 2024, status: "live" },
  { _id: "c3d4", name: "iGaming Platform", stack: ["Angular", "RxJS", "Node.js"], year: 2022, status: "deployed" },
  { _id: "e5f6", name: "Booking System", stack: ["React", "Express", "MongoDB"], year: 2021, status: "deployed" },
  { _id: "g7h8", name: "Analytics Dashboard", stack: ["Angular", "TypeScript", "Firebase"], year: 2023, status: "live" },
  { _id: "i9j0", name: "Component Library", stack: ["StencilJS", "Sass", "Storybook"], year: 2023, status: "live" },
];

export const STACK_FILTERS = ["React", "Angular", "TypeScript", "Node.js"];
