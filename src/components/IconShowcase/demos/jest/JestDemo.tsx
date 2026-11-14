import { useState } from "react";
import CodePanel from "../components/CodePanel";
import DemoShell from "../components/DemoShell";
import { INITIAL_TEST_COUNT, SUITE_OPEN, TEST_CASES, TESTS_PER_RUN, type TestCase } from "./constants";
import {
  FAILURE_NOTE, JEST_COLOR, RUN_MORE_BUTTON, TEST_DESCRIPTION, TEST_DURATION, TEST_ICON, TEST_PANEL, TEST_ROW,
} from "./styles";

function TestRow({ test }: { test: TestCase }) {
  const result = test.passes ? "pass" : "fail";
  return (
    <div className={TEST_ROW}>
      <span className={TEST_ICON[result]}>{test.passes ? "✓" : "✗"}</span>
      <span className={TEST_DESCRIPTION[result]}>{test.description}</span>
      <span className={TEST_DURATION}>({test.duration})</span>
    </div>
  );
}

export default function JestDemo() {
  const [revealedCount, setRevealedCount] = useState(INITIAL_TEST_COUNT);

  const tests = TEST_CASES.slice(0, revealedCount);
  const passingCount = tests.filter(test => test.passes).length;
  const failingCount = tests.length - passingCount;
  const failureNotes = tests.flatMap(test => (test.failureNote ? [test.failureNote] : []));
  const hasMoreTests = revealedCount < TEST_CASES.length;

  const runMoreTests = () => setRevealedCount(count => Math.min(count + TESTS_PER_RUN, TEST_CASES.length));

  return (
    <DemoShell>
      <CodePanel accent={JEST_COLOR} className={TEST_PANEL}>
        <p className="mb-3 text-muted">{SUITE_OPEN}</p>
        {tests.map(test => <TestRow key={test.description} test={test} />)}
        {failureNotes.map(note => (
          <div key={note} className={FAILURE_NOTE}>
            <span className="text-muted">{"  ● "}</span>{note}
          </div>
        ))}
        <p className="mt-3 text-muted">{"}"}</p>
      </CodePanel>

      <div className="flex items-center justify-between px-1">
        <div className="flex gap-4 font-mono text-sm">
          <span className="text-success">{passingCount} passing</span>
          {failingCount > 0 && <span className="text-danger">{failingCount} failing</span>}
        </div>
        {hasMoreTests && <button type="button" onClick={runMoreTests} className={RUN_MORE_BUTTON}>run more tests</button>}
      </div>
    </DemoShell>
  );
}
