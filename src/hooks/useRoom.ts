"use client";

import { useEffect, useState, useCallback } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CARD_VALUES } from "@/lib/cardData";
import type { RoomState, Card, CardValue } from "@/types/game";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useRoom(roomCode: string) {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const roomRef = doc(db, "rooms", roomCode);

    const unsubscribe = onSnapshot(
      roomRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as RoomState;
          setRoomState(data);
          setError(null);
        } else {
          setError("Room not found");
          setRoomState(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Firestore listener error:", err);
        setError("Failed to connect to room");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [roomCode]);

  const revealCard = useCallback(
    async (cardId: string) => {
      if (!roomState) return;

      // Ensure only the top unrevealed card can be revealed
      const topUnrevealed = roomState.cards.find((c) => !c.revealed);
      if (!topUnrevealed || topUnrevealed.id !== cardId) return;

      const updatedCards = roomState.cards.map((card) =>
        card.id === cardId ? { ...card, revealed: true } : card
      );

      try {
        const roomRef = doc(db, "rooms", roomCode);
        await updateDoc(roomRef, { cards: updatedCards });
      } catch (err) {
        console.error("Failed to reveal card:", err);
      }
    },
    [roomCode, roomState]
  );

  const resetGame = useCallback(async () => {
    const shuffledValues = shuffleArray<CardValue>(CARD_VALUES);
    const cards: Card[] = shuffledValues.map((value, index) => ({
      id: `card-${index}`,
      value,
      revealed: false,
    }));

    try {
      const roomRef = doc(db, "rooms", roomCode);
      await updateDoc(roomRef, { cards });
    } catch (err) {
      console.error("Failed to reset game:", err);
    }
  }, [roomCode]);

  return {
    roomState,
    error,
    loading,
    revealCard,
    resetGame,
  };
}
