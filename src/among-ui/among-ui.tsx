import React, { useEffect, useState } from "react";
import { Actions } from "./components/actions/actions";
import { Map } from "./components/map/map";
import { Screens } from "./components/screens/screens";
import { Tasks } from "./components/tasks/tasks";
import "./among-ui.scss";
import { GameClient } from "./game-client";

let screenTimeout: number | null = null;
export function AmongUI() {
  const [gameClient, setGameClient] = useState<GameClient | null>(null);
  const [gameState, setGameState] = useState<GameState | undefined>();
  const [screen, setScreen] = useState<Screens | undefined>(undefined);
  useEffect(() => {
    const newGameClient: GameClient = new GameClient(setGameState);
    setGameClient(newGameClient);
    setGameState(newGameClient.getGameState());
    return () => {
      clearScreenTimeout();
      console.log("UNMOUNT");
    };
  }, []);

  function clearScreenTimeout() {
    console.log("inside clear screen timeout");
    if (screenTimeout) clearTimeout(screenTimeout);
    screenTimeout = null;
  }

  console.log("Screen Queue");
  console.log(gameClient?.screenQueue);
  // Show screens
  if (
    (gameClient?.screenPriorityQueue.length && screen?.type !== gameClient?.screenPriorityQueue[0]?.type) ||
    (!screen && gameClient?.screenQueue.length)
  ) {
    console.log("inside if screenqueue");
    const priorityScreen = gameClient?.screenPriorityQueue[0];
    const nextScreen = gameClient?.screenQueue[0];
    console.log(nextScreen?.type);
    console.log(priorityScreen?.type);

    if (priorityScreen && nextScreen) {
      console.log("prioityScreen & nextScreen");
      clearScreenTimeout();
      gameClient?.clearScreenQueue();
    }

    const screenToSet = priorityScreen ? priorityScreen : nextScreen;
    console.log(screenToSet);
    setScreen(screenToSet);
    if (screenToSet?.timeout === null) {
      // TODO figure out for screens with no timeout like meeting and win
    } else {
      screenTimeout = window.setTimeout(() => {
        console.log("inside finished setTimeout");
        if (!priorityScreen) gameClient?.shiftScreenQueue();
        else gameClient?.shiftPriorityScreenQueue();
        clearScreenTimeout();
        setScreen(undefined);
        setGameState(gameClient?.getGameState());
      }, screenToSet?.timeout);
    }
  }

  // if screenqueue has length, set timeout to screen.timeout
  // show screen if screenqueue has length
  // set timeout to remove screenqueue

  // if priorityqueue has length, screenqueue = []
  return (
    <div style={{ overflow: "hidden" }}>
      <button onClick={gameClient?.startGame.bind(gameClient)}>Start Game</button>
      {gameClient?.gameStarted && (
        <Actions actions={gameState?.actions} gameClient={gameClient} isDead={gameClient?.dead} />
      )}
      {gameClient?.gameStarted && (
        <Map
          playerPosition={gameClient?.position}
          tasks={gameClient?.tasks}
          emergencyTasks={gameClient?.sabotageInfo ? gameClient?.sabotageInfo.emergencyTasks : []}
        />
      )}
      {gameClient?.gameStarted && (
        <Tasks
          tasks={gameState?.tasks ? gameState?.tasks : []}
          isImposter={gameState?.role === "impostor"}
          completedTasks={20}
          totalTasks={100}
          isDead={gameClient?.dead}
          sabotageInfo={gameClient?.sabotageInfo}
          // emergency={"fix lights (13%)"}
        />
      )}
      {gameClient?.isMeeting && (
        <Screens
          type="meeting"
          meetingInfo={gameClient?.meetingInfo}
          impostors={gameClient?.impostors}
          myPlayerId={gameClient?.playerId}
          vote={gameClient?.vote.bind(gameClient)}
          iDead={gameClient?.dead}
        />
      )}
      {screen && screen.type === "win" && (
        <Screens
          {...screen}
          resetScreen={() => {
            console.log("RESET SCREEN");
            if (gameClient?.screenPriorityQueue.length) gameClient.screenPriorityQueue = [];
            setScreen(undefined);
            setGameState(gameClient?.getGameState());
          }}
        />
      )}
      {screen && screen.type !== "win" && <Screens {...screen} />}
      <TemporaryMoveButtons gameClient={gameClient} />
    </div>
  );
}

type TemporaryMoveButtonsProps = {
  gameClient: GameClient | null;
};
function TemporaryMoveButtons({ gameClient }: TemporaryMoveButtonsProps) {
  function onClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const value = e.currentTarget.value;
    let [axis, magnitude] = value.split("_");
    if (axis === "x" || axis === "y" || axis === "z") {
      gameClient?.move(axis, +magnitude);
    } else {
      // unexpected error
      console.error("something went wrong in move click()");
    }
  }
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0 }}>
      <button
        className="move"
        value="x_-1"
        onClick={() => {
          console.log(gameClient?.getGameState());
        }}
      >
        PRINT GAMESTATE
      </button>
      <div>
        <button className="move" value="x_-1" onClick={onClick}>
          -
        </button>
        <span>X</span>
        <button className="move" value="x_1" onClick={onClick}>
          +
        </button>
      </div>
      <div>
        <button className="move" value="y_-1" onClick={onClick}>
          -
        </button>
        <span>Y</span>
        <button className="move" value="y_1" onClick={onClick}>
          +
        </button>
      </div>
      <div>
        <button className="move" value="z_-1" onClick={onClick}>
          -
        </button>
        <span>Z</span>
        <button className="move" value="z_1" onClick={onClick}>
          +
        </button>
      </div>
    </div>
  );
}
