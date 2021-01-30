import React from "react";
import { ReportScreen } from "./report-screen";
import { KilledScreen } from "./killed-screen";
import { AirlockedScreen } from "./airlocked-screen";
import { ShhhScreen } from "./shhh-screen";
import { MeetingScreen } from "./meeting-screen";
import { RoleRevealScreen } from "./role-reveal-screen";
import { WinScreen } from "./win-screen";
import "../../data/types";
import "./screens.scss";

type ScreensProps = Screens;

export function Screens(props: ScreensProps) {
  const { type } = props;
  return (
    <div className="screen-container">
      {type === "report" && <ReportScreen />}
      {type === "killed" && <KilledScreen />}
      {type === "airlocked" && <AirlockedScreen {...(props as ScreensAirlock)} />}
      {type === "shhh" && <ShhhScreen />}
      {type === "meeting" && <MeetingScreen {...(props as ScreensMeeting)} />}
      {type === "role-reveal" && <RoleRevealScreen {...(props as ScreensRoleReveal)} />}
      {type === "win" && <WinScreen {...(props as ScreensWin)} />}
    </div>
  );
}
