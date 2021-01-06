import React from "react";

type TsTestProps = {
  toyName: string
};

export function TsTest({ toyName }: TsTestProps) {
  return <div>{toyName}</div>;
}
