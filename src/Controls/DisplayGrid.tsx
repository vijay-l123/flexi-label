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
import AdvancedFilter from "../UiComponents/AdvanceFilter";
import useMasterAuthContext from "../Context/MasterAuthContext";
import { useFilterContext } from "../Context/FilterContext";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
interface IDataGridProps {
  colDefs: any;
  rowData: any;
  columnVisibilityState?: any;
  pagedInfo?: any;
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

const CustomToolbar = ({ selectedTab }: any) => {
  return (
    <GridToolbarContainer
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1,
      }}
    >
      {/* Keep only the buttons you want */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Box>

      {/* Your custom filter */}
      <Box sx={{ ml: 2 }}>
        <AdvancedFilter selectedTab={selectedTab} />
      </Box>
    </GridToolbarContainer>
  );
};

function DisplayGrid(props: IDataGridProps) {
  const { colDefs, rowData, columnVisibilityState = {}, pagedInfo } = props;
  const { setPageSize, setPage, pageSize, setPaginationChange, page } = useFilterContext();
  const { tabValue } = useMasterAuthContext();
  
  console.log("DisplayGrid - colDefs:", colDefs);
  console.log("DisplayGrid - rowData length:", rowData?.length);
  console.log("DisplayGrid - pagedInfo:", pagedInfo);
  console.log("DisplayGrid - pageSize:", pageSize);
  console.log("DisplayGrid - page:", page);

  // Calculate total row count from pagedInfo - this is the TOTAL records across all pages
  const rowCount = React.useMemo(() => {
    if (pagedInfo && typeof pagedInfo.totalRecords === 'number') {
      console.log("Using pagedInfo.totalRecords:", pagedInfo.totalRecords);
      return pagedInfo.totalRecords;
    }
    // Fallback to current page data length
    const fallback = rowData?.length || 0;
    console.log("Using fallback rowCount:", fallback);
    return fallback;
  }, [pagedInfo, rowData]);

  // Handle pagination changes
  const handlePaginationChange = React.useCallback((model: any) => {
    console.log("Pagination change:", model);
    setPaginationChange(true);
    
    // If page size changed, reset to first page
    if (model.pageSize !== pageSize) {
      console.log("Page size changed from", pageSize, "to", model.pageSize);
      setPage(0); 
    } else {
      console.log("Page changed to:", model.page);
      setPage(model.page);
    }
    setPageSize(model.pageSize);
  }, [pageSize, setPage, setPageSize, setPaginationChange]);

  return (
    <Box
      sx={{
        width: {
          xs: '45vh',
          sm: '80vh',
          md: '100vh',
          lg: '170vh',
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
        columns={colDefs || []}
        rows={rowData || []}
        rowHeight={38}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        pagination
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={handlePaginationChange}
        pageSizeOptions={[25, 50, 100]}
        slots={{
          toolbar: CustomToolbar,
        }}
        // slotProps={{
        //   toolbar: {
        //     showQuickFilter: true,
        //   }
        // }}
        columnVisibilityModel={{
          ...columnVisibilityState,
        }}
      />
    </Box>
  );
}

export default DisplayGrid;