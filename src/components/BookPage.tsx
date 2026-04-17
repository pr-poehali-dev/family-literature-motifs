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
  const scoreClass =
    scorePercent === null
      ? ""
      : scorePercent >= 80
      ? "score-great"
      : scorePercent >= 60
      ? "score-ok"
      : "score-low";

  return (
    <div className="min-h-screen bg-parchment">
      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-ink/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 font-sans text-sm text-white/60 hover:text-gold transition-colors"
          >
            <Icon name="ChevronLeft" size={16} />
            Оглавление
          </button>
          <span className="font-sc text-sm text-white/40 tracking-widest uppercase hidden md:block">
            Лит Кабинет
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-bg text-white px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto relative z-10 animate-fade-in">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold/80 mb-4">
            {book.genre} · {book.year}
          </p>
          <h1 className="font-sc text-4xl md:text-6xl text-white leading-tight mb-3">
            {book.title}
          </h1>
          <p className="font-serif text-lg text-white/55 italic">
            {book.author}
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left */}
          <div className="md:col-span-2 space-y-6">
            <div className="book-card p-6 animate-fade-in stagger-1">
              <h2 className="font-sc text-lg text-ink tracking-wide mb-3 flex items-center gap-2">
                <span className="text-gold">✦</span> О произведении
              </h2>
              <p className="font-serif text-base text-ink/80 leading-relaxed">
                {book.description}
              </p>
            </div>

            <div className="book-card p-6 animate-fade-in stagger-2">
              <h2 className="font-sc text-lg text-ink tracking-wide mb-4 flex items-center gap-2">
                <span className="text-gold">✦</span> Содержание
              </h2>
              <div className="space-y-0.5">
                {book.chapters.map((chapter, i) => (
                  <div
                    key={i}
                    className="flex items-baseline gap-3 py-2.5 border-b border-black/5 last:border-0"
                  >
                    <span className="font-sans text-xs font-bold text-gold/70 w-5 text-right flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-serif text-sm text-ink/75 leading-snug flex-1">
                      {chapter}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — quiz card */}
          <div className="animate-fade-in stagger-3">
            <div className="book-card p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="PenLine" size={16} className="text-gold" />
                <h3 className="font-sc text-base text-ink tracking-wide">
                  Проверка знаний
                </h3>
              </div>
              <p className="font-sans text-xs text-ink/45 mb-5">
                {book.quiz.questions.length} вопросов · около 5 минут
              </p>

              {scorePercent !== null && result && (
                <div className="mb-5 p-4 bg-parchment-dark rounded-xl">
                  <div className="flex justify-between items-center text-xs font-sans mb-2">
                    <span className="text-ink/55">Ваш результат</span>
                    <span className={`score-pill ${scoreClass}`}>
                      {result.score}/{result.total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full progress-fill rounded-full"
                      style={{ width: `${scorePercent}%` }}
                    />
                  </div>
                  <p className="font-sans text-xs text-ink/40 mt-2">
                    {scorePercent >= 80
                      ? "Отличное знание произведения!"
                      : scorePercent >= 60
                      ? "Хорошо, но есть куда расти"
                      : "Рекомендуем повторить материал"}
                  </p>
                </div>
              )}

              <button onClick={onStartQuiz} className="btn-primary w-full justify-center">
                <Icon name="PenLine" size={14} />
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
