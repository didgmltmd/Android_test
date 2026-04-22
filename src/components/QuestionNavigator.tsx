import type { Question, QuestionState } from "../types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

type Props = {
  currentIndex: number;
  questions: Question[];
  questionStates: Record<number, QuestionState>;
  onPrev: () => void;
  onNext: () => void;
};

export function QuestionNavigator({
  currentIndex,
  questions,
  questionStates,
  onPrev,
  onNext,
}: Props) {
  const current = questions[currentIndex];
  const state = questionStates[current.id];

  return (
    <Card className="flex items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge tone="blue">
            {currentIndex + 1} / {questions.length}
          </Badge>
          {state.answer ? <Badge tone="green">작성됨</Badge> : null}
          {state.feedback ? <Badge tone="amber">채점 완료</Badge> : null}
        </div>
        <h2 className="text-lg font-semibold text-toss-text">{current.title}</h2>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onPrev}>
          이전 카드
        </Button>
        <Button variant="secondary" onClick={onNext}>
          다음 카드
        </Button>
      </div>
    </Card>
  );
}
