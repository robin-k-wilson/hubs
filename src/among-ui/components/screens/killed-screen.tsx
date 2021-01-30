import React from "react";
import killedBackground from "../../../assets/images/among-images/pngs/killed-background.png";

// TODO setup showing who killed whom

export function KilledScreen() {
  return (
    <>
      <img src={killedBackground} className="killed-screen killed-image" />
      <span className="among-font screen-text text-outline-3">You were killed!</span>{" "}
    </>
  );
}
