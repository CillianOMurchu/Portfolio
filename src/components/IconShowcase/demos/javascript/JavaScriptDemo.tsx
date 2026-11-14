import { useState } from "react";
import CodePanel from "../components/CodePanel";
import DemoShell from "../components/DemoShell";
import { GOOD_SCORE, GREAT_SCORE, QUESTIONS, RESULT_MESSAGE, type Question } from "./constants";
import {
  ACCENT_BUTTON, ACCENT_TEXT, EXPLANATION, FINAL_SCORE, FINAL_SCORE_TONE, JAVASCRIPT_COLOR, OPTION_TONE,
  PROMPT_PANEL, type OptionTone,
} from "./styles";

function resultMessage(score: number) {
  if (score === QUESTIONS.length) return RESULT_MESSAGE.perfect;
  return score >= GOOD_SCORE ? RESULT_MESSAGE.good : RESULT_MESSAGE.poor;
}

function optionTone(option: string, question: Question, selected: string | null): OptionTone {
  if (!selected) return "open";
  if (option === question.answer) return "correct";
  return option === selected ? "wrong" : "idle";
}

function QuizResult({ score, restart }: { score: number; restart: () => void }) {
  const scoreTone = score >= GREAT_SCORE ? FINAL_SCORE_TONE.great : FINAL_SCORE_TONE.okay;
  return (
    <DemoShell className="items-center py-6">
      <p className={`${FINAL_SCORE} ${scoreTone}`}>{score}/{QUESTIONS.length}</p>
      <p className="text-sm text-muted">{resultMessage(score)}</p>
      <button type="button" onClick={restart} className={`${ACCENT_BUTTON} px-4`}>Try again</button>
    </DemoShell>
  );
}

export default function JavaScriptDemo() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const restart = () => {
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
  };

  if (questionIndex >= QUESTIONS.length) return <QuizResult score={score} restart={restart} />;

  const question = QUESTIONS[questionIndex];
  const isCorrect = selected === question.answer;
  const isLastQuestion = questionIndex + 1 === QUESTIONS.length;

  const pickOption = (option: string) => {
    setSelected(option);
    if (option === question.answer) setScore(current => current + 1);
  };

  const nextQuestion = () => {
    setQuestionIndex(current => current + 1);
    setSelected(null);
  };

  return (
    <DemoShell>
      <div className="flex justify-between text-sm text-muted">
        <span>Question {questionIndex + 1} / {QUESTIONS.length}</span>
        <span className={ACCENT_TEXT}>Score: {score}</span>
      </div>

      <CodePanel accent={JAVASCRIPT_COLOR} className={PROMPT_PANEL}>
        <span className="text-muted">{"> "}</span>
        <span className={ACCENT_TEXT}>{question.code}</span>
      </CodePanel>

      <div className="grid grid-cols-2 gap-2">
        {question.options.map(option => (
          <button key={option} type="button" disabled={selected !== null} onClick={() => pickOption(option)} className={OPTION_TONE[optionTone(option, question, selected)]}>
            {option}
          </button>
        ))}
      </div>

      {selected && (
        <>
          <div className={EXPLANATION}>{isCorrect ? "✓ Correct. " : "✗ Wrong. "}{question.explanation}</div>
          <button type="button" onClick={nextQuestion} className={ACCENT_BUTTON}>{isLastQuestion ? "See results" : "Next →"}</button>
        </>
      )}
    </DemoShell>
  );
}
