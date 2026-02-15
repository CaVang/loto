"use client";

import { memo } from "react";
import { getBallColor } from "@/utils/random";
import styles from "./Ball.module.css";

interface BallProps {
  number: number;
  size?: "small" | "medium" | "large";
  className?: string;
}

function BallComponent({ number, size = "medium", className = "" }: BallProps) {
  const color = getBallColor(number);

  return (
    <div
      className={`${styles.ball} ${styles[size]} ${className}`}
      style={{ "--ball-color": color } as React.CSSProperties}
    >
      <div className={styles.shine} />
      <span className={styles.number}>{number}</span>
    </div>
  );
}

export const Ball = memo(BallComponent);
