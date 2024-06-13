import * as React from "react";
import { TextField as MatTextField } from "@mui/material";
//import { useForm, Controller } from "react-hook-form";
import {
  Autocomplete as MatAutocomplete,
  createFilterOptions,
} from "@mui/material";

const filter = createFilterOptions<any>();

interface IAutoCompleteProps {
  listData: any[];
  selectedKey: any;
  selectedId: any;
  id: any;
  name: any;
  required: boolean;
  label: string;
  selectedValue: string;
  errors: any;
  actualNameValue: any;
  handleInputChange: any;
  isAddOption: boolean;
  disabled: boolean;
}

export default function AutoComplete(props: IAutoCompleteProps) {
  const {
    listData,
    selectedKey,
    selectedId,
    id,
    name,
    required,
    label,
    errors,
    actualNameValue,
    selectedValue,
    handleInputChange,
    isAddOption = false,
    disabled,
  } = props;
  const [value, setValue] = React.useState<any | null>(selectedValue);

  return (
    <MatAutocomplete
      aria-required={required}
      value={value}
      onChange={(event: any, newValue: any) => {
        if (typeof newValue === "string") {
          setValue({
            [selectedKey]: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            [selectedKey]: newValue.inputValue,
          });
        } else {
          setValue(newValue);
        }

        let changeEvents: any;

        changeEvents = {
          target: {
            name: name,
            value:
              newValue === null
                ? null
                : newValue.inputValue
                ? -1
                : newValue[selectedId],
          },
        };

        if (newValue && newValue.inputValue) {
          changeEvents = {
            target: {
              name: actualNameValue,
              value: newValue.inputValue,
              isAddValue: true,
              setIdFlag: name,
            },
          };
        }
        handleInputChange(changeEvents);
      }}
      filterOptions={(options: any, params: any) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option: any) => inputValue === option[selectedKey]
        );
        if (inputValue !== "" && !isExisting && isAddOption) {
          filtered.push({
            inputValue,
            [selectedKey]: `Add ${label} : "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id={id}
      options={listData}
      getOptionLabel={(option: any) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option[selectedKey];
      }}
      renderOption={(props: any, option: any) => (
        <li {...props}>{option[selectedKey]}</li>
      )}
      sx={{ width: 300 }}
      freeSolo={isAddOption}
      renderInput={(params: any) => (
        <MatTextField {...params} label={label} error={errors} />
      )}
      disabled={disabled}
    />
  );
}
