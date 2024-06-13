import { Box, FormControl, FormLabel } from "@mui/material";
import { useDemoData } from "@mui/x-data-grid-generator";
import { alpha, styled } from "@mui/material/styles";
import "../../styles/grid.css";
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
  if (row[field].toLowerCase() === "true") {
    component = (
      <Controls.SvgIcon sx={{ color: CustomTheme.CustomColor.Green.darker }}>
        {" "}
        <TaskAlt />
      </Controls.SvgIcon>
    );
  }

  return component;
};

const getColumnDefinitions = (params: IColParams) => {
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
  } = params;

  const dynamicColDef: any[] = [];
  console.log("columndata", columnData);

  if (selectedTab === 1 && authData.roleId !== TRoleType.LabelViewers) {
    const historyCols = {
      headerName: "View History",
      field: "labelHistory",
      align: "center",
      display: true,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => {
        const id = +params.row.id;

        return (
          <React.Fragment>
            <>
              <Controls.IconButton
                value={id}
                aria-label="close"
                onClick={(e: any) => {
                  console.log("event", e);
                  const historyParams: IHistoryPopupParams = {
                    show: true,
                    fileId: +e.currentTarget.value,
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
        fiterable: !item.name.trim().includes("id"),
        //hide: !item.display,
        // hideable: item.display,
        // editable: !item.display,
        headerClassName: "super-app-theme--header",
        flexGrow: 1,
        flexShrink: 1,
        width: "150",
      };

      if (
        !item.name.trim().toLowerCase().includes("date") &&
        item.name.trim().toLowerCase().includes("approved")
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
                        console.log("event", e);
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
                        console.log("event", e);
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
    console.log("popupdata", params);
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

  function handleReviewClickEvent(params: any) {
    console.log(params);
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
          createVersionClick={() => createVersionClickEvent(params)}
        />
      ),

      // getActions: (params: any) => [
      //   <GridActionsCellItem
      //     showInMenu
      //     icon={<BorderColorOutlinedIcon />}
      //     label="Edit"
      //     onClick={() => {
      //       console.log("popupdata", params);
      //       modalState(true);
      //       rowState(params.row);
      //       editState(true);
      //     }}
      //   />,
      // ],
    },
    ...dynamicColDef,
  ];

  return columnDef;
};

function isValidPassword(val: string) {
  return val.length === 0;
}

function checkErrorValidation(params: formParams) {
  const { name, value } = params;

  if (name === "password")
    return {
      error: isValidPassword(value) ? "You must enter a password" : "",
    };

  if (name === "notes")
    return {
      error: value.length === 0 ? "Please enter notes" : "",
    };

  // if (name === "remarks")
  //   return {
  //     error: value.length === 0 ? "You must enter a password" : "",
  //   };
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
  } = props;
  const { authData } = useAuthContext();
  const labelVersionId = React.useRef(0);
  const fileVersionId = React.useRef(0);

  const { rowData, columnData, updateSelectedTab, updateLabelsData } =
    useLabelsContext();
  // const { data } = useDemoData({
  //   dataSet: "Commodity",
  //   rowLength: 100,
  //   editable: true,
  // });
  // console.log("grid:", data);

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
          TLabelStatus.Active &&
        authData.roleId !== TRoleType.Initiator
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
      console.log("columnstate", {
        ...obj,
      });
      return obj;
    }
  }, [columnData]);

  //const rowData = React.useRef([]);

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

          console.log(response);
        } catch (error) {
          console.log(error);
        }
      };

      addNotes();

      // const addNotes = async () => {
      //   try {
      //     const apiParams = {
      //       labelVersionId: Number(labelVersionId.current),
      //       remarks: data.get("remarks") as string,
      //     };
      //     let response = null;
      //     if (buttonState === TButtonClick.SubmitForReview)
      //       response = await Services.LabelVersion.submitForReview(
      //         apiParams
      //       ).then((success) => {
      //         updateLabelsData(true);
      //         modalState(false);
      //         const popupStateParams = {
      //           show: false,
      //         };
      //         reviewPopupState(popupStateParams);
      //       });
      //     if (
      //       buttonState === TButtonClick.Resend ||
      //       buttonState === TButtonClick.Approve
      //     )
      //       response = await Services.LabelVersion.processReview({
      //         ...apiParams,
      //         action: Number(buttonState),
      //       }).then((success) => {
      //         updateLabelsData(true);
      //         modalState(false);
      //         const popupStateParams = {
      //           show: false,
      //         };
      //         reviewPopupState(popupStateParams);
      //       });
      //     console.log(response);
      //   } catch (error) {
      //     console.log(error);
      //   }
      // };
      // updateLabelVersion();
      // closePasswordConfirmationPopup(false);
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
            buttonState === TButtonClick.Resend ||
            buttonState === TButtonClick.Approve
          )
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

          console.log(response);
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
    if (params.row?.hasReview && params.row?.hasReview === "True") {
      return "hasReview";
    }
    if (params.row?.hasReview && params.row?.hasReview === "False") {
      return "hasNoReview";
    }

    return params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd";
  };

  return (
    // <DataGrid
    //   sx={{
    //     boxShadow: 0,
    //     border: 0,
    //     borderColor: "primary.light",
    //     "& .MuiDataGrid-cell:hover": {
    //       color: "primary.main",
    //     },
    //   }}
    //   {...data}
    //   loading={data.rows.length === 0}
    //   rowHeight={38}
    //   checkboxSelection
    //   disableSelectionOnClick
    //   experimentalFeatures={{ newEditingApi: true }}
    // />

    <Box
      sx={{
        height: "100%",
        width: "100%",
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
      <StripedDataGrid
        sx={{
          boxShadow: 2,
          border: 1,
          borderColor: CustomTheme.CustomColor.Primary.light,
          "& .MuiDataGrid-cell:hover": {
            color: CustomTheme.CustomColor.Primary.light,
          },
        }}
        getRowId={(row) => row.index}
        columns={columnData && getColumnDefinitions(colDefParams)}
        rows={rowData && rowData}
        //loading={rowData.length === 0}
        rowHeight={38}
        disableSelectionOnClick
        getRowClassName={getRowClass}
        disableColumnSelector={true}
        components={{
          Toolbar: GridToolbar,
        }}
        componentsProps={{
          toolbar: { showQuickFilter: true },
        }}
        columnVisibilityModel={{
          ...columnVisibilityState,
        }}

        // initialState={{
        //   columns: {
        //     columnVisibilityModel: {
        //       ...colVisibilityState,
        //     },
        //     // Hide columns status and traderName, the other columns will remain visible
        //     // andaId: false,
        //     // previousVersionFileId: false,
        //     // currentVersionId: false,
        //   },
        // }}
      />
    </Box>
  );
}

function gridPropsAreEqual(prevProps: any, nextProps: any) {
  return prevProps.selectedTab === nextProps.selectedTab;
}

export default React.memo(GridLayout, gridPropsAreEqual);
