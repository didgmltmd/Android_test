import type { Question, QuestionState } from "../types";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";

type Props = {
  index: number;
  total: number;
  question: Question;
  questionState: QuestionState;
};

export function QuestionCard({ question, questionState }: Props) {
  return (
    <Card className="flex h-full min-h-0 flex-col gap-2 overflow-hidden p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {questionState.answer ? <Badge tone="green">작성됨</Badge> : null}
            {questionState.feedback ? <Badge tone="amber">채점 완료</Badge> : null}
            {questionState.lastSavedAt ? <Badge tone="gray">저장됨</Badge> : null}
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-toss-text">
            {question.title}
          </h2>
        </div>
      </div>

      <div className="rounded-[20px] bg-[#F8FAFC] px-5 py-3">
        <p className="text-base leading-relaxed text-toss-text">{question.question}</p>
      </div>
    </Card>
  );
}
