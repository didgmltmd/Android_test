import { useEffect, useMemo, useState } from "react";
import { ApiKeyBanner } from "./components/ApiKeyBanner";
import { ApiKeySettingsModal } from "./components/ApiKeySettingsModal";
import { AppHeader } from "./components/AppHeader";
import { AnswerEditor } from "./components/AnswerEditor";
import { ConfirmResetModal } from "./components/ConfirmResetModal";
import { FeedbackPanel } from "./components/FeedbackPanel";
import { PdfViewerPanel } from "./components/PdfViewerPanel";
import { QuestionCarousel } from "./components/QuestionCarousel";
import { questions } from "./data/questions";
import "./lib/pdf";
import { gradeAnswer, sanitizeApiKey } from "./lib/openai";
import { useMediaQuery } from "./hooks/useMediaQuery";
import type { PersistedAppState, QuestionState } from "./types";
import {
  buildInitialQuestionStates,
  calculateProgress,
  clearPersistedState,
  loadPersistedState,
  persistAppState,
} from "./utils/storage";

function App() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>(
    () => buildInitialQuestionStates(questions),
  );
  const [apiKey, setApiKey] = useState("");
  const [currentQuestionId, setCurrentQuestionId] = useState(questions[0].id);
  const [selectedPdf, setSelectedPdf] = useState(questions[0].relatedPdf);
  const [pdfPageByQuestionId, setPdfPageByQuestionId] = useState<Record<number, number>>(
    () =>
      questions.reduce<Record<number, number>>((acc, question) => {
        acc[question.id] = question.relatedPages[0];
        return acc;
      }, {}),
  );
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

  const isMobile = useMediaQuery("(max-width: 1023px)");

  useEffect(() => {
    const persisted = loadPersistedState(questions);

    if (persisted) {
      const initialStates = buildInitialQuestionStates(questions);
      const mergedStates = questions.reduce<Record<number, QuestionState>>((acc, question) => {
        acc[question.id] = {
          ...initialStates[question.id],
          answer: persisted.answersByQuestionId[question.id] ?? "",
          feedback: persisted.feedbackByQuestionId[question.id],
          isFeedbackHidden:
            persisted.feedbackVisibilityByQuestionId[question.id] ??
            initialStates[question.id].isFeedbackHidden,
          isHintOpen:
            persisted.uiStateByQuestionId[question.id]?.isHintOpen ??
            initialStates[question.id].isHintOpen,
          isModelAnswerVisible: false,
          lastSavedAt: initialStates[question.id].lastSavedAt,
          lastEvaluatedAt:
            persisted.lastEvaluatedAtByQuestionId[question.id] ??
            initialStates[question.id].lastEvaluatedAt,
        };
        return acc;
      }, {});

      setQuestionStates(mergedStates);
      setApiKey(persisted.apiKey);
      setCurrentQuestionId(persisted.currentQuestionId);
      setSelectedPdf(persisted.selectedPdf || questions[0].relatedPdf);
      setPdfPageByQuestionId((prev) => ({ ...prev, ...persisted.pdfPageByQuestionId }));
    }

    setHasHydrated(true);
  }, []);

  const currentIndex = useMemo(() => {
    const index = questions.findIndex((question) => question.id === currentQuestionId);
    return index >= 0 ? index : 0;
  }, [currentQuestionId]);

  const currentQuestion = questions[currentIndex];
  const currentQuestionState = questionStates[currentQuestion.id];
  const currentPdfPage =
    pdfPageByQuestionId[currentQuestion.id] ?? currentQuestion.relatedPages[0];
  const progress = useMemo(
    () => calculateProgress(questions, questionStates),
    [questionStates],
  );

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const persisted: PersistedAppState = {
      apiKey,
      currentQuestionId,
      answersByQuestionId: mapValues(questionStates, (state) => state.answer),
      feedbackByQuestionId: mapValues(questionStates, (state) => state.feedback),
      feedbackVisibilityByQuestionId: mapValues(
        questionStates,
        (state) => state.isFeedbackHidden,
      ),
      uiStateByQuestionId: mapValues(questionStates, (state) => ({
        isHintOpen: state.isHintOpen,
        isModelAnswerVisible: false,
      })),
      selectedPdf,
      pdfPageByQuestionId,
      lastSavedAt: "",
      progressState: progress,
      lastEvaluatedAtByQuestionId: mapValues(
        questionStates,
        (state) => state.lastEvaluatedAt,
      ),
    };

    try {
      persistAppState(persisted);
      setStorageError(null);
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "알 수 없는 저장 오류");
    }
  }, [
    apiKey,
    currentQuestionId,
    hasHydrated,
    pdfPageByQuestionId,
    progress,
    questionStates,
    selectedPdf,
  ]);

  useEffect(() => {
    setSelectedPdf(currentQuestion.relatedPdf);
  }, [currentQuestion.relatedPdf]);

  const updateQuestionState = (
    questionId: number,
    updater: (prev: QuestionState) => QuestionState,
  ) => {
    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: updater(prev[questionId]),
    }));
  };

  const moveToQuestion = (nextId: number) => {
    const nextQuestion = questions.find((question) => question.id === nextId);
    if (!nextQuestion) {
      return;
    }

    setCurrentQuestionId(nextId);
    setSelectedPdf(nextQuestion.relatedPdf);
    setPdfPageByQuestionId((prev) => ({
      ...prev,
      [nextId]: prev[nextId] ?? nextQuestion.relatedPages[0],
    }));
  };

  const handlePrev = () => {
    const previous = questions[(currentIndex - 1 + questions.length) % questions.length];
    moveToQuestion(previous.id);
  };

  const handleNext = () => {
    const next = questions[(currentIndex + 1) % questions.length];
    moveToQuestion(next.id);
  };

  const handleAnswerChange = (value: string) => {
    updateQuestionState(currentQuestion.id, (prev) => ({
      ...prev,
      answer: value,
      lastSavedAt: new Date().toISOString(),
    }));
  };

  const handleClearAnswer = () => {
    if (!currentQuestionState.answer.trim()) {
      return;
    }

    const confirmed = window.confirm("현재 문제의 답안을 지우시겠습니까?");
    if (!confirmed) {
      return;
    }

    updateQuestionState(currentQuestion.id, (prev) => ({
      ...prev,
      answer: "",
      lastSavedAt: new Date().toISOString(),
    }));
  };

  const handleJumpToPdfPage = (page: number) => {
    if (page < 1) {
      setRequestError("잘못된 페이지 번호 요청입니다.");
      return;
    }

    setRequestError(null);
    setSelectedPdf(currentQuestion.relatedPdf);
    setPdfPageByQuestionId((prev) => ({
      ...prev,
      [currentQuestion.id]: page,
    }));
    setIsPdfOpen(true);
  };

  const handleSaveApiKey = (value: string) => {
    const sanitizedValue = sanitizeApiKey(value);
    setApiKey(sanitizedValue);

    try {
      window.localStorage.setItem("apiKey", sanitizedValue);
      setStorageError(null);
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "API Key 저장에 실패했습니다.");
    }
  };

  const handleEvaluate = async () => {
    if (!apiKey.trim()) {
      setRequestError("OpenAI API Key가 없습니다. 먼저 설정해 주세요.");
      setIsApiKeyModalOpen(true);
      return;
    }

    if (!currentQuestionState.answer.trim()) {
      setRequestError("빈 답안은 채점할 수 없습니다.");
      return;
    }

    setRequestError(null);
    setIsEvaluating(true);

    try {
      const feedback = await gradeAnswer({
        apiKey,
        question: currentQuestion,
        answer: currentQuestionState.answer,
      });

      updateQuestionState(currentQuestion.id, (prev) => ({
        ...prev,
        feedback,
        isFeedbackHidden: false,
        lastEvaluatedAt: new Date().toISOString(),
        lastSavedAt: new Date().toISOString(),
      }));
    } catch (error) {
      const message =
        error instanceof SyntaxError
          ? "AI 응답 JSON 파싱에 실패했습니다. 다시 시도해 주세요."
          : error instanceof Error
            ? error.message
            : "채점 중 오류가 발생했습니다.";
      setRequestError(message);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    clearPersistedState();
    setApiKey("");
    setCurrentQuestionId(questions[0].id);
    setSelectedPdf(questions[0].relatedPdf);
    setPdfPageByQuestionId(
      questions.reduce<Record<number, number>>((acc, question) => {
        acc[question.id] = question.relatedPages[0];
        return acc;
      }, {}),
    );
    setQuestionStates(buildInitialQuestionStates(questions));
    setRequestError(null);
    setStorageError(null);
  };

  return (
    <div className="min-h-screen bg-toss-bg text-toss-text">
      <div className="mx-auto box-border flex w-full max-w-screen-6xl flex-col gap-4 px-4 py-3 md:px-6">
        <AppHeader
          questions={questions}
          currentQuestion={currentQuestion}
          questionStates={questionStates}
          progress={progress}
          onSelectQuestion={moveToQuestion}
          onPrev={handlePrev}
          onNext={handleNext}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          onOpenResetModal={() => setIsResetModalOpen(true)}
        />

        <ApiKeyBanner />

        {requestError ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {requestError}
          </div>
        ) : null}

        {storageError ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            localStorage 저장 오류: {storageError}
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
          <div className="space-y-5">
            <QuestionCarousel
              questions={questions}
              currentIndex={currentIndex}
              questionStates={questionStates}
            />

            <AnswerEditor
              questionState={currentQuestionState}
              onChangeAnswer={handleAnswerChange}
              onClearAnswer={handleClearAnswer}
              onToggleHint={() =>
                updateQuestionState(currentQuestion.id, (prev) => ({
                  ...prev,
                  isHintOpen: !prev.isHintOpen,
                }))
              }
              onEvaluate={handleEvaluate}
              isEvaluating={isEvaluating}
              hint={currentQuestion.hint}
            />
          </div>

          <div>
            <FeedbackPanel
              questionTitle={currentQuestion.title}
              relatedPdf={currentQuestion.relatedPdf}
              relatedWeek={currentQuestion.relatedWeek}
              relatedPages={currentQuestion.relatedPages}
              relatedTopics={[
                ...currentQuestion.relatedTopics,
                ...(currentQuestionState.isHintOpen ? currentQuestion.expectedKeywords : []),
              ]}
              canOpenPdf={Boolean(currentQuestionState.feedback)}
              currentPdfPage={currentPdfPage}
              questionState={currentQuestionState}
              onToggleHidden={() =>
                updateQuestionState(currentQuestion.id, (prev) => ({
                  ...prev,
                  isFeedbackHidden: !prev.isFeedbackHidden,
                }))
              }
              onOpenPdf={() => setIsPdfOpen(true)}
              onJumpToPdfPage={handleJumpToPdfPage}
            />
          </div>
        </div>
      </div>

      <PdfViewerPanel
        open={isPdfOpen}
        isMobile={isMobile}
        selectedPdf={selectedPdf}
        currentPage={currentPdfPage}
        question={currentQuestion}
        onClose={() => setIsPdfOpen(false)}
        onPageChange={(page) =>
          setPdfPageByQuestionId((prev) => ({
            ...prev,
            [currentQuestion.id]: page,
          }))
        }
      />

      <ApiKeySettingsModal
        open={isApiKeyModalOpen}
        initialValue={apiKey}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiKey}
      />

      <ConfirmResetModal
        open={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleReset}
      />
    </div>
  );
}

function mapValues<TValue, TResult>(
  record: Record<number, TValue>,
  mapper: (value: TValue) => TResult,
) {
  return Object.entries(record).reduce<Record<number, TResult>>((acc, [key, value]) => {
    acc[Number(key)] = mapper(value);
    return acc;
  }, {});
}

export default App;
