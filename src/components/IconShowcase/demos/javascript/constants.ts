export interface Question {
  code: string;
  options: string[];
  answer: string;
  explanation: string;
}

export const QUESTIONS: Question[] = [
  { code: '"5" + 3', options: ['"53"', "8", "TypeError", "NaN"], answer: '"53"', explanation: "The + operator coerces 3 to a string when one operand is already a string." },
  { code: "typeof null", options: ['"null"', '"object"', '"undefined"', '"symbol"'], answer: '"object"', explanation: 'A 27-year-old bug in JS. typeof null returns "object" — it\'s in the spec now.' },
  { code: "0.1 + 0.2 === 0.3", options: ["false", "true", "undefined", "RangeError"], answer: "false", explanation: "Floating point arithmetic. 0.1 + 0.2 = 0.30000000000000004. Use Number.EPSILON to compare." },
  { code: "[] == false", options: ["true", "false", "TypeError", "undefined"], answer: "true", explanation: "[] coerces to 0, false coerces to 0. Abstract equality at its finest." },
  { code: '"" || "Cillian"', options: ['"Cillian"', '""', "true", "false"], answer: '"Cillian"', explanation: 'Empty string is falsy — || returns the first truthy value, which is "Cillian".' },
];

export const GOOD_SCORE = 3;
export const GREAT_SCORE = 4;

export const RESULT_MESSAGE = {
  perfect: "You've clearly read the spec. Or suffered enough.",
  good: "Solid. JS quirks are a survival skill.",
  poor: "That's fine. Linters exist for a reason.",
} as const;
