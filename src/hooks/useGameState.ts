"use client";

import { useState, useCallback, useRef } from "react";
import { getSecureRandom } from "@/utils/random";

const ALL_NUMBERS = Array.from({ length: 90 }, (_, i) => i + 1);

export interface GameState {
  drawnNumbers: number[];
  currentBall: number | null;
  isSpinning: boolean;
  showZoom: boolean;
  remainingCount: number;
  isComplete: boolean;
}

export interface GameActions {
  spin: () => void;
  reset: () => void;
  dismissZoom: () => void;
}

export function useGameState(): GameState & GameActions {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentBall, setCurrentBall] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const remaining = ALL_NUMBERS.filter((n) => !drawnNumbers.includes(n));

  const spin = useCallback(() => {
    if (isSpinning || remaining.length === 0) return;

    setIsSpinning(true);
    setShowZoom(false);
    setCurrentBall(null);

    // Cage spins for 2 seconds, then picks a number
    spinTimeoutRef.current = setTimeout(() => {
      const picked = getSecureRandom(remaining);
      setCurrentBall(picked);
      setDrawnNumbers((prev) => [...prev, picked]);
      setIsSpinning(false);
      setShowZoom(true);

      // Auto-dismiss zoom after 3 seconds
      zoomTimeoutRef.current = setTimeout(() => {
        setShowZoom(false);
      }, 3000);
    }, 2200);
  }, [isSpinning, remaining]);

  const dismissZoom = useCallback(() => {
    setShowZoom(false);
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
    setDrawnNumbers([]);
    setCurrentBall(null);
    setIsSpinning(false);
    setShowZoom(false);
  }, []);

  return {
    drawnNumbers,
    currentBall,
    isSpinning,
    showZoom,
    remainingCount: remaining.length,
    isComplete: remaining.length === 0,
    spin,
    reset,
    dismissZoom,
  };
}
