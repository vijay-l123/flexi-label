import { Box, Paper, Typography } from "@mui/material";
import * as React from "react";
import withPaperLayout from "../../HOC/withPaperLayout";

function Profile() {
  return <Typography> Hi Profile </Typography>;
}

const paperLayoutProfileProps = {
  paperHeight: "50vh",
  boxHeight: "40vh",
};

export default withPaperLayout(Profile, paperLayoutProfileProps);
