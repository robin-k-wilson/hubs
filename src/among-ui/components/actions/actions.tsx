import React, { useState } from "react";
import use from "../../../assets/images/among-images/pngs/use.png";
import kill from "../../../assets/images/among-images/svgs/kill1.svg";
import sabotage from "../../../assets/images/among-images/pngs/sabotage.png"; // TODO to svg
import report from "../../../assets/images/among-images/pngs/report.png";
import { ActionButton } from "./action-button";
import "./actions.scss";
import { GameClient } from "../../game-client";
import { Sabotage } from "../sabotage/sabotage";

type ActionsProps = {
  actions: CrewActions | ImpostorActions | null | undefined;
  gameClient: GameClient;
  isDead: boolean;
};

// TODO will send in actions "canSabotage" / "canStartTask" etc.
export function Actions(props: ActionsProps) {
  const isImposter = props.actions?.hasOwnProperty("canKill");

  return props.actions ? (
    isImposter ? (
      <ImpostorActionButtons
        isDead={props.isDead}
        gameClient={props.gameClient}
        {...(props.actions as ImpostorActions)}
      />
    ) : (
      <CrewActionButtons isDead={props.isDead} gameClient={props.gameClient} {...(props.actions as CrewActions)} />
    )
  ) : (
    <></>
  );
}

function CrewActionButtons(props: CrewActions & { isDead: boolean; gameClient: GameClient }) {
  // if isDead can only Use
  return (
    <div className="actions-container">
      {!props.isDead && (
        <ReportButton canReport={props.canReport} onClick={props.gameClient.report.bind(props.gameClient)} />
      )}
      <div className="action-bot-row">
        <UseButton canStartTask={props.canStartTask} onClick={props.gameClient.startTask.bind(props.gameClient)} />
      </div>
    </div>
  );
}

function ImpostorActionButtons(props: ImpostorActions & { isDead: boolean; gameClient: GameClient }) {
  const [showSabotage, setShowSabotage] = useState<boolean>(false);

  function toggleSabotageMenu() {
    showSabotage && setShowSabotage(false);
    !showSabotage && setShowSabotage(true);
  }
  // if isDead can only Sabotage
  return (
    <div className="actions-container">
      {!props.isDead && (
        <ReportButton canReport={props.canReport} onClick={props.gameClient.report.bind(props.gameClient)} />
      )}
      <div className="action-bot-row">
        {!props.isDead && (
          <KillButton
            canKill={props.canKill}
            killCooldown={props.killCooldown}
            onClick={props.gameClient.kill.bind(props.gameClient)}
          />
        )}
        {props.canStartTask && !props.isDead ? (
          <UseButton canStartTask={props.canStartTask} onClick={props.gameClient.startTask.bind(props.gameClient)} />
        ) : (
          <SabotageButton onClick={toggleSabotageMenu} sabotageCooldown={props.sabotageCooldown} />
        )}
        {showSabotage && (
          <Sabotage sabotageClick={props.gameClient.sabotage.bind(props.gameClient)} closeMenu={toggleSabotageMenu} />
        )}
      </div>
    </div>
  );
}

type ReportButtonProps = {
  canReport: boolean;
  onClick: () => void;
};
function ReportButton({ canReport, onClick }: ReportButtonProps) {
  return <ActionButton num={0} imageSrc={report} active={canReport} alt="Report button" onClick={onClick} />;
}

type KillButtonProps = {
  canKill: boolean;
  onClick: () => void;
  killCooldown: number;
};
function KillButton({ canKill, onClick, killCooldown }: KillButtonProps) {
  return <ActionButton num={killCooldown} active={canKill} imageSrc={kill} alt="Kill button" onClick={onClick} />;
}

type UseButtonProps = {
  canStartTask: boolean;
  onClick: () => void;
};
function UseButton({ canStartTask, onClick }: UseButtonProps) {
  return (
    <ActionButton
      num={0}
      active={canStartTask}
      imageSrc={use}
      alt="Use button or start task button"
      onClick={onClick}
    />
  );
}

type SabotageButtonProps = {
  onClick: () => void;
  sabotageCooldown: number | null;
};
function SabotageButton({ onClick, sabotageCooldown }: SabotageButtonProps) {
  console.log(sabotageCooldown);
  const isActive = sabotageCooldown !== null && Date.now() > sabotageCooldown;
  // todo might have issues here
  return (
    <ActionButton
      num={sabotageCooldown === null || isActive ? 0 : sabotageCooldown}
      active={isActive}
      imageSrc={sabotage}
      alt="Sabotage button"
      onClick={onClick}
    />
  );
}
