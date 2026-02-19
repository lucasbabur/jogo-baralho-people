"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CARD_VALUES } from "@/lib/cardData";
import type { CardValue, Card } from "@/types/game";

function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Home() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    setLoading(true);
    setError("");

    try {
      // Generate a unique room code
      let code = generateRoomCode();
      let attempts = 0;
      while (attempts < 10) {
        const existing = await getDoc(doc(db, "rooms", code));
        if (!existing.exists()) break;
        code = generateRoomCode();
        attempts++;
      }

      if (attempts >= 10) {
        setError("Falha ao gerar código da sala. Tente novamente.");
        setLoading(false);
        return;
      }

      const shuffledValues = shuffleArray<CardValue>(CARD_VALUES);
      const cards: Card[] = shuffledValues.map((value, index) => ({
        id: `card-${index}`,
        value,
        revealed: false,
      }));

      await setDoc(doc(db, "rooms", code), {
        code,
        cards,
        createdAt: Date.now(),
      });

      router.push(`/room/${code}`);
    } catch {
      setError("Falha ao criar sala. Tente novamente.");
      setLoading(false);
    }
  };

  const handleJoinRoom = () => {
    const code = joinCode.trim().toUpperCase();
    if (!code) {
      setError("Insira o código da sala");
      return;
    }
    if (code.length !== 6) {
      setError("O código deve ter 6 caracteres");
      return;
    }
    router.push(`/room/${code}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,197,94,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Title */}
        <div className="text-center mb-10">
          {/* Logo */}
          <div className="mx-auto mb-6 w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500/40 rotate-45 flex items-center justify-center">
            <span className="text-emerald-400 text-2xl font-black -rotate-45 tracking-tighter">
              LL
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Jogo dos Princípios
          </h1>
          <p className="text-emerald-400/60 text-base">
            Lastlink
          </p>
        </div>

        {/* Card container */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-8 shadow-2xl shadow-emerald-500/5">
          {/* Create Room */}
          <div className="mb-8">
            <h2 className="text-white text-lg font-semibold mb-4">
              Criar nova sala
            </h2>
            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98] cursor-pointer"
            >
              {loading ? "Criando..." : "Criar Sala"}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-emerald-500/10" />
            <span className="text-white/30 text-sm font-medium">OU</span>
            <div className="flex-1 h-px bg-emerald-500/10" />
          </div>

          {/* Join Room */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">
              Entrar em uma sala
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Código da sala"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value.toUpperCase());
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
                maxLength={6}
                className="flex-1 px-4 py-3.5 bg-white/[0.03] border border-emerald-500/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 tracking-[0.3em] text-center font-mono text-lg transition-all"
              />
              <button
                onClick={handleJoinRoom}
                className="px-6 py-3.5 bg-white/5 border border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                Entrar
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
