import React from "react";

interface Test {
  robin: string;
}

export function TsTest(props: Test) {
  const str2 = props.robin;
  const str: string = "I am typescritp";

  console.log(str);
  console.log(str2);
  return (
    <div>
      <span>{str}</span>
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          backgroundColor: "red",
          top: 0,
          left: 0,
          zIndex: 1000
        }}
      />
    </div>
  );
}
