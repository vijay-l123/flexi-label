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
// import AdvancedFilter from "../UiComponents/AdvanceFilter";
import useMasterAuthContext from "../Context/MasterAuthContext";

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
// const CustomToolbar = () => {
//   return (
//     <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1 }}>
//       <GridToolbar />

//       <Box sx={{ ml: 2 }}>
//         <AdvancedFilter />
//       </Box>
//     </Box>
//   );
// };

function DisplayGrid(props: IDataGridProps) {
  const { colDefs, rowData, columnVisibilityState = {} } = props;
  const {tabValue } = useMasterAuthContext();
  console.log("colDefs",colDefs,tabValue);

  return (
    // <div style={{ width: '170vh',height:"55vh", overflowX: 'auto' }}>
    <Box
  sx={{
    width: {
      xs: '45vh',   // mobile
      sm: '80vh',    // tablet
      md: '100vh',    // desktop
      lg: '170vh',    // large screens
    },
    height: "55vh",
    overflowX: "auto"
  }}
>

    <StripedDisplayGrid
      sx={{
        boxShadow: 2,
        border: 1,
        borderColor: CustomTheme.CustomColor.Primary.light,
        "& .MuiDataGrid-columnSeparator": {
            color: CustomTheme.CustomColor.Common.white,
            visibility: "visible"
        },
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
      // disableSelectionOnClick
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      // disableColumnSelector={true}
      // components={{
      //   Toolbar: GridToolbar,
      // }}
      // componentsProps={{
      //   toolbar: { showQuickFilter: true },
      // }}
      slots={{
        toolbar: GridToolbar,
      }}
      // slots={{
      //   toolbar: CustomToolbar,
      // }}
      slotProps={{
        toolbar: {
          showQuickFilter:true,
        }
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

export default DisplayGrid;
