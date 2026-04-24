import type { Feedback, Question } from "../types";

const DEFAULT_MODEL = "gpt-4.1-mini";

export function sanitizeApiKey(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function buildPrompt(question: Question, answer: string) {
  return `
당신은 안드로이드 시험 첨삭 도우미다.
채점 기준:
- 시험은 어렵지 않고 PDF 기반이다.
- 지나치게 엄격하지 말고, 시험 답안으로 적절한지 중심으로 평가한다.
- 핵심 개념을 맞췄으면 부분점수를 충분히 준다.
- 틀린 개념은 분명히 지적한다.
- 재작성 답안은 시험장에서 적을 수 있을 정도로 짧고 명확하게 제시한다.
- 점수는 반드시 0점 이상 100점 이하의 정수로 준다.
- 100점은 핵심 개념, 표현, 정확성이 모두 매우 우수한 경우에만 준다.

반드시 아래 JSON 객체만 반환하라. 마크다운 금지.
필수 스키마:
{
  "score": number,
  "summary": string,
  "strengths": string[],
  "weaknesses": string[],
  "missingKeywords": string[],
  "improvements": string[],
  "rewrittenAnswer": string
}

문제 정보:
- 제목: ${question.title}
- 유형: ${question.type}
- 문제: ${question.question}
- 관련 핵심 키워드: ${question.expectedKeywords.join(", ")}
- 관련 개념: ${question.relatedTopics.join(", ")}
- 모범답안 요약: ${question.modelAnswerSummary ?? "없음"}

사용자 답안:
${answer}
`.trim();
}

function extractJson(raw: string) {
  const fenced = raw.match(/```json\s*([\s\S]*?)```/i)?.[1];
  if (fenced) {
    return fenced.trim();
  }

  const objectMatch = raw.match(/\{[\s\S]*\}/);
  return objectMatch ? objectMatch[0] : raw;
}

function normalizeScore(score: unknown) {
  const numericScore = Number(score ?? 0);
  if (!Number.isFinite(numericScore)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(numericScore)));
}

export async function gradeAnswer(params: {
  apiKey: string;
  question: Question;
  answer: string;
}): Promise<Feedback> {
  const sanitizedKey = sanitizeApiKey(params.apiKey);
  if (!sanitizedKey) {
    throw new Error("유효한 OpenAI API Key가 없습니다.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sanitizedKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "당신은 한국어로 안드로이드 시험 답안을 채점하는 평가자다. 반드시 JSON만 반환하며 점수는 0에서 100 사이 정수다.",
        },
        {
          role: "user",
          content: buildPrompt(params.question, params.answer),
        },
      ],
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "OpenAI API 요청에 실패했습니다.");
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const rawContent = data.choices?.[0]?.message?.content?.trim();
  if (!rawContent) {
    throw new Error("AI 응답이 비어 있습니다.");
  }

  const parsed = JSON.parse(extractJson(rawContent)) as Feedback;
  return {
    score: normalizeScore(parsed.score),
    summary: parsed.summary ?? "요약이 제공되지 않았습니다.",
    strengths: parsed.strengths ?? [],
    weaknesses: parsed.weaknesses ?? [],
    missingKeywords: parsed.missingKeywords ?? [],
    improvements: parsed.improvements ?? [],
    rewrittenAnswer: parsed.rewrittenAnswer ?? "",
    raw: rawContent,
  };
}
