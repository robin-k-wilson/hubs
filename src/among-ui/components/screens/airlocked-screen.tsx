import React from "react";
import airlockedBackground from "../../../assets/images/among-images/pngs/airlock-background.png";
import "../../data/types";

type AirlockedScreenProps = ScreensAirlock;

// TODO color with the spinning person
export function AirlockedScreen(props: AirlockedScreenProps) {
  const { playerColor, playerName, skipped } = props;
  return (
    <>
      <div className="killed-screen killed-image"></div>
      <img src={airlockedBackground} className="killed-screen killed-image" />
      <span className="among-font screen-text">
        {skipped ? "No one was ejected. (Skipped)" : `${playerName} was ejected.`}
      </span>
    </>
  );
}
