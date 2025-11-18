import React from "react";

export function useFormValidation(
  initialFValues: any,
  validateOnChange = false,
  validate?: any
) {
  const [values, setValues] = React.useState(initialFValues);
  const [errors, setErrors] = React.useState<any>({});

//   const handleDateChange = (key: string, value: any) => {
//       setValues({
//         ...values,
//         [key]: value 
//  })
//      if (validateOnChange) validate({ [key]: value });

//   }
// const handleDateChange = (key: string, value: string) => {
//   let formattedValue = value;
//   let errorMessage = "";

//   // Remove any non-digit characters
//   const cleaned = value.replace(/[^\d]/g, "");

//   // Auto-insert '-' for MM-DD-YYYY
//   if (cleaned.length <= 2) formattedValue = cleaned;
//   else if (cleaned.length <= 4)
//     formattedValue = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
//   else
//     formattedValue = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}`;

//   // Validate format when full date is entered
//   if (formattedValue.length === 10) {
//     const isValidDate = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/.test(formattedValue);
//     if (!isValidDate) {
//       errorMessage = "Invalid date format (MM-DD-YYYY)";
//     }
//   }

//   // Update values
//   setValues({
//     ...values,
//     [key]: formattedValue,
//   });

//   // Trigger validation if needed
//   if (validateOnChange) {
//     validate({ [key]: formattedValue });
//   }

//   // Manually set validation error if applicable
//   setErrors({
//     ...errors,
//     [key]: errorMessage,
//   });
// };
const handleDateChange = (key: string, value: string) => {
  let errorMessage = "";

  // Try to parse the entered value into a valid date
  const parsedDate = new Date(value);

  // Check if it's a valid date
  const isValidDate =
    parsedDate instanceof Date && !isNaN(parsedDate.getTime());

  if (!isValidDate && value.trim() !== "") {
    errorMessage = "Invalid date. Please enter a valid date.";
  }

  // Update state
  setValues({
    ...values,
    [key]: value,
  });

  // Validate if needed
  if (validateOnChange) {
    validate({ [key]: value });
  }

  // Set custom error if invalid
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
