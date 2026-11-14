export interface TypeField {
  key: string;
  value: string;
  correctType: string;
  options: string[];
}

export const FIELDS: TypeField[] = [
  { key: "name", value: '"Cillian Ó Murchú"', correctType: "string", options: ["string", "number", "boolean", "any"] },
  { key: "yearsExperience", value: "6", correctType: "number", options: ["string", "number", "Date", "any"] },
  { key: "isAvailableForWork", value: "true", correctType: "boolean", options: ["string", "number", "boolean", "null"] },
  { key: "skills", value: '["React", "TypeScript", ...]', correctType: "string[]", options: ["string[]", "string", "object", "any"] },
];

export type Verdict = "perfect" | "close" | "poor";

export const PASSABLE_SCORE = 2;

export const VERDICT_MESSAGE: Record<Verdict, string> = {
  perfect: "Zero type errors. TypeScript approves.",
  close: "A few type errors. The compiler is disappointed.",
  poor: "Many type errors. Please use any sparingly.",
};
