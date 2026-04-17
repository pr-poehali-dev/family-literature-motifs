import { Guide } from "@/data/booksData";
import Icon from "@/components/ui/icon";

interface GuideTabProps {
  guide: Guide;
}

const GuideTab = ({ guide }: GuideTabProps) => {
  return (
    <div className="space-y-6">

      {/* ── Краткое содержание ── */}
      <section className="book-card p-6 animate-fade-in stagger-1">
        <h3 className="font-sc text-lg text-ink mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
            <Icon name="AlignLeft" size={14} className="text-sky-600" />
          </span>
          Краткое содержание
        </h3>
        <div className="space-y-4">
          {guide.summary.map((ch, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-ink flex items-center justify-center flex-shrink-0">
                  <span className="font-sans text-[10px] font-bold text-gold-light">{i + 1}</span>
                </div>
                {i < guide.summary.length - 1 && (
                  <div className="w-px flex-1 bg-gold/20 mt-1 mb-1 min-h-4" />
                )}
              </div>
              <div className="pb-4 last:pb-0">
                <p className="font-sc text-sm text-ink font-semibold mb-1">{ch.title}</p>
                <p className="font-serif text-sm text-ink/75 leading-relaxed">{ch.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Главные герои ── */}
      <section className="book-card p-6 animate-fade-in stagger-2">
        <h3 className="font-sc text-lg text-ink mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Icon name="Users" size={14} className="text-violet-600" />
          </span>
          Главные герои
        </h3>
        <div className="space-y-3">
          {guide.characters.map((ch, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-parchment border border-black/5 hover:border-gold/30 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ink to-ink-soft flex items-center justify-center flex-shrink-0">
                <span className="font-sc text-gold-light text-sm font-bold">
                  {ch.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
                  <span className="font-sc text-sm text-ink font-semibold">{ch.name}</span>
                  <span className="font-sans text-xs text-ink/40">{ch.role}</span>
                </div>
                <p className="font-serif text-sm text-ink/70 leading-snug">{ch.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Темы и проблематика ── */}
      <section className="book-card p-6 animate-fade-in stagger-3">
        <h3 className="font-sc text-lg text-ink mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Icon name="Lightbulb" size={14} className="text-amber-600" />
          </span>
          Темы и проблематика
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {guide.themes.map((theme, i) => (
            <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
              <p className="font-sc text-sm text-amber-900 font-semibold mb-1.5">{theme.title}</p>
              <p className="font-serif text-sm text-ink/70 leading-snug">{theme.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Цитаты ── */}
      <section className="book-card p-6 animate-fade-in stagger-4">
        <h3 className="font-sc text-lg text-ink mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Icon name="Quote" size={14} className="text-emerald-600" />
          </span>
          Цитаты для сочинения
        </h3>
        <div className="space-y-4">
          {guide.quotes.map((q, i) => (
            <div key={i} className="relative pl-5 border-l-2 border-gold">
              <p className="font-serif text-base italic text-ink/85 leading-relaxed mb-2">
                «{q.text}»
              </p>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-xs text-ink/45">
                  <span className="font-semibold text-ink/60">Контекст: </span>
                  {q.context}
                </span>
                <span className="font-sans text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1 w-fit">
                  <Icon name="Pen" size={10} />
                  {q.usage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Подсказка для ЕГЭ ── */}
      <div className="bg-gradient-to-r from-ink to-ink-soft rounded-2xl p-5 text-white animate-fade-in stagger-5">
        <div className="flex gap-3 items-start">
          <span className="text-2xl flex-shrink-0">🎯</span>
          <div>
            <p className="font-sc text-sm text-gold-light mb-1">Совет для ЕГЭ</p>
            <p className="font-sans text-xs text-white/70 leading-relaxed">
              В сочинении используй конкретные цитаты с указанием части/главы.
              Обязательно раскрой 2–3 темы, укажи художественные средства
              (метафора, антитеза, символ) и авторскую позицию.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GuideTab;
