import React from "react";

type RoleRevealScreenProps = ScreensRoleReveal;

export function RoleRevealScreen(props: RoleRevealScreenProps) {
  return (
    <>
      <span className="among-font screen-text text-outline-3">{props.role}</span>
    </>
  );
}
