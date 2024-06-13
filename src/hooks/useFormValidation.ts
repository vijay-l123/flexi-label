import React from "react";

export function useFormValidation(
  initialFValues: any,
  validateOnChange = false,
  validate: any
) {
  const [values, setValues] = React.useState(initialFValues);
  const [errors, setErrors] = React.useState<any>({});

  const handleInputChange = (e: any) => {
    const { name, value, isAddValue = false, setIdFlag = "" } = e.target;

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
    resetValidationState,
  };
}
