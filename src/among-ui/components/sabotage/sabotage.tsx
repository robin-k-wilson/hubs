import React from "react";
import "./sabotage.scss";

type SabotageProps = {
  sabotageClick: (sabotageKind: SabotageKind) => void;
  closeMenu: () => void;
};

export function Sabotage(props: SabotageProps) {
  const { sabotageClick, closeMenu } = props;
  return (
    <div className="center-screen">
      <div className="sabotage-buttons-wrapper">
        <button
          className="sabotage-button"
          onClick={() => {
            console.log("clicked O2");
            sabotageClick("o2");
            closeMenu();
          }}
        >
          O2
        </button>
        <button
          className="sabotage-button"
          onClick={() => {
            console.log("clicked Reactor");
            sabotageClick("reactor");
            closeMenu();
          }}
        >
          Reactor
        </button>
      </div>
    </div>
  );
}
