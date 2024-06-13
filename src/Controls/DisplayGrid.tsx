import React from "react";
import { Box, FormControl, FormLabel } from "@mui/material";
import { useDemoData } from "@mui/x-data-grid-generator";
import { alpha, styled } from "@mui/material/styles";
import {
  DataGrid as MuiGrid,
  gridClasses,
  GridActionsCellItem,
  GridToolbar,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import CustomTheme from "../Theme/CustomTheme";

interface IDataGridProps {
  colDefs: any;
  rowData: any;
  columnVisibilityState?: any;
}

const ODD_OPACITY = 0.2;

const StripedDisplayGrid = styled(MuiGrid)(({ theme }) => ({
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

function DisplayGrid(props: IDataGridProps) {
  const { colDefs, rowData, columnVisibilityState = {} } = props;
  return (
    <StripedDisplayGrid
      sx={{
        boxShadow: 2,
        border: 1,
        borderColor: CustomTheme.CustomColor.Primary.light,
        "& .MuiDataGrid-cell:hover": {
          color: CustomTheme.CustomColor.Primary.light,
        },
        "& .super-app-theme--header": {
          backgroundColor: CustomTheme.CustomColor.Primary.main,
          color: CustomTheme.CustomColor.Common.white,
          "& .MuiSvgIcon-root": {
            color: CustomTheme.CustomColor.Common.white,
          },
        },
      }}
      getRowId={(row) => row.index}
      columns={colDefs}
      rows={rowData}
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
  );
}

export default DisplayGrid;
