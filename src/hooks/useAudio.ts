"use client";

import { useRef, useCallback, useEffect, useState } from "react";

interface AudioControls {
  playSpinSound: () => void;
  stopSpinSound: () => void;
  playBallDrop: () => void;
  playFanfare: () => void;
  toggleMute: () => void;
  isMuted: boolean;
}

export function useAudio(): AudioControls {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const spinOscRef = useRef<OscillatorNode | null>(null);
  const spinGainRef = useRef<GainNode | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playSpinSound = useCallback(() => {
    if (isMutedRef.current) return;
    try {
      const ctx = getCtx();
      // Rattling cage sound = low frequency noise modulated
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.value = 80;
      lfo.type = "square";
      lfo.frequency.value = 12;
      lfoGain.gain.value = 40;

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.08;

      osc.start();
      lfo.start();

      spinOscRef.current = osc;
      spinGainRef.current = gain;

      // Store lfo ref for cleanup
      (osc as OscillatorNode & { _lfo?: OscillatorNode })._lfo = lfo;
    } catch {
      // Audio not supported
    }
  }, [getCtx]);

  const stopSpinSound = useCallback(() => {
    try {
      if (spinGainRef.current) {
        spinGainRef.current.gain.exponentialRampToValueAtTime(
          0.001,
          (audioCtxRef.current?.currentTime ?? 0) + 0.1
        );
      }
      setTimeout(() => {
        if (spinOscRef.current) {
          try {
            const lfo = (
              spinOscRef.current as OscillatorNode & {
                _lfo?: OscillatorNode;
              }
            )._lfo;
            lfo?.stop();
            spinOscRef.current.stop();
          } catch {
            // Already stopped
          }
          spinOscRef.current = null;
        }
      }, 150);
    } catch {
      // Audio not supported
    }
  }, []);

  const playBallDrop = useCallback(() => {
    if (isMutedRef.current) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        200,
        ctx.currentTime + 0.3
      );

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.4
      );

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio not supported
    }
  }, [getCtx]);

  const playFanfare = useCallback(() => {
    if (isMutedRef.current) return;
    try {
      const ctx = getCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, now + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          now + i * 0.12 + 0.5
        );

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.5);
      });
    } catch {
      // Audio not supported
    }
  }, [getCtx]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return {
    playSpinSound,
    stopSpinSound,
    playBallDrop,
    playFanfare,
    toggleMute,
    isMuted,
  };
}
