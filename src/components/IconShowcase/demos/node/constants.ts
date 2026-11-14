export type LineKind = "input" | "output" | "error";

export interface TerminalLine {
  kind: LineKind;
  text: string;
}

export const ERROR_PREFIX = "✗";

export const COMMANDS: Record<string, string[]> = {
  "cillian.buildPortfolio()": [
    "▶ Spinning up Vite dev server...",
    "▶ Bundling 847 modules...",
    "✓ Build complete in 1.2s",
    "✓ Deployed to cillianomurchu.vercel.app",
  ],
  "cillian.makeCoffee()": [
    "▶ Grinding beans (Colombian, medium roast)...",
    "▶ Heating water to 93°C...",
    "✓ Coffee ready. Productivity +25%",
  ],
  "cillian.listSkills()": [
    "→ React, TypeScript, Node.js, Angular",
    "→ Tailwind, Sass, MongoDB, Express",
    "→ Jest, Cypress, Storybook, Figma",
    "→ ...and 10 more (see sphere)",
  ],
  "cillian.checkEmails()": [
    "⚠ 47 unread",
    "⚠ 12 flagged",
    `${ERROR_PREFIX} Operation cancelled by user. Stay outta my emails!`,
  ],
};

export const BOOT_LINES: TerminalLine[] = [
  { kind: "input", text: "$ node cillian.js" },
  { kind: "output", text: "▶ Booting developer..." },
  { kind: "output", text: "▶ Loading skills [■■■■■■■■■■] 100%" },
  { kind: "output", text: "✓ Cillian ready. Call a method to continue." },
  { kind: "output", text: "" },
];
