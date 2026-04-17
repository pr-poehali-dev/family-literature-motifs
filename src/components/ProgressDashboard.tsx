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

const ProgressDashboard = ({
  books,
  progress,
  onBack,
  onOpenBook,
  onReset,
}: ProgressDashboardProps) => {
  const completed = progress.results.length;
  const total = books.length;
  const overallPercent = Math.round((completed / total) * 100);
  const avgScore =
    progress.results.length > 0
      ? Math.round(
          (progress.results.reduce(
            (sum, r) => sum + (r.score / r.total) * 100,
            0
          ) /
            progress.results.length) *
            10
        ) / 10
      : 0;

  const handleReset = () => {
    if (confirm("Сбросить весь прогресс? Это действие нельзя отменить.")) {
      onReset();
    }
  };

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
            Мой прогресс
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12 animate-fade-in">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Дневник читателя
          </p>
          <h1 className="font-sc text-4xl text-ink mb-3">Мой прогресс</h1>
          <div className="ornament-line my-6 max-w-xs mx-auto">
            <span className="text-gold">✦</span>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: "BookOpen",
              label: "Открыто произведений",
              value: progress.visitedBooks.length,
              suffix: `из ${total}`,
            },
            {
              icon: "CheckCircle",
              label: "Викторин завершено",
              value: completed,
              suffix: `из ${total}`,
            },
            {
              icon: "Star",
              label: "Средний балл",
              value: avgScore,
              suffix: "%",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`classical-border rounded-sm p-5 bg-parchment text-center animate-fade-in stagger-${i + 1}`}
            >
              <Icon
                name={stat.icon as "BookOpen"}
                size={22}
                className="text-gold mx-auto mb-3"
              />
              <div className="font-sc text-3xl text-ink mb-1">
                {stat.value}
                <span className="text-sm text-ink/40 ml-1">{stat.suffix}</span>
              </div>
              <p className="font-sans text-xs text-ink/55">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Overall progress */}
        <div className="classical-border rounded-sm p-6 bg-parchment mb-10 animate-fade-in stagger-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-sc text-base text-ink tracking-wide">
              Общий прогресс
            </h3>
            <span className="font-sans text-sm font-semibold text-gold-dark">
              {overallPercent}%
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full progress-fill rounded-full"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <p className="font-sans text-xs text-ink/45 mt-2">
            Завершено {completed} из {total} викторин
          </p>
        </div>

        {/* Books list */}
        <h2 className="ornament-line font-sc text-xl text-ink tracking-wider mb-6">
          По произведениям
        </h2>

        <div className="space-y-3 mb-12">
          {books.map((book, i) => {
            const result = progress.results.find((r) => r.bookId === book.id);
            const isVisited = progress.visitedBooks.includes(book.id);
            const scorePercent = result
              ? Math.round((result.score / result.total) * 100)
              : null;
            const completedDate = result
              ? new Date(result.completedAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                })
              : null;

            return (
              <div
                key={book.id}
                className={`rounded-sm border bg-parchment transition-all animate-fade-in stagger-${Math.min(i + 1, 5)} ${
                  result ? "border-gold/40" : "border-gold/15"
                }`}
              >
                <div className="p-5 flex items-center gap-4">
                  {/* Status icon */}
                  <div
                    className={`flex-shrink-0 w-9 h-9 rounded-sm flex items-center justify-center ${
                      scorePercent !== null
                        ? scorePercent >= 80
                          ? "bg-green-100"
                          : scorePercent >= 60
                          ? "bg-yellow-100"
                          : "bg-red-100"
                        : "bg-secondary"
                    }`}
                  >
                    {scorePercent !== null ? (
                      <Icon
                        name={scorePercent >= 60 ? "CheckCircle" : "AlertCircle"}
                        size={18}
                        className={
                          scorePercent >= 80
                            ? "text-green-700"
                            : scorePercent >= 60
                            ? "text-yellow-700"
                            : "text-red-700"
                        }
                      />
                    ) : (
                      <Icon
                        name={isVisited ? "Eye" : "Circle"}
                        size={18}
                        className="text-ink/30"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => onOpenBook(book.id)}
                        className="font-sc text-base text-ink hover:text-gold-dark transition-colors text-left"
                      >
                        {book.title}
                      </button>
                      {scorePercent !== null && (
                        <span
                          className={`font-sans text-sm font-bold flex-shrink-0 ${
                            scorePercent >= 80
                              ? "text-green-700"
                              : scorePercent >= 60
                              ? "text-yellow-700"
                              : "text-red-700"
                          }`}
                        >
                          {scorePercent}%
                        </span>
                      )}
                    </div>
                    <p className="font-serif text-xs text-ink/50 italic mt-0.5">
                      {book.author}
                    </p>

                    {result && (
                      <div className="mt-2">
                        <div className="h-1 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full progress-fill rounded-full"
                            style={{ width: `${scorePercent}%` }}
                          />
                        </div>
                        <p className="font-sans text-xs text-ink/40 mt-1">
                          {result.score}/{result.total} верных · {completedDate}
                        </p>
                      </div>
                    )}

                    {!result && !isVisited && (
                      <p className="font-sans text-xs text-ink/35 mt-1">
                        Ещё не открыто
                      </p>
                    )}
                    {!result && isVisited && (
                      <p className="font-sans text-xs text-ink/35 mt-1">
                        Открыто, викторина не пройдена
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset */}
        {(completed > 0 || progress.visitedBooks.length > 0) && (
          <div className="text-center">
            <button
              onClick={handleReset}
              className="font-sans text-xs text-ink/35 hover:text-red-700 transition-colors underline decoration-dotted"
            >
              Сбросить весь прогресс
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProgressDashboard;
