"use client";

import { use, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRoom } from "@/hooks/useRoom";
import type { Card } from "@/types/game";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default function RoomPage({ params }: PageProps) {
  const { code } = use(params);
  const roomCode = code.toUpperCase();
  const router = useRouter();
  const { roomState, error, loading, revealCard, resetGame } =
    useRoom(roomCode);
  const [copied, setCopied] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleRevealCard = useCallback(
    (cardId: string) => {
      setFlippedCards((prev) => new Set(prev).add(cardId));
      revealCard(cardId);
    },
    [revealCard]
  );

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}/room/${roomCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [roomCode]);

  const allRevealed = roomState?.cards.every((c) => c.revealed) ?? false;
  const revealedCards = roomState?.cards.filter((c) => c.revealed) ?? [];
  const unrevealedCards = roomState?.cards.filter((c) => !c.revealed) ?? [];
  const topCard = unrevealedCards[0] ?? null;

  // Loading state
  if (!roomState) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          {error ? (
            <div className="space-y-4">
              <p className="text-red-400 text-xl">{error}</p>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-white/60 text-lg">
                {loading ? "Connecting..." : "Loading room..."}
              </p>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <button
          onClick={() => router.push("/")}
          className="text-white/50 hover:text-white transition-colors text-sm cursor-pointer"
        >
          &larr; Sair da Sala
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 border border-emerald-500/20 rounded-xl px-4 py-2">
            <span className="text-emerald-400/60 text-sm">Sala</span>
            <span className="text-emerald-300 font-mono text-lg font-bold tracking-[0.2em]">
              {roomCode}
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded-xl transition-all text-sm cursor-pointer"
          >
            {copied ? "Copiado!" : "Copiar Link"}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-emerald-500/20 rounded-xl px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/60 text-sm">Conectado</span>
          </div>
        </div>
      </header>

      {/* Game Area */}
      <div className="max-w-6xl mx-auto">
        {allRevealed ? (
          /* Game Finished */
          <div className="text-center py-12 space-y-8">
            <h2 className="text-4xl font-bold text-white">
              Todos os princípios revelados!
            </h2>
            <p className="text-emerald-400 text-lg">
              Reflita sobre cada valor com seu time
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {roomState.cards.map((card, i) => (
                <RevealedCardFull
                  key={card.id}
                  card={card}
                  index={i}
                  expanded={expandedCard === card.id}
                  onToggle={() =>
                    setExpandedCard(
                      expandedCard === card.id ? null : card.id
                    )
                  }
                />
              ))}
            </div>

            <button
              onClick={resetGame}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98] cursor-pointer"
            >
              Reiniciar Jogo
            </button>
          </div>
        ) : (
          /* Active Game */
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Card Stack */}
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-emerald-400/60 text-sm font-medium mb-6 uppercase tracking-wider">
                Pilha de cartas ({unrevealedCards.length} restantes)
              </h2>

              <div className="relative w-64 h-96">
                {/* Stack shadow cards */}
                {unrevealedCards.map((card, index) => {
                  if (index === 0) return null;
                  const offset = Math.min(index, 3);
                  return (
                    <div
                      key={card.id}
                      className="absolute inset-0 rounded-2xl border border-emerald-500/10 bg-gray-900"
                      style={{
                        transform: `translateY(${offset * 5}px) translateX(${offset * 3}px)`,
                        zIndex: unrevealedCards.length - index,
                        opacity: 1 - offset * 0.2,
                      }}
                    />
                  );
                })}

                {/* Top Card - Clickable with flip */}
                {topCard && (
                  <div
                    className="card-flip-container absolute inset-0 z-50 cursor-pointer"
                    onClick={() => handleRevealCard(topCard.id)}
                  >
                    <div
                      className={`card-flip-inner ${
                        flippedCards.has(topCard.id) ? "flipped" : ""
                      }`}
                    >
                      {/* BACK of card */}
                      <div className="card-face">
                        <CardBack />
                      </div>

                      {/* FRONT of card (revealed) */}
                      <div className="card-face card-face-front">
                        <CardFront card={topCard} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-emerald-500/40 text-xs mt-4 uppercase tracking-widest">
                Toque para revelar
              </p>
            </div>

            {/* Revealed Cards */}
            <div className="w-full lg:w-96">
              <h2 className="text-emerald-400/60 text-sm font-medium mb-4 uppercase tracking-wider">
                Revelados ({revealedCards.length}/{roomState.cards.length})
              </h2>

              {revealedCards.length === 0 ? (
                <div className="bg-white/[0.02] border border-dashed border-emerald-500/10 rounded-2xl p-8 text-center">
                  <p className="text-white/20 text-sm">
                    Nenhum princípio revelado ainda
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {revealedCards.map((card) => (
                    <RevealedCardCompact
                      key={card.id}
                      card={card}
                      expanded={expandedCard === card.id}
                      onToggle={() =>
                        setExpandedCard(
                          expandedCard === card.id ? null : card.id
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* ─── Card Back ─── */
function CardBack() {
  const text = "JOGO DOS PRINCÍPIOS LASTLINK";
  // Repeat text to fill the circle
  const repeatedText = `${text}  ·  ${text}  ·  `;

  return (
    <div className="w-full h-full rounded-2xl bg-black border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/10 overflow-hidden relative group hover:border-emerald-500/50 transition-colors duration-500">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,197,94,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-500/40 rounded-tl-sm" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-500/40 rounded-tr-sm" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-500/40 rounded-bl-sm" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-500/40 rounded-br-sm" />

      {/* Circular text using SVG */}
      <div className="circular-text-wrapper">
        <svg viewBox="0 0 220 220" className="w-full h-full">
          <defs>
            <path
              id="circlePath"
              d="M 110,110 m -85,0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0"
            />
          </defs>
          <text
            fill="#22c55e"
            fontSize="11"
            fontWeight="600"
            letterSpacing="3"
            opacity="0.7"
          >
            <textPath href="#circlePath">{repeatedText}</textPath>
          </text>
        </svg>
      </div>

      {/* Center logo area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        {/* Logo diamond shape */}
        <div className="relative" style={{ animation: "pulseGlow 3s ease-in-out infinite" }}>
          <div className="w-14 h-14 bg-emerald-500/10 border-2 border-emerald-500/50 rotate-45 flex items-center justify-center">
            <span className="text-emerald-400 text-xl font-black -rotate-45 tracking-tighter">
              LL
            </span>
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-5 left-0 right-0 text-center">
        <span className="text-emerald-500/30 text-[10px] uppercase tracking-[0.3em] font-medium">
          Revelar
        </span>
      </div>
    </div>
  );
}

/* ─── Card Front (inside the flip) ─── */
function CardFront({ card }: { card: Card }) {
  return (
    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-900 via-gray-950 to-black border-2 border-emerald-500/30 shadow-2xl overflow-hidden relative">
      {/* Title bar */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-3">
        <h3 className="text-emerald-400 font-bold text-sm text-center uppercase tracking-wider">
          {card.value.title}
        </h3>
      </div>

      {/* Compact content */}
      <div className="p-3 card-content-scroll overflow-y-auto" style={{ maxHeight: "calc(100% - 48px)" }}>
        <div className="space-y-2">
          {card.value.principles.slice(0, 2).map((p, i) => (
            <p key={i} className="text-white/60 text-[10px] leading-tight flex gap-1">
              <span className="text-emerald-400 shrink-0">&#9670;</span>
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Revealed Card Compact (sidebar) ─── */
function RevealedCardCompact({
  card,
  expanded,
  onToggle,
}: {
  card: Card;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 cursor-pointer ${
        expanded
          ? "bg-emerald-500/[0.05] border-emerald-500/30"
          : "bg-white/[0.02] border-emerald-500/10 hover:border-emerald-500/20"
      }`}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-emerald-400 font-bold text-sm">
          {card.value.title}
        </h3>
        <span
          className={`text-emerald-500/50 text-xs transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          &#9660;
        </span>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Principles */}
          <div className="card-section">
            <h4 className="text-emerald-500/70 text-[10px] font-bold uppercase tracking-wider mb-2">
              Princípios
            </h4>
            <ul className="space-y-1.5">
              {card.value.principles.map((p, i) => (
                <li key={i} className="text-white/60 text-xs leading-relaxed flex gap-1.5">
                  <span className="text-emerald-400 shrink-0 mt-0.5">&#9670;</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* We adopt */}
          <div className="card-section">
            <h4 className="text-emerald-500/70 text-[10px] font-bold uppercase tracking-wider mb-2">
              Adotamos
            </h4>
            <ul className="space-y-1.5">
              {card.value.we_adopt.map((item, i) => (
                <li key={i} className="text-white/60 text-xs leading-relaxed flex gap-1.5">
                  <span className="text-emerald-400 shrink-0 mt-0.5">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Not confuse with */}
          <div className="card-section">
            <h4 className="text-red-400/70 text-[10px] font-bold uppercase tracking-wider mb-2">
              Não confundir com
            </h4>
            <ul className="space-y-1.5">
              {card.value.not_confuse_with.map((item, i) => (
                <li key={i} className="text-white/40 text-xs leading-relaxed flex gap-1.5">
                  <span className="text-red-400/60 shrink-0 mt-0.5">&#10007;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Reflection */}
          <div className="card-section">
            <h4 className="text-amber-400/70 text-[10px] font-bold uppercase tracking-wider mb-2">
              Perguntas para reflexão
            </h4>
            <ul className="space-y-2">
              {card.value.reflection_questions.map((q, i) => (
                <li key={i} className="text-white/50 text-xs leading-relaxed italic">
                  &ldquo;{q}&rdquo;
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Revealed Card Full (end screen) ─── */
function RevealedCardFull({
  card,
  index,
  expanded,
  onToggle,
}: {
  card: Card;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
        expanded
          ? "bg-emerald-500/[0.05] border-emerald-500/30"
          : "bg-white/[0.02] border-emerald-500/10 hover:border-emerald-500/20 hover:bg-white/[0.03]"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-emerald-400 font-bold text-base">
          {card.value.title}
        </h3>
        <span
          className={`text-emerald-500/50 text-xs transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          &#9660;
        </span>
      </div>

      {/* Always show principles */}
      <div className="px-5 pb-3">
        <ul className="space-y-1">
          {card.value.principles.map((p, i) => (
            <li key={i} className="text-white/50 text-xs leading-relaxed flex gap-1.5">
              <span className="text-emerald-400 shrink-0 mt-0.5">&#9670;</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Expanded sections */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-emerald-500/10 pt-4">
          <div className="card-section">
            <h4 className="text-emerald-500/70 text-[10px] font-bold uppercase tracking-wider mb-2">
              Adotamos
            </h4>
            <ul className="space-y-1.5">
              {card.value.we_adopt.map((item, i) => (
                <li key={i} className="text-white/60 text-xs leading-relaxed flex gap-1.5">
                  <span className="text-emerald-400 shrink-0 mt-0.5">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-section">
            <h4 className="text-red-400/70 text-[10px] font-bold uppercase tracking-wider mb-2">
              Não confundir com
            </h4>
            <ul className="space-y-1.5">
              {card.value.not_confuse_with.map((item, i) => (
                <li key={i} className="text-white/40 text-xs leading-relaxed flex gap-1.5">
                  <span className="text-red-400/60 shrink-0 mt-0.5">&#10007;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-section">
            <h4 className="text-amber-400/70 text-[10px] font-bold uppercase tracking-wider mb-2">
              Perguntas para reflexão
            </h4>
            <ul className="space-y-2">
              {card.value.reflection_questions.map((q, i) => (
                <li key={i} className="text-white/50 text-xs leading-relaxed italic">
                  &ldquo;{q}&rdquo;
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
