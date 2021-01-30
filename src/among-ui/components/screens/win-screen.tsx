import React from "react";

type WinScreenProps = ScreensWin;

export function WinScreen(props: WinScreenProps) {
  const { resetGame, resetScreen, role } = props;
  const winningTeam = role === "crew" ? "Crewmates" : "Impostor Team";
  function playAgain(e: React.MouseEvent<HTMLElement>) {
    resetGame(e);
    resetScreen(e);
  }
  return (
    <>
      <span className="among-font screen-text text-outline-3">{winningTeam + " won!"}</span>
      <button className="win-screen-play-again" onClick={playAgain}>
        Play again
      </button>
    </>
  );
}
