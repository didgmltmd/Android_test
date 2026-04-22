import { useMemo, useState } from "react";
import { Document, Page } from "react-pdf";
import type { Question } from "../types";
import { pdfMetaMap } from "../data/pdfMeta";
import { getPdfUrl } from "../lib/pdf";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Modal } from "./ui/Modal";

type Props = {
  open: boolean;
  isMobile: boolean;
  selectedPdf: string;
  currentPage: number;
  question: Question;
  onClose: () => void;
  onPageChange: (page: number) => void;
};

export function PdfViewerPanel({
  open,
  isMobile,
  selectedPdf,
  currentPage,
  question,
  onClose,
  onPageChange,
}: Props) {
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.05);
  const [error, setError] = useState<string | null>(null);

  const pdfMeta = useMemo(() => pdfMetaMap[selectedPdf], [selectedPdf]);

  return (
    <Modal
      open={open}
      title="관련 PDF 보기"
      description="현재 문제의 근거 페이지를 크게 열어 확인할 수 있습니다."
      onClose={onClose}
      panelClassName="max-w-[96vw] md:max-w-[92vw] lg:max-w-6xl"
    >
      <Card className="flex max-h-[78vh] flex-col space-y-4 overflow-hidden p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-toss-text">
              {pdfMeta?.label ?? selectedPdf}
            </p>
            <p className="mt-1 text-sm text-toss-muted">
              현재 페이지 {currentPage}
              {numPages ? ` / ${numPages}` : ""}
            </p>
          </div>
          {isMobile ? (
            <Button variant="secondary" onClick={onClose}>
              닫기
            </Button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          >
            이전 페이지
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              onPageChange(numPages ? Math.min(numPages, currentPage + 1) : currentPage + 1)
            }
          >
            다음 페이지
          </Button>
          <Button
            variant="secondary"
            onClick={() => setScale((prev) => Math.max(0.8, Number((prev - 0.1).toFixed(1))))}
          >
            축소
          </Button>
          <Button
            variant="secondary"
            onClick={() => setScale((prev) => Math.min(1.8, Number((prev + 0.1).toFixed(1))))}
          >
            확대
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-toss-muted">
            관련 페이지 바로가기
          </p>
          <div className="flex flex-wrap gap-2">
            {question.relatedPages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  currentPage === page
                    ? "bg-[#3182F6] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                p.{page}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {question.relatedTopics.map((topic) => (
            <Badge key={topic} tone="blue">
              {topic}
            </Badge>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-auto rounded-2xl bg-gray-50 p-3">
          {error ? (
            <div className="rounded-2xl bg-red-50 px-4 py-5 text-sm text-red-700">
              PDF 로딩 실패: {error}
            </div>
          ) : (
            <div className="flex min-h-full justify-center">
              <Document
                file={getPdfUrl(selectedPdf)}
                onLoadSuccess={({ numPages: loadedPages }) => {
                  setError(null);
                  setNumPages(loadedPages);
                  if (currentPage > loadedPages) {
                    onPageChange(loadedPages);
                  }
                }}
                onLoadError={(loadError) => {
                  setError(loadError.message);
                }}
                loading={<div className="p-6 text-sm text-toss-muted">PDF 불러오는 중...</div>}
                className="space-y-4"
              >
                <Page
                  className="pdf-page overflow-hidden rounded-2xl bg-white shadow-sm"
                  pageNumber={currentPage}
                  scale={scale}
                  renderAnnotationLayer
                  renderTextLayer
                />
              </Document>
            </div>
          )}
        </div>
      </Card>
    </Modal>
  );
}
