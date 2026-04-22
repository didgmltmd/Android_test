import type { QuestionState } from "../types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

type Props = {
  questionTitle: string;
  relatedPdf: string;
  relatedWeek: number;
  relatedPages: number[];
  relatedTopics: string[];
  canOpenPdf: boolean;
  currentPdfPage: number;
  questionState: QuestionState;
  onToggleHidden: () => void;
  onOpenPdf: () => void;
  onJumpToPdfPage: (page: number) => void;
};

export function FeedbackPanel({
  questionTitle,
  relatedPdf,
  relatedWeek,
  relatedPages,
  relatedTopics,
  canOpenPdf,
  currentPdfPage,
  questionState,
  onToggleHidden,
  onOpenPdf,
  onJumpToPdfPage,
}: Props) {
  const feedback = questionState.feedback;

  return (
    <Card className="flex h-full max-h-[calc(100vh-12.5rem)] flex-col overflow-hidden bg-[#F8FAFC]">
      {!feedback ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-white px-6 text-center text-sm leading-relaxed text-toss-muted">
          아직 채점되지 않았습니다. 답안을 제출하면 점수, 총평, 보완점, 누락 개념, 재작성 답안을 저장합니다.
        </div>
      ) : (
        <>
          <div className="space-y-5 border-b border-gray-100 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-toss-text">AI 피드백</p>
                <p className="text-sm text-toss-text">{questionTitle}</p>
                <p className="text-sm text-toss-muted">
                  {questionState.lastEvaluatedAt
                    ? `마지막 채점 ${new Date(questionState.lastEvaluatedAt).toLocaleString("ko-KR")}`
                    : "채점 시간 기록 없음"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100">
                  <p className="text-xs uppercase tracking-wide text-toss-muted">Score</p>
                  <p className="text-2xl font-semibold text-[#3182F6]">{feedback.score}</p>
                </div>
                <Button variant="secondary" onClick={onOpenPdf} disabled={!canOpenPdf}>
                  관련 PDF 보기
                </Button>
                <Button variant="secondary" onClick={onToggleHidden}>
                  {questionState.isFeedbackHidden ? "피드백 보기" : "피드백 가리기"}
                </Button>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-toss-text">
                  {relatedWeek}주차 / {relatedPdf}
                </p>
                <div className="flex flex-wrap gap-2">
                  {relatedPages.map((page) => (
                    <button
                      key={page}
                      onClick={() => onJumpToPdfPage(page)}
                      disabled={!canOpenPdf}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        currentPdfPage === page
                          ? "bg-[#3182F6] text-white"
                          : "bg-gray-100 text-gray-700"
                      } ${!canOpenPdf ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      p.{page}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {relatedTopics.map((topic) => (
                    <Badge key={topic} tone="blue">
                      {topic}
                    </Badge>
                  ))}
                </div>
                {!canOpenPdf ? (
                  <p className="text-sm text-toss-muted">
                    답안을 제출한 뒤 PDF를 열어 근거 페이지를 확인할 수 있습니다.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pt-5">
            {questionState.isFeedbackHidden ? (
              <div className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-toss-muted">
                피드백을 가려 둔 상태입니다. 다시 답안을 써 본 뒤 필요할 때 열어 보세요.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <Section title="총평" items={[feedback.summary]} tone="blue" isParagraph />
                <Section title="잘한 점" items={feedback.strengths} tone="green" />
                <Section title="부족한 점" items={feedback.weaknesses} tone="red" />
                <Section
                  title="핵심 누락 개념"
                  items={feedback.missingKeywords}
                  tone="amber"
                />
                <Section title="보완점" items={feedback.improvements} tone="blue" />
                <Section
                  title="재작성 답안"
                  items={[feedback.rewrittenAnswer]}
                  tone="gray"
                  isParagraph
                />
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

type SectionProps = {
  title: string;
  items: string[];
  tone: "blue" | "gray" | "green" | "amber" | "red";
  isParagraph?: boolean;
};

function Section({ title, items, tone, isParagraph = false }: SectionProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="mb-3 flex items-center gap-2">
        <Badge tone={tone}>{title}</Badge>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-toss-muted">별도 내용 없음</p>
      ) : isParagraph ? (
        <p className="text-sm leading-relaxed text-toss-text">{items[0]}</p>
      ) : (
        <ul className="space-y-2 text-sm leading-relaxed text-toss-text">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-gray-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
