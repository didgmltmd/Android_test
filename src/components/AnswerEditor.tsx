import type { QuestionState } from "../types";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

type Props = {
  questionState: QuestionState;
  onChangeAnswer: (value: string) => void;
  onClearAnswer: () => void;
  onToggleHint: () => void;
  onEvaluate: () => void;
  isEvaluating: boolean;
  hint?: string;
};

const PANEL_HEIGHT = "h-[56vh] min-h-[20rem] max-h-[72vh]";

export function AnswerEditor({
  questionState,
  onChangeAnswer,
  onClearAnswer,
  onToggleHint,
  onEvaluate,
  isEvaluating,
  hint,
}: Props) {
  return (
    <Card className={`flex flex-col gap-3 p-4 ${PANEL_HEIGHT}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-toss-text">답안 작성</h3>
          <p className="mt-1 text-sm text-toss-muted">
            입력 즉시 자동 저장됩니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onToggleHint}>
            {questionState.isHintOpen ? "힌트 숨기기" : "힌트 보기"}
          </Button>
        </div>
      </div>

      {questionState.isHintOpen && hint ? (
        <div className="rounded-2xl bg-[#F8FAFC] px-4 py-3 text-sm leading-relaxed text-toss-muted">
          {hint}
        </div>
      ) : null}

      <textarea
        value={questionState.answer}
        onChange={(event) => onChangeAnswer(event.target.value)}
        placeholder="시험장에서 적을 답안을 기준으로 핵심 개념 위주로 작성해 보세요."
        className="min-h-0 flex-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm leading-relaxed text-toss-text outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-200 focus:ring-2 focus:ring-[#3182F6]"
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={onClearAnswer}>
          답안 지우기
        </Button>
        <Button onClick={onEvaluate} disabled={isEvaluating}>
          {isEvaluating ? "채점 중..." : "AI에게 채점받기"}
        </Button>
      </div>
    </Card>
  );
}
