import { Paper, Box } from "@mui/material";
import React from "react";
import { MasterAuthProvider } from "../Context/MasterAuthContext";

function withMaster(Component: React.ComponentType) {
  return (hocProps: any) => {
    return (
      <MasterAuthProvider>
        <Component {...hocProps}></Component>
      </MasterAuthProvider>
    );
  };
}

export default withMaster;
