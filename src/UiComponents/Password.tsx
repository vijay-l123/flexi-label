import { FormLabel, Grid } from "@mui/material";
import React from "react";
import Controls from "../Controls/Controls";

function Password(props: any) {
  const { formValues, handleTextChange } = props;

  return (
    <Grid container sx={{ alignItems: "center" }}>
      <Grid item xs={3}>
        <FormLabel>Confirm Password:</FormLabel>
      </Grid>
      <Grid item xs={9}>
        <Controls.Input
          required
          fullWidth
          margin="normal"
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formValues.password.value}
          onChange={handleTextChange}
          error={formValues.password.error}
        />
      </Grid>
    </Grid>
  );
}

export default React.memo(Password);
