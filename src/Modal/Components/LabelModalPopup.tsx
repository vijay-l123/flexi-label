import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  FormHelperText,
  MenuItem,
  Select,
} from "@mui/material";
import {
  Close,
  Save,
  Visibility,
  ReplyAll,
  TaskAlt,
} from "@mui/icons-material";
import React from "react";
import Controls from "../../Controls/Controls";
import Services from "../../Services/Services";

import { useFormValidation } from "../../hooks/useFormValidation";
import CustomTheme from "../../Theme/CustomTheme";
import Popup from "./Popup";
import Password from "../../UiComponents/Password";
import { showButton } from "../utilModal";
import useAuthContext from "../../Authentication/AuthProvider";
import common from "../../utils/common";
import useLabelsContext from "../../Context/LabelsContext";
import { IModalProps } from "../../utils/types";
import useMasterAuthContext from "../../Context/MasterAuthContext";
import { createLabelData, ICreateLabelParams } from "../utilLabelCreation";
import AutoComplete from "../../Controls/AutoComplete";

const { TButtonClick, fetchConfirmationTitle, TAppPage } = common;

const style = {
  //position: "absolute" as "absolute",
  //top: "50%",
  //left: "50%",
  //transform: "translate(-50%, -50%)",

  // bgcolor: "background.paper",

  p: 4,
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  m: "auto",
};

const types = [
  {
    name: "ANDA",
    value: 0,
  },
  {
    name: "Product",
    value: 1,
  },
  {
    name: "PM Code",
    value: 2,
  },
  {
    name: "Customers",
    value: 3,
  },
  {
    name: "Label Types",
    value: 4,
  },
  {
    name: "Labels",
    value: 5,
  },

  // {
  //   name: "Label Version History",
  //   value: 6,
  // },
];

interface IAndaTypes {
  andaid: number;
  andanumber: string;
  startDate: string;
  endData: string;
  isActive: boolean;
}

const initialFValues = {
  labelVersionId: 0,
  andaNumber: "",
  isActive: true,
  productName: "",
  selectedAnda: "",
  remarks: "",
  pmCode: "",
  description: "",
  customerName: "",
  address: "",
  code: "",
  labelType: "",
  selectedProduct: "",
  selectedPmCode: "",
  selectedLabelType: "",
  selectedCustomer: "",
  printer: "",
  ndcNumber: "",
  jobNumber: "",
  tabletCount: "N/A",
  proofNumber: "",
  versionNumber: "",
  fileData: "",
  fileName: "",
  isFileInfoChanged: false,
  fileId: "",
  foldSize: "",
  flatSize: "",
  ccf: "",
  labelDescription: "",
};

//TODO
// function fetchFileData(fileId: number) {
//   const fetchDocument: any = async () => {
//     try {
//       let response = await Services.Document.downloadDocument(fileId);
//       return response;
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   fileId &&
//     fetchDocument().then((response: any) => {
//       console.log(response.data);

//       console.log(response);
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "file.pdf");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     });
//   return [];
// }

interface formParams {
  name: string;
  value: string;
}
interface IKeyMapping {
  [propertyName: string]: {
    value: string;
    error: string;
  };
}

function isValidPassword(val: string) {
  return val.length === 0;
}

function checkErrorValidation(params: formParams) {
  const { name, value } = params;

  if (name === "password")
    return {
      error: isValidPassword(value) ? "You must enter a password" : "",
    };

  // if (name === "remarks")
  //   return {
  //     error: value.length === 0 ? "You must enter a password" : "",
  //   };
}

