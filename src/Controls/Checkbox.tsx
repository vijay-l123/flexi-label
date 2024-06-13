import React from "react";
import { Checkbox as MuiCheckbox } from "@mui/material";

export default function Checkbox(props: any) {
  const { name, isChecked, onChange, ...other } = props;
  const [value, setValue] = React.useState(isChecked);

  const handleChange = (name: any, value: any) => {
    if (value) {
      setValue(true);
    } else {
      setValue(false);
    }

    return {
      target: {
        name,
        value,
      },
    };
  };

  return (
    <MuiCheckbox
      name={name}
      checked={value}
      value={value}
      onChange={(e) => onChange(handleChange(name, e.target.checked))}
      {...other}
    ></MuiCheckbox>
  );
}
