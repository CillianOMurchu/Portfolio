import { useState } from "react";
import CodePanel from "../components/CodePanel";
import DemoShell from "../components/DemoShell";
import { FIELDS, PASSABLE_SCORE, VERDICT_MESSAGE, type TypeField, type Verdict } from "./constants";
import {
  CHECK_BUTTON, FIELD_ROW, KEYWORD, PROPERTY_KEY, RESET_LINK, RESULT_MARK, SCORE, SELECT_TONE, TYPE_SELECT,
  TYPESCRIPT_COLOR, VALUE_HINT, VERDICT_TONE,
} from "./styles";

type Answers = Record<string, string>;

function verdictFor(score: number): Verdict {
  if (score === FIELDS.length) return "perfect";
  return score >= PASSABLE_SCORE ? "close" : "poor";
}

interface FieldRowProps {
  field: TypeField;
  answer: string;
  isChecked: boolean;
  choose: (type: string) => void;
}

function FieldRow({ field, answer, isChecked, choose }: FieldRowProps) {
  const isCorrect = answer === field.correctType;
  const result = isCorrect ? "correct" : "wrong";
  const selectTone = isChecked ? SELECT_TONE[result] : SELECT_TONE.pending;
  const resultMark = isCorrect ? "✓" : `✗ (${field.correctType})`;

  return (
    <div className={FIELD_ROW}>
      <span className={PROPERTY_KEY}>{field.key}</span>
      <span className="text-muted">:</span>
      <select disabled={isChecked} value={answer} onChange={(e) => choose(e.target.value)} className={`${TYPE_SELECT} ${selectTone}`}>
        <option value="">pick type</option>
        {field.options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
      <span className="text-muted">{"// "}</span>
      <span className={VALUE_HINT}>{field.value}</span>
      {isChecked && <span className={RESULT_MARK[result]}>{resultMark}</span>}
    </div>
  );
}

export default function TypeScriptDemo() {
  const [answers, setAnswers] = useState<Answers>({});
  const [isChecked, setIsChecked] = useState(false);

  const isComplete = FIELDS.every(field => answers[field.key]);
  const score = FIELDS.filter(field => answers[field.key] === field.correctType).length;
  const verdict = verdictFor(score);

  const chooseType = (key: string, type: string) => setAnswers(current => ({ ...current, [key]: type }));
  const resetDemo = () => {
    setAnswers({});
    setIsChecked(false);
  };

  return (
    <DemoShell>
      <p className="text-center text-sm text-muted">Fill in the correct TypeScript types for Cillian's profile object</p>

      <CodePanel accent={TYPESCRIPT_COLOR}>
        <div className={`mb-1 ${KEYWORD}`}>const cillian: &#123;</div>
        {FIELDS.map(field => (
          <FieldRow key={field.key} field={field} answer={answers[field.key] ?? ""} isChecked={isChecked} choose={(type) => chooseType(field.key, type)} />
        ))}
        <div className={KEYWORD}>&#125; = cillian</div>
      </CodePanel>

      {isChecked ? (
        <div className="text-center">
          <p className={`${SCORE} ${VERDICT_TONE[verdict]}`}>{score}/{FIELDS.length} correct</p>
          <p className="mt-1 text-sm text-muted">{VERDICT_MESSAGE[verdict]}</p>
          <button type="button" onClick={resetDemo} className={RESET_LINK}>reset</button>
        </div>
      ) : (
        <button type="button" disabled={!isComplete} onClick={() => setIsChecked(true)} className={CHECK_BUTTON}>tsc --check</button>
      )}
    </DemoShell>
  );
}
