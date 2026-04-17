import { Book } from "@/data/booksData";
import { QuizResult } from "@/hooks/useProgress";
import Icon from "@/components/ui/icon";

interface BookPageProps {
  book: Book;
  result?: QuizResult;
  onBack: () => void;
  onStartQuiz: () => void;
}

const BookPage = ({ book, result, onBack, onStartQuiz }: BookPageProps) => {
  const scorePercent = result
    ? Math.round((result.score / result.total) * 100)
    : null;

  return (
    <div className="min-h-screen parchment-texture">
      <header className="border-b border-gold/30 bg-parchment/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-sans text-gold-dark hover:text-gold transition-colors"
          >
            <Icon name="ChevronLeft" size={16} />
            Оглавление
          </button>
          <span className="font-sc text-sm text-ink/50 tracking-widest uppercase">
            Литературная сокровищница
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Book header */}
        <div className="text-center mb-12 animate-fade-in">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            {book.genre} · {book.year}
          </p>
          <h1 className="font-sc text-4xl md:text-5xl text-ink mb-3 leading-tight">
            {book.title}
          </h1>
          <p className="font-serif text-xl text-ink/60 italic">{book.author}</p>
          <div className="ornament-line my-8 max-w-xs mx-auto">
            <span className="text-gold">✦</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left — Chapters */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <div className="classical-border rounded-sm p-6 bg-parchment animate-fade-in stagger-1">
              <h2 className="font-sc text-lg text-ink mb-4 tracking-wide">
                О произведении
              </h2>
              <p className="font-serif text-base text-ink/80 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Chapters */}
            <div className="animate-fade-in stagger-2">
              <h2 className="font-sc text-lg text-ink mb-4 tracking-wide flex items-center gap-2">
                <span className="text-gold">✦</span>
                Содержание
              </h2>
              <div className="space-y-2">
                {book.chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className="flex items-baseline gap-3 py-2.5 border-b border-gold/15 last:border-0 group"
                  >
                    <span className="font-sans text-xs text-gold/60 w-6 text-right flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 flex items-baseline gap-2">
                      <span className="font-serif text-sm text-ink/80 leading-snug">
                        {chapter}
                      </span>
                      <span className="flex-1 border-b border-dotted border-gold/20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Quiz card */}
          <div className="animate-fade-in stagger-3">
            <div className="corner-ornament classical-border rounded-sm p-6 bg-parchment sticky top-24">
              <h3 className="font-sc text-base text-ink mb-2 tracking-wide">
                Проверка знаний
              </h3>
              <p className="font-sans text-xs text-ink/55 mb-5 leading-relaxed">
                {book.quiz.questions.length} вопросов о произведении
              </p>

              {scorePercent !== null && result && (
                <div className="mb-5 p-3 bg-parchment-dark rounded-sm">
                  <div className="flex items-center justify-between text-xs font-sans mb-2">
                    <span className="text-ink/60">Ваш результат</span>
                    <span
                      className={`font-bold ${
                        scorePercent >= 80
                          ? "text-green-700"
                          : scorePercent >= 60
                          ? "text-yellow-700"
                          : "text-red-700"
                      }`}
                    >
                      {result.score}/{result.total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full progress-fill rounded-full"
                      style={{ width: `${scorePercent}%` }}
                    />
                  </div>
                  <p className="text-xs font-sans text-ink/45 mt-2">
                    {scorePercent >= 80
                      ? "Отлично! Превосходное знание"
                      : scorePercent >= 60
                      ? "Хорошо! Есть куда расти"
                      : "Стоит повторить материал"}
                  </p>
                </div>
              )}

              <button
                onClick={onStartQuiz}
                className="w-full bg-ink text-parchment font-sans text-sm py-3 px-4 rounded-sm hover:bg-gold-dark transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="PenLine" size={15} />
                {scorePercent !== null ? "Пройти ещё раз" : "Начать викторину"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookPage;
