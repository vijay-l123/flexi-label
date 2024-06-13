import { TextField } from "@mui/material";
import React from "react";

export default function Input(props: any) {
  const { name, label, value, onChange, error = null, ...other } = props;
  console.log(other);
  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  );
}
