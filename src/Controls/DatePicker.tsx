import React from "react";
import Controls from "./Controls";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export default function DatePicker(props: any) {
  const { onChange, label, initValue, name } = props;
  const [value, setValue] = React.useState<Date | null>(initValue);

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  const convertToDefEventPara = (name: any, value: any) => ({
    target: { name, value },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label={label || "Select Date"}
        inputFormat="MM/dd/yyyy"
        value={value}
        onChange={handleChange}
        renderInput={(params: any) => (
          <Controls.Input
            {...params}
            name={name}
            size={"small"}
            onChange={onChange(convertToDefEventPara(name, value))}
          />
        )}
      />
    </LocalizationProvider>
  );
}
