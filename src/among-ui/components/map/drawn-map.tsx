import React, { useEffect, useRef } from "react";
import mapImg from "../../../assets/images/among-images/pngs/skeld-map.png";
import purpleMe from "../../../assets/images/among-images/pngs/meeting-purple.png";
import closeIconImage from "../../../assets/images/among-images/pngs/close-icon.png";
import "./map.scss";

const MAP_UI_DIMENSIONS_X = 800;
const MAP_UI_DIMENSIONS_Y = 600;

const WORLD_DIMENSIONS_X = 5;
const WORLD_DIMENSIONS_Y = 5;
const WORLD_DIMENSIONS_OFFSET_X = -1; // if not start at 0,0
const WORLD_DIMENSIONS_OFFSET_Y = -1;

type DrawnMapProps = {
  playerPosition: Position;
  tasks: Array<CrewTask>;
  emergencyTasks: Array<CrewTask>;
  onClose: (e: React.MouseEvent<HTMLElement>) => void;
};

export function DrawnMap(props: DrawnMapProps) {
  const { onClose, playerPosition, tasks, emergencyTasks } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log("inside drawn map");
    console.log(playerPosition);
    console.log(tasks);
    const ctx: CanvasRenderingContext2D | undefined | null = canvasRef?.current?.getContext("2d");
    if (ctx === null || ctx === undefined) return;

    drawMe({ x: playerPosition.x, y: playerPosition.y }, ctx);
    tasks
      .filter((task) => task.completed === false)
      .forEach((task) => drawTask({ x: task.position.x, y: task.position.y }, ctx));
    emergencyTasks
      .filter((task) => task.completed === false)
      .forEach((task) => drawTask({ x: task.position.x, y: task.position.y }, ctx, true));
  }, []);

  return (
    <div className="map-container">
      <img src={closeIconImage} onClick={onClose} alt="Close map button." className="close-icon" />
      <img className="map-image" src={mapImg} />
      <canvas ref={canvasRef} id="canvas" height="800px" width="800px"></canvas>
    </div>
  );
}

function worldToMapPosition(worldPosition: Position2D) {
  // TODO add offsets
  const a = worldPosition.x * MAP_UI_DIMENSIONS_X;
  const ui_x = a / WORLD_DIMENSIONS_X;
  const b = worldPosition.y * MAP_UI_DIMENSIONS_Y;
  const ui_y = b / WORLD_DIMENSIONS_Y;
  return [ui_x, ui_y];
}

const ME_IMG_WIDTH = 75;
const ME_IMG_HEIGHT = 100;
function drawMe(position: Position2D, ctx: any) {
  console.log("me");
  console.log(position);
  const [x, y] = worldToMapPosition(position);

  const image = new Image();
  image.onload = () => {
    console.log("Image loaded");
    ctx.drawImage(image, x - ME_IMG_WIDTH / 2, y - ME_IMG_HEIGHT / 2, ME_IMG_WIDTH, ME_IMG_HEIGHT);
  };
  image.src = purpleMe;
}

function drawTask(position: Position2D, ctx: any, isEmergency?: boolean) {
  console.log("task");
  console.log(position);
  const [x, y] = worldToMapPosition(position);

  ctx.beginPath();
  ctx.fillStyle = isEmergency ? "red" : "gold";
  ctx.arc(x, y, 20, 2 * Math.PI, false);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}
