"use client";

import { memo, useMemo } from "react";
import styles from "./BingoCage.module.css";

const MAX_TOTAL = 90;
const BALL_SIZE_PX = 10;
const CAGE_SIZE_PX = 260;
const SPHERE_RADIUS_PX = 110; // rings are 220px wide

/**
 * Generate ball positions that pile up at the very bottom of a circular cage.
 * Uses circle geometry: at height h from bottom, available width = 2 * sqrt(r² - (r-h)²)
 */
function generateBallPositions(count: number) {
  const positions: { x: number; y: number; hue: number; delay: number }[] = [];
  const r = SPHERE_RADIUS_PX;
  const cageCenter = CAGE_SIZE_PX / 2;

  // Start placing balls from the very bottom of the sphere
  // Sphere bottom is at cageCenter + r = 240px from top = 20px from container bottom
  const sphereBottomFromTop = cageCenter + r; // 240px from top

  let placed = 0;
  let rowIndex = 0;
  const ballDiameter = BALL_SIZE_PX + 2; // 2px gap between balls

  while (placed < count) {
    // Height of this row's center from the sphere bottom
    const hFromSphereBottom = ballDiameter / 2 + rowIndex * ballDiameter;

    // Available width at this height inside the circle
    const distFromCenter = r - hFromSphereBottom;
    if (distFromCenter < 0) break; // Above sphere center, stop
    const halfWidth = Math.sqrt(r * r - distFromCenter * distFromCenter);
    const availableWidth = halfWidth * 2 - BALL_SIZE_PX; // subtract ball size for padding

    // How many balls fit in this row
    const ballsInRow = Math.max(1, Math.floor(availableWidth / ballDiameter));
    const ballsToPlace = Math.min(ballsInRow, count - placed);

    // Center the balls horizontally in the row
    const rowWidth = (ballsToPlace - 1) * ballDiameter;
    const startX = -rowWidth / 2;

    for (let col = 0; col < ballsToPlace; col++) {
      // px coords relative to cage center
      const xPx = startX + col * ballDiameter;
      // top position: sphere bottom minus row height
      const topPx = sphereBottomFromTop - hFromSphereBottom - BALL_SIZE_PX / 2;

      // Convert to percentages of cage container
      const xPercent = (xPx / CAGE_SIZE_PX) * 100;
      const topPercent = (topPx / CAGE_SIZE_PX) * 100;

      positions.push({
        x: xPercent,
        y: topPercent,
        hue: ((placed + col) * 37) % 360,
        delay: ((placed + col) % 10) * 0.06,
      });
    }

    placed += ballsToPlace;
    rowIndex++;
  }

  return positions;
}

interface BingoCageProps {
  isSpinning: boolean;
  remainingCount: number;
}

function BingoCageComponent({ isSpinning, remainingCount }: BingoCageProps) {
  const ballPositions = useMemo(
    () => generateBallPositions(MAX_TOTAL),
    []
  );

  return (
    <div className={styles.cageWrapper}>
      <div className={styles.scene}>
        <div
          className={`${styles.cage} ${isSpinning ? styles.spinning : ""}`}
        >
          {/* Wireframe rings */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`ring-${i}`}
              className={styles.ring}
              style={
                {
                  "--ring-rotate": `${i * 22.5}deg`,
                } as React.CSSProperties
              }
            />
          ))}

          {/* Vertical meridians */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`meridian-${i}`}
              className={styles.meridian}
              style={
                {
                  "--meridian-rotate": `${i * 30}deg`,
                } as React.CSSProperties
              }
            />
          ))}

          {/* Balls inside cage — pile at bottom, scatter when spinning */}
          {ballPositions.slice(0, remainingCount).map((pos, i) => (
            <div
              key={`inner-ball-${i}`}
              className={styles.innerBall}
              style={
                {
                  "--ball-rest-x": `${pos.x}%`,
                  "--ball-rest-y": `${pos.y}%`,
                  "--ball-delay": `${pos.delay}s`,
                  // Chaos positions constrained to sphere via polar coords
                  "--chaos-x1": `${Math.cos(i * 2.1) * (20 + (i % 5) * 3)}%`,
                  "--chaos-y1": `${50 + Math.sin(i * 2.1) * (20 + (i % 5) * 3)}%`,
                  "--chaos-x2": `${Math.cos(i * 1.4 + 2) * (15 + (i % 7) * 2.5)}%`,
                  "--chaos-y2": `${50 + Math.sin(i * 1.4 + 2) * (15 + (i % 7) * 2.5)}%`,
                  "--chaos-x3": `${Math.cos(i * 3.2 + 4) * (18 + (i % 6) * 2.8)}%`,
                  "--chaos-y3": `${50 + Math.sin(i * 3.2 + 4) * (18 + (i % 6) * 2.8)}%`,
                } as React.CSSProperties
              }
            >
              TẾT
            </div>
          ))}

          {/* Exit chute */}
          <div className={styles.chute} />
        </div>
      </div>

      {/* Stand / base */}
      <div className={styles.stand}>
        <div className={styles.standNeck} />
        <div className={styles.standBase} />
      </div>
    </div>
  );
}

export const BingoCage = memo(BingoCageComponent);
