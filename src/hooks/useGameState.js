import { useCallback } from "react"; // Importe o useCallback
import useLocalStorage from "./useLocalStorage";

// O estado inicial e a lista de nomes permanecem os mesmos...
const INITIAL_STATE = {
  stats: { fed: 0, rest: 0, tasks: 0, focus: 0, love: 0 },
  level: 1,
  xp: 0,
  xpForNextLevel: 100,
  petName: "PET NAME!",
  tasks: [
    {
      id: Date.now(),
      text: "Sua primeira tarefa: marcar isso! :)",
      checked: false,
    },
  ],
};
const PET_NAMES = [
  "Bubbles",
  "Miki",
  "Neko",
  "Lulu",
  "Zuzu",
  "Koko",
  "Fafa",
  "Toto",
  "Peachy",
  "Momo",
  "Pipoca",
  "Kiki",
  "Bibi",
  "Tama",
  "Chibi",
  "Luna",
  "Coco",
  "Nina",
  "Bunbun",
  "Pixie",
];

export default function useGameState() {
  const [gameState, setGameState] = useLocalStorage(
    "tamaTaskProgress",
    INITIAL_STATE
  );

  // --- Funções envolvidas em 'useCallback' ---

  const checkForLevelUp = useCallback(() => {
    return gameState.xp >= gameState.xpForNextLevel;
  }, [gameState.xp, gameState.xpForNextLevel]); // Dependências desta função

  const updateStat = useCallback((stat, amount) => {
    setGameState((prev) => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpForNextLevel = prev.xpForNextLevel;

      if (newXp >= newXpForNextLevel) {
        newLevel++;
        newXp -= newXpForNextLevel;
        newXpForNextLevel = Math.round(newXpForNextLevel * 1.5);
      }
      return {
        ...prev,
        stats: {
          ...prev.stats,
          [stat]: Math.min(prev.stats[stat] + amount, 100),
        },
        xp: newXp,
        level: newLevel,
        xpForNextLevel: newXpForNextLevel,
      };
    });
  }, []); // Vazio pois 'setGameState' é estável

  const addTask = useCallback((taskText) => {
    if (!taskText) return;
    const newTask = { id: Date.now(), text: taskText, checked: false };
    setGameState((prev) => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  }, []);

  const toggleTask = useCallback((taskId) => {
    setGameState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, checked: !task.checked } : task
      ),
    }));
  }, []);

  const setPetName = useCallback(() => {
    const randomName = PET_NAMES[Math.floor(Math.random() * PET_NAMES.length)];
    setGameState((prev) => ({ ...prev, petName: randomName + "!" }));
  }, []);

  return {
    gameState,
    updateStat,
    addTask,
    toggleTask,
    setPetName,
    checkForLevelUp,
  };
}
