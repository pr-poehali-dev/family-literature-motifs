import { useState } from "react";
import { Book } from "@/data/booksData";
import Icon from "@/components/ui/icon";

interface QuizPageProps {
  book: Book;
  onBack: () => void;
  onFinish: (score: number) => void;
}

type AnswerState = "idle" | "correct" | "incorrect";

interface AnswerRecord {
  selectedIndex: number;
  state: AnswerState;
}

const QuizPage = ({ book, onBack, onFinish }: QuizPageProps) => {
  const { quiz } = book;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  const handleOptionClick = (optionIndex: number) => {
    if (showResult) return;
    setSelectedOption(optionIndex);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selectedIndex: selectedOption,
        state: isCorrect ? "correct" : "incorrect",
      },
    }));
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const score = Object.values(answers).filter(
    (a) => a.state === "correct"
  ).length;
  const scorePercent = Math.round((score / totalQuestions) * 100);

  if (isFinished) {
    return (
      <div className="min-h-screen parchment-texture flex flex-col">
        <header className="border-b border-gold/30 bg-parchment/80 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-6 py-4">
            <span className="font-sc text-sm text-ink/50 tracking-widest uppercase">
              Литературная сокровищница
            </span>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl text-center animate-scale-in">
            <div className="classical-border corner-ornament rounded-sm p-10 bg-parchment">
              <div className="text-5xl mb-6">
                {scorePercent >= 80 ? "🏆" : scorePercent >= 60 ? "📖" : "📝"}
              </div>
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold mb-2">
                Викторина завершена
              </p>
              <h2 className="font-sc text-3xl text-ink mb-1">{book.title}</h2>
              <p className="font-serif text-ink/60 italic mb-8">
                {book.author}
              </p>

              <div className="ornament-line mb-8">
                <span className="text-gold">✦</span>
              </div>

              <div className="mb-6">
                <div className="text-5xl font-sc text-ink mb-1">
                  {score}
                  <span className="text-2xl text-ink/40">/{totalQuestions}</span>
                </div>
                <p className="font-sans text-sm text-ink/60">правильных ответов</p>
              </div>

              <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3 max-w-xs mx-auto">
                <div
                  className="h-full progress-fill rounded-full"
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
              <p
                className={`font-sans text-sm font-semibold mb-8 ${
                  scorePercent >= 80
                    ? "text-green-700"
                    : scorePercent >= 60
                    ? "text-yellow-700"
                    : "text-red-700"
                }`}
              >
                {scorePercent >= 80
                  ? "Превосходно! Вы отлично знаете это произведение"
                  : scorePercent >= 60
                  ? "Хороший результат! Есть над чем работать"
                  : "Рекомендуем перечитать произведение"}
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 border border-gold/40 text-ink font-sans text-sm py-2.5 px-5 rounded-sm hover:bg-parchment-dark transition-colors"
                >
                  <Icon name="BookOpen" size={14} />
                  К произведению
                </button>
                <button
                  onClick={() => onFinish(score)}
                  className="flex items-center gap-2 bg-ink text-parchment font-sans text-sm py-2.5 px-5 rounded-sm hover:bg-gold-dark transition-colors"
                >
                  <Icon name="LayoutList" size={14} />
                  В оглавление
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen parchment-texture">
      <header className="border-b border-gold/30 bg-parchment/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-sans text-gold-dark hover:text-gold transition-colors"
          >
            <Icon name="ChevronLeft" size={16} />
            {book.title}
          </button>
          <span className="font-sans text-xs text-ink/50">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-secondary">
          <div
            className="h-full progress-fill transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Quiz title */}
        <div className="mb-8 animate-fade-in">
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold mb-1">
            {quiz.title}
          </p>
          <h2 className="font-sc text-xl text-ink">
            Вопрос {currentIndex + 1}
          </h2>
        </div>

        {/* Question */}
        <div
          key={currentQuestion.id}
          className="classical-border rounded-sm p-6 bg-parchment mb-6 animate-scale-in"
        >
          <p className="font-serif text-lg text-ink leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, idx) => {
            const answer = answers[currentQuestion.id];
            let className = "quiz-option rounded-sm p-4 bg-parchment";

            if (showResult && answer) {
              if (idx === currentQuestion.correctIndex) {
                className += " correct";
              } else if (
                idx === answer.selectedIndex &&
                answer.state === "incorrect"
              ) {
                className += " incorrect";
              }
            } else if (selectedOption === idx) {
              className += " selected";
            }

            return (
              <button
                key={idx}
                className={`${className} w-full text-left flex items-start gap-3 animate-fade-slide stagger-${idx + 1}`}
                onClick={() => handleOptionClick(idx)}
                disabled={showResult}
              >
                <span className="flex-shrink-0 w-6 h-6 border border-gold/40 flex items-center justify-center rounded-sm text-xs font-sans text-gold-dark font-semibold mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-serif text-base text-ink leading-snug">
                  {option}
                </span>
                {showResult && idx === currentQuestion.correctIndex && (
                  <Icon name="Check" size={16} className="text-green-700 flex-shrink-0 mt-0.5 ml-auto" />
                )}
                {showResult &&
                  answer &&
                  idx === answer.selectedIndex &&
                  answer.state === "incorrect" && (
                    <Icon name="X" size={16} className="text-red-700 flex-shrink-0 mt-0.5 ml-auto" />
                  )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className="bg-parchment-dark border border-gold/20 rounded-sm p-4 mb-6 animate-fade-in">
            <p className="font-sans text-xs uppercase tracking-wider text-gold mb-2">
              Пояснение
            </p>
            <p className="font-serif text-sm text-ink/80 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <span className="font-sans text-xs text-ink/40">
            Правильных: {score} из {answeredCount}
          </span>

          {!showResult ? (
            <button
              onClick={handleConfirm}
              disabled={selectedOption === null}
              className="flex items-center gap-2 bg-ink text-parchment font-sans text-sm py-2.5 px-6 rounded-sm hover:bg-gold-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Подтвердить
              <Icon name="ChevronRight" size={15} />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-ink text-parchment font-sans text-sm py-2.5 px-6 rounded-sm hover:bg-gold-dark transition-colors"
            >
              {currentIndex < totalQuestions - 1
                ? "Следующий вопрос"
                : "Завершить"}
              <Icon name="ChevronRight" size={15} />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
