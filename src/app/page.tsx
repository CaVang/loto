"use client";

import { useEffect, useRef } from "react";
import { BingoCage } from "@/components/BingoCage";
import { BallZoom } from "@/components/BallZoom";
import { DrawnNumbers } from "@/components/DrawnNumbers";
import { Controls } from "@/components/Controls";
import { Confetti } from "@/components/Confetti";
import { useGameState } from "@/hooks/useGameState";
import { useAudio } from "@/hooks/useAudio";
import styles from "./page.module.css";

export default function Home() {
  const game = useGameState();
  const audio = useAudio();
  const prevSpinning = useRef(false);

  // Sync audio with game state
  useEffect(() => {
    if (game.isSpinning && !prevSpinning.current) {
      audio.playSpinSound();
    }
    if (!game.isSpinning && prevSpinning.current) {
      audio.stopSpinSound();
      if (game.currentBall !== null) {
        audio.playBallDrop();
        setTimeout(() => audio.playFanfare(), 200);
      }
    }
    prevSpinning.current = game.isSpinning;
  }, [game.isSpinning, game.currentBall, audio]);

  return (
    <main className={styles.main}>
      {/* Title */}
      <header className={styles.header}>
        <h1 className={styles.title}>LÔ TÔ</h1>
      </header>

      {/* 3D Bingo Cage */}
      <section className={styles.cageSection}>
        <BingoCage isSpinning={game.isSpinning} remainingCount={game.remainingCount} />
      </section>

      {/* Controls */}
      <section className={styles.controlsSection}>
        <Controls
          onSpin={game.spin}
          onReset={game.reset}
          onToggleMute={audio.toggleMute}
          isSpinning={game.isSpinning}
          isComplete={game.isComplete}
          isMuted={audio.isMuted}
        />
      </section>

      {/* Last drawn ball display */}
      {game.currentBall !== null && !game.showZoom && (
        <section className={styles.lastBall}>
          <span className={styles.lastLabel}>Số vừa quay:</span>
          <span className={styles.lastNumber}>{game.currentBall}</span>
        </section>
      )}

      {/* Drawn Numbers Grid */}
      <section className={styles.numbersSection}>
        <DrawnNumbers drawnNumbers={game.drawnNumbers} />
      </section>

      {/* Ball Zoom Overlay */}
      {game.showZoom && game.currentBall !== null && (
        <BallZoom number={game.currentBall} onDismiss={game.dismissZoom} />
      )}

      {/* Confetti */}
      <Confetti active={game.showZoom} />
    </main>
  );
}