function LabelModalPopup(props: IModalProps) {
  const { authData, canEdit } = useAuthContext();
  const {
    isOpen,
    closeModal,
    editState,
    newTypeState,
    setNewTypeState,
    rowState,
    defaultToLabel,
    isCreateNewVersion,
  } = props;
  const { updateLabelsData } = useLabelsContext();
  const { updateMasterData } = useMasterAuthContext();
  console.log("rowstate", rowState);
  console.log("modalprops", props);

  const [andaList, setAndaList] = React.useState<IAndaTypes[]>([]);
  const [productList, setProductList] = React.useState<any[]>([]);
  const [pmCodes, setPmCodes] = React.useState<any[]>([]);
  const [labelTypes, setLabelTypes] = React.useState<any[]>([]);
  const [customers, setCustomers] = React.useState<any[]>([]);

  const [formValues, setFormValues] = React.useState<IKeyMapping>({
    password: {
      value: "",
      error: "",
    },
    remarks: {
      value: "",
      error: "",
    },
  });

  const [buttonState, setButtonState] = React.useState<any>();

  const handleTextChange = (e: any) => {
    let temp = JSON.parse(JSON.stringify(formValues));

    const { name, value } = e.target;

    const updatedValues = {
      ...temp,
      [name]: {
        ...formValues[name],
        value,
        ...checkErrorValidation(e.target),
      },
    };
    temp = updatedValues;

    setFormValues(temp);
  };
  const [isPasswordConfirmationPopup, setPasswordConfirmationPopup] =
    React.useState<boolean>(false);

  const handleClose = () => {
    resetValidationState();
    closeModal(false);
  };

  const closePasswordConfirmationPopup = (val: boolean) => {
    setPasswordConfirmationPopup(val);
    setFormValues((prevState) => ({
      ...prevState,
      password: {
        value: "",
        error: "",
      },
      remarks: {
        value: "",
        error: "",
      },
    }));
  };

  const newType = newTypeState;

  const handleTypeChange = (event: any) => setNewTypeState(event.target.value);

  const validate = (fieldValues = values): any => {
    let temp: any = { ...errors };
    if ("andaNumber" in fieldValues) {
      temp.andaNumber = fieldValues.andaNumber
        ? false
        : "Anda Number is required.";
    }
    if ("productName" in fieldValues) {
      temp.productName = fieldValues.productName
        ? false
        : "Product Name is required.";
    }
    if ("selectedAnda" in fieldValues) {
      temp.selectedAnda = fieldValues.selectedAnda ? false : "Select Anda.";
    }
    // if ("remarks" in fieldValues) {
    //   temp.remarks = fieldValues.remarks ? false : "Remarks is required.";
    // }
    if ("pmCode" in fieldValues) {
      temp.pmCode = fieldValues.pmCode ? false : "PM Code is required.";
    }
    if ("description" in fieldValues) {
      temp.description = fieldValues.description
        ? false
        : "Description is required.";
    }
    if ("customerName" in fieldValues) {
      temp.customerName = fieldValues.customerName
        ? false
        : "Customer Name is required.";
    }
    if ("address" in fieldValues) {
      temp.address = fieldValues.address ? false : "Address is required.";
    }
    // if ("code" in fieldValues) {
    //   temp.code = fieldValues.code ? false : "Code is required.";
    // }
    if ("labelType" in fieldValues) {
      temp.labelType = fieldValues.labelType
        ? false
        : "Label Type is required.";
    }
    if ("selectedProduct" in fieldValues) {
      temp.selectedProduct = fieldValues.selectedProduct
        ? false
        : "Select Product.";
    }
    if ("selectedPmCode" in fieldValues) {
      temp.selectedPmCode = fieldValues.selectedPmCode
        ? false
        : "Select PM Code.";
    }
    if ("selectedLabelType" in fieldValues) {
      temp.selectedLabelType = fieldValues.selectedLabelType
        ? false
        : "Select Label Type.";
    }
    if ("selectedCustomer" in fieldValues) {
      temp.selectedCustomer = fieldValues.selectedCustomer
        ? false
        : "Select Customer.";
    }
    if ("printer" in fieldValues) {
      temp.printer = fieldValues.printer ? false : "Printer is required.";
    }
    if ("ndcNumber" in fieldValues) {
      temp.ndcNumber = fieldValues.ndcNumber
        ? false
        : "Ndc Number is required.";
    }
    if ("jobNumber" in fieldValues) {
      temp.jobNumber = fieldValues.jobNumber
        ? false
        : "Job Number is required.";
    }
    if ("versionNumber" in fieldValues) {
      temp.versionNumber = fieldValues.versionNumber
        ? false
        : "Revision Number is required.";
    }
    if ("proofNumber" in fieldValues) {
      temp.proofNumber = fieldValues.proofNumber
        ? false
        : "Proof Number is required.";
    }
    // if ("fileData" in fieldValues) {
    //   console.log("filedata", fieldValues.fileData);
    //   temp.fileData = fieldValues.fileData?.name
    //     ? false
    //     : "File Data is required.";
    // }
    if ("fileName" in fieldValues) {
      temp.fileName = fieldValues.fileName ? false : "File Name is required.";
    }
    // if ("fileId" in fieldValues) {
    //   temp.fileId = fieldValues.fileId ? false : "File Id is required.";
    // }
    // if ("email" in fieldValues)
    //   temp.email = /$^|.+@.+..+/.test(fieldValues.email)
    //     ? false
    //     : "Email is not valid.";
    // if ("mobile" in fieldValues)
    //   temp.mobile =
    //     fieldValues.mobile.length > 9 ? false : "Minimum 1false numbers required.";
    // if ("departmentId" in fieldValues)
    //   temp.departmentId =
    //     fieldValues.departmentId.length != 0 ? false : "This field is required.";
    setErrors((prevState: any) => ({
      ...prevState,
      ...temp,
    }));

    //if (fieldValues == values) return Object.values(temp).every((x) => x == false);

    return Object.values(temp).every((x) => x === false);
  };

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetValidationState,
  } = useFormValidation(initialFValues, true, validate);

  React.useMemo(() => {
    const fetchAndaList = async () => {
      try {
        let response = await Services.Anda.getAndaList();
        setAndaList(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchProductList = async () => {
      try {
        let response = await Services.Product.getProductList();
        setProductList(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPmCodes = async () => {
      try {
        let response = await Services.PmCode.getPmCodeList();
        setPmCodes(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchLabelTypes = async () => {
      try {
        let response = await Services.LabelType.getLabelTypeList();
        setLabelTypes(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCustomers = async () => {
      try {
        let response = await Services.Customer.getCustomerList();
        setCustomers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    switch (newType) {
      case 1:
        fetchAndaList();
        break;
      // case 5:
      //   fetchAndaList();
      //   fetchProductList();
      //   fetchPmCodes();
      //   fetchLabelTypes();
      //   fetchCustomers();
      //   break;
      case 5:
      case 6:
        fetchAndaList();
        fetchProductList();
        fetchPmCodes();
        fetchLabelTypes();
        fetchCustomers();
        break;
    }

    resetValidationState();
  }, [newTypeState]);

  React.useMemo(() => {
    if (editState) {
      setValues((prevState: any) => ({
        ...prevState,
        labelVersionId: +rowState.id, // +rowState.currentVersionId,
        andaNumber: rowState.andaNumber,
        selectedAnda: rowState.andaId || rowState.andaid,
        selectedProduct: rowState.productId,
        selectedPmCode: rowState.pmCodeId || rowState.pmcodeId,
        selectedLabelType: rowState.labelTypeId ?? rowState.typeId ?? "",
        selectedCustomer: rowState.customerId,
        productName: rowState.productName,
        remarks: isCreateNewVersion ? "" : rowState.remarks,
        pmCode: rowState.pmCode,
        customerName:
          rowState.customer ?? rowState.customerName ?? rowState.name ?? "",
        address: rowState.address,
        code: rowState.customerCode,
        labelType: rowState.labelType || rowState.type,
        description: rowState.description,
        printer: isCreateNewVersion ? "" : rowState.printer,
        ndcNumber: rowState.ndcNumber,
        jobNumber: isCreateNewVersion ? "" : rowState.jobNumber,
        tabletCount: rowState.tabletCount,
        versionNumber: isCreateNewVersion ? "" : rowState.currentVersion,
        foldSize: isCreateNewVersion ? "" : rowState.foldSize,
        flatSize: isCreateNewVersion ? "" : rowState.flatSize,
        ccf: isCreateNewVersion ? "" : rowState.ccf,
        labelDescription: rowState.labelDescription,
        proofNumber: isCreateNewVersion ? "" : rowState.proofNumber,
        fileData: isCreateNewVersion
          ? ""
          : { name: rowState.currentVersionFileName }, //TODOfetchFileData(rowState.currentVerstionFileId), //{ name: rowState.currentVersionFileName },
        fileName: isCreateNewVersion
          ? ""
          : rowState.currentVersionFileName || "",
        fileId: isCreateNewVersion ? "" : rowState.currentVersionFileId || "-1",
      }));
    }
  }, [editState, rowState]);

  function triggerUpdateMasterData() {
    if (document.title.includes(TAppPage.Master)) {
      updateMasterData(true);
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const currKeys = [...new FormData(event.currentTarget).keys()];

    const temp: any[] = [];

    currKeys.forEach((key) => {
      temp.push({ [key]: data.get(key) });
    });

    const isValid: any[] = [];
    temp.forEach((target: any) => {
      isValid.push(validate(target));
    });

    if (isValid.every((i) => i === true)) {
      const createLabelParams: ICreateLabelParams = {
        newType,
        event,
        data,
        values,
        triggerUpdateMasterData,
        editState,
        updateLabelsData,
        rowState,
        isCreateNewVersion,
      };
      createLabelData(createLabelParams);

      handleClose();

      //resetValidationState();
    }
  };

  const handleWorkflowProcess = (clickedButton: any) => {
    if (values.labelVersionId > 0) {
      setPasswordConfirmationPopup(true);
      setButtonState(clickedButton);
      //handleClose();
    }
  };

  const onOkClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log({
      password: data.get("password"),
      remarks: data.get("remarks"),
    });

    const formData = [
      {
        target: {
          name: "password",
          value: data.get("password") as string,
        },
      },
      {
        target: {
          name: "remarks",
          value: data.get("remarks") as string,
        },
      },
    ];

    let temp = JSON.parse(JSON.stringify(values));

    formData.map((item) => {
      const { name, value } = item.target;

      const updatedValues = {
        ...temp,
        [name]: {
          ...formValues[name],
          value,
          ...checkErrorValidation(item.target),
        },
      };
      temp = updatedValues;
    });

    setFormValues(temp);

    let hasError = false;

    Object.values(temp).forEach((item: any) => {
      if (item.error) hasError = item.error;
    });

    if (!hasError) {
      const updateLabelVersion = async () => {
        try {
          const apiParams = {
            labelVersionId: values.labelVersionId,
            remarks: data.get("remarks") as string,
          };
          let response = null;
          if (buttonState === TButtonClick.SubmitForReview)
            response = await Services.LabelVersion.submitForReview(
              apiParams
            ).then((success) => {
              updateLabelsData(true);
              handleClose();
            });
          if (
            buttonState === TButtonClick.Resend ||
            buttonState === TButtonClick.Approve
          )
            response = await Services.LabelVersion.processReview({
              ...apiParams,
              action: Number(buttonState),
            }).then((success) => {
              updateLabelsData(true);
              handleClose();
            });

          console.log(response);
        } catch (error) {
          console.log(error);
        }
      };

      updateLabelVersion();
      closePasswordConfirmationPopup(false);
    }
  };

  const submitReviewConfirmationProps = {
    isPopup: isPasswordConfirmationPopup,
    closePopup: closePasswordConfirmationPopup,
    dialogTitle: fetchConfirmationTitle(buttonState) || "",
    form: "confirmationBox",
  };

  return (
    <div>
      {confirmationPopup(
        submitReviewConfirmationProps,
        onOkClick,
        formValues,
        handleTextChange
      )}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        fullWidth
        maxWidth="md"
        sx={style}
      >
        <DialogTitle
          sx={{
            // mt: 2,
            // mb: 2,
            px: 2,
            py: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: CustomTheme.CustomColor.Primary.dark, // "#d1c4e9",
            color: CustomTheme.CustomColor.Common.white,
          }}
        >
          {isCreateNewVersion
            ? "Create New Version"
            : editState
            ? "Edit Label:"
            : "Create New:"}
          <FormControl sx={{ mx: 2, minWidth: "25%" }}>
            <Select
              required
              fullWidth
              displayEmpty
              size="small"
              labelId="select-types-label"
              id="select-types"
              value={newType}
              name="types"
              onChange={handleTypeChange}
              disabled={true}
              sx={{
                backgroundColor: CustomTheme.CustomColor.Common.white,
              }}

              // error={formValues.roles.error}
            >
              {types.map((type, index) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
            {/* <FormHelperText sx={{ color: "#D32F2F" }}>
                {formValues.roles.error && formValues.roles.errorMessage}
              </FormHelperText> */}
          </FormControl>
          <Controls.IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            color="inherit"
          >
            <Close />
          </Controls.IconButton>
        </DialogTitle>
        <DialogContent>
          {" "}
          <Box
            noValidate
            component="form"
            onSubmit={handleSubmit}
            sx={{ mx: 2 }}
            id="boxForm"
          >
            {newType === 0 && (
              <FormControl
                required
                variant="filled"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  ANDA Number:
                </FormLabel>
                <Controls.Input
                  required
                  name="andaNumber"
                  label="ANDA Number"
                  type="text"
                  id="andaNumber"
                  size={"small"}
                  value={values.andaNumber}
                  error={errors.andaNumber}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}

            {newType === 1 && (
              <FormControl
                required
                variant="filled"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Product Name:
                </FormLabel>
                <Controls.Input
                  required
                  name="productName"
                  label="Product Name"
                  type="text"
                  id="productName"
                  size={"small"}
                  value={values.productName}
                  error={errors.productName}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}
            {(newType === 1 || newType === 5 || isCreateNewVersion) && (
              <FormControl
                required
                variant="filled"
                disabled={!canEdit || isCreateNewVersion}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  ANDA Number:
                </FormLabel>
                <Box
                  sx={{
                    width: "40%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* <Select
                    required
                    fullWidth
                    displayEmpty
                    size="small"
                    variant="outlined"
                    labelId="select-anda"
                    id="selectAnda"
                    name="selectedAnda"
                    value={values.selectedAnda || ""}
                    error={
                      errors.selectedAnda && errors.selectedAnda.length > 0
                    }
                    onChange={handleInputChange}
                    //onChange={handleTypeChange}

                    // error={formValues.roles.error}
                  >
                    {andaList.map((type, index) => (
                      <MenuItem key={type.andaid} value={type.andaid}>
                        {type.andanumber}
                      </MenuItem>
                    ))}
                  </Select> */}
                  <AutoComplete
                    required
                    isAddOption={!editState}
                    listData={andaList}
                    selectedKey="andanumber"
                    selectedId="andaid"
                    id="selectAnda"
                    name="selectedAnda"
                    actualNameValue="andaNumber"
                    label="ANDA Number"
                    selectedValue={values.andaNumber || ""}
                    errors={
                      errors.selectedAnda && errors.selectedAnda.length > 0
                    }
                    handleInputChange={handleInputChange}
                    disabled={!canEdit || isCreateNewVersion}
                  ></AutoComplete>
                  <FormHelperText sx={{ color: "#D32F2F" }}>
                    {errors.selectedAnda && errors.selectedAnda}
                  </FormHelperText>
                </Box>
              </FormControl>
            )}
            {newType === 2 && (
              <FormControl
                required
                variant="filled"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  PM Code:
                </FormLabel>
                <Controls.Input
                  required
                  name="pmCode"
                  label="PM Code"
                  type="text"
                  id="pmCode"
                  size={"small"}
                  value={values.pmCode}
                  error={errors.pmCode}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}
            {newType === 3 && (
              <FormControl
                required
                variant="filled"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Name:
                </FormLabel>
                <Controls.Input
                  required
                  name="customerName"
                  label="Name"
                  type="text"
                  id="customerName"
                  size={"small"}
                  value={values.customerName}
                  error={errors.customerName}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}
            {newType === 3 && (
              <FormControl
                required
                variant="filled"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Address:
                </FormLabel>
                <Controls.InputTextArea
                  required
                  name="address"
                  label="Address"
                  type="text"
                  id="address"
                  size={"small"}
                  value={values.address}
                  error={errors.address}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.InputTextArea>
              </FormControl>
            )}

            {/* {newType === 3 && (
              <FormControl
                required
                variant="filled"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Code:
                </FormLabel>
                <Controls.Input
                  required
                  name="code"
                  label="Code"
                  type="text"
                  id="code"
                  size={"small"}
                  value={values.code}
                  error={errors.code}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )} */}
            {newType === 4 && (
              <FormControl
                required
                variant="filled"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Label Type:
                </FormLabel>
                <Controls.Input
                  required
                  name="labelType"
                  label="Label Type"
                  type="text"
                  id="labelType"
                  size={"small"}
                  value={values.labelType}
                  error={errors.labelType}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}

            {(newType === 5 || isCreateNewVersion) && (
              <FormControl
                required
                variant="filled"
                disabled={!canEdit || isCreateNewVersion}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Product:
                </FormLabel>
                <Box
                  sx={{
                    width: "40%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* <Select
                    required
                    fullWidth
                    displayEmpty
                    size="small"
                    variant="outlined"
                    labelId="select-product"
                    id="selectProduct"
                    name="selectedProduct"
                    value={values.selectedProduct || ""}
                    error={
                      errors.selectedProduct &&
                      errors.selectedProduct.length > 0
                    }
                    onChange={handleInputChange}
                    //onChange={handleTypeChange}

                    // error={formValues.roles.error}
                  >
                    {productList.map((product, index) => (
                      <MenuItem
                        key={product.productId}
                        value={product.productId}
                      >
                        {product.productname}
                      </MenuItem>
                    ))}
                  </Select> */}

                  <AutoComplete
                    required
                    listData={productList}
                    selectedKey="productname"
                    selectedId="productId"
                    id="selectProduct"
                    name="selectedProduct"
                    actualNameValue="productName"
                    label="Product"
                    isAddOption={!editState}
                    selectedValue={values.productName || ""}
                    errors={
                      errors.selectedProduct &&
                      errors.selectedProduct.length > 0
                    }
                    handleInputChange={handleInputChange}
                    disabled={!canEdit || isCreateNewVersion}
                  ></AutoComplete>
                  <FormHelperText sx={{ color: "#D32F2F" }}>
                    {errors.selectedProduct && errors.selectedProduct}
                  </FormHelperText>
                </Box>
              </FormControl>
            )}

            {(newType === 5 || isCreateNewVersion) && (
              <FormControl
                required
                variant="filled"
                disabled={!canEdit || isCreateNewVersion}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  PM Code:
                </FormLabel>
                <Box
                  sx={{
                    width: "40%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* <Select
                    required
                    fullWidth
                    displayEmpty
                    size="small"
                    variant="outlined"
                    labelId="select-pmcode"
                    id="selectPmCode"
                    name="selectedPmCode"
                    value={values.selectedPmCode || ""}
                    error={
                      errors.selectedPmCode && errors.selectedPmCode.length > 0
                    }
                    onChange={handleInputChange}
                    //onChange={handleTypeChange}

                    // error={formValues.roles.error}
                  >
                    {pmCodes.map((code, index) => (
                      <MenuItem key={code.pmcodeId} value={code.pmcodeId}>
                        {code.pmcode}
                      </MenuItem>
                    ))}
                  </Select> */}
                  <AutoComplete
                    required
                    listData={pmCodes}
                    selectedKey="pmcode"
                    selectedId="pmcodeId"
                    id="selectPmCode"
                    name="selectedPmCode"
                    actualNameValue="pmCode"
                    label="PM Code"
                    isAddOption={!editState}
                    selectedValue={values.pmCode || ""}
                    errors={
                      errors.selectedPmCode && errors.selectedPmCode.length > 0
                    }
                    handleInputChange={handleInputChange}
                    disabled={!canEdit || isCreateNewVersion}
                  ></AutoComplete>
                  <FormHelperText sx={{ color: "#D32F2F" }}>
                    {errors.selectedPmCode && errors.selectedPmCode}
                  </FormHelperText>
                </Box>
              </FormControl>
            )}

            {(newType === 5 || isCreateNewVersion) && (
              <FormControl
                required
                variant="filled"
                disabled={!canEdit || isCreateNewVersion}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Label Type:
                </FormLabel>
                <Box
                  sx={{
                    width: "40%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* <Select
                    required
                    fullWidth
                    displayEmpty
                    size="small"
                    variant="outlined"
                    labelId="select-labeltypeid"
                    id="selectLabelType"
                    name="selectedLabelType"
                    value={values.selectedLabelType || ""}
                    error={
                      errors.selectedLabelType &&
                      errors.selectedLabelType.length > 0
                    }
                    onChange={handleInputChange}
                    //onChange={handleTypeChange}

                    // error={formValues.roles.error}
                  >
                    {labelTypes.map((labelType, index) => (
                      <MenuItem key={labelType.typeId} value={labelType.typeId}>
                        {labelType.type}
                      </MenuItem>
                    ))}
                  </Select> */}
                  <AutoComplete
                    required
                    listData={labelTypes}
                    selectedKey="type"
                    selectedId="typeId"
                    id="selectLabelType"
                    name="selectedLabelType"
                    actualNameValue="labelType"
                    label="Label Type"
                    isAddOption={!editState}
                    selectedValue={values.labelType || ""}
                    errors={
                      errors.selectedLabelType &&
                      errors.selectedLabelType.length > 0
                    }
                    handleInputChange={handleInputChange}
                    disabled={!canEdit || isCreateNewVersion}
                  ></AutoComplete>
                  <FormHelperText sx={{ color: "#D32F2F" }}>
                    {errors.selectedLabelType && errors.selectedLabelType}
                  </FormHelperText>
                </Box>
              </FormControl>
            )}

            {(newType === 5 || isCreateNewVersion) && (
              <FormControl
                required
                variant="filled"
                disabled={!canEdit || isCreateNewVersion}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Customer:
                </FormLabel>
                <Box
                  sx={{
                    width: "40%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* <Select
                    required
                    fullWidth
                    displayEmpty
                    size="small"
                    variant="outlined"
                    labelId="select-customer"
                    id="selectCustomer"
                    name="selectedCustomer"
                    value={values.selectedCustomer || ""}
                    error={
                      errors.selectedCustomer &&
                      errors.selectedCustomer.length > 0
                    }
                    onChange={handleInputChange}
                    //onChange={handleTypeChange}

                    // error={formValues.roles.error}
                  >
                    {customers.map((customer, index) => (
                      <MenuItem
                        key={customer.customerId}
                        value={customer.customerId}
                      >
                        {customer.name}
                      </MenuItem>
                    ))}
                  </Select> */}
                  <AutoComplete
                    required
                    listData={customers}
                    selectedKey="name"
                    selectedId="customerId"
                    id="selectCustomer"
                    name="selectedCustomer"
                    actualNameValue="customerName"
                    label="Customer"
                    isAddOption={!editState}
                    selectedValue={values.customerName || ""}
                    errors={
                      errors.selectedCustomer &&
                      errors.selectedCustomer.length > 0
                    }
                    handleInputChange={handleInputChange}
                    disabled={!canEdit || isCreateNewVersion}
                  ></AutoComplete>
                  <FormHelperText sx={{ color: "#D32F2F" }}>
                    {errors.selectedCustomer && errors.selectedCustomer}
                  </FormHelperText>
                </Box>
              </FormControl>
            )}

            {(newType === 5 || isCreateNewVersion) && (
              <FormControl
                required
                variant="filled"
                disabled={!canEdit || isCreateNewVersion}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Ndc Number:
                </FormLabel>
                <Controls.Input
                  required
                  disabled={!canEdit || isCreateNewVersion}
                  name="ndcNumber"
                  label="Ndc Number"
                  type="text"
                  id="ndcNumber"
                  size={"small"}
                  value={values.ndcNumber}
                  error={errors.ndcNumber}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}

            {(newType === 5 || isCreateNewVersion) && (
              <FormControl
                required
                variant="filled"
                disabled={!canEdit || isCreateNewVersion}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Tablet Count:
                </FormLabel>
                <Controls.Input
                  required
                  disabled={!canEdit || isCreateNewVersion}
                  name="tabletCount"
                  label="Tablet Count"
                  type="text"
                  id="tabletCount"
                  size={"small"}
                  value={values.tabletCount}
                  error={errors.tabletCount}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}
            {isCreateNewVersion && (
              <FormControl
                required
                variant="filled"
                disabled={!canEdit}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Printer:
                </FormLabel>
                <Controls.Input
                  required
                  disabled={!canEdit}
                  name="printer"
                  label="Printer"
                  type="text"
                  id="printer"
                  size={"small"}
                  value={values.printer}
                  error={errors.printer}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}

            {isCreateNewVersion && (
              <FormControl
                required
                variant="filled"
                disabled={!canEdit}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Job Number:
                </FormLabel>
                <Controls.Input
                  required
                  disabled={!canEdit}
                  name="jobNumber"
                  label="Job Number"
                  type="text"
                  id="jobNumber"
                  size={"small"}
                  value={values.jobNumber}
                  error={errors.jobNumber}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}
            {isCreateNewVersion && (
              <FormControl
                required
                variant="filled"
                disabled={!canEdit}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Proof Number:
                </FormLabel>
                <Controls.Input
                  required
                  disabled={!canEdit}
                  name="proofNumber"
                  label="Proof Number"
                  type="text"
                  id="proofNumber"
                  size={"small"}
                  value={values.proofNumber}
                  error={errors.proofNumber}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}

            {isCreateNewVersion && (
              <FormControl
                required
                variant="filled"
                disabled={!canEdit}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Revision Number:
                </FormLabel>
                <Controls.Input
                  required
                  disabled={!canEdit}
                  name="versionNumber"
                  label="Revision Number"
                  type="text"
                  id="versionNumber"
                  size={"small"}
                  value={values.versionNumber}
                  error={errors.versionNumber}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}

            {isCreateNewVersion && (
              <FormControl
                variant="filled"
                disabled={!canEdit}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Fold Size:
                </FormLabel>
                <Controls.Input
                  disabled={!canEdit}
                  name="foldSize"
                  label="Fold Size"
                  type="text"
                  id="foldSize"
                  size={"small"}
                  value={values.foldSize}
                  error={errors.foldSize}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}
            {isCreateNewVersion && (
              <FormControl
                variant="filled"
                disabled={!canEdit}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Flat Size:
                </FormLabel>
                <Controls.Input
                  disabled={!canEdit}
                  name="flatSize"
                  label="Flat Size"
                  type="text"
                  id="flatSize"
                  size={"small"}
                  value={values.flatSize}
                  error={errors.flatSize}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}
            {isCreateNewVersion && (
              <FormControl
                variant="filled"
                disabled={!canEdit}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  CCF:
                </FormLabel>
                <Controls.Input
                  disabled={!canEdit}
                  name="ccf"
                  label="CCF"
                  type="text"
                  id="ccf"
                  size={"small"}
                  value={values.ccf}
                  error={errors.ccf}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}

            {isCreateNewVersion && (
              <FormControl
                variant="filled"
                disabled={!canEdit}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  File Data:
                </FormLabel>
                {/* <input type="file" name="file" /> */}
                <Controls.InputUpload
                  disabled={!canEdit}
                  label="Upload Files"
                  name="fileData"
                  id="fileData"
                  size={"small"}
                  value={values.fileData}
                  error={errors.fileData}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.InputUpload>
              </FormControl>
            )}

            {isCreateNewVersion && (
              <FormControl
                variant="filled"
                disabled={!canEdit}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  File Name:
                </FormLabel>
                <Controls.Input
                  required
                  disabled={!canEdit}
                  name="fileName"
                  label="File Name"
                  type="text"
                  id="fileName"
                  size={"small"}
                  value={values.fileName}
                  error={errors.fileName}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}
            {newType === 5 && !isCreateNewVersion && (
              <FormControl
                variant="filled"
                disabled={!canEdit}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Label Description:
                </FormLabel>
                <Controls.InputTextArea
                  disabled={!canEdit}
                  name="labelDescription"
                  label="Label Description"
                  type="text"
                  id="labelDescription"
                  size={"small"}
                  value={values.labelDescription}
                  error={errors.labelDescription}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.InputTextArea>
              </FormControl>
            )}

            {(newType === 1 ||
              // newType === 2 ||
              //  newType === 4 ||
              newType === 5 ||
              isCreateNewVersion) && (
              <FormControl
                variant="filled"
                disabled={!canEdit}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Remarks:
                </FormLabel>
                <Controls.InputTextArea
                  disabled={!canEdit}
                  name="remarks"
                  label="Remarks"
                  type="text"
                  id="remarks"
                  size={"small"}
                  value={values.remarks}
                  error={errors.remarks}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.InputTextArea>
              </FormControl>
            )}
            {(newType === 2 || newType === 4) && (
              <FormControl
                required
                variant="filled"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  Description:
                </FormLabel>
                <Controls.InputTextArea
                  required
                  name="description"
                  label="Description"
                  type="text"
                  id="description"
                  size={"small"}
                  value={values.description}
                  error={errors.description}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.InputTextArea>
              </FormControl>
            )}

            {newType === 0 && (
              <FormControl
                required
                variant="filled"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <FormLabel
                  sx={{
                    //color: "#212B36",
                    width: "25%",
                  }}
                >
                  IsActive:
                </FormLabel>
                <Controls.Checkbox
                  name="isActive"
                  isChecked={true}
                ></Controls.Checkbox>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ backgroundColor: CustomTheme.CustomColor.Site.bgColor }}
        >
          <Controls.Button
            variant="outlined"
            onClick={handleClose}
            startIcon={<Close></Close>}
          >
            Close
          </Controls.Button>
          {showButton({
            rowState,
            currentButton: "Save",
            authData,
            isCreateNew: true,
          }) && (
            <Controls.Button
              type="submit"
              variant="contained"
              form="boxForm"
              startIcon={<Save></Save>}
            >
              Save
            </Controls.Button>
          )}
          {editState &&
            showButton({
              rowState,
              currentButton: "SubmitForReview",
              authData,
            }) && (
              <Controls.Button
                // type="submit"
                sx={{
                  backgroundColor: `${CustomTheme.CustomColor.Indigo.main}`,
                }}
                variant="contained"
                form="boxForm"
                startIcon={<Visibility></Visibility>}
                onClick={() =>
                  handleWorkflowProcess(TButtonClick.SubmitForReview)
                }
              >
                Submit For Review
              </Controls.Button>
            )}
          {editState &&
            showButton({ rowState, currentButton: "Resend", authData }) && (
              <Controls.Button
                // type="submit"
                sx={{
                  backgroundColor: `${CustomTheme.CustomColor.DeepOrange.main}`,
                }}
                variant="contained"
                form="boxForm"
                startIcon={<ReplyAll></ReplyAll>}
                onClick={() => handleWorkflowProcess(TButtonClick.Resend)}
              >
                Resend
              </Controls.Button>
            )}
          {editState &&
            showButton({ rowState, currentButton: "Approve", authData }) && (
              <Controls.Button
                // type="submit"
                sx={{
                  backgroundColor: `${CustomTheme.CustomColor.Green.darker}`,
                }}
                variant="contained"
                form="boxForm"
                startIcon={<TaskAlt></TaskAlt>}
                onClick={() => handleWorkflowProcess(TButtonClick.Approve)}
              >
                Approve
              </Controls.Button>
            )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

function confirmationPopup(
  submitReviewConfirmationProps: {
    isPopup: boolean;
    closePopup: (val: boolean) => void;
    dialogTitle: string;
    form: string;
  },
  onOkClick: (event: React.FormEvent<HTMLFormElement>) => void,
  formValues: IKeyMapping,
  handleTextChange: (e: any) => void
) {
  return (
    <Popup {...submitReviewConfirmationProps}>
      <Box
        noValidate
        component="form"
        onSubmit={onOkClick}
        sx={{ mx: 2 }}
        id="confirmationBox"
      >
        <FormControl required>
          {" "}
          <Password
            formValues={formValues}
            handleTextChange={handleTextChange}
          ></Password>
        </FormControl>
        <FormControl
          variant="filled"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            mt: 2,
            mb: 2,
          }}
        >
          <FormLabel
            sx={{
              //color: "#212B36",
              width: "25%",
            }}
          >
            Remarks:
          </FormLabel>
          <Controls.InputTextArea
            name="remarks"
            label="Remarks"
            type="text"
            id="remarks"
            size={"small"}
            value={formValues.remarks.value}
            error={formValues.remarks.error}
            onChange={handleTextChange}
          ></Controls.InputTextArea>
        </FormControl>
      </Box>
    </Popup>
  );
}

function propsAreEqual(prevProps: any, nextProps: any) {
  console.log("prevprops", prevProps);
  console.log("nextprops", nextProps);
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.editState === nextProps.editState &&
    prevProps.rowState === nextProps.rowState &&
    prevProps.newTypeState === nextProps.newTypeState &&
    prevProps.isCreateNewVersion === nextProps.isCreateNewVersion &&
    prevProps.defaultToLabel === nextProps.defaultToLabel
  );
}

export default React.memo(LabelModalPopup, propsAreEqual);

//export default LabelModalPopup;
