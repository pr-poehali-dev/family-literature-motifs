import { useState, useEffect } from "react";

export interface QuizResult {
  bookId: string;
  quizId: string;
  score: number;
  total: number;
  completedAt: string;
}

export interface Progress {
  results: QuizResult[];
  visitedBooks: string[];
}

const STORAGE_KEY = "literary_progress";

const defaultProgress: Progress = {
  results: [],
  visitedBooks: [],
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultProgress;
    } catch {
      return defaultProgress;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const saveResult = (result: Omit<QuizResult, "completedAt">) => {
    setProgress((prev) => {
      const existing = prev.results.findIndex(
        (r) => r.bookId === result.bookId
      );
      const newResult: QuizResult = {
        ...result,
        completedAt: new Date().toISOString(),
      };
      const newResults =
        existing >= 0
          ? prev.results.map((r, i) => (i === existing ? newResult : r))
          : [...prev.results, newResult];
      return { ...prev, results: newResults };
    });
  };

  const markVisited = (bookId: string) => {
    setProgress((prev) => {
      if (prev.visitedBooks.includes(bookId)) return prev;
      return { ...prev, visitedBooks: [...prev.visitedBooks, bookId] };
    });
  };

  const getBookResult = (bookId: string): QuizResult | undefined => {
    return progress.results.find((r) => r.bookId === bookId);
  };

  const getTotalProgress = () => {
    return {
      completed: progress.results.length,
      visited: progress.visitedBooks.length,
      avgScore:
        progress.results.length > 0
          ? Math.round(
              (progress.results.reduce(
                (sum, r) => sum + (r.score / r.total) * 100,
                0
              ) /
                progress.results.length) *
                10
            ) / 10
          : 0,
    };
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
  };

  return { progress, saveResult, markVisited, getBookResult, getTotalProgress, resetProgress };
}
