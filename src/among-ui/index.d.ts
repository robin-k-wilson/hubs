declare module "*.png" {
    const content: string;
    export default content;
  }

// declare module "*.svg" {
//     const value: any;
//     export default value;
//   }

  declare module "\*.svg" {
    import React = require("react");
    export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
  }
