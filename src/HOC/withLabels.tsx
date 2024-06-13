import React from "react";
import { LabelsContextProvider } from "../Context/LabelsContext";

export default function withLabels(Component: React.ComponentType) {
  return (props: any): any => {
    return (
      <LabelsContextProvider>
        <Component {...props} />
      </LabelsContextProvider>
    );
  };
}
