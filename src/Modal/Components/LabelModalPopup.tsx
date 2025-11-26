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
  Autocomplete,
  TextField,
  IconButton,
  styled,
  Grid,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import {
  Close,
  Save,
  Visibility,
  VisibilityOff,
  ReplyAll,
  TaskAlt,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLookupDataAsync,
  resetLookupData,
} from "../../Redux/MasterDataUpdateSlice/getLookupSlice";
import { setEditClick } from "../../Redux/MasterDataUpdateSlice/LookupUpdate";
import PdfIconButton from "../../PDFIconBtn/Components/PdfIconButton";
import PDFViewer from "../../PDFViewer/Components/PDFViewer";
import { setPdfPopupOpen } from "../../Redux/PopupSlice/PopupSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useAxiosHandlerContext } from "../../AxiosHandler/AxiosHandler";
import AuthService from "../../Services/AuthService";

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
    name: "Lookup",
    value: 6,
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
export const colorOptions = [
  { label: "Red", value: "#FF0000" },
  { label: "Green", value: "#008000" },
  { label: "Blue", value: "#0000FF" },
  { label: "Yellow", value: "#ba8759" },
  { label: "Orange", value: "#E65100" },
  { label: "Purple", value: "#800080" },
  { label: "Gray", value: "#808080" },
  { label: "Cyan", value: "#00FFFF" },
  { label: "Brown", value: "#A52A2A" },
  { label: "Navy", value: "#000080" },
];

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
  return val?.length === 0;
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
  const StyledSelect = styled(Select)(({ theme }) => ({
    "&.MuiOutlinedInput-root": {
      borderRadius: 8,
      transition: "all 0.2s ease",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.grey[400],
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 3px ${theme.palette.primary.main}33`,
      },
    },
    "& .MuiSelect-select": {
      padding: "10px 14px",
      backgroundColor: theme.palette.background.paper,
    },
    "& .MuiSvgIcon-root": {
      color: theme.palette.grey[600],
      transition: "transform 0.2s ease",
    },
    "&.MuiSelect-iconOpen .MuiSvgIcon-root": {
      transform: "rotate(180deg)",
    },
  }));

  const { authData, canEdit } = useAuthContext();
  const {
    isOpen,
    closeModal,
    editState,
    newTypeState,
    setNewTypeState,
    rowState,
    defaultToLabel,
    selectedTab,
    isCreateNewVersion,
    isChangeColor,
    isImplementationDate,

    isApproved,
  } = props;
  const { updateLabelsData, setLabelversionAPiCall, LabelversionAPiCall } =
    useLabelsContext();
  const { updateMasterData, lookupvalue, setLookupvalue } =
    useMasterAuthContext();
  const { setAlertMessage, setSbOpen, setAlertSeverity } =
    useAxiosHandlerContext();
  const [andaList, setAndaList] = React.useState<IAndaTypes[]>([]);
  const [productList, setProductList] = React.useState<any[]>([]);
  const [pmCodes, setPmCodes] = React.useState<any[]>([]);
  const [labelTypes, setLabelTypes] = React.useState<any[]>([]);
  const [customers, setCustomers] = React.useState<any[]>([]);
  const dispatch = useDispatch();
  const { tabValue, lookupData, populatedValue, editClickEvent } = useSelector(
    (state: any) => state.lookupDataFlags
  );
  const lookupView = lookupData.rowData;
  const [selectedOption, setSelectedOption] = React.useState(null);
  const lookupDataSlice = useSelector(
    (state: any) => state.fetchGetLookupData.data
  );
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
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
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
    // debugger;
    // setLabelversionAPiCall(false);
    resetValidationState();
    closeModal(false);
    updateLabelsData(false);
    updateMasterData(false);
    dispatch(setEditClick(false));
    // setLookupvalue('1')
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

  const newType: any = newTypeState;

  const handleTypeChange = (event: any) => setNewTypeState(event.target.value);

  const validate = (fieldValues = values): any => {
    // debugger
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
    if ("pmCode" in fieldValues) {
      temp.pmCode = fieldValues.pmCode ? false : "PM Code is required.";
    }
    if ("description" in fieldValues) {
      temp.description = fieldValues.description
        ? false
        : newType == 4
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
    if ("implementationDate" in fieldValues) {
      const rawValue = String(fieldValues.implementationDate || "").trim();

      if (!rawValue) {
        temp.implementationDate = "Implementation Date is required.";
      } else {
        temp.implementationDate = false;
      }
    }

    if ("color" in fieldValues) {
      temp.color = fieldValues.color ? false : "color is required.";
    }

    if ("fileName" in fieldValues) {
      temp.fileName = fieldValues.fileName ? false : "File Name is required.";
    }
    setErrors((prevState: any) => ({
      ...prevState,
      ...temp,
    }));
    return Object.values(temp).every((x) => x === false);
  };

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    handleDateChange,
    resetValidationState,
  } = useFormValidation(initialFValues, true, validate);
  const isPdfOpen = useSelector((state: any) => state.popupSlice.isOpen);
  const handleClosePdf = () => {
    dispatch(setPdfPopupOpen(false));
  };

  React.useMemo(() => {
    const fetchAndaList = async () => {
      try {
        let response = await Services.Anda.getAndaList();
        // console.log("response",response);
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
// console.log("rowState",rowState);

  React.useMemo(() => {
    if (editState) {
      const parsedDate = rowState.implementationDate
        ? rowState.implementationDate
        : "";
      //   const parsedDate = rowState.implementationDate
      // ? dayjs(rowState.implementationDate).format("MM-DD-YYYY")
      // : "";
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
        remarks: rowState.remarks,
        pmCode: rowState.pmCode,
        customerName:
          rowState.customer ?? rowState.customerName ?? rowState.name ?? "",
        address: rowState.address,
        code: rowState.customerCode,
        labelType: rowState.labelType || rowState.type,
        description: rowState.description,
        printer: rowState.printer,
        ndcNumber: rowState.ndcNumber,
        // color: rowState.color,
        color: rowState.noOfColors,
        colorcode: rowState.colorCode,
        implementationDate: parsedDate,
        jobNumber: rowState.jobNumber,
        tabletCount: rowState.tabletCount,
        // versionNumber: rowState.currentVersion,
        versionNumber: rowState.revisionNumber,
        foldSize: rowState.foldSize,
        flatSize: rowState.flatSize,
        ccf: rowState.ccf,
        labelDescription: rowState.labelDescription,
        proofNumber: rowState.proofNumber,
        fileData: { name: rowState.currentVersionFileName },
        fileName: rowState.currentVersionFileName || "",
        fileId: rowState.currentVersionFileId || "-1",
      }));
    }
  }, [editState, rowState]);

  function triggerUpdateMasterData() {
    if (document.title.includes(TAppPage.Master)) {
      updateMasterData(true);
    }
  }

  useEffect(() => {
    if (editClickEvent) {
      setValues({ ...values, description: populatedValue?.description });
    }
  }, [populatedValue?.description]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // debugger
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const currKeys = [...new FormData(event.currentTarget).keys()];

    const temp: any[] = [];

    currKeys.forEach((key) => {
      temp.push({ [key]: data.get(key) });
    });
    if (values.implementationDate || isCreateNewVersion) {
      temp.push({
        implementationDate: !editState
          ? values.implementationDate
          : values?.implementationDate,
        color: values.color,
      });
    }
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
        updateMasterData,
        triggerUpdateMasterData,
        editState,
        isChangeColor,
        isApproved,
        selectedTab,
        updateLabelsData,
        setLabelversionAPiCall,
        LabelversionAPiCall,
        rowState,
        isCreateNewVersion,
        isImplementationDate,
      };
      createLabelData(createLabelParams, dispatch);
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

  const onOkClick = async (event: React.FormEvent<HTMLFormElement>) => {
    // debugger
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log({
      password: data.get("password"),
      remarks: data.get("remarks"),
    });
    const password = data.get("password") as string;
    const remarks = data.get("remarks") as string;
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
    if (hasError) return;

    try {
      const response = await AuthService.passwordCheckForProcees({
        userId: authData?.userId,
        password,
      });

      const apiResult = response?.data;

      if (apiResult?.status != 200) {
        // debugger
        setFormValues((prev) => ({
          ...prev,
          password: {
            ...prev.password,
            error: apiResult?.message || "Invalid password. Please try again.",
          },
        }));
        setAlertSeverity("error");
        setAlertMessage(
          apiResult?.message || "Invalid password. Please try again."
        );
        return;
      }

      console.log("Password validated successfully!");
    } catch (error: any) {
      console.error("Password validation error:", error);
      setAlertSeverity("error");
      setAlertMessage("Invalid password. Please try again.");
      return;
    }

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
            // debugger
            response = await Services.LabelVersion.processReview({
              ...apiParams,
              action: Number(buttonState),
            }).then((success) => {
              updateLabelsData(true);
              handleClose();
            });

          // console.log(response);
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

  const [selectedPrinter, setSelectedPrinter] = useState<any>("");
  const [selectedRevision, setSelectedRevision] = useState<any>("");
  const [selectedProof, setSelectedProof] = useState<any>("");
  const [selectedFlat, setSelectedFlat] = useState<any>("");
  const [selectedFold, setSelectedFold] = useState<any>("");

  const handlePrinterChange = (event: any, newValue: any) => {
    // debugger
    setSelectedPrinter(newValue);
  };

  const handleRevisionChange = (event: any, newValue: any) => {
    setSelectedRevision(newValue);
  };

  const handleProofChange = (event: any, newValue: any) => {
    setSelectedProof(newValue);
  };

  const handleFlatChange = (event: any, newValue: any) => {
    setSelectedFlat(newValue);
  };

  const handleFoldChange = (event: any, newValue: any) => {
    setSelectedFold(newValue);
  };

  useEffect(() => {
    dispatch(fetchLookupDataAsync());

    return () => {
      dispatch(resetLookupData());
    };
  }, [dispatch, newTypeState]);

  useEffect(() => {
    if (selectedOption) {
      const fieldsToUpdate = [
        "code",
        "versionNumber",
        "printer",
        "proofNumber",
        "flatSize",
        "foldSize",
        "remarks",
      ]; // Add more field names here if needed
      fieldsToUpdate.forEach((field) => {
        handleInputChange({ target: { name: field, value: selectedOption } });
      });
    }
  }, [selectedOption]);
  const selectedAndaObj = andaList?.find(
    (a) => a.andaid == values.selectedAnda
  ) || {
    andaid: rowState.andaid || rowState.andaId,
    andanumber: rowState.andaNumber,
  };

  const displayList = [
    ...andaList,
    ...(andaList.some((a) => a.andaid == selectedAndaObj.andaid)
      ? []
      : [selectedAndaObj]),
  ];
  // console.log("label values", values);
  const foldSizeOptions =
    lookupDataSlice?.rows?.filter((x: any) => x.Type === "6") || [];

  const selectedFoldSize =
    foldSizeOptions.find((x: any) => x.Description === values.foldSize) ||
    (values.foldSize ? { Description: values.foldSize } : null);
  //////
  const flateSizeOptions =
    (lookupDataSlice?.rows &&
      lookupDataSlice?.rows?.filter((item: any) => item?.Type === "5")) ||
    [];

  const selectedFlateSize =
    flateSizeOptions.find((x: any) => x.Description === values.flatSize) ||
    (values.flatSize ? { Description: values.flatSize } : null);
  ///////
  const versionNumberOptions =
    (lookupDataSlice?.rows &&
      lookupDataSlice?.rows?.filter((item: any) => item?.Type === "2")) ||
    [];

  const selectedversionNumber =
    versionNumberOptions.find(
      (x: any) => x.Description === values.versionNumber
    ) || (values.versionNumber ? { Description: values.versionNumber } : null);
  ///////
  const proofNumberOptions =
    (lookupDataSlice?.rows &&
      lookupDataSlice?.rows?.filter((item: any) => item?.Type === "4")) ||
    [];

  const selectedProofNumber =
    versionNumberOptions.find(
      (x: any) => x.Description === values.proofNumber
    ) || (values.proofNumber ? { Description: values.proofNumber } : null);

  return (
    <div>
      {confirmationPopup(
        submitReviewConfirmationProps,
        onOkClick,
        formValues,
        handleTextChange,
        showPassword,
        handleClickShowPassword,
        handleMouseDownPassword
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
            backgroundColor: CustomTheme.CustomColor.Primary.dark,
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
            >
              {types.map((type, index) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
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
                  error={errors?.andaNumber}
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
                  error={errors?.productName}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}
            {(newType === 1 || newType === 5 || isCreateNewVersion) &&
              !isChangeColor && (
                <FormControl
                  required
                  variant="filled"
                  // disabled={(canEdit && editState) || isCreateNewVersion}
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
                    <Autocomplete
                      fullWidth
                      size="small"
                      // options={andaList || []}
                      options={displayList}
                      getOptionLabel={(option) => option.andanumber || ""}
                      // value={
                      //   andaList.find(
                      //     (anda) => anda.andaid == values.selectedAnda
                      //   ) || null
                      // }
                      value={
                        displayList.find(
                          (anda) => anda.andaid == values.selectedAnda
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        handleInputChange({
                          target: {
                            name: "selectedAnda",
                            value: newValue ? newValue.andaid : "",
                          },
                        });
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.andaid === value.andaid
                      }
                      disabled={
                        (canEdit && editState) || isCreateNewVersion || !canEdit
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          label="ANDA Number"
                          name="selectedAnda"
                          variant="outlined"
                          disabled={
                            (canEdit && editState) ||
                            isCreateNewVersion ||
                            !canEdit
                          }
                          error={!!errors.selectedAnda}
                          helperText={
                            Array.isArray(errors.selectedAnda)
                              ? errors.selectedAnda[0]
                              : errors.selectedAnda || ""
                          }
                        />
                      )}
                      sx={{ width: 300 }}
                    />
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
                  error={errors?.pmCode}
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
                  error={errors?.customerName}
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
                  error={errors?.address}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.InputTextArea>
              </FormControl>
            )}

            {tabValue == 6 && lookupvalue == "1" && newType === 6 ? (
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
                    width: "25%",
                  }}
                >
                  Customer Code:
                </FormLabel>
                <Autocomplete
                  sx={{ width: "30%" }}
                  id="customer-code-autocomplete"
                  options={lookupData?.rowData
                    ?.map((item: any) => item?.description)
                    ?.reverse()}
                  getOptionLabel={(option: any) => option}
                  value={values?.description ?? selectedOption}
                  onChange={(event, newValue) => {
                    setSelectedOption(newValue);
                    handleInputChange(event);
                  }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="code"
                      label="Customer Code"
                      required
                      fullWidth
                      size="small"
                      error={errors?.code}
                      helperText={errors?.code && "Customer Code is required"}
                      onChange={handleInputChange}
                    />
                  )}
                />
              </FormControl>
            ) : (
              lookupvalue == "1" &&
              newType === 6 && (
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
                    Customer Code:
                  </FormLabel>
                  <Controls.Input
                    required
                    name="code"
                    label="Customer Code"
                    type="text"
                    id="code"
                    size={"small"}
                    value={values.code}
                    error={errors?.code}
                    onChange={handleInputChange}
                    // sx={{ width: "75%" }}
                  ></Controls.Input>
                </FormControl>
              )
            )}
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
                  error={errors?.labelType}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}

            {(newType === 5 || isCreateNewVersion) && !isChangeColor && (
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
                  Product:
                </FormLabel>
                <Box
                  sx={{
                    width: "40%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={productList || []}
                    getOptionLabel={(option) => option.productname || ""}
                    value={
                      productList.find(
                        (product) => product.productId == values.selectedProduct
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      // debugger
                      handleInputChange({
                        target: {
                          name: "selectedProduct",
                          value: newValue ? newValue.productId : "",
                        },
                      });
                    }}
                    onBlur={() => {}}
                    isOptionEqualToValue={(option, value) =>
                      option.productId === value.productId
                    }
                    disabled={
                      (canEdit &&
                        editState &&
                        (selectedTab == 2 || selectedTab == 1)) ||
                      isCreateNewVersion ||
                      !canEdit
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Product"
                        name="selectedProduct"
                        variant="outlined"
                        disabled={
                          (canEdit &&
                            editState &&
                            (selectedTab == 2 || selectedTab == 1)) ||
                          isCreateNewVersion ||
                          !canEdit
                        }
                        error={!!errors.selectedProduct}
                        helperText={
                          Array.isArray(errors.selectedProduct)
                            ? errors.selectedProduct[0]
                            : errors.selectedProduct || ""
                        }
                      />
                    )}
                    sx={{ width: 300 }}
                  />
                </Box>
              </FormControl>
            )}

            {(newType === 5 || isCreateNewVersion) && !isChangeColor && (
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
                <Box
                  sx={{
                    width: "40%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={pmCodes || []}
                    getOptionLabel={(option) => option.pmcode || ""}
                    value={
                      pmCodes.find(
                        (code) => code.pmcodeId == values.selectedPmCode
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: "selectedPmCode",
                          value: newValue ? newValue.pmcodeId : "",
                        },
                      });
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.pmcodeId === value.pmcodeId
                    }
                    disabled={
                      (canEdit &&
                        editState &&
                        (selectedTab == 2 || selectedTab == 1)) ||
                      isCreateNewVersion ||
                      !canEdit
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="PM Code"
                        name="selectedPmCode"
                        variant="outlined"
                        disabled={
                          (canEdit &&
                            editState &&
                            (selectedTab == 2 || selectedTab == 1)) ||
                          isCreateNewVersion ||
                          !canEdit
                        }
                        error={!!errors.selectedPmCode}
                        helperText={
                          Array.isArray(errors.selectedPmCode)
                            ? errors.selectedPmCode[0]
                            : errors.selectedPmCode || ""
                        }
                      />
                    )}
                    sx={{ width: 300 }}
                  />
                </Box>
              </FormControl>
            )}

            {(newType === 5 || isCreateNewVersion) && !isChangeColor && (
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
                <Box
                  sx={{
                    width: "40%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={labelTypes || []}
                    getOptionLabel={(option) => option.type || ""}
                    value={
                      labelTypes.find(
                        (labelType) =>
                          labelType.typeId == values.selectedLabelType
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: "selectedLabelType",
                          value: newValue ? newValue.typeId : "",
                        },
                      });
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.typeId === value.typeId
                    }
                    disabled={
                      (canEdit &&
                        editState &&
                        (selectedTab == 2 || selectedTab == 1)) ||
                      isCreateNewVersion ||
                      !canEdit
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Label Type"
                        name="selectedLabelType"
                        variant="outlined"
                        disabled={
                          (canEdit &&
                            editState &&
                            (selectedTab == 2 || selectedTab == 1)) ||
                          isCreateNewVersion ||
                          !canEdit
                        }
                        error={!!errors.selectedLabelType}
                        helperText={
                          Array.isArray(errors.selectedLabelType)
                            ? errors.selectedLabelType[0]
                            : errors.selectedLabelType || ""
                        }
                      />
                    )}
                    sx={{ width: 300 }}
                  />
                </Box>
              </FormControl>
            )}

            {(newType === 5 || isCreateNewVersion) && !isChangeColor && (
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
                  Customer:
                </FormLabel>
                <Box
                  sx={{
                    width: "40%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={customers || []}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      customers.find(
                        (customer) =>
                          customer.customerId == values.selectedCustomer
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: "selectedCustomer",
                          value: newValue ? newValue.customerId : "",
                        },
                      });
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.customerId === value.customerId
                    }
                    disabled={
                      (canEdit &&
                        editState &&
                        (selectedTab == 2 || selectedTab == 1)) ||
                      isCreateNewVersion ||
                      !canEdit
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Customer"
                        name="selectedCustomer"
                        variant="outlined"
                        disabled={
                          (canEdit &&
                            editState &&
                            (selectedTab == 2 || selectedTab == 1)) ||
                          isCreateNewVersion ||
                          !canEdit
                        }
                        error={!!errors.selectedCustomer}
                        helperText={
                          Array.isArray(errors.selectedCustomer)
                            ? errors.selectedCustomer[0]
                            : errors.selectedCustomer || ""
                        }
                      />
                    )}
                    sx={{ width: 300 }}
                  />
                </Box>
              </FormControl>
            )}

            {((newType === 5 && !isChangeColor) ||
              (isCreateNewVersion && editState && !isChangeColor)) && (
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
                  Ndc Number:
                </FormLabel>
                <Controls.Input
                  required
                  disabled={
                    (canEdit &&
                      editState &&
                      (selectedTab == 2 || selectedTab == 1)) ||
                    isCreateNewVersion ||
                    !canEdit
                  }
                  name="ndcNumber"
                  label="Ndc Number"
                  type="text"
                  id="ndcNumber"
                  size={"small"}
                  value={values.ndcNumber}
                  error={errors?.ndcNumber}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}

            {(newType === 5 || isCreateNewVersion) && !isChangeColor && (
              <FormControl
                // required
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
                  Tablet Count:
                </FormLabel>
                <Controls.Input
                  // required
                  disabled={
                    (canEdit &&
                      editState &&
                      (selectedTab == 2 || selectedTab == 1)) ||
                    isCreateNewVersion ||
                    !canEdit
                  }
                  name="tabletCount"
                  label="Tablet Count"
                  type="text"
                  id="tabletCount"
                  size={"small"}
                  value={values.tabletCount}
                  error={errors?.tabletCount}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.Input>
              </FormControl>
            )}
            {(tabValue == 6 && lookupvalue == "3" && newType == 6) ||
            (tabValue == 6 &&
              lookupvalue == "3" &&
              newType == 6 &&
              editState) ? (
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
                    width: "25%",
                  }}
                >
                  Printer:
                </FormLabel>
                <Autocomplete
                  sx={{ width: "30%" }}
                  options={
                    lookupData?.rowData
                      ? lookupData?.rowData
                          ?.map((item: any) => item.description)
                          ?.reverse()
                      : lookupDataSlice?.rows &&
                        lookupDataSlice?.rows
                          ?.filter((item: any) => item?.Type === "3")
                          ?.map((item: any) => item.Description)
                          ?.reverse()
                  }
                  getOptionLabel={(option: any) => option}
                  value={values?.description ?? selectedOption}
                  onChange={(event, newValue) => {
                    setSelectedOption(newValue);
                    handleInputChange(event);
                  }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="printer"
                      label="Printer"
                      required
                      fullWidth
                      size="small"
                      error={errors?.printer}
                      helperText={errors?.printer && "Printer is required"}
                      onChange={handleInputChange}
                    />
                  )}
                />
              </FormControl>
            ) : (
              (newType === 5 || isCreateNewVersion) &&
              !isChangeColor && (
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
                      width: "25%",
                    }}
                  >
                    Printer:
                  </FormLabel>
                  <Autocomplete
                    sx={{ width: "26.7%" }}
                    options={
                      lookupDataSlice?.rows
                        ?.filter((item: any) => item?.Type === "3")
                        ?.map((item: any) => item.Description) || []
                    }
                    getOptionLabel={(option) => option || ""}
                    value={values.printer || null} // string value
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: { name: "printer", value: newValue },
                      });
                    }}
                    //    options={
                    //    lookupDataSlice?.rows?.filter((item: any) => item?.Type === "3") || []
                    //   }
                    //  getOptionLabel={(option: any) => option?.Description || ""}
                    //  value={
                    //  lookupDataSlice?.rows?.find((item: any) => item?.Description === values.printer) || null
                    // }
                    //  onChange={(event, newValue) => {
                    //  handleInputChange({
                    //   target: { name: "printer", value: newValue?.Description || "" },
                    //  });
                    //   }}
                    disabled={
                      (canEdit &&
                        editState &&
                        (selectedTab == 2 || selectedTab == 1)) ||
                      isCreateNewVersion ||
                      !canEdit
                    }
                    // freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="printer"
                        label="Printer"
                        required
                        fullWidth
                        disabled={
                          (canEdit &&
                            editState &&
                            (selectedTab == 2 || selectedTab == 1)) ||
                          isCreateNewVersion ||
                          !canEdit
                        }
                        size="small"
                        error={errors?.printer}
                        // helperText={errors.printer && 'Printer is required'}
                        helperText={errors?.printer}
                        // onChange={handleInputChange}
                      />
                    )}
                  />
                </FormControl>
              )
            )}

            {(isCreateNewVersion ||
              (editState && (selectedTab == 2 || selectedTab == 1))) &&
              !isChangeColor && (
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
                    disabled={!canEdit || isChangeColor || isImplementationDate}
                    name="jobNumber"
                    label="Job Number"
                    type="text"
                    id="jobNumber"
                    size={"small"}
                    value={values.jobNumber}
                    error={errors?.jobNumber}
                    onChange={handleInputChange}
                    // sx={{ width: "75%" }}
                  ></Controls.Input>
                </FormControl>
              )}
            {(tabValue == 6 && lookupvalue == "4" && newType == 6) ||
            (tabValue == 6 &&
              lookupvalue == "4" &&
              newType == 6 &&
              editState) ? (
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
                    width: "25%",
                  }}
                >
                  Proof Number:
                </FormLabel>
                <Autocomplete
                  sx={{ width: "30%" }}
                  options={
                    lookupData?.rowData
                      ? lookupData?.rowData
                          ?.map((item: any) => item.description)
                          ?.reverse()
                      : lookupDataSlice?.rows &&
                        lookupDataSlice?.rows
                          ?.filter((item: any) => item?.Type === "4")
                          ?.map((item: any) => item.Description)
                          ?.reverse()
                  }
                  getOptionLabel={(option: any) => option}
                  value={values?.description ?? selectedOption}
                  onChange={(event, newValue) => {
                    setSelectedOption(newValue);
                    handleInputChange(event);
                  }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="proofNumber"
                      label="Proof Number"
                      required
                      fullWidth
                      size="small"
                      error={errors?.proofNumber}
                      helperText={
                        errors?.proofNumber && "proofNumber is required"
                      }
                      onChange={handleInputChange}
                    />
                  )}
                />
              </FormControl>
            ) : (
              (isCreateNewVersion ||
                (editState && (selectedTab == 2 || selectedTab == 1))) &&
              !isChangeColor && (
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
                      width: "25%",
                    }}
                  >
                    Proof Number:
                  </FormLabel>
                  <Autocomplete
                    sx={{ width: "26.7%" }}
                    options={
                      lookupDataSlice?.rows
                        ?.filter((item: any) => item?.Type === "4")
                        ?.map((item: any) => item.Description) || []
                    }
                    getOptionLabel={(option) => option || ""}
                    value={values.proofNumber || null}
                    // value={values.proofNumber || selectedProof}
                    // onChange={handleProofChange}
                    disabled={isChangeColor || isImplementationDate}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: { name: "proofNumber", value: newValue },
                      });
                    }}
                    // freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="proofNumber"
                        label="Proof Number"
                        required
                        fullWidth
                        disabled={isChangeColor || isImplementationDate}
                        size="small"
                        error={errors?.proofNumber}
                        helperText={
                          errors?.proofNumber && "proofNumber is required"
                        }
                        // onChange={handleInputChange}
                      />
                    )}
                  />
                </FormControl>
              )
            )}

            {(tabValue == 6 && lookupvalue == "2" && newType == 6) ||
            (tabValue == 6 &&
              lookupvalue == "2" &&
              newType == 6 &&
              editState) ? (
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
                    width: "25%",
                  }}
                >
                  Revision Number:
                </FormLabel>
                <Autocomplete
                  sx={{ width: "30%" }}
                  options={
                    lookupData?.rowData
                      ? lookupData?.rowData
                          ?.map((item: any) => item.description)
                          ?.reverse()
                      : lookupDataSlice?.rows &&
                        lookupDataSlice?.rows
                          ?.filter((item: any) => item?.Type === "2")
                          ?.map((item: any) => item.Description)
                          ?.reverse()
                  }
                  getOptionLabel={(option: any) => option}
                  value={values?.description ?? selectedOption}
                  onChange={(event, newValue) => {
                    setSelectedOption(newValue);
                    handleInputChange(event);
                  }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="versionNumber"
                      label="Revision Number"
                      required
                      fullWidth
                      size="small"
                      error={errors?.versionNumber}
                      helperText={
                        errors?.versionNumber && "Revision Number is required"
                      }
                      onChange={handleInputChange}
                    />
                  )}
                />
              </FormControl>
            ) : (
              (isCreateNewVersion ||
                (editState && (selectedTab == 2 || selectedTab == 1))) &&
              !isChangeColor && (
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
                      width: "25%",
                    }}
                  >
                    Revision Number:
                  </FormLabel>
                  <Autocomplete
                    sx={{ width: "26.7%" }}
                    options={
                      lookupDataSlice?.rows
                        ?.filter((item: any) => item?.Type === "2")
                        ?.map((item: any) => item.Description) || []
                    }
                    getOptionLabel={(option) => option || ""}
                    value={values.versionNumber || null}
                    //                   options={
                    //                  versionNumberOptions
                    //                  }
                    //                 //   options={
                    //                 //  lookupDataSlice?.rows && lookupDataSlice?.rows?.filter((item: any) => item?.Type === '2') || []
                    //                 //  }
                    //                  getOptionLabel={(option: any) => option?.Description || ""}
                    //                 value={
                    // selectedversionNumber}
                    // value={
                    // lookupDataSlice?.rows?.find((item: any) => item?.Description === values.versionNumber) || null
                    // }
                    // onChange={(event, newValue) => {
                    // handleInputChange({
                    // target: { name: "versionNumber", value: newValue?.Description || "" },
                    // });
                    // }}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: { name: "versionNumber", value: newValue },
                      });
                    }}
                    disabled={isChangeColor || isImplementationDate}
                    // freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="versionNumber"
                        label="Revision Number"
                        required
                        disabled={isChangeColor || isImplementationDate}
                        fullWidth
                        size="small"
                        error={errors?.versionNumber}
                        helperText={
                          errors?.versionNumber && "Revision Number is required"
                        }
                        // onChange={handleInputChange}
                      />
                    )}
                  />
                </FormControl>
              )
            )}

            {(tabValue == 6 && lookupvalue == "6" && newType == 6) ||
            (tabValue == 6 &&
              lookupvalue == "6" &&
              newType == 6 &&
              editState) ? (
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
                    width: "25%",
                  }}
                >
                  Fold Size:
                </FormLabel>
                <Autocomplete
                  sx={{ width: "30%" }}
                  options={
                    lookupData?.rowData
                      ? lookupData?.rowData
                          ?.map((item: any) => item.description)
                          ?.reverse()
                      : lookupDataSlice?.rows &&
                        lookupDataSlice?.rows
                          ?.filter((item: any) => item?.Type === "6")
                          ?.map((item: any) => item.Description)
                          ?.reverse()
                  }
                  getOptionLabel={(option: any) => option}
                  value={values?.description ?? selectedOption}
                  onChange={(event, newValue) => {
                    setSelectedOption(newValue);
                    handleInputChange(event); // You may need to adapt how you handle input change here
                  }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="foldSize"
                      label="Fold Size"
                      required
                      fullWidth
                      size="small"
                      error={errors?.foldSize}
                      helperText={errors?.foldSize && "Fold Size is required"}
                      onChange={handleInputChange}
                    />
                  )}
                />
              </FormControl>
            ) : (
              // ((isCreateNewVersion || editState) && values.foldSize
              (isCreateNewVersion ||
                (editState && (selectedTab == 2 || selectedTab == 1))) &&
              !isChangeColor && (
                //  || (lookupvalue == '6' && newType === 6) || (lookupvalue == '6' && newType === 6 && editState)
                <FormControl
                  // required
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
                      width: "25%",
                    }}
                  >
                    Fold Size:
                  </FormLabel>
                  <Autocomplete
                    sx={{ width: "26.7%" }}
                    //                 //     options={
                    //                 //  lookupDataSlice?.rows && lookupDataSlice?.rows?.filter((item: any) => item?.Type === '6') || []
                    //                 //  }
                    //                  getOptionLabel={(option: any) => option?.Description || ""}

                    // value={
                    // lookupDataSlice?.rows?.find((item: any) => item?.Description === values.foldSize) || null
                    // }
                    options={
                      lookupDataSlice?.rows
                        ?.filter((item: any) => item?.Type === "6")
                        ?.map((item: any) => item.Description) || []
                    }
                    getOptionLabel={(option) => option || ""}
                    value={values.foldSize || null} // string value
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: { name: "foldSize", value: newValue },
                      });
                    }}
                    // onChange={(event, newValue) => {
                    // handleInputChange({
                    // target: { name: "foldSize", value: newValue?.Description || "" },
                    // });
                    // }}
                    disabled={isChangeColor || isImplementationDate}
                    // freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="foldSize"
                        label="Fold Size"
                        // required
                        fullWidth
                        size="small"
                        disabled={isChangeColor || isImplementationDate}
                        error={errors?.foldSize}
                        helperText={errors?.foldSize && "Fold Size is required"}
                        // onChange={handleInputChange}
                      />
                    )}
                  />
                </FormControl>
              )
            )}
            {(tabValue == 6 && lookupvalue == "5" && newType == 6) ||
            (tabValue == 6 &&
              lookupvalue == "5" &&
              newType == 6 &&
              editState) ? (
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
                    width: "25%",
                  }}
                >
                  Flat Size:
                </FormLabel>
                <Autocomplete
                  sx={{ width: "30%" }}
                  options={
                    lookupData?.rowData
                      ? lookupData?.rowData
                          ?.map((item: any) => item.description)
                          ?.reverse()
                      : lookupDataSlice?.rows
                          ?.filter((item: any) => item?.Type === "5")
                          ?.map((item: any) => item.Description)
                          ?.reverse()
                  }
                  getOptionLabel={(option: any) => option}
                  value={values?.description ?? selectedOption}
                  onChange={(event, newValue) => {
                    setSelectedOption(newValue);
                    handleInputChange(event);
                  }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="flatSize"
                      label="Flat Size"
                      required
                      fullWidth
                      size="small"
                      error={errors?.flatSize}
                      helperText={errors?.flatSize && "Flat Size is required"}
                      onChange={handleInputChange}
                    />
                  )}
                />
              </FormControl>
            ) : (
              (isCreateNewVersion ||
                (editState && (selectedTab == 2 || selectedTab == 1))) &&
              !isChangeColor && (
                <FormControl
                  // required
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
                      width: "25%",
                    }}
                  >
                    Flat Size:
                  </FormLabel>
                  <Autocomplete
                    sx={{ width: "26.7%" }}
                    options={
                      lookupDataSlice?.rows
                        ?.filter((item: any) => item?.Type === "5")
                        ?.map((item: any) => item.Description) || []
                    }
                    getOptionLabel={(option) => option || ""}
                    value={values.flatSize || null} // string value
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: { name: "flatSize", value: newValue },
                      });
                    }}
                    disabled={isChangeColor || isImplementationDate}
                    // freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="flatSize"
                        label="Flat Size"
                        // required
                        fullWidth
                        size="small"
                        disabled={isChangeColor || isImplementationDate}
                        error={errors?.flatSize}
                        helperText={errors?.flatSize && "Flat Size is required"}
                        // onChange={handleInputChange}
                      />
                    )}
                  />
                </FormControl>
              )
            )}

            {/* {(isCreateNewVersion || editState) && values.ccf && ( */}
            {(isCreateNewVersion ||
              (editState && (selectedTab == 2 || selectedTab == 1))) &&
              !isChangeColor && (
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
                    disabled={!canEdit || isChangeColor || isImplementationDate}
                    name="ccf"
                    label="CCF"
                    type="text"
                    id="ccf"
                    size={"small"}
                    value={values.ccf}
                    error={errors?.ccf}
                    onChange={handleInputChange}
                    // sx={{ width: "75%" }}
                  ></Controls.Input>
                </FormControl>
              )}
            {(isCreateNewVersion ||
              (editState && (selectedTab == 2 || selectedTab == 1))) &&
              !isChangeColor && (
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
                    Implementation Date:
                  </FormLabel>
                  <Controls.Input
                    disabled={isChangeColor}
                    name="implementationDate"
                    label="Implementation Date"
                    type="text"
                    required
                    id="implementationDate"
                    size={"small"}
                    value={values.implementationDate}
                    error={errors.implementationDate}
                    onChange={handleInputChange}
                    // sx={{ width: "75%" }}
                  ></Controls.Input>
                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Box sx={{ display: "block", gap: 1, mt: 2 }}>
                                  <DatePicker
                                    label="Implementation Date"
                                    inputFormat="MM-DD-YYYY"
                                    value={
                                      values.implementationDate
                                        ? dayjs(values.implementationDate, "MM-DD-YYYY")
                                        : values.implementationDate
                                        ? dayjs(values.implementationDate, "MM-DD-YYYY") 
                                        :
                                        null
                                    }
                                    onChange={(newValue: Dayjs | null) =>
                                      handleDateChange(
                                        "implementationDate",
                                        newValue ? newValue.format("MM-DD-YYYY") : ""
                                      )
                                    }
                                    disabled={isChangeColor}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        fullWidth
                                        required
                                        disabled={isChangeColor}
                                        error={!!errors?.implementationDate}
                                        // error={Boolean(errors.ImplementationDate)}
                                        helperText={errors?.implementationDate || ""}
                                        placeholder="MM-DD-YYYY"
                                        sx={{
                                          "& .MuiInputBase-root": { height: 40 },
                                          "& .MuiInputLabel-root": { top: -4, fontSize: 14 },
                                          "& .MuiInputLabel-shrink": { top: 1 },
                                          mb: 2,
                                          width: "85%"
                                        }}
                                      />
                                    )}
                                  />
                                </Box>
                              </LocalizationProvider> */}
                </FormControl>
              )}
            {(isCreateNewVersion ||
              (editState && (selectedTab == 2 || selectedTab == 1))) &&
              !isChangeColor && (
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
                    No Of Colors:
                  </FormLabel>
                  <Controls.Input
                    disabled={!canEdit || isImplementationDate}
                    name="color"
                    label="No Of Colors"
                    type="text"
                    id="color"
                    required
                    size={"small"}
                    value={values.color}
                    error={errors?.color}
                    onChange={handleInputChange}
                    // sx={{ width: "75%" }}
                  ></Controls.Input>
                </FormControl>
              )}
            {isChangeColor && (
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
                <FormLabel sx={{ width: "25%" }}>Color Code:</FormLabel>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "26.5%",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {[
                      { name: "Red", value: "#FF0000" },
                      { name: "Blue", value: "#0000FF" },
                      { name: "Black", value: "#000000" },
                      { name: "Green", value: "#008000" },
                      { name: "Pink", value: "#FFC0CB" },
                    ].map((color) => (
                      <Box
                        key={color.value}
                        onClick={() =>
                          canEdit &&
                          handleInputChange({
                            target: { name: "colorcode", value: color.value },
                          })
                        }
                        sx={{
                          width: 35,
                          height: 35,
                          borderRadius: "50%",
                          backgroundColor: color.value,
                          border:
                            values.colorcode === color.value
                              ? "3px solid #000"
                              : "1px solid #ccc",
                          cursor: canEdit ? "pointer" : "not-allowed",
                          transition: "0.2s",
                          "&:hover": canEdit ? { transform: "scale(1.1)" } : {},
                        }}
                        title={color.name}
                      />
                    ))}
                  </Box>
                </Box>
              </FormControl>
            )}
            {(isCreateNewVersion ||
              (editState &&
                (selectedTab == 2 || selectedTab == 1) &&
                !isChangeColor)) && (
              <FormControl
                variant="filled"
                disabled={!canEdit || values?.fileId !== "-1"}
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
                  Current Version File:
                </FormLabel>
                <PdfIconButton
                  isDisabled={values?.fileId === "-1"}
                  dFileId={values?.fileId}
                />
              </FormControl>
            )}

            {(isCreateNewVersion ||
              (editState &&
                (selectedTab == 2 || selectedTab == 1) &&
                !isChangeColor)) && (
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
                <Controls.InputUpload
                  disabled={
                    !canEdit ||
                    isChangeColor ||
                    (editState &&
                      (selectedTab == 2 || selectedTab == 1) &&
                      isImplementationDate)
                  }
                  label="Upload Files"
                  name="fileData"
                  id="fileData"
                  size={"small"}
                  value={values.fileData}
                  error={errors?.fileData}
                  onChange={handleInputChange}
                  // sx={{ width: "75%" }}
                ></Controls.InputUpload>
              </FormControl>
            )}
            <Dialog maxWidth={"lg"} open={isPdfOpen} onClose={handleClosePdf}>
              <DialogTitle
                sx={{
                  px: 2,
                  py: 1,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: CustomTheme.CustomColor.Primary.dark,
                  color: CustomTheme.CustomColor.Common.white,
                }}
              >
                Label Version
              </DialogTitle>
              <IconButton
                aria-label="close"
                onClick={handleClosePdf}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <Close />
              </IconButton>
              <DialogContent>
                <PDFViewer fileId={values?.fileId} />
              </DialogContent>
            </Dialog>
            {newType === 5 &&
              !isCreateNewVersion &&
              selectedTab != 2 &&
              !isChangeColor &&
              !isImplementationDate && (
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
                    disabled={!canEdit || isChangeColor || isImplementationDate}
                    name="labelDescription"
                    label="Label Description"
                    type="text"
                    id="labelDescription"
                    size={"small"}
                    value={values.labelDescription}
                    error={errors?.labelDescription}
                    onChange={handleInputChange}
                    // sx={{ width: "75%" }}
                  ></Controls.InputTextArea>
                </FormControl>
              )}

            {!isChangeColor &&
              (newType === 1 ||
                // newType === 2 ||
                (lookupvalue == "7" && newType === 6 && editState) ||
                (lookupvalue == "7" && newType === 6) ||
                //  newType === 4 ||
                (newType === 5 && selectedTab) ||
                // isCreateNewVersion) && values.remarks && (
                (isCreateNewVersion && selectedTab)) && (
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
                    disabled={!canEdit || isChangeColor || isImplementationDate}
                    name="remarks"
                    label="Remarks"
                    type="text"
                    id="remarks"
                    size={"small"}
                    value={values.remarks}
                    error={errors?.remarks}
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
                  error={errors?.description}
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
                  // isChecked={true}
                  isChecked={
                    editState
                      ? rowState?.isActive === "True"
                        ? true
                        : false
                      : true
                  }
                  // disabled={!editState}
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
              {isCreateNewVersion ? "Move to Draft" : "Save"}
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
  handleTextChange: (e: any) => void,
  showPassword: boolean,
  handleClickShowPassword: () => void,
  handleMouseDownPassword: (e: React.MouseEvent<HTMLButtonElement>) => void
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
        {/* <FormControl required>
          {" "}
          <Password
            formValues={formValues}
            handleTextChange={handleTextChange}
          ></Password>
        </FormControl> */}
        <FormControl
          variant="outlined"
          fullWidth
          size="small"
          required
          error={!!formValues.password.error}
        >
          <Grid container sx={{ alignItems: "center" }}>
            <Grid item xs={3}>
              <FormLabel>Confirm Password:</FormLabel>
            </Grid>
            <Grid item xs={9}>
              <OutlinedInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formValues.password?.value || ""}
                onChange={handleTextChange}
                required
                placeholder="Enter your password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={{
                  mt: 1,
                  "& input::placeholder": {
                    opacity: 0.7,
                  },
                }}
              />
              {formValues.password.error && (
                <FormHelperText>{formValues.password.error}</FormHelperText>
              )}
            </Grid>
          </Grid>
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
  // console.log("prevprops", prevProps);
  // console.log("nextprops", nextProps);
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
