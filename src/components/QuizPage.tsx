import { useState } from "react";
import { Book } from "@/data/booksData";
import Icon from "@/components/ui/icon";

interface QuizPageProps {
  book: Book;
  onBack: () => void;
  onFinish: (score: number) => void;
}

type AnswerState = "idle" | "correct" | "incorrect";
interface AnswerRecord { selectedIndex: number; state: AnswerState; }

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
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleConfirm = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { selectedIndex: selectedOption, state: isCorrect ? "correct" : "incorrect" },
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

  const score = Object.values(answers).filter((a) => a.state === "correct").length;
  const scorePercent = Math.round((score / totalQuestions) * 100);

  /* ── Finished screen ── */
  if (isFinished) {
    const medal = scorePercent >= 80 ? "🏆" : scorePercent >= 60 ? "📖" : "📝";
    const scoreClass = scorePercent >= 80 ? "score-great" : scorePercent >= 60 ? "score-ok" : "score-low";
    return (
      <div className="min-h-screen bg-parchment flex flex-col">
        <header className="bg-ink/95 border-b border-white/5">
          <div className="max-w-2xl mx-auto px-6 py-3.5">
            <span className="font-sc text-sm text-white/40 tracking-widest uppercase">Лит Кабинет</span>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-lg animate-scale-in">
            <div className="book-card p-10 text-center">
              <div className="text-5xl mb-5">{medal}</div>
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold mb-2">
                Викторина завершена
              </p>
              <h2 className="font-sc text-3xl text-ink mb-1">{book.title}</h2>
              <p className="font-serif text-ink/50 italic mb-8">{book.author}</p>

              <div className="ornament-line mb-8">
                <span className="text-gold text-sm">✦</span>
              </div>

              <div className="mb-3">
                <span className="font-sc text-5xl text-ink">{score}</span>
                <span className="font-sc text-2xl text-ink/30">/{totalQuestions}</span>
              </div>
              <p className="font-sans text-sm text-ink/50 mb-4">правильных ответов</p>

              <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3 max-w-xs mx-auto">
                <div className="h-full progress-fill rounded-full" style={{ width: `${scorePercent}%` }} />
              </div>
              <span className={`score-pill ${scoreClass} mb-8 inline-flex`}>
                {scorePercent >= 80 ? "Отлично!" : scorePercent >= 60 ? "Хорошо" : "Повторите материал"} · {scorePercent}%
              </span>

              <div className="flex gap-3 justify-center mt-6">
                <button onClick={onBack} className="btn-outline">
                  <Icon name="BookOpen" size={14} />
                  К произведению
                </button>
                <button onClick={() => onFinish(score)} className="btn-primary">
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

  /* ── Quiz screen ── */
  return (
    <div className="min-h-screen bg-parchment">
      <header className="sticky top-0 z-20 bg-ink/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-2xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 font-sans text-sm text-white/60 hover:text-gold transition-colors">
            <Icon name="ChevronLeft" size={16} />
            {book.title}
          </button>
          <span className="font-sans text-xs text-white/40">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-white/10">
          <div className="h-full progress-fill transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Label */}
        <div className="mb-6 animate-fade-in">
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold mb-1">{quiz.title}</p>
          <h2 className="font-sc text-2xl text-ink">Вопрос {currentIndex + 1}</h2>
        </div>

        {/* Question */}
        <div key={currentQuestion.id} className="book-card p-6 mb-5 animate-scale-in">
          <p className="font-serif text-lg text-ink leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, idx) => {
            const answer = answers[currentQuestion.id];
            let cls = "quiz-option w-full text-left flex items-start gap-3 p-4";
            if (showResult && answer) {
              if (idx === currentQuestion.correctIndex) cls += " correct";
              else if (idx === answer.selectedIndex && answer.state === "incorrect") cls += " incorrect";
            } else if (selectedOption === idx) {
              cls += " selected";
            }

            return (
              <button
                key={idx}
                className={`${cls} animate-fade-slide stagger-${idx + 1}`}
                onClick={() => !showResult && setSelectedOption(idx)}
                disabled={showResult}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-xs font-sans font-bold text-ink/60">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-serif text-base text-ink leading-snug flex-1">{option}</span>
                {showResult && idx === currentQuestion.correctIndex && (
                  <Icon name="Check" size={16} className="text-emerald flex-shrink-0 mt-0.5" />
                )}
                {showResult && answer && idx === answer.selectedIndex && answer.state === "incorrect" && (
                  <Icon name="X" size={16} className="text-crimson flex-shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 animate-fade-in">
            <p className="font-sans text-xs uppercase tracking-wider text-gold-dark font-semibold mb-1.5">
              Пояснение
            </p>
            <p className="font-serif text-sm text-ink/80 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <span className="font-sans text-xs text-ink/35">
            Верных: {score} из {answeredCount}
          </span>
          {!showResult ? (
            <button onClick={handleConfirm} disabled={selectedOption === null} className="btn-primary">
              Подтвердить
              <Icon name="ChevronRight" size={14} />
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary">
              {currentIndex < totalQuestions - 1 ? "Следующий" : "Завершить"}
              <Icon name="ChevronRight" size={14} />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
