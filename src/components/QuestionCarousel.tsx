import type { Question, QuestionState } from "../types";
import { QuestionCard } from "./QuestionCard";

type Props = {
  questions: Question[];
  currentIndex: number;
  questionStates: Record<number, QuestionState>;
};

export function QuestionCarousel({
  questions,
  currentIndex,
  questionStates,
}: Props) {
  const question = questions[currentIndex];

  return (
    <div className="relative overflow-hidden">
      <div className="transition-all duration-200">
        <QuestionCard
          index={currentIndex}
          total={questions.length}
          question={question}
          questionState={questionStates[question.id]}
        />
      </div>
    </div>
  );
}
