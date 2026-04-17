import { useState } from "react";
import { books } from "@/data/booksData";
import { useProgress } from "@/hooks/useProgress";
import BookPage from "@/components/BookPage";
import QuizPage from "@/components/QuizPage";
import ProgressDashboard from "@/components/ProgressDashboard";
import Icon from "@/components/ui/icon";

type View = "home" | "book" | "quiz" | "progress";

const genreBadge: Record<string, { cls: string; emoji: string }> = {
  "Роман-эпопея":       { cls: "badge-novel",  emoji: "📖" },
  "Роман в стихах":     { cls: "badge-poem",   emoji: "✍️" },
  "Пьеса":              { cls: "badge-play",   emoji: "🎭" },
  "Психологический роман":{ cls: "badge-psycho",emoji: "🧠" },
  "Мистический роман":  { cls: "badge-mystic", emoji: "🔮" },
};

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

  if (view === "book" && selectedBook)
    return (
      <BookPage
        book={selectedBook}
        result={getBookResult(selectedBook.id)}
        onBack={goHome}
        onStartQuiz={() => openQuiz(selectedBook.id)}
      />
    );

  if (view === "quiz" && selectedBook)
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

  if (view === "progress")
    return (
      <ProgressDashboard
        books={books}
        progress={progress}
        onBack={goHome}
        onOpenBook={openBook}
        onReset={resetProgress}
      />
    );

  return (
    <div className="min-h-screen bg-parchment">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-20 bg-ink/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-gold text-base">✦</span>
            <span className="font-sc text-base text-white/90 tracking-widest uppercase">
              Лит&nbsp;Кабинет
            </span>
          </div>
          <button
            onClick={() => setView("progress")}
            className="flex items-center gap-2 font-sans text-sm text-white/60 hover:text-gold transition-colors"
          >
            <Icon name="BarChart3" size={15} />
            <span>Прогресс</span>
            {totalProgress.completed > 0 && (
              <span className="bg-gold text-ink text-xs px-2 py-0.5 rounded-full font-semibold">
                {totalProgress.completed}/{books.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero-bg text-white px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="animate-fade-in">
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-gold/80 mb-5">
              Интерактивный учебный материал · ЕГЭ и ОГЭ
            </p>
            <h1 className="font-sc text-5xl md:text-7xl leading-tight mb-6">
              Русская<br />
              <span className="gold-shimmer">классика</span>
            </h1>
            <p className="font-serif text-lg md:text-xl text-white/65 max-w-lg leading-relaxed mb-10">
              Оглавления, методички, викторины и трекинг знаний —
              всё что нужно для успешного ЕГЭ по литературе
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById("toc")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary"
              >
                <Icon name="BookOpen" size={15} />
                Начать изучение
              </button>
              <button
                onClick={() => setView("progress")}
                className="btn-outline !text-white/70 !border-white/20 hover:!text-gold hover:!border-gold/50 hover:!bg-white/5"
              >
                <Icon name="BarChart3" size={15} />
                Мой прогресс
              </button>
            </div>
          </div>

          {/* Floating stats */}
          {totalProgress.completed > 0 && (
            <div className="mt-14 flex flex-wrap gap-4 animate-fade-in stagger-3">
              {[
                { icon: "BookOpen",    label: "Открыто",    val: totalProgress.visited },
                { icon: "CheckCircle", label: "Сдано",       val: totalProgress.completed },
                { icon: "Percent",     label: "Средний балл",val: `${totalProgress.avgScore}%` },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/8 border border-white/10 rounded-xl px-4 py-2.5">
                  <Icon name={s.icon as "BookOpen"} size={14} className="text-gold" />
                  <span className="font-sans text-xs text-white/50">{s.label}</span>
                  <span className="font-sc text-sm text-white font-bold">{s.val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Table of contents ── */}
      <main id="toc" className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold mb-1">
              {books.length} произведений
            </p>
            <h2 className="font-sc text-3xl text-ink">Оглавление</h2>
          </div>
          <span className="font-sans text-xs text-ink/35 hidden md:block">
            Нажмите на произведение, чтобы открыть
          </span>
        </div>

        <div className="space-y-4">
          {books.map((book, index) => {
            const result      = getBookResult(book.id);
            const isVisited   = progress.visitedBooks.includes(book.id);
            const scorePercent = result ? Math.round((result.score / result.total) * 100) : null;
            const badge       = genreBadge[book.genre] ?? { cls: "badge-novel", emoji: "📚" };
            const scoreClass  = scorePercent === null ? "" : scorePercent >= 80 ? "score-great" : scorePercent >= 60 ? "score-ok" : "score-low";

            return (
              <div
                key={book.id}
                className={`book-card animate-fade-in stagger-${Math.min(index + 1, 5)}`}
              >
                <div className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    {/* Number */}
                    <div className="num-badge">{String(index + 1).padStart(2, "0")}</div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className={`genre-badge ${badge.cls}`}>
                              {badge.emoji} {book.genre}
                            </span>
                            {isVisited && (
                              <span className="genre-badge" style={{background:"rgba(15,22,35,0.06)", color:"#555"}}>
                                <Icon name="Eye" size={10} /> Открыто
                              </span>
                            )}
                            {scorePercent !== null && (
                              <span className={`score-pill ${scoreClass}`}>
                                <Icon name="Award" size={10} />
                                {scorePercent}%
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => openBook(book.id)}
                            className="font-sc text-xl md:text-2xl text-ink hover:text-gold-dark transition-colors text-left leading-snug"
                          >
                            {book.title}
                          </button>
                          <p className="font-serif text-sm text-ink/50 italic mt-0.5">
                            {book.author} · {book.year}
                          </p>
                        </div>
                      </div>

                      <p className="font-sans text-sm text-ink/60 mt-2 leading-relaxed line-clamp-2">
                        {book.description}
                      </p>

                      {/* Actions row */}
                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        <button
                          onClick={() => openBook(book.id)}
                          className="btn-primary !py-2 !px-4 !text-xs"
                        >
                          <Icon name="BookOpen" size={13} />
                          Содержание
                        </button>
                        <button
                          onClick={() => openQuiz(book.id)}
                          className="btn-outline !py-2 !px-4 !text-xs"
                        >
                          <Icon name="PenLine" size={13} />
                          {result ? "Пройти снова" : "Викторина"}
                        </button>
                        <span className="font-sans text-xs text-ink/30 ml-auto hidden md:block">
                          {book.quiz.questions.length} вопросов
                        </span>
                      </div>

                      {/* Progress bar */}
                      {result && (
                        <div className="mt-4 pt-4 border-t border-black/5">
                          <div className="flex justify-between text-xs font-sans text-ink/40 mb-1.5">
                            <span>Результат теста</span>
                            <span>{result.score}/{result.total} верных</span>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full progress-fill rounded-full" style={{ width: `${scorePercent}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-black/6 py-8 text-center">
        <p className="font-serif text-sm text-ink/30 italic">
          Читайте · Размышляйте · Побеждайте ЕГЭ
        </p>
      </footer>
    </div>
  );
};

export default Index;
