import React from "react";
import { Button as MuiButton } from "@mui/material";
import CustomTheme from "../Theme/CustomTheme";

export default function Button(props: any) {
  const { text, size, color, variant, onClick, children, ...other } = props;
  console.log(other);
  return (
    <MuiButton
      variant={variant || "contained"}
      size={size || "medium"}
      color={color || "primary"}
      onClick={onClick}
      {...other}
    >
      {children}
    </MuiButton>
  );
}
