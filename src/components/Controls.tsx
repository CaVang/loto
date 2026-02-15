"use client";

import { memo } from "react";
import styles from "./Controls.module.css";

interface ControlsProps {
  onSpin: () => void;
  onReset: () => void;
  onToggleMute: () => void;
  isSpinning: boolean;
  isComplete: boolean;
  isMuted: boolean;
}

function ControlsComponent({
  onSpin,
  onReset,
  onToggleMute,
  isSpinning,
  isComplete,
  isMuted,
}: ControlsProps) {
  const handleReset = () => {
    if (window.confirm("Bạn có chắc muốn reset và quay lại từ đầu?")) {
      onReset();
    }
  };

  return (
    <div className={styles.controls}>
      <button
        className={styles.spinButton}
        onClick={onSpin}
        disabled={isSpinning || isComplete}
        aria-label="Quay số"
      >
        {isSpinning ? (
          <span className={styles.spinningText}>ĐANG QUAY...</span>
        ) : isComplete ? (
          "HẾT SỐ"
        ) : (
          "QUAY SỐ"
        )}
      </button>

      <div className={styles.secondaryButtons}>
        <button
          className={styles.resetButton}
          onClick={handleReset}
          disabled={isSpinning}
          aria-label="Reset"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          RESET
        </button>

        <button
          className={styles.muteButton}
          onClick={onToggleMute}
          aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export const Controls = memo(ControlsComponent);
