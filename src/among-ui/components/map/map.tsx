import React, { useState } from "react";
import { ImageButton } from "../common/image-button";
import { DrawnMap } from "./drawn-map";
import mapIconImage from "../../../assets/images/among-images/pngs/map-icon.png";
import "./map.scss";

type MapProps = {
  playerPosition: Position;
  tasks: Array<CrewTask>;
  emergencyTasks: Array<CrewTask>;
};

export function Map(props: MapProps) {
  const { playerPosition, tasks, emergencyTasks } = props;
  const [showMap, toggleMap] = useState(false);
  const toggleMapOnOff = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (showMap) toggleMap(false);
    else toggleMap(true);
  };

  return (
    <div className="">
      <ImageButton
        wrapperClasses="map-button-container"
        imageClasses="map-button-image"
        alt="Map icon to open map"
        imageSrc={mapIconImage}
        onClick={toggleMapOnOff}
      />
      {showMap && (
        <DrawnMap
          playerPosition={playerPosition}
          tasks={tasks}
          emergencyTasks={emergencyTasks}
          onClose={toggleMapOnOff}
        />
      )}
    </div>
  );
}
