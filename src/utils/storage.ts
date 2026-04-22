import type {
  PersistedAppState,
  ProgressState,
  Question,
  QuestionState,
} from "../types";

const storageKeys = {
  apiKey: "apiKey",
  currentQuestionId: "currentQuestionId",
  answersByQuestionId: "answersByQuestionId",
  feedbackByQuestionId: "feedbackByQuestionId",
  feedbackVisibilityByQuestionId: "feedbackVisibilityByQuestionId",
  selectedPdf: "selectedPdf",
  pdfPageByQuestionId: "pdfPageByQuestionId",
  lastSavedAt: "lastSavedAt",
  progressState: "progressState",
  uiStateByQuestionId: "uiStateByQuestionId",
  lastEvaluatedAtByQuestionId: "lastEvaluatedAtByQuestionId",
} as const;

export function buildInitialQuestionState(): QuestionState {
  return {
    answer: "",
    isFeedbackHidden: false,
    isHintOpen: false,
    isModelAnswerVisible: false,
  };
}

export function buildInitialQuestionStates(questions: Question[]) {
  return questions.reduce<Record<number, QuestionState>>((acc, question) => {
    acc[question.id] = buildInitialQuestionState();
    return acc;
  }, {});
}

export function calculateProgress(
  questions: Question[],
  questionStates: Record<number, QuestionState>,
): ProgressState {
  const answeredCount = questions.filter(
    (question) => questionStates[question.id]?.answer.trim().length > 0,
  ).length;
  const evaluatedCount = questions.filter(
    (question) => !!questionStates[question.id]?.feedback,
  ).length;

  return {
    answeredCount,
    evaluatedCount,
    completionRate: Math.round((answeredCount / questions.length) * 100),
  };
}

export function loadPersistedState(
  questions: Question[],
): PersistedAppState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const answersByQuestionId = parseJson<Record<number, string>>(
      localStorage.getItem(storageKeys.answersByQuestionId),
      {},
    );
    const feedbackByQuestionId = parseJson<
      PersistedAppState["feedbackByQuestionId"]
    >(localStorage.getItem(storageKeys.feedbackByQuestionId), {});
    const feedbackVisibilityByQuestionId = parseJson<Record<number, boolean>>(
      localStorage.getItem(storageKeys.feedbackVisibilityByQuestionId),
      {},
    );
    const uiStateByQuestionId = parseJson<PersistedAppState["uiStateByQuestionId"]>(
      localStorage.getItem(storageKeys.uiStateByQuestionId),
      {},
    );
    const pdfPageByQuestionId = parseJson<Record<number, number>>(
      localStorage.getItem(storageKeys.pdfPageByQuestionId),
      {},
    );
    const progressState = parseJson<ProgressState>(
      localStorage.getItem(storageKeys.progressState),
      {
        answeredCount: 0,
        evaluatedCount: 0,
        completionRate: 0,
      },
    );
    const lastEvaluatedAtByQuestionId = parseJson<
      Record<number, string | undefined>
    >(localStorage.getItem(storageKeys.lastEvaluatedAtByQuestionId), {});

    return {
      apiKey: localStorage.getItem(storageKeys.apiKey) ?? "",
      currentQuestionId:
        Number(localStorage.getItem(storageKeys.currentQuestionId)) ||
        questions[0]?.id ||
        1,
      answersByQuestionId,
      feedbackByQuestionId,
      feedbackVisibilityByQuestionId,
      uiStateByQuestionId,
      selectedPdf: localStorage.getItem(storageKeys.selectedPdf) ?? questions[0]?.relatedPdf ?? "",
      pdfPageByQuestionId,
      lastSavedAt: localStorage.getItem(storageKeys.lastSavedAt) ?? "",
      progressState,
      lastEvaluatedAtByQuestionId,
    };
  } catch {
    return null;
  }
}

export function persistAppState(state: PersistedAppState) {
  localStorage.setItem(storageKeys.apiKey, state.apiKey);
  localStorage.setItem(
    storageKeys.currentQuestionId,
    String(state.currentQuestionId),
  );
  localStorage.setItem(
    storageKeys.answersByQuestionId,
    JSON.stringify(state.answersByQuestionId),
  );
  localStorage.setItem(
    storageKeys.feedbackByQuestionId,
    JSON.stringify(state.feedbackByQuestionId),
  );
  localStorage.setItem(
    storageKeys.feedbackVisibilityByQuestionId,
    JSON.stringify(state.feedbackVisibilityByQuestionId),
  );
  localStorage.setItem(storageKeys.selectedPdf, state.selectedPdf);
  localStorage.setItem(
    storageKeys.pdfPageByQuestionId,
    JSON.stringify(state.pdfPageByQuestionId),
  );
  localStorage.setItem(storageKeys.lastSavedAt, state.lastSavedAt);
  localStorage.setItem(
    storageKeys.progressState,
    JSON.stringify(state.progressState),
  );
  localStorage.setItem(
    storageKeys.uiStateByQuestionId,
    JSON.stringify(state.uiStateByQuestionId),
  );
  localStorage.setItem(
    storageKeys.lastEvaluatedAtByQuestionId,
    JSON.stringify(state.lastEvaluatedAtByQuestionId),
  );
}

export function clearPersistedState() {
  Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
