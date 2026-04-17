import { useState } from "react";
import { books } from "@/data/booksData";
import { useProgress } from "@/hooks/useProgress";
import BookPage from "@/components/BookPage";
import QuizPage from "@/components/QuizPage";
import ProgressDashboard from "@/components/ProgressDashboard";
import Icon from "@/components/ui/icon";

type View = "home" | "book" | "quiz" | "progress";

const Index = () => {
  const [view, setView] = useState<View>("home");
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const { progress, saveResult, markVisited, getBookResult, getTotalProgress, resetProgress } =
    useProgress();

  const selectedBook = books.find((b) => b.id === selectedBookId) || null;
  const totalProgress = getTotalProgress();

  const openBook = (bookId: string) => {
    markVisited(bookId);
    setSelectedBookId(bookId);
    setView("book");
  };

  const openQuiz = (bookId: string) => {
    setSelectedBookId(bookId);
    setView("quiz");
  };

  const goHome = () => {
    setView("home");
    setSelectedBookId(null);
  };

  if (view === "book" && selectedBook) {
    return (
      <BookPage
        book={selectedBook}
        result={getBookResult(selectedBook.id)}
        onBack={goHome}
        onStartQuiz={() => openQuiz(selectedBook.id)}
      />
    );
  }

  if (view === "quiz" && selectedBook) {
    return (
      <QuizPage
        book={selectedBook}
        onBack={() => openBook(selectedBook.id)}
        onFinish={(score) => {
          saveResult({
            bookId: selectedBook.id,
            quizId: selectedBook.quiz.id,
            score,
            total: selectedBook.quiz.questions.length,
          });
          setView("book");
        }}
      />
    );
  }

  if (view === "progress") {
    return (
      <ProgressDashboard
        books={books}
        progress={progress}
        onBack={goHome}
        onOpenBook={openBook}
        onReset={resetProgress}
      />
    );
  }

  return (
    <div className="min-h-screen parchment-texture">
      {/* Header */}
      <header className="border-b border-gold/30 bg-parchment/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-gold text-xl">✦</span>
            <span className="font-sc text-lg text-ink tracking-widest uppercase">
              Литературная сокровищница
            </span>
          </div>
          <button
            onClick={() => setView("progress")}
            className="flex items-center gap-2 text-sm text-gold-dark hover:text-gold transition-colors"
          >
            <Icon name="BarChart3" size={16} />
            <span className="font-sans">Мой прогресс</span>
            {totalProgress.completed > 0 && (
              <span className="bg-gold text-ink text-xs px-2 py-0.5 rounded-full font-sans font-semibold">
                {totalProgress.completed}/{books.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-4">
            Интерактивный учебный материал
          </p>
          <h1 className="font-sc text-5xl md:text-6xl text-ink mb-4 leading-tight">
            Русская классическая
            <br />
            <span className="gold-shimmer">литература</span>
          </h1>
          <div className="ornament-line my-6 max-w-xs mx-auto">
            <span className="text-gold text-sm">✦</span>
          </div>
          <p className="font-serif text-lg text-ink/70 max-w-xl mx-auto leading-relaxed">
            Исследуйте великие произведения русской литературы, изучайте
            содержание и проверяйте свои знания в интерактивных викторинах
          </p>
        </div>

        {/* Stats bar */}
        {totalProgress.completed > 0 && (
          <div className="classical-border rounded-sm p-4 mb-10 animate-fade-in bg-parchment-dark/50">
            <div className="flex flex-wrap gap-6 justify-center font-sans text-sm">
              <div className="flex items-center gap-2 text-ink/70">
                <Icon name="BookOpen" size={15} className="text-gold" />
                <span>Прочитано: <strong className="text-ink">{totalProgress.visited}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-ink/70">
                <Icon name="CheckCircle" size={15} className="text-gold" />
                <span>Тестов сдано: <strong className="text-ink">{totalProgress.completed}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-ink/70">
                <Icon name="Star" size={15} className="text-gold" />
                <span>Средний балл: <strong className="text-ink">{totalProgress.avgScore}%</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Table of Contents */}
        <div className="mb-8">
          <h2 className="ornament-line font-sc text-2xl text-ink tracking-wider mb-10">
            Оглавление
          </h2>

          <div className="space-y-4">
            {books.map((book, index) => {
              const result = getBookResult(book.id);
              const isVisited = progress.visitedBooks.includes(book.id);
              const scorePercent = result
                ? Math.round((result.score / result.total) * 100)
                : null;

              return (
                <div
                  key={book.id}
                  className={`corner-ornament classical-border rounded-sm bg-parchment hover:bg-parchment-dark/60 transition-all duration-300 group animate-fade-in stagger-${Math.min(index + 1, 5)}`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-5">
                      {/* Number */}
                      <div className="flex-shrink-0 w-10 h-10 border border-gold/40 flex items-center justify-center rounded-sm">
                        <span className="font-sc text-gold text-base font-bold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <button
                              onClick={() => openBook(book.id)}
                              className="font-sc text-xl text-ink group-hover:text-gold-dark transition-colors text-left hover:underline decoration-gold/40"
                            >
                              {book.title}
                            </button>
                            <p className="font-serif text-sm text-ink/60 mt-0.5 italic">
                              {book.author} · {book.year} · {book.genre}
                            </p>
                          </div>

                          {/* Status badges */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isVisited && (
                              <span className="flex items-center gap-1 text-xs font-sans text-ink/50 bg-secondary px-2 py-1 rounded-sm">
                                <Icon name="Eye" size={11} />
                                Открыто
                              </span>
                            )}
                            {scorePercent !== null && (
                              <span
                                className={`flex items-center gap-1 text-xs font-sans px-2 py-1 rounded-sm font-semibold ${
                                  scorePercent >= 80
                                    ? "bg-green-100 text-green-800"
                                    : scorePercent >= 60
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                <Icon name="Award" size={11} />
                                {scorePercent}%
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="font-sans text-sm text-ink/65 mt-3 leading-relaxed line-clamp-2">
                          {book.description}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-4">
                          <button
                            onClick={() => openBook(book.id)}
                            className="flex items-center gap-1.5 text-sm font-sans text-gold-dark hover:text-gold transition-colors"
                          >
                            <Icon name="BookOpen" size={14} />
                            Читать содержание
                          </button>
                          <span className="text-ink/20">·</span>
                          <button
                            onClick={() => openQuiz(book.id)}
                            className="flex items-center gap-1.5 text-sm font-sans text-gold-dark hover:text-gold transition-colors"
                          >
                            <Icon name="PenLine" size={14} />
                            {result ? "Пройти ещё раз" : "Начать викторину"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar if completed */}
                    {result && (
                      <div className="mt-4 pt-4 border-t border-gold/15">
                        <div className="flex items-center justify-between text-xs font-sans text-ink/50 mb-1.5">
                          <span>Результат викторины</span>
                          <span>
                            {result.score} / {result.total} вопросов
                          </span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full progress-fill rounded-full"
                            style={{ width: `${scorePercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer ornament */}
        <div className="ornament-line mt-16 mb-4">
          <span className="text-gold text-xs">◆ ◆ ◆</span>
        </div>
        <p className="text-center font-serif text-sm text-ink/40 italic">
          Читайте. Размышляйте. Познавайте.
        </p>
      </main>
    </div>
  );
};

export default Index;
