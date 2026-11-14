export interface TestCase {
  description: string;
  passes: boolean;
  duration: string;
  failureNote?: string;
}

export const TEST_CASES: TestCase[] = [
  { description: "Pixel-perfect UI from a Figma file", passes: true, duration: "6ms" },
  { description: "Being aware", passes: true, duration: "8ms" },
  { description: "More leg days", passes: false, duration: "3ms" },
  {
    description: "Should start writing TypeScript that reads like documentation and stop annoying people about documentation",
    passes: false,
    duration: "4ms",
  },
  { description: "Picks the right test account and password from memory", passes: true, duration: "5ms" },
  { description: "Uses dark mode", passes: true, duration: "1ms" },
  {
    description: "Stops at one coffee",
    passes: false,
    duration: "∞ms",
    failureNote: "RangeError: maximum caffeine capacity exceeded",
  },
];

export const SUITE_OPEN = "describe('Cillian', () => {";
export const INITIAL_TEST_COUNT = 4;
export const TESTS_PER_RUN = 2;
