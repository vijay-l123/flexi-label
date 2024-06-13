import { SvgIcon as MuiSvgIcon, SvgIconProps } from "@mui/material";

import * as React from "react";

export default function SvgIcon(props: SvgIconProps) {
  const { children } = props;
  return <MuiSvgIcon {...props}>{children}</MuiSvgIcon>;
}
