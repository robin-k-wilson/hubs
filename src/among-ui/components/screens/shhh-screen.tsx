import React from "react";
import shhhPurpleImage from "../../../assets/images/among-images/svgs/shhh-purple.svg";
import shhhBlackImage from "../../../assets/images/among-images/svgs/shhh-black.svg";
import shhhRedImage from "../../../assets/images/among-images/svgs/shhh-red.svg";

export function ShhhScreen() {
  const shhhImage = [shhhBlackImage, shhhPurpleImage, shhhRedImage][Math.floor(Math.random() * 3)];
  return (
    <>
      <div className="shhh-image-wrapper">
        <img src={shhhImage} className="killed-screen killed-image shhh-image" />
      </div>
    </>
  );
}
