import React from "react";
import killedBackground from "../../../assets/images/among-images/pngs/killed-background.png";

export function ReportScreen() {
  return (
    <>
      <img src={killedBackground} className="killed-screen killed-image" />
      <span className="among-font screen-text text-outline-3">Dead body reported!</span>
    </>
  );
}
