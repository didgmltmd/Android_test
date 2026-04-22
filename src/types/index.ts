export type QuestionType = "short-answer" | "essay" | "concept-check" | "code";

export type Question = {
  id: number;
  title: string;
  type: QuestionType;
  question: string;
  expectedKeywords: string[];
  relatedPdf: string;
  relatedWeek: number;
  relatedPages: number[];
  relatedTopics: string[];
  hint?: string;
  modelAnswerSummary?: string;
};

export type Feedback = {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  improvements: string[];
  rewrittenAnswer: string;
  raw?: string;
};

export type QuestionState = {
  answer: string;
  feedback?: Feedback;
  isFeedbackHidden: boolean;
  isHintOpen: boolean;
  isModelAnswerVisible: boolean;
  lastSavedAt?: string;
  lastEvaluatedAt?: string;
};

export type PdfMeta = {
  label: string;
  topics: string[];
};

export type ProgressState = {
  answeredCount: number;
  evaluatedCount: number;
  completionRate: number;
};

export type PersistedAppState = {
  apiKey: string;
  currentQuestionId: number;
  answersByQuestionId: Record<number, string>;
  feedbackByQuestionId: Record<number, Feedback | undefined>;
  feedbackVisibilityByQuestionId: Record<number, boolean>;
  uiStateByQuestionId: Record<
    number,
    Pick<QuestionState, "isHintOpen" | "isModelAnswerVisible">
  >;
  selectedPdf: string;
  pdfPageByQuestionId: Record<number, number>;
  lastSavedAt: string;
  progressState: ProgressState;
  lastEvaluatedAtByQuestionId: Record<number, string | undefined>;
};
