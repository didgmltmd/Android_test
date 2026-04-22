import type { ProgressState, Question, QuestionState } from "../types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

type Props = {
  questions: Question[];
  currentQuestion: Question;
  questionStates: Record<number, QuestionState>;
  progress: ProgressState;
  onSelectQuestion: (questionId: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onOpenApiKeyModal: () => void;
  onOpenResetModal: () => void;
};

export function AppHeader({
  questions,
  currentQuestion,
  questionStates,
  progress,
  onSelectQuestion,
  onPrev,
  onNext,
  onOpenApiKeyModal,
  onOpenResetModal,
}: Props) {
  const currentIndex = questions.findIndex(
    (question) => question.id === currentQuestion.id,
  );

  return (
    <div className="sticky top-0 z-30 bg-toss-bg/90 pb-0.5 pt-0.5 backdrop-blur">
      <Card className="space-y-1.5 px-4 py-2 md:px-5">
        <div className="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-[#3182F6]">
              Android Exam Companion
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[15px] font-semibold tracking-tight text-toss-text">
                안드로이드 시험 대비 학습 앱
              </h1>
              <Badge tone="blue">
                {currentIndex + 1} / {questions.length}
              </Badge>
            </div>
            <p className="text-[11px] text-toss-muted">
              문제 풀이, PDF 근거 확인, AI 첨삭을 한 흐름으로 정리했습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={onOpenApiKeyModal} className="px-3 py-2">
              API Key 설정
            </Button>
            <Button variant="danger" onClick={onOpenResetModal} className="px-3 py-2">
              전체 초기화
            </Button>
          </div>
        </div>

        <div className="grid gap-1.5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-toss-muted">
              <span>답안 작성 진행률</span>
              <span>{progress.completionRate}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#3182F6] transition-all duration-300"
                style={{ width: `${progress.completionRate}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onPrev} className="px-3 py-2">
              이전
            </Button>
            <Button variant="secondary" onClick={onNext} className="px-3 py-2">
              다음
            </Button>
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {questions.map((question) => {
            const state = questionStates[question.id];
            const hasAnswer = state?.answer.trim().length > 0;
            const hasFeedback = Boolean(state?.feedback);

            return (
              <button
                key={question.id}
                onClick={() => onSelectQuestion(question.id)}
                className={`relative min-h-[54px] min-w-[52px] rounded-[16px] px-2 py-1.5 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                  question.id === currentQuestion.id
                    ? "bg-[#3182F6] text-white shadow-sm"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="text-sm font-semibold leading-none tracking-tight">
                  Q{question.id}
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      hasAnswer
                        ? question.id === currentQuestion.id
                          ? "bg-emerald-300"
                          : "bg-emerald-500"
                        : question.id === currentQuestion.id
                          ? "bg-white/30"
                          : "bg-gray-300"
                    }`}
                  />
                  <span
                    className={`h-2 w-2 rounded-full ${
                      hasFeedback
                        ? question.id === currentQuestion.id
                          ? "bg-amber-200"
                          : "bg-amber-400"
                        : question.id === currentQuestion.id
                          ? "bg-white/20"
                          : "bg-gray-200"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
