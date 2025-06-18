import { useState, useEffect } from "react";

// Hooks que organizam a lógica
import useGameState from "./hooks/useGameState";
import useAudioPlayer from "./hooks/useAudioPlayer";
import usePomodoro from "./hooks/usePomodoro";

function App() {
  // --- STATE MANAGEMENT (LÓGICA) ---

  const {
    gameState,
    updateStat,
    addTask,
    toggleTask,
    setPetName,
    checkForLevelUp,
  } = useGameState();
  const audioControls = useAudioPlayer({
    tracks: [
      "https://res.cloudinary.com/dzmomr6jc/video/upload/v1749404264/jazzy_ukoq0l.m4a",
      "https://res.cloudinary.com/dzmomr6jc/video/upload/v1749404524/cute_j80v1k.m4a",
      "https://res.cloudinary.com/dzmomr6jc/video/upload/v1749404288/brown_opjjkr.m4a",
    ],
  });
  const { pomodoro, controls: pomodoroControls } = usePomodoro({
    onSessionComplete: () => {
      handleShowToast("⏰ Focus session complete! +25xp", "fa-brain");
      updateStat("focus", 25);
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [toast, setToast] = useState({
    message: "",
    icon: "",
    key: 0,
    show: false,
  });
  const [levelUpAnimation, setLevelUpAnimation] = useState(false);
  const [petReaction, setPetReaction] = useState("/assets/device/pet.svg");

  // --- HANDLER FUNCTIONS (AÇÕES) ---

  const handleShowToast = (message, icon) => {
    setToast({ message, icon, key: Date.now(), show: true });
    setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 3500);
  };

  const showPetReaction = (reactionUrl) => {
    setPetReaction(reactionUrl);
    setTimeout(() => setPetReaction("/assets/device/pet.svg"), 3000);
  };

  const handleAddTask = () => {
    addTask(taskInput);
    setTaskInput("");
    setIsModalOpen(false);
    handleShowToast("New task added!", "fa-plus");
  };

  const handleToggleTask = (taskId, isChecked) => {
    toggleTask(taskId);
    if (isChecked) {
      updateStat("tasks", 20);
      handleShowToast("Task completed! +20xp", "fa-check");
    }
  };

  const handleSimpleAction = (stat, value, message, icon, reactionUrl) => {
    updateStat(stat, value);
    handleShowToast(message, icon);
    if (reactionUrl) showPetReaction(reactionUrl);
  };

  // Efeito para verificar o level up com as dependências corrigidas
  useEffect(() => {
    const leveledUp = checkForLevelUp();
    if (leveledUp) {
      handleShowToast(
        `Level Up! You reached Level ${gameState.level}!`,
        "fa-star"
      );
      setLevelUpAnimation(true);
      setTimeout(() => setLevelUpAnimation(false), 1500);
    }
  }, [gameState.xp, gameState.level, checkForLevelUp]);

  // --- RENDER (APARÊNCIA) ---

  return (
    <>
      <div className="windowmain">
        {/* === NAVBAR === */}
        <div className="navbar">
          <div className="navbtns">
            <span className="dot blue" />
            <span className="dot red" />
            <span className="dot yellow" />
          </div>
          <div className="navtitle">
            <h1 className="h1 text-brown">Tamatask Webapp</h1>
          </div>
          <div className="navmenu">
            <button
              className="player-btn h-grow"
              title="Faixa Anterior"
              onClick={audioControls.playPrev}
            >
              <i className="fa-solid fa-backward-step" />
            </button>
            <button
              className="player-btn h-grow"
              title="Tocar/Pausar"
              onClick={audioControls.togglePlay}
            >
              <i
                className={`fa-solid ${
                  audioControls.isPlaying ? "fa-pause" : "fa-play"
                }`}
              />
            </button>
            <button
              className="player-btn h-grow"
              title="Próxima Faixa"
              onClick={audioControls.playNext}
            >
              <i className="fa-solid fa-forward-step" />
            </button>
            <button
              className="player-btn h-grow"
              title="Mudo"
              onClick={audioControls.toggleMute}
            >
              <i
                className={`fa-solid ${
                  audioControls.isMuted ? "fa-volume-xmark" : "fa-volume-high"
                }`}
              />
            </button>
            <input
              type="range"
              id="volume-slider"
              min={0}
              max={100}
              value={audioControls.volume}
              onInput={(e) => audioControls.setVolume(e.target.value)}
            />
          </div>
        </div>

        <div className="inner-grid__container">
          {/* === TAMAGOTCHI DEVICE === */}
          <div className="tama-device__container">
            <h1 className="h1 text-brown">
              <i
                className="h-grow fa-solid fa-shuffle text-pink"
                onClick={setPetName}
              />
              <span id="pet-name" className="pet-name">
                {gameState.petName}
              </span>
            </h1>
            <div className="device-frame">
              <img
                src="/assets/device/device.svg"
                alt="Tamagotchi Shell"
                className="device-svg"
              />
              <div
                className="pet-screen"
                onClick={() =>
                  handleSimpleAction(
                    "love",
                    5,
                    "You petted your pet! +5xp",
                    "fa-paw",
                    "/assets/device/reactions/boop.svg"
                  )
                }
              >
                <img
                  src={
                    pomodoro.isRunning
                      ? "/assets/device/reactions/pomodoro.svg"
                      : petReaction
                  }
                  alt="Pet"
                  className={`pet-svg is-floating ${
                    levelUpAnimation ? "level-up-animation" : ""
                  }`}
                />
              </div>
              <div className="device-buttons">
                <img
                  src="/assets/device/sleep.svg"
                  alt="Sleep"
                  className="btn-svg h-grow"
                  onClick={() =>
                    handleSimpleAction(
                      "rest",
                      10,
                      "Your pet rested a bit! +10xp",
                      "fa-bed",
                      "/assets/device/reactions/sleep.svg"
                    )
                  }
                />
                <img
                  src="/assets/device/love.svg"
                  alt="Love"
                  className="btn-svg h-grow"
                  onClick={() =>
                    handleSimpleAction(
                      "love",
                      10,
                      "Lots of love for your pet! +10xp",
                      "fa-heart",
                      "/assets/device/reactions/love.svg"
                    )
                  }
                />
                <img
                  src="/assets/device/food.svg"
                  alt="Food"
                  className="btn-svg h-grow"
                  onClick={() =>
                    handleSimpleAction(
                      "fed",
                      10,
                      "Your pet has been fed! +10xp",
                      "fa-utensils",
                      "/assets/device/reactions/feed.svg"
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* === TODO WIDGET === */}
          <div className="todowidget__container">
            <h2 className="h2 text-deep-orange">TODO</h2>
            <div className="todo-scroll">
              <ul className="todo-list">
                {gameState.tasks.map((task) => (
                  <li key={task.id}>
                    <label className="todo-item">
                      <input
                        type="checkbox"
                        checked={task.checked}
                        onChange={() =>
                          handleToggleTask(task.id, !task.checked)
                        }
                      />
                      <span className="checkmark" />
                      <span className="task-text text-deep-orange h3">
                        {task.text}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* === ADD TASK BUTTON === */}
          <div
            className="btn-addtask h-grow"
            onClick={() => setIsModalOpen(true)}
          >
            <h1 className="title text-yellow">ADD TASK</h1>
          </div>

          {/* === POMODORO WIDGET === */}
          <div className="btn-pomodoro">
            <h1 className="text-pink title">{pomodoro.display}</h1>
            <div className="pomodoro-buttons">
              <button
                className="pomodoro-btn h-grow"
                onClick={pomodoroControls.toggle}
              >
                <h2 className="text-yellow">
                  {pomodoro.isRunning ? "PAUSE" : "START"}
                </h2>
              </button>
              <button
                className="pomodoro-btn h-grow"
                onClick={pomodoroControls.reset}
              >
                <h2 className="text-yellow">RESET</h2>
              </button>
            </div>
          </div>

          {/* === STATS WIDGET === */}
          <div className="stats-widget__container">
            <h2 className="h2 text-pink">STATS</h2>
            <h3 className="h3 text-deep-orange-darker">
              LEVEL {gameState.level}
            </h3>
            <div className="stat-line">
              <span className="stat-label h3">XP</span>
              <div className="stat-bar">
                <div
                  className="stat-fill stat-fill--xp"
                  style={{
                    width: `${
                      (gameState.xp / gameState.xpForNextLevel) * 100
                    }%`,
                  }}
                >
                  <span className="stat-bar-text">
                    {gameState.xp} / {gameState.xpForNextLevel} xp
                  </span>
                </div>
              </div>
            </div>
            <div className="stat-line">
              <span className="stat-label">TASKS</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{ width: `${gameState.stats.tasks}%` }}
                ></div>
              </div>
            </div>
            <div className="stat-line">
              <span className="stat-label">FOCUS</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{ width: `${gameState.stats.focus}%` }}
                ></div>
              </div>
            </div>
            <div className="stat-line">
              <span className="stat-label">FOOD</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{ width: `${gameState.stats.fed}%` }}
                ></div>
              </div>
            </div>
            <div className="stat-line">
              <span className="stat-label">LOVE</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{ width: `${gameState.stats.love}%` }}
                ></div>
              </div>
            </div>
            <div className="stat-line">
              <span className="stat-label">REST</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{ width: `${gameState.stats.rest}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* === NOTES WIDGET === */}
          <div className="notes-widget__container">
            <h2 className="text-cream">NOTES</h2>
            <div className="notes-content" contentEditable="true">
              Type something!
            </div>
          </div>
        </div>
      </div>

      <footer className="credits">
        made with <i className="fa-solid fa-heart" /> by flavinha
      </footer>

      {/* === AUDIO & OVERLAYS === */}
      <audio
        ref={audioControls.audioRef}
        preload="auto"
        onEnded={audioControls.playNext}
      />

      <div id="toast-container">
        <div className={`toast ${toast.show ? "show" : ""}`} key={toast.key}>
          <h2>
            <i className={`fa-solid ${toast.icon}`}></i> {toast.message}
          </h2>
        </div>
      </div>

      <div className={`modal-overlay ${isModalOpen ? "" : "hidden"}`}>
        <div className="modal-content">
          <h2 className="h2 text-brown">Add a New Task</h2>
          <input
            type="text"
            id="task-input"
            placeholder="What do you need to do?"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          />
          <div className="modal-buttons">
            <button
              className="modal-btn confirm-btn h-grow"
              onClick={handleAddTask}
            >
              Add Task
            </button>
            <button
              className="modal-btn cancel-btn h-grow"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
