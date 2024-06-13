import * as React from "react";
import { TextareaAutosize, TextField } from "@mui/material";

export default function InputTextArea(props: any) {
  const { name, label, value, onChange, error = null, ...other } = props;
  console.log(other);
  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      multiline
      InputProps={{
        inputComponent: TextareaAutosize,
        inputProps: {
          style: {
            resize: "auto",
          },
          minRows: "3",
        },
      }}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  );
}
