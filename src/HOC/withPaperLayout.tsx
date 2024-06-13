import { Paper, Box } from "@mui/material";
import * as React from "react";

function withPaperLayout<T>(Component: React.ComponentType<T>, props: any) {
  return (hocProps: T) => {
    const { paperHeight, boxHeight } = props;
    const hocOutProps = {
      ...hocProps,
      props,
    };
    return (
      <Paper elevation={4} sx={{ p: 1, mx: 0.2, height: paperHeight }}>
        <Box sx={{ height: boxHeight }}>
          <Component {...hocOutProps}></Component>
        </Box>
      </Paper>
    );
  };
}

export default withPaperLayout;
