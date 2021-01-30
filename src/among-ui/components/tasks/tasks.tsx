import React, { useState } from "react";
import "./tasks.scss";
import "../../data/types";
import { Countdown } from "../common/countdown";
import { ProgressPlugin } from "webpack";

const dummyTasks: Array<{ completed: boolean; name: string }> = [
  { completed: true, name: "Wave to your neighbor" },
  { completed: false, name: "Admin Swipe Card" },
  { completed: false, name: "Electrical Calibrate Distributor" },
  { completed: true, name: "Upper Engine Align Engine Output (0/2)" },
  { completed: false, name: "Electical Fix Wiring (0/3)" },
];

const O2_EMERGENCY_TEXT = "Oxygen depleted";
const REACTOR_EMERGENCY_TEXT = "Reactor meltdown";

type TasksProps = {
  tasks: Array<CrewTask>;
  completedTasks: number;
  totalTasks: number;
  isImposter: boolean;
  isDead: boolean;
  sabotageInfo: SabotageInfo | null;
};

export function Tasks(props: TasksProps) {
  let { tasks, isImposter, completedTasks, totalTasks, isDead, sabotageInfo } = props;
  const [showTasks, toggleTasks] = useState(true);
  // TODO toggle
  // function toggleTasksMenu(e: Event): void {
  //   e.preventDefault();
  //   if (showTasks) toggleTasks(false);
  //   else toggleTasks(false);
  // }
  return (
    <div className="task-container">
      <div className="task-progress-wrapper">
        <div style={{ width: `${(completedTasks / totalTasks) * 100}%` }} className="task-progress"></div>
        {/* Todo turn into progress bar */}
        {/* <span className="among-font text-outline-3">{`${completedTasks} / ${totalTasks}`}</span> */}
      </div>
      {showTasks && (
        <div className="crew-task-container">
          {isImposter && (
            <>
              <Task text="Sabotage and kill everyone." emergency completed={false} />
              <Task text="Fake Tasks:" completed={false} />
            </>
          )}
          {isDead && (
            <>
              <Task text="You're dead! Do tasks to win!" completed={false} />
            </>
          )}
          {tasks.map((task, idx) => {
            return <Task key={task.name + idx} text={task.name} completed={task.completed} />;
          })}
          {sabotageInfo && (
            <Task text="" emergency completed={false}>
              <>
                {`${sabotageInfo.sabotageKind === "o2" ? O2_EMERGENCY_TEXT : REACTOR_EMERGENCY_TEXT} `}
                <Countdown timestamp={sabotageInfo.expires} classes="" />
                {` s (${sabotageInfo.progress}/2)`}
              </>
            </Task>
          )}
        </div>
      )}
    </div>
  );
}

type TaskProps = {
  text: string;
  completed: boolean;
  emergency?: boolean;
  children?: JSX.Element;
};

function Task({ text, completed = false, emergency = false, children }: TaskProps) {
  return (
    <div className="task-wrapper">
      <span
        className={`among-font task-font
      ${completed ? "completed" : ""}
      ${emergency ? "emergency" : ""} text-outline-1`}
      >
        {text}
        {children}
      </span>
    </div>
  );
}
