"use client";

import { memo } from "react";
import { Ball } from "./Ball";
import styles from "./BallZoom.module.css";

interface BallZoomProps {
  number: number;
  onDismiss: () => void;
}

function BallZoomComponent({ number, onDismiss }: BallZoomProps) {
  return (
    <div className={styles.overlay} onClick={onDismiss} role="dialog" aria-label={`Số ${number}`}>
      <div className={styles.container}>
        <Ball number={number} size="large" className={styles.zoomedBall} />
        <p className={styles.label}>SỐ</p>
        <p className={styles.bigNumber}>{number}</p>
      </div>
    </div>
  );
}

export const BallZoom = memo(BallZoomComponent);
