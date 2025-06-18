import { useState, useEffect, useRef } from "react";

// Importa os sons do pomodoro
import startSoundSrc from "/assets/sounds/bell-ringing-04.mp3";
import endSoundSrc from "/assets/sounds/bell-ringing-05.mp3";

const DURATION = 25 * 60; // 25 minutos em segundos

export default function usePomodoro({ onSessionComplete }) {
  const [secondsLeft, setSecondsLeft] = useState(DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Refs para os elementos de áudio dos sinos
  const startSound = useRef(new Audio(startSoundSrc));
  const endSound = useRef(new Audio(endSoundSrc));

  // Efeito principal que controla o timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            onSessionComplete(); // Chama a função de callback
            endSound.current.play();
            return DURATION; // Reseta o timer
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    // Função de limpeza para evitar memory leaks
    return () => clearInterval(intervalRef.current);
  }, [isRunning, onSessionComplete]);

  // --- Funções de Controle ---

  const toggle = () => {
    // Toca o som de início apenas se o timer estiver no começo
    if (!isRunning && secondsLeft === DURATION) {
      startSound.current.play();
    }
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(DURATION);
  };

  // --- Formatação do tempo para exibição ---
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const display = `${minutes}:${seconds}`;

  return {
    pomodoro: {
      display,
      isRunning,
    },
    controls: {
      toggle,
      reset,
    },
  };
}
