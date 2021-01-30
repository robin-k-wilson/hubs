import React, { useState } from "react";
import meetingImageBlue from "../../../assets/images/among-images/svgs/meeting-blue.svg";
import meetingImageBrown from "../../../assets/images/among-images/svgs/meeting-brown.svg";
import meetingImageGreen from "../../../assets/images/among-images/svgs/meeting-green.svg";
import meetingImageBlack from "../../../assets/images/among-images/svgs/meeting-black.svg";
import meetingImageLightBlue from "../../../assets/images/among-images/svgs/meeting-lightblue.svg";
import meetingImageLime from "../../../assets/images/among-images/svgs/meeting-lime.svg";
import meetingImageOrange from "../../../assets/images/among-images/svgs/meeting-orange.svg";
import meetingImagePink from "../../../assets/images/among-images/svgs/meeting-pink.svg";
import meetingImagePurple from "../../../assets/images/among-images/svgs/meeting-purple.svg";
import meetingImageRed from "../../../assets/images/among-images/svgs/meeting-red.svg";
import meetingImageWhite from "../../../assets/images/among-images/svgs/meeting-white.svg";
import meetingImageYellow from "../../../assets/images/among-images/svgs/meeting-yellow.svg";
import micIcon from "../../../assets/images/among-images/pngs/mic-icon.png";
import ivotedIcon from "../../../assets/images/among-images/pngs/ivoted.png";
import { Countdown } from "../common/countdown";

const colorToImage: { [color in Color]: string } = {
  blue: meetingImageBlue,
  brown: meetingImageBrown,
  green: meetingImageGreen,
  black: meetingImageBlack,
  lightblue: meetingImageLightBlue,
  lime: meetingImageLime,
  orange: meetingImageOrange,
  pink: meetingImagePink,
  purple: meetingImagePurple,
  red: meetingImageRed,
  white: meetingImageWhite,
  yellow: meetingImageYellow,
};

type MeetingScreenProps = ScreensMeeting;

export function MeetingScreen(props: MeetingScreenProps) {
  const { myPlayerId, meetingInfo, impostors, iDead } = props; // vote removed to avoid conflicts
  const [iVoted, setIVoted] = useState(false);

  function vote(e: React.MouseEvent<HTMLElement>, playerId: string | null) {
    // string if playerId
    // null if skip vote
    e.preventDefault();
    if (iVoted === true || iDead) return;
    console.log("I voted for " + name);
    props.vote(playerId);
    setIVoted(true);
  }
  // TODO WHO VOTED
  return (
    <div className="container-outside">
      <div className="container-inside">
        <h2 className="among-font text-outline-3">Who is the impostor?</h2>
        <div className="crew-container">
          {meetingInfo.players.map((crew: MeetingPlayer, idx) => {
            const { name = "missing name", playerId, dead } = crew;
            const playerVoted = meetingInfo.voterList.includes(playerId);
            console.log("did i vote?");
            console.log(playerVoted);
            const isReporter = meetingInfo.callerId === crew.playerId;
            const isImpostor = impostors.includes(playerId);
            const colorList: Array<Color> = Object.keys(colorToImage);
            const color: Color = colorList[idx];
            return (
              <CrewItem
                key={name + idx}
                name={name}
                playerId={playerId}
                dead={dead}
                isImpostor={isImpostor}
                isReporter={isReporter}
                playerVoted={playerVoted}
                vote={vote}
                iVoted={iVoted && myPlayerId === playerId}
                color={color}
                iDead={iDead}
              />
            );
          })}
          <Countdown timestamp={meetingInfo.cooldown} classes="" />
        </div>
        <button onClick={(e: React.MouseEvent<HTMLElement>) => vote(e, null)}>Skip vote</button>
      </div>
      <div className="ipad-button"></div>
    </div>
  );
}

type CrewItemProps = {
  name: string;
  playerId: string;
  color: Color;
  isImpostor: boolean;
  isReporter: boolean;
  dead: boolean;
  vote: (e: React.MouseEvent<HTMLElement>, name: string | null) => void;
  iVoted: boolean;
  playerVoted: boolean;
  iDead: boolean;
};

function CrewItem(props: CrewItemProps) {
  const { name, playerId, color, isReporter, dead, isImpostor, vote, iVoted, iDead, playerVoted } = props;
  const [showVoteButtons, toggleVoteButtons] = useState(false);
  function startVote(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    if (iVoted || iDead) return;
    if (showVoteButtons) toggleVoteButtons(false);
    else toggleVoteButtons(true);
  }
  function hideVoteButtons(e: React.MouseEvent<HTMLElement>) {
    if (iVoted) return;
    e.preventDefault();
    toggleVoteButtons(false);
  }
  console.log(color);
  console.log(iVoted);
  return (
    <div
      className={`crew-wrapper ${isReporter ? "justify-content-space-between" : "justify-content-flex-start"} ${
        dead ? "background-grey" : ""
      }`}
      onClick={startVote}
    >
      <div className="image-name-wrapper">
        {(iVoted || playerVoted) && <img src={ivotedIcon} className="image-ivoted" />}
        <img src={colorToImage[color]} className="crew-image" />
        <span className={`among-font text-outline-1 ${isImpostor ? "emergency" : ""}`}>{`${
          dead ? "DEAD " : ""
        }${name}`}</span>
        {!iDead && !dead && showVoteButtons && !iVoted && (
          <VoteButtons vote={vote} hideVoteButtons={hideVoteButtons} playerId={playerId} />
        )}
      </div>
      {isReporter && <img src={micIcon} className="microphone-image" />}
    </div>
  );
}

type VoteButtonsProps = {
  vote: (e: React.MouseEvent<HTMLElement>, name: string | null) => void;
  hideVoteButtons: (e: React.MouseEvent<HTMLElement>) => void;
  playerId: string;
};

function VoteButtons(props: VoteButtonsProps) {
  const { vote, hideVoteButtons, playerId } = props;
  return (
    <div>
      <button
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          vote(e, playerId);
        }}
      >
        YES
      </button>
      <button onClick={hideVoteButtons}>NO</button>
    </div>
  );
}
