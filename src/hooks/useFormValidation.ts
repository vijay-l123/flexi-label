import React from "react";

export function useFormValidation(
  initialFValues: any,
  validateOnChange = false,
  validate?: any
) {
  const [values, setValues] = React.useState(initialFValues);
  const [errors, setErrors] = React.useState<any>({});
  const handleDateChange = (key: string, value: string) => {
    let errorMessage = "";
    const parsedDate = new Date(value);
    const isValidDate =
      parsedDate instanceof Date && !isNaN(parsedDate.getTime());

    if (!isValidDate && value.trim() !== "") {
      errorMessage = "Invalid date. Please enter a valid date.";
    }

    setValues({
      ...values,
      [key]: value,
    });
    if (validateOnChange) {
      validate({ [key]: value });
    }
    setErrors({
      ...errors,
      [key]: errorMessage,
    });
  };

  const handleInputChange = (e: any) => {
    const { name, value, isAddValue = false, setIdFlag = "" } = e.target;
    // debugger
    if (name === "fileData") {
      setValues({
        ...values,
        [name]: value,
        fileName: value.name,
      });
    } else if (isAddValue) {
      setValues({
        ...values,
        [name]: value,
        [setIdFlag]: -1,
      });
    } else {
      setValues({
        ...values,
        [name]: value,
      });
    }
    if (value) {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
    if (validateOnChange) validate({ [name]: value });
  };

  const resetValidationState = () => {
    setValues(initialFValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    validate,
    handleInputChange,
    handleDateChange,
    resetValidationState,
  };
}
