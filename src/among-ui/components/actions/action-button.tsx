import React from "react";
import { Countdown } from "../common/countdown";
import { ImageButton } from "../common/image-button";

type ActionButtonProps = {
  active: boolean;
  num: number; // date.now() + x into the future
  imageSrc: string;
  onClick: () => void;
  alt: string;
};

export function ActionButton({ num, active, imageSrc, onClick, alt }: ActionButtonProps) {
  return (
    <div className="action-button">
      <ImageButton
        imageClasses={`action-button-image ${active ? "active" : "not-active"}`}
        wrapperClasses=""
        imageSrc={imageSrc}
        onClick={onClick}
        alt={alt}
      />
      <Countdown timestamp={num} classes="centered among-font cooldown-num text-outline-3" />
    </div>
  );
}
