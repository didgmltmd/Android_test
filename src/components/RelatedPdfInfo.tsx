import type { Question } from "../types";
import { pdfMetaMap } from "../data/pdfMeta";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

type Props = {
  question: Question;
  currentPdfPage: number;
  canOpenPdf: boolean;
  onOpenPdf: () => void;
  onJumpToPage: (page: number) => void;
  showKeywords: boolean;
};

export function RelatedPdfInfo({
  question,
  currentPdfPage,
  canOpenPdf,
  onOpenPdf,
  onJumpToPage,
  showKeywords,
}: Props) {
  const pdfMeta = pdfMetaMap[question.relatedPdf];

  return (
    <Card className="space-y-4 bg-[#F8FAFC]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-toss-text">관련 학습 근거</p>
          <p className="mt-1 text-sm text-toss-muted">
            {question.relatedWeek}주차 / {pdfMeta?.label ?? question.relatedPdf}
          </p>
        </div>
        <Button variant="secondary" onClick={onOpenPdf} disabled={!canOpenPdf}>
          관련 PDF 보기
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-toss-muted">
            파일
          </p>
          <p className="mt-2 text-sm text-toss-text">{question.relatedPdf}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-toss-muted">
            관련 페이지
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {question.relatedPages.map((page) => (
              <button
                key={page}
                onClick={() => onJumpToPage(page)}
                disabled={!canOpenPdf}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  currentPdfPage === page
                    ? "bg-[#3182F6] text-white"
                    : "bg-white text-gray-700"
                } ${!canOpenPdf ? "cursor-not-allowed opacity-50" : ""}`}
              >
                p.{page}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-toss-muted">
            핵심 개념
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {question.relatedTopics.map((topic) => (
              <Badge key={topic} tone="blue">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {showKeywords ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-toss-muted">
            힌트 기반 핵심 키워드
          </p>
          <div className="flex flex-wrap gap-2">
            {question.expectedKeywords.map((keyword) => (
              <Badge key={keyword} tone="blue">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {!canOpenPdf ? (
        <p className="text-sm text-toss-muted">
          답안을 제출한 뒤 PDF를 열어 근거 페이지를 확인할 수 있습니다.
        </p>
      ) : null}
    </Card>
  );
}
