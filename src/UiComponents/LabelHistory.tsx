import { FormLabel, Grid } from "@mui/material";
import React from "react";
import { alpha, styled } from "@mui/material/styles";
import {
  DataGrid,
  gridClasses,
  GridActionsCellItem,
  GridToolbar,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import useLabelHistoryContext from "../Context/LabelHistoryContext";
import Controls from "../Controls/Controls";
import CustomTheme from "../Theme/CustomTheme";
import { IPdfParams } from "../utils/types";
import Popup from "../Modal/Components/Popup";
import PDFViewer from "../PDFViewer/Components/PDFViewer";

import {
  Settings,
  TaskAlt,
  Pending,
  PictureAsPdf,
  LibraryBooks,
} from "@mui/icons-material";

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
  columnData: any[];
  pdfStateChange: (val: IPdfParams) => void;
}
type IColumnState = {
  [key: string]: boolean;
};

function LabelHistory(props: any) {
  const { rowData, columnData } = useLabelHistoryContext();

  const [pdfPopupState, setPdfPopupState] = React.useState<any>({
    versionId: "",
    show: false,
  });

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

      return obj;
    }
  }, [columnData]);

  const pdfStateChange = (val: IPdfParams) => {
    setPdfPopupState((prevState: any) => ({
      ...prevState,
      versionId: val.fileId,
      show: val.show,
    }));
  };
  const colDefParams: IColParams = {
    columnData,
    pdfStateChange,
  };

  const pdfDialogProps = {
    isPopup: pdfPopupState.show,
    closePopup: (val: boolean) =>
      setPdfPopupState((prevState: any) => ({ ...prevState, show: val })),
    dialogTitle: `Label Version`,
    form: "pdfPopup",
    maxWidth: "md",
  };

  const getColumnDefinitions = (params: IColParams) => {
    const { columnData, pdfStateChange } = params;

    const dynamicColDef: any[] = [];

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

        if (item.field === "lableFile") {
          const updatedCols = {
            headerName: "Versions",
            display: true,
            align: "center",
            renderCell: (params: any) => {
              const dFileId = params.row.fileId;

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
                          pdfStateChange(pdfParams);
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

    const columnDef: any = [...dynamicColDef];

    return columnDef;
  };

  return (
    <React.Fragment>
      <Popup {...pdfDialogProps}>
        <PDFViewer fileId={pdfPopupState.versionId} />
      </Popup>

      <StripedDataGrid
        autoHeight
        sx={{
          boxShadow: 2,
          border: 1,
          borderColor: CustomTheme.CustomColor.Primary.light,
          "& .super-app-theme--header": {
            backgroundColor: CustomTheme.CustomColor.Primary.main,
            color: CustomTheme.CustomColor.Common.white,
            "& .MuiSvgIcon-root": {
              color: CustomTheme.CustomColor.Common.white,
            },
          },
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
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
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
    </React.Fragment>
  );
}

export default React.memo(LabelHistory);
