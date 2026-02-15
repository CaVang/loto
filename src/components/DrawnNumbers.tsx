"use client";

import { memo } from "react";
import { getBallColor } from "@/utils/random";
import styles from "./DrawnNumbers.module.css";

interface DrawnNumbersProps {
  drawnNumbers: number[];
}

function DrawnNumbersComponent({ drawnNumbers }: DrawnNumbersProps) {
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);
  const drawnSet = new Set(drawnNumbers);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.counter}>
          Đã quay: <strong>{drawnNumbers.length}</strong>/90
        </span>
      </div>
      <div className={styles.grid}>
        {numbers.map((num) => {
          const isDrawn = drawnSet.has(num);
          return (
            <div
              key={num}
              className={`${styles.cell} ${isDrawn ? styles.drawn : styles.undrawn}`}
              style={
                isDrawn
                  ? ({
                      "--cell-color": getBallColor(num),
                    } as React.CSSProperties)
                  : undefined
              }
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const DrawnNumbers = memo(DrawnNumbersComponent);
