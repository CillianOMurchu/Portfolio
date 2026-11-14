import { useState } from "react";
import CodePanel from "../components/CodePanel";
import DemoShell from "../components/DemoShell";
import { BOOT_LINES, COMMANDS, ERROR_PREFIX, type TerminalLine } from "./constants";
import { COMMAND_BUTTON, LINE_TONE, NODE_COLOR, TERMINAL } from "./styles";

const BLANK_LINE: TerminalLine = { kind: "output", text: "" };

const toOutputLine = (text: string): TerminalLine => ({
  kind: text.startsWith(ERROR_PREFIX) ? "error" : "output",
  text,
});

export default function NodeDemo() {
  const [lines, setLines] = useState<TerminalLine[]>(BOOT_LINES);
  const [ranCommands, setRanCommands] = useState<ReadonlySet<string>>(new Set());

  const runCommand = (command: string) => {
    setRanCommands(current => new Set(current).add(command));
    setLines(current => [
      ...current,
      { kind: "input", text: `> ${command}` },
      ...COMMANDS[command].map(toOutputLine),
      BLANK_LINE,
    ]);
  };

  return (
    <DemoShell>
      <CodePanel accent={NODE_COLOR} className={TERMINAL}>
        {lines.map((line, index) => (
          <div key={index} className={LINE_TONE[line.kind]}>{line.text || " "}</div>
        ))}
      </CodePanel>

      <p className="text-center text-sm text-muted">Click a method to run it</p>

      <div className="grid grid-cols-2 gap-2">
        {Object.keys(COMMANDS).map(command => (
          <button key={command} type="button" onClick={() => runCommand(command)} disabled={ranCommands.has(command)} className={COMMAND_BUTTON}>
            {command}
          </button>
        ))}
      </div>
    </DemoShell>
  );
}
