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
      {/* Keep only the buttons you want */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Box>

      {/* Your custom filter */}
      <Box sx={{ ml: 2 }}>
        <AdvancedFilter />
      </Box>
    </GridToolbarContainer>
  );
};

function DisplayGrid(props: IDataGridProps) {
  const { colDefs, rowData, columnVisibilityState = {}, pagedInfo } = props;
  const { setPageSize, setPage, pageSize, setPaginationChange, page } =
    useFilterContext();
  const { tabValue } = useMasterAuthContext();
  const masterContext = useMasterAuthContext?.();
  const {
    columnVisibilityModel: contextVisibilityModel,
    setColumnVisibilityModel: contextSetColumnVisibilityModel,
  } = masterContext || {};

  const [localColumnVisibility, setLocalColumnVisibility] =
    React.useState<GridColumnVisibilityModel>(columnVisibilityState || {});

  const columnVisibilityModel =
    contextVisibilityModel !== undefined
      ? contextVisibilityModel
      : localColumnVisibility;

  const setColumnVisibilityModel =
    contextSetColumnVisibilityModel !== undefined
      ? contextSetColumnVisibilityModel
      : setLocalColumnVisibility;

  const updatedColDefs = React.useMemo(() => {
    return colDefs?.map((col: any) => {
      if (col.field === "isActive") {
        return {
          ...col,
          renderCell: (params: any) => (
            <span
              style={{
                color: params.value === "True" ? "green" : "red",
                fontWeight: 500,
              }}
            >
              {params.value === "True" ? "Active" : "In Active"}
            </span>
          ),
        };
      }
      return col;
    });
  }, [colDefs]);

  const [rowSelectionModel, setRowSelectionModel] = React.useState<any>({});
  React.useEffect(() => {
    setRowSelectionModel({});
  }, [tabValue]);

  const rowCount = React.useMemo(() => {
    if (pagedInfo && typeof pagedInfo.totalRecords === "number") {
      return pagedInfo.totalRecords;
    }
    const fallback = rowData?.length || 0;
    return fallback;
  }, [pagedInfo, rowData]);

  const handlePaginationChange = React.useCallback(
    (model: any) => {
      setPaginationChange(true);

      if (model.pageSize !== pageSize) {
        setPage(0);
      } else {
        setPage(model.page);
      }
      setPageSize(model.pageSize);
    },
    [pageSize, setPage, setPageSize, setPaginationChange]
  );

  return (
    <Box
      sx={{
        width: {
          xs: "calc(100vw - 320px)",
          sm: "calc(100vw - 320px)",
          md: "calc(100vw - 320px)",
          lg: "calc(100vw - 320px)",
        },
        height: "50vh",
        overflowX: "auto",
      }}
    >
      <StripedDisplayGrid
        sx={{
          boxShadow: 2,
          border: 1,
          borderColor: CustomTheme.CustomColor.Primary.light,
          "& .MuiDataGrid-columnSeparator": {
            color: CustomTheme.CustomColor.Common.white,
            visibility: "visible",
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
        // columns={colDefs || []}
        columns={updatedColDefs || []}
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
        slotProps={{
          columnsPanel: {
            sx: {
              maxHeight: 200,
              overflowY: "auto",
            },
          },
        }}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) =>
          setColumnVisibilityModel(newModel)
        }
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newSelection) => {
          setRowSelectionModel(newSelection);
        }}
        checkboxSelection={false}
        disableRowSelectionOnClick={true}
      />
    </Box>
  );
}

export default DisplayGrid;
