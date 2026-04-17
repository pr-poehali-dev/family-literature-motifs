import { Book } from "@/data/booksData";
import { Progress } from "@/hooks/useProgress";
import Icon from "@/components/ui/icon";

interface ProgressDashboardProps {
  books: Book[];
  progress: Progress;
  onBack: () => void;
  onOpenBook: (bookId: string) => void;
  onReset: () => void;
}

const ProgressDashboard = ({ books, progress, onBack, onOpenBook, onReset }: ProgressDashboardProps) => {
  const completed = progress.results.length;
  const total = books.length;
  const overallPercent = Math.round((completed / total) * 100);
  const avgScore =
    progress.results.length > 0
      ? Math.round(
          (progress.results.reduce((sum, r) => sum + (r.score / r.total) * 100, 0) /
            progress.results.length) * 10
        ) / 10
      : 0;

  const handleReset = () => {
    if (confirm("Сбросить весь прогресс? Это действие нельзя отменить.")) onReset();
  };

  return (
    <div className="min-h-screen bg-parchment">
      <header className="sticky top-0 z-20 bg-ink/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 font-sans text-sm text-white/60 hover:text-gold transition-colors">
            <Icon name="ChevronLeft" size={16} />
            Оглавление
          </button>
          <span className="font-sc text-sm text-white/40 tracking-widest uppercase hidden md:block">
            Лит Кабинет
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-bg text-white px-6 py-16">
        <div className="max-w-4xl mx-auto relative z-10 animate-fade-in">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold/80 mb-4">
            Дневник читателя
          </p>
          <h1 className="font-sc text-4xl md:text-5xl text-white leading-tight">
            Мой прогресс
          </h1>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: "BookOpen",    label: "Открыто произведений", val: progress.visitedBooks.length, sub: `из ${total}` },
            { icon: "CheckCircle", label: "Викторин завершено",   val: completed,                    sub: `из ${total}` },
            { icon: "Star",        label: "Средний балл",          val: `${avgScore}%`,               sub: "по всем тестам" },
          ].map((s, i) => (
            <div key={i} className={`stat-card p-5 text-center animate-fade-in stagger-${i + 1}`}>
              <Icon name={s.icon as "BookOpen"} size={22} className="text-gold mx-auto mb-3" />
              <div className="font-sc text-3xl text-ink mb-0.5">{s.val}</div>
              <p className="font-sans text-xs text-ink/40">{s.label}</p>
              <p className="font-sans text-xs text-ink/30">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Overall progress */}
        <div className="book-card p-6 mb-10 animate-fade-in stagger-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-sc text-base text-ink tracking-wide">Общий прогресс</h3>
            <span className="font-sans text-sm font-bold text-gold-dark">{overallPercent}%</span>
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full progress-fill rounded-full" style={{ width: `${overallPercent}%` }} />
          </div>
          <p className="font-sans text-xs text-ink/35 mt-2">
            Завершено {completed} из {total} викторин
          </p>
        </div>

        {/* Books */}
        <h2 className="font-sc text-xl text-ink mb-5 flex items-center gap-2">
          <span className="text-gold">✦</span> По произведениям
        </h2>

        <div className="space-y-3 mb-12">
          {books.map((book, i) => {
            const result      = progress.results.find((r) => r.bookId === book.id);
            const isVisited   = progress.visitedBooks.includes(book.id);
            const scorePercent = result ? Math.round((result.score / result.total) * 100) : null;
            const scoreClass  = scorePercent === null ? "" : scorePercent >= 80 ? "score-great" : scorePercent >= 60 ? "score-ok" : "score-low";
            const completedDate = result
              ? new Date(result.completedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
              : null;

            return (
              <div key={book.id} className={`book-card animate-fade-in stagger-${Math.min(i + 1, 5)}`}>
                <div className="p-5 flex items-center gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    scorePercent !== null
                      ? scorePercent >= 80 ? "bg-green-100" : scorePercent >= 60 ? "bg-yellow-100" : "bg-red-100"
                      : "bg-secondary"
                  }`}>
                    {scorePercent !== null
                      ? <Icon name={scorePercent >= 60 ? "CheckCircle" : "AlertCircle"} size={18}
                          className={scorePercent >= 80 ? "text-green-700" : scorePercent >= 60 ? "text-yellow-700" : "text-red-700"} />
                      : <Icon name={isVisited ? "Eye" : "Circle"} size={18} className="text-ink/25" />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <button onClick={() => onOpenBook(book.id)} className="font-sc text-base text-ink hover:text-gold-dark transition-colors text-left">
                        {book.title}
                      </button>
                      {scorePercent !== null && (
                        <span className={`score-pill ${scoreClass} flex-shrink-0`}>
                          {scorePercent}%
                        </span>
                      )}
                    </div>
                    <p className="font-serif text-xs text-ink/45 italic mt-0.5">{book.author}</p>

                    {result && (
                      <div className="mt-2">
                        <div className="h-1 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full progress-fill rounded-full" style={{ width: `${scorePercent}%` }} />
                        </div>
                        <p className="font-sans text-xs text-ink/35 mt-1">
                          {result.score}/{result.total} верных · {completedDate}
                        </p>
                      </div>
                    )}
                    {!result && !isVisited && <p className="font-sans text-xs text-ink/30 mt-1">Ещё не открыто</p>}
                    {!result && isVisited  && <p className="font-sans text-xs text-ink/30 mt-1">Открыто, тест не пройден</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {(completed > 0 || progress.visitedBooks.length > 0) && (
          <div className="text-center">
            <button onClick={handleReset} className="font-sans text-xs text-ink/30 hover:text-crimson transition-colors underline decoration-dotted">
              Сбросить весь прогресс
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProgressDashboard;
