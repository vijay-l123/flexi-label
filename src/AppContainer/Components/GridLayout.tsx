import { Box, FormControl, FormHelperText, FormLabel, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { useDemoData } from "@mui/x-data-grid-generator";
import { alpha, styled } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "../../styles/grid.css";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  DataGrid,
  gridClasses,
  GridActionsCellItem,
  GridToolbar,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";

import * as React from "react";
import Services from "../../Services/Services";
import Controls from "../../Controls/Controls";

import {
  Settings,
  TaskAlt,
  Pending,
  PictureAsPdf,
  LibraryBooks,
} from "@mui/icons-material";

import { orange, green, blue } from "@mui/material/colors";
import { camelCase } from "lodash";
import ActionCellRenderer from "./ActionCellRenderer";
import CustomTheme from "../../Theme/CustomTheme";
import common from "../../utils/common";
import useAuthContext from "../../Authentication/AuthProvider";
import Popup from "../../Modal/Components/Popup";
import Password from "../../UiComponents/Password";
import PDFViewer from "../../PDFViewer/Components/PDFViewer";
import useLabelsContext from "../../Context/LabelsContext";
import {
  IPdfParams,
  IHistoryPopupParams,
  IReviewPopupParams,
  INotesPopupParams,
} from "../../utils/types";
import { checkAlreadyApproved } from "../../Modal/utilModal";
import LabelHistory from "../../UiComponents/LabelHistory";
import { LabelHistoryContextProvider } from "../../Context/LabelHistoryContext";
import LabelReview from "../../UiComponents/LabelReview";
import AdvancedFilter from "../../UiComponents/AdvanceFilter";
import { useFilterContext } from "../../Context/FilterContext";
import AuthService from "../../Services/AuthService";
import { useAxiosHandlerContext } from "../../AxiosHandler/AxiosHandler";

const {
  TLabelStatus,
  TRoleType,
  tabData,
  TButtonClick,
  fetchConfirmationTitle,
  camelizeKeys,
} = common;

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[100],
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
  [`& .${gridClasses.row}.odd`]: {
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

interface IColParams {
  modalState: any;
  rowState: any;
  editState: any;
  columnData: any[];
  selectedTab: any;
  fileVersionId: React.MutableRefObject<number>;
  handleWorkflowProcess: (val: any, params: any) => void;
  pdfPopupState: (val: IPdfParams) => void;
  historyPopupState: (val: IHistoryPopupParams) => void;
  notesPopupState: (val: INotesPopupParams) => void;
  reviewPopupState: (val: IReviewPopupParams) => void;
  setEditRowState: (val: any) => void;
  authData: any;
  createNewVersionState: any;
  changeColorState: any;
  changeToLiveState: any;
  changeImplementationDateState: any;
}

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

export const ApprovedCellRenderer = (params: any): any => {
  const { row, field } = params;

  let component = (
    <Controls.SvgIcon sx={{ color: CustomTheme.CustomColor.Alert.warning }}>
      <Pending />
    </Controls.SvgIcon>
  );
  if (row[field]?.toLowerCase() === "true") {
    component = (
      <Controls.SvgIcon sx={{ color: CustomTheme.CustomColor.Green.darker }}>
        {" "}
        <TaskAlt />
      </Controls.SvgIcon>
    );
  }

  return component;
};

const getColumnDefinitions = (params: IColParams,rowData:any) => {
  const {
    modalState,
    rowState,
    editState,
    columnData,
    selectedTab,
    fileVersionId,
    handleWorkflowProcess,
    pdfPopupState,
    notesPopupState,
    historyPopupState,
    reviewPopupState,
    authData,
    setEditRowState,
    createNewVersionState,
    changeColorState,
    changeToLiveState,
    changeImplementationDateState
  } = params;

  const dynamicColDef: any[] = [];
  const calculateColumnWidth = (field: string, headerName: string, rowData: any[]) => {
    const padding = 30; // space for padding, sort icons etc.
    const longestValueLength = Math.max(
      headerName.length,
      ...rowData.map((row) => (row[field] ? String(row[field]).length : 0))
    );
  
    return Math.max(100, longestValueLength * 8 + padding); 
  };
  
  if (selectedTab === 1 && authData.roleId !== TRoleType.LabelViewers) {
    const historyCols = {
      headerName: "View History",
      field: "labelHistory",
      align: "center",
      display: true,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => {
        // debugger
        const id = +params.row.id;
        const currentVersionId = +params.row.currentVersionId;

        return (
          <React.Fragment>
            <>
              <Controls.IconButton
                value={id}
                aria-label="close"
                onClick={(e: any) => {
                  // console.log("event", e);
                  const historyParams: IHistoryPopupParams = {
                    show: true,
                    // fileId: +e.currentTarget.value,
                    fileId: +currentVersionId,
                  };
                  historyPopupState(historyParams);
                }}
                sx={{ color: CustomTheme.CustomColor.Secondary.light }}
              >
                <LibraryBooks />
              </Controls.IconButton>
            </>
          </React.Fragment>
        );
      },
    };
    dynamicColDef.push(historyCols);
  }

  columnData &&
    columnData.forEach((item) => {
      let cols = {
        field: item.field,
        headerName: item.name,
        fiterable: !item.name?.trim().includes("id"),
        headerClassName: "super-app-theme--header",
        width: 200,
      };
const name = item.name?.trim().toLowerCase() || "";
const includeKeywords = ["approved", "hod initiated"];
const excludeKeywords = ["date", "by"];

if (
  !excludeKeywords.some(keyword => name.includes(keyword)) &&
  includeKeywords.some(keyword => name.includes(keyword))
) {
  const updatedCols = {
    align: "center",
    renderCell: (params: any) => <ApprovedCellRenderer {...params} />,
  };
  cols = { ...cols, ...updatedCols };
}

      if (item.field === "currentVersionFileId") {
        const updatedCols = {
          headerName: "Current Version File",
          display: true,
          align: "center",
          renderCell: (params: any) => {
            const dFileId = params.row.currentVersionFileId;

            return (
              <React.Fragment>
                <>
                  {dFileId && (
                    <Controls.IconButton
                      value={dFileId}
                      aria-label="close"
                      onClick={(e: any) => {
                        // console.log("event", e);
                        const pdfParams: IPdfParams = {
                          show: true,
                          fileId: +e.currentTarget.value,
                        };
                        // console.log("pdfParams", pdfParams);
                        
                        pdfPopupState(pdfParams);
                      }}
                      color="error"
                    >
                      <PictureAsPdf />
                    </Controls.IconButton>
                  )}
                </>
              </React.Fragment>
            );
          },
        };
        cols = { ...cols, ...updatedCols };
      }

      if (item.field === "previousVersionFileId") {
        const updatedCols = {
          headerName: "Previous Version File",
          align: "center",
          display: true,
          renderCell: (params: any) => {
            const dFileId = params.row.previousVersionFileId;

            return (
              <React.Fragment>
                <>
                  {dFileId && (
                    <Controls.IconButton
                      value={dFileId}
                      aria-label="close"
                      onClick={(e: any) => {
                        // console.log("event", e);
                        const pdfParams: IPdfParams = {
                          show: true,
                          fileId: +e.currentTarget.value,
                        };
                        pdfPopupState(pdfParams);
                      }}
                      color="error"
                    >
                      <PictureAsPdf />
                    </Controls.IconButton>
                  )}
                </>
              </React.Fragment>
            );
          },
        };
        cols = { ...cols, ...updatedCols };
      }

      dynamicColDef.push(cols);
    });

  const editClickEvent = (params: any): void => {
    // console.log("popupdata", params);
    modalState(true);
    rowState(params.row);
    editState(true);
  };

  const createVersionClickEvent = (params: any): void => {
    modalState(true);
    rowState(params.row);
    editState(true);
    createNewVersionState(true);
  };
  const changeColorClickEvent = (params: any): void => {
    modalState(true);
    rowState(params.row);
    editState(true);
    changeColorState(true);
  };
  const changeImplemantationDateClickEvent = (params: any): void => {
    modalState(true);
    rowState(params.row);
    editState(true);
    changeImplementationDateState(true);
  };

  function handleReviewClickEvent(params: any) {
    // console.log(params);
    const popupStateParams = {
      show: true,
    };
    reviewPopupState(popupStateParams);
    setEditRowState((prevState: any) => ({
      ...prevState,
      row: params.row,
      isEdit: true,
    }));
  }

  const columnDef: any = [
    //...hiddenColDef,
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      maxWidth: 200,
      renderCell: (params: any) => (
        <ActionCellRenderer
          rowParams={params}
          editClick={() => editClickEvent(params)}
          approveClick={() =>
            handleWorkflowProcess(TButtonClick.Approve, params)
          }
          resendClick={() => handleWorkflowProcess(TButtonClick.Resend, params)}
          submitForReviewClick={() =>
            handleWorkflowProcess(TButtonClick.SubmitForReview, params)
          }
          reviewClick={() => handleReviewClickEvent(params)}
          addNotesClick={() => {
            const notesParams: INotesPopupParams = {
              show: true,
              id: params.row.id,
            };
            notesPopupState(notesParams);
          }}
          isCreateVersion={
            selectedTab === 1 && authData.roleId === TRoleType.Initiator
          }
          isChangeColor={
            selectedTab === 1 && authData.roleId === TRoleType.Initiator
          }
          isApproved={
            selectedTab === 4 && authData.roleId === TRoleType.FinalHOD
          }
          isImplementationDateChange={
            (selectedTab === 1 && authData.roleId === TRoleType.Initiator) || (selectedTab === 1 && authData.roleId === TRoleType.FinalHOD)
          }
          createVersionClick={() => createVersionClickEvent(params)}
          changeColorClick={() => changeColorClickEvent(params)}
                changeToLiveClick={() =>
            handleWorkflowProcess(TButtonClick.Approve, params)
          }
          changeImplemantationDateClick={() => changeImplemantationDateClickEvent(params)}
        />
      ),
    },
    ...dynamicColDef,
  ];

  return columnDef;
};

function isValidPassword(val: string) {
  return val.length === 0;
}

function checkErrorValidation(params: formParams) {
  // debugger
  const { name, value } = params;

  if (name === "password")
    return {
      error: isValidPassword(value) ? "You must enter a password" : "",
    };

  if (name === "notes")
    return {
      error: value.length === 0 ? "Please enter notes" : "",
    };
}

function GridLayout(props: any) {
  const {
    modalState,
    rowState,
    editState,
    selectedTab,
    isEdit,
    editRowData,
    createNewVersionState,
    changeColorState,
    changeToLiveState,
    changeImplementationDateState
  } = props;
    const { setAlertMessage, setSbOpen, setAlertSeverity } =
    useAxiosHandlerContext();
  const { authData } = useAuthContext();
  const { setPageSize,setPage,pageSize,setPaginationChange,page,paginationData } = useFilterContext();
  const labelVersionId = React.useRef(0);
  const fileVersionId = React.useRef(0);

  const { rowData, columnData, updateSelectedTab, updateLabelsData } =
    useLabelsContext();

  type IColumnState = {
    [key: string]: boolean;
  };

  const [isPasswordConfirmationPopup, setPasswordConfirmationPopup] =
    React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState<IKeyMapping>({
    password: {
      value: "",
      error: "",
    },
    remarks: {
      value: "",
      error: "",
    },
    notes: {
      value: "",
      error: "",
    },
  });

  const [buttonState, setButtonState] = React.useState<any>();
  const [editRowState, setEditRowState] = React.useState<any>({
    row: [],
    isEdit: false,
  });
  const [pdfPopup, setPdfPopup] = React.useState<boolean>(false);
  const [historyPopup, setHistoryPopup] = React.useState<any>({
    id: "",
    show: false,
  });
  const [notesPopup, setNotesPopup] = React.useState<any>({
    id: "",
    show: false,
  });
  const [reviewPopup, setReviewPopup] = React.useState<any>({
    id: "",
    show: false,
  });

  const pdfPopupState = (val: IPdfParams) => {
    fileVersionId.current = val.fileId;
    setPdfPopup(val.show);
  };

  const historyPopupState = (val: IHistoryPopupParams) => {
    // debugger
    setHistoryPopup((prevState: any) => ({
      ...prevState,
      id: val.fileId,
      show: val.show,
    }));
  };

  const notesPopupState = (val: INotesPopupParams) => {
    setNotesPopup((prevState: any) => ({
      ...prevState,
      id: val.id,
      show: val.show,
    }));
  };

  function reviewPopupState(val: IReviewPopupParams) {
    setReviewPopup((prevState: any) => ({
      ...prevState,
      //id: val.fileId
      show: val.show,
    }));
  }

  const columnVisibilityState = React.useMemo(() => {
    if (columnData) {
      let obj: IColumnState = {};
      columnData
        .filter((i) => !i.display)
        .forEach((col, index) => {
          if (!col.display) {
            //mp.set(col.field, true);
            obj[col.field] = false;
          }
        });

      let actionColState = true;
      if (
        tabData.find(({ value }) => value === selectedTab)?.label ===
          TLabelStatus.Active
           &&
        (authData.roleId !== TRoleType.Initiator && authData.roleId !== TRoleType.FinalHOD)
      ) {
        actionColState = false;
      }
      if (
        tabData
          .find(({ value }) => value === selectedTab)
          ?.label.replaceAll(" ", "") === TLabelStatus.UnderReview &&
        authData.roleId === TRoleType.Initiator
      ) {
        actionColState = false;
      }
      obj["actions"] = actionColState;
      // console.log("columnstate", {
      //   ...obj,
      // });
      return obj;
    }
  }, [columnData]);

const [rowSelectionModel, setRowSelectionModel] = React.useState<any>({});
  React.useEffect(() => {
    setRowSelectionModel({});
  }, [selectedTab]);

  React.useEffect(() => {
    updateSelectedTab(selectedTab);
  }, [selectedTab, updateSelectedTab]);

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

  const handleWorkflowProcess = (clickedButton: any, params: any) => {
    if (params.row.id > 0) {
      setPasswordConfirmationPopup(true);
      setButtonState(clickedButton);
      labelVersionId.current = params.row.id; //params.row.currentVersionId;
    }
  };

  const onAddNotesClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = [
      {
        target: {
          name: "notes",
          value: data.get("notes") as string,
        },
      },
    ];

    let temp = JSON.parse(JSON.stringify(formValues));

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
      const addNotes = async () => {
        try {
          const apiParams = {
            id: +notesPopup.id,
            notes: data.get("notes") as string,
          };
          let response = null;
          response = await Services.LabelVersion.addNotes(apiParams).then(
            (success) => {
              updateLabelsData(true);
              modalState(false);
              notesPopupState({ id: 0, show: false });
            }
          );
          setFormValues((prev) => ({
          ...prev,
          notes: { value: "", error: "" },
        }));
          // console.log(response);
        } catch (error) {
          console.log(error);
        }
      };

      addNotes();
    }
  };

  const onOkClick =async (event: React.FormEvent<HTMLFormElement>) => {
    // debugger
    event.preventDefault();
    const data = new FormData(event.currentTarget);
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

    let temp = JSON.parse(JSON.stringify(formValues));

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
      setAlertMessage(apiResult?.message || "Invalid password. Please try again.");
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
            labelVersionId: Number(labelVersionId.current),
            remarks: data.get("remarks") as string,
          };
          let response = null;
          if (buttonState === TButtonClick.SubmitForReview)
            response = await Services.LabelVersion.submitForReview(
              apiParams
            ).then((success) => {
              updateLabelsData(true);
              modalState(false);
              const popupStateParams = {
                show: false,
              };
              reviewPopupState(popupStateParams);
            });
          if (
            (((buttonState === TButtonClick.Resend) && (selectedTab != 4))) ||
            ((buttonState === TButtonClick.Approve) && (selectedTab != 4))
          ){
          // debugger
            response = await Services.LabelVersion.processReview({
              ...apiParams,
              action: Number(buttonState),
            }).then((success) => {
              updateLabelsData(true);
              modalState(false);
              const popupStateParams = {
                show: false,
              };
              reviewPopupState(popupStateParams);
            });
          }
          if (
            ((buttonState === TButtonClick.Approve )&& (selectedTab == 4))
          ){
          // debugger
            response = await Services.LabelVersion.moveToLiveProcessReview({
              ...apiParams,
              action: Number(buttonState),
            }).then((success) => {
              updateLabelsData(true);
              modalState(false);
              const popupStateParams = {
                show: false,
              };
              reviewPopupState(popupStateParams);
            });

          // console.log(response);
          }
        } catch (error) {
          console.log(error);
        }
      };

      updateLabelVersion();
      closePasswordConfirmationPopup(false);
    }
  };

  const colDefParams: IColParams = {
    modalState,
    rowState,
    editState,
    columnData,
    selectedTab,
    fileVersionId,
    handleWorkflowProcess,
    pdfPopupState,
    historyPopupState,
    notesPopupState,
    reviewPopupState,
    authData,
    setEditRowState,
    createNewVersionState,
    changeColorState,
    changeToLiveState,
    changeImplementationDateState
  };

  const submitReviewConfirmationProps = {
    isPopup: isPasswordConfirmationPopup,
    closePopup: closePasswordConfirmationPopup,
    dialogTitle: fetchConfirmationTitle(buttonState) || "",
    form: "confirmationBox",
  };

  const pdfDialogProps = {
    isPopup: pdfPopup,
    closePopup: (val: boolean) => setPdfPopup(val),
    dialogTitle: `Label Version`,
    form: "pdfPopup",
    maxWidth: "md",
  };

  const historyDialogProps = {
    isPopup: historyPopup.show,
    closePopup: (val: boolean) =>
      setHistoryPopup((prevState: any) => ({ ...prevState, show: val })),
    dialogTitle: `Label Version History`,
    form: "historyPopup",
    maxWidth: "lg",
  };

  const reviewDialogProps = {
    isPopup: reviewPopup.show,
    closePopup: (val: boolean) =>
      setReviewPopup((prevState: any) => ({ ...prevState, show: val })),
    dialogTitle: `Label Review`,
    form: "reviewPopup",
    editRowState,
    authData,
    handleWorkflowProcess,
    maxWidth: "md",
  };

  const labelReviewProps = {
    editRowState,
  };

  const notesDialogProps = {
    isPopup: notesPopup.show,
    closePopup: (val: boolean) =>
      setNotesPopup((prevState: any) => ({ ...prevState, show: val })),
    dialogTitle: `Add Notes`,
    form: "addNotesBox",
    maxWidth: "md",
  };

  const getRowClass = (params: any) => {
  if (params.row?.colorCode) {
    const cleanCode = params.row.colorCode.replace("#", "");
    return `row-color-${cleanCode}`;
  }
  return "";
};
const getContrastColor = (hexColor: string) => {
  if (!hexColor) return "#000";
  const color = hexColor.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? "#000000" : "#FFFFFF";
};
// Create a style object dynamically before JSX
const dynamicRowColors: Record<string, any> = {};
rowData?.forEach((row: any) => {
  if (row?.colorCode) {
    const cleanCode = row.colorCode.replace("#", "");
    dynamicRowColors[`& .row-color-${cleanCode}`] = {
      color: row.colorCode,
      // color: getContrastColor(row.colorCode),
      fontWeight: 500,
    };
  }
});
const CustomToolbar = () => {
  return (
    <GridToolbarContainer
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1,
      }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Box>

      <Box sx={{ ml: 2 }}>
        <AdvancedFilter selectedTab={selectedTab} />
      </Box>
    </GridToolbarContainer>
  );
};

  const rowCount = React.useMemo(() => {
    if (paginationData && typeof paginationData.totalRecords === 'number') {
      return paginationData.totalRecords;
    }
    const fallback = rowData?.length || 0;
    return fallback;
  }, [paginationData, rowData]);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <Box sx={{position: 'relative'}}>
      <Box
      sx={{
        // height: "100%",
        width: "100%",
        position:'absolute',
        boxShadow: 0,
        border: 0,
        borderColor: CustomTheme.CustomColor.Primary.light,
        "& .super-app-theme--header": {
          backgroundColor: CustomTheme.CustomColor.Primary.main,
          color: CustomTheme.CustomColor.Common.white,
          "& .MuiSvgIcon-root": {
            color: CustomTheme.CustomColor.Common.white,
          },
        },
      }}
    >
      <Popup {...notesDialogProps}>
        <Box
          noValidate
          component="form"
          onSubmit={onAddNotesClick}
          sx={{ mx: 2 }}
          id="addNotesBox"
        >
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
              Notes:
            </FormLabel>
            <Controls.InputTextArea
              required
              name="notes"
              label="notes"
              type="text"
              id="notes"
              size={"small"}
              value={formValues.notes.value}
              error={formValues.notes.error}
              onChange={handleTextChange}
              // sx={{ width: "75%" }}
            ></Controls.InputTextArea>
          </FormControl>
        </Box>
      </Popup>
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
       <FormControl variant="outlined" fullWidth size="small" required  error={!!formValues.password.error} >
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
          '& input::placeholder': {
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
              // sx={{ width: "75%" }}
            ></Controls.InputTextArea>
          </FormControl>
        </Box>
      </Popup>
      <Popup {...pdfDialogProps}>
        <PDFViewer fileId={fileVersionId.current} />
      </Popup>
      <Popup {...historyDialogProps}>
        <LabelHistoryContextProvider id={historyPopup.id}>
          {" "}
          <LabelHistory></LabelHistory>
        </LabelHistoryContextProvider>
      </Popup>
      <Popup {...reviewDialogProps}>
        <LabelReview {...labelReviewProps}></LabelReview>
      </Popup>
      <div style={{ width: '100%',height:"70vh", overflowX: 'auto' }}>
      {/* <div className="scroll-wrapper"> */}
      
      <StripedDataGrid
        sx={{
          boxShadow: 2,
          border: 1,
          borderColor: CustomTheme.CustomColor.Primary.light,
          "& .MuiDataGrid-columnSeparator": {
            color: CustomTheme.CustomColor.Common.white,
            visibility: "visible"
          },
          "& .MuiDataGrid-cell:hover": {
            color: CustomTheme.CustomColor.Primary.dark,
          },
      ...dynamicRowColors,
        }}
        getRowId={(row) => row.index}
        columns={columnData && getColumnDefinitions(colDefParams,rowData)}
        rows={rowData && rowData}
        //loading={rowData.length === 0}
        rowHeight={38}
        getRowClassName={getRowClass}
        disableColumnSelector={true}
        rowCount={rowCount}
              pagination
              paginationMode="server"
              paginationModel={{ page, pageSize }}
                 onPaginationModelChange={(model) => {
            setPaginationChange(true);
            if (model.pageSize !== pageSize) {
            setPage(0); 
            } else {
            setPage(model.page);
            }
            setPageSize(model.pageSize);
            }}
        pageSizeOptions={[25, 50, 100]}
            slots={{
        toolbar: CustomToolbar,
      }}
        columnVisibilityModel={{
          ...columnVisibilityState,
        }}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newSelection) => {
          setRowSelectionModel(newSelection);
        }}
        checkboxSelection={false}
        disableRowSelectionOnClick={true}
      />
      </div>
    </Box>
    </Box>
  );
}

function gridPropsAreEqual(prevProps: any, nextProps: any) {
  return prevProps.selectedTab === nextProps.selectedTab;
}

export default React.memo(GridLayout, gridPropsAreEqual);