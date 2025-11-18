import { camelCase } from "lodash";
import React from "react";
import useAuthContext from "../Authentication/AuthProvider";
import Services from "../Services/Services";
import common from "../utils/common";
import { useFilterContext } from "../Context/FilterContext";

const {
  TLabelStatus,
  TRoleType,
  tabData,
  TButtonClick,
  fetchConfirmationTitle,
  camelizeKeys,
} = common;

export function useLabelsData(LabelversionAPiCall: boolean) {
  const [rowData, setRowData] = React.useState<any[]>([]);
  const [columnData, setColumnData] = React.useState<any[]>([]);
  const [selectedTab, setSelectedTab] = React.useState<any>();
  const [labelAction, setLabelAction] = React.useState<boolean>(false);

  const { authData } = useAuthContext();
  // console.log("LabelversionAPiCall :useLabelsData",LabelversionAPiCall);
  
  const {
    pageSize,
    page,
    paginationChange,
    setPaginationChange,
    setPaginationData,
    filter,
  } = useFilterContext();

  const clearState = () => {
    setRowData([]);
    setColumnData([]);
  };

  const updateSelectedTab = React.useCallback((val: any) => {
    setSelectedTab(val);
  }, []);

  const updateLabelsData = React.useCallback((val: boolean) => {
    setLabelAction(val);
  }, []);

  // Helper function to construct filter parameters
  const getFilterParams = React.useCallback(() => {
    // console.log("Current filter state:", filter);
    
    // Check if filter has been applied (has filterValue or all required fields)
    if (filter.column?.field && filter.operator && (filter.filterValue !== undefined || filter.value)) {
      const filterParams = {
        filterCol: filter.column.field,
        filterOperator: filter.operator,
        filterValue: filter.filterValue || filter.value || "",
      };
      // console.log("Using filter params:", filterParams);
      return filterParams;
    }
    
    // Return empty filter params if no valid filter is applied
    // console.log("No valid filter applied, using empty params");
    return {
      filterCol: "",
      filterOperator: "",
      filterValue: "",
    };
  }, [filter]);

  // Fetch data when selectedTab changes (initial load)
  React.useMemo(() => {
    const getLabels = async () => {
      try {
        // console.log("Fetching labels for tab:", selectedTab, "page:", page + 1, "pageSize:", pageSize);
        
        const filterParams = getFilterParams();

        const response = await Services.LabelVersion.getLableVersionList(
          selectedTab,
          authData.roleId,
          page + 1, // Convert 0-based to 1-based page number
          pageSize,
          filterParams.filterCol,
          filterParams.filterOperator,
          filterParams.filterValue
        );

        // console.log("API Response:", response.data);

        // Handle new API response structure
        const apiData = response.data;
        
        // Check if response has the new structure with paging
        if (apiData.paging && apiData.data) {
          // New API structure
          setPaginationData({
            totalRecords: apiData.paging.totalRecords,
            maxPage: apiData.paging.maxPage,
            contentRange: apiData.paging.contentRange,
            previousPage: apiData.paging.previousPage,
            nextPage: apiData.paging.nextPage,
          });

          // Set column data
          setColumnData(
            apiData.data.columns.map((i: any) => {
              return { ...i, field: camelCase(i.name) };
            })
          );

          // Set row data
          setRowData(
            apiData.data.rows.map((i: any, index: number) => {
              return { ...camelizeKeys(i), index: (page * pageSize) + index };
            })
          );

          // console.log("New API - Processed rowData length:", apiData.data.rows.length);
          // console.log("New API - Total records:", apiData.paging.totalRecords);
        } else {
          // Fallback to old API structure
          // console.log("Using old API structure");
          setPaginationData({
            totalRecords: apiData.rows?.length || 0,
            maxPage: 1,
            contentRange: `1-${apiData.rows?.length || 0}/${apiData.rows?.length || 0}`,
            previousPage: 0,
            nextPage: 0,
          });

          setColumnData(
            apiData["columns"]?.map((i: any) => {
              return { ...i, field: camelCase(i.name) };
            }) || []
          );

          setRowData(
            apiData["rows"]?.map((i: any, index: number) => {
              return { ...camelizeKeys(i), index: index };
            }) || []
          );
        }
        
      } catch (error) {
        console.error("Error fetching labels:", error);
        // Set empty data on error
        setPaginationData({
          totalRecords: 0,
          maxPage: 1,
          contentRange: "0-0/0",
          previousPage: 0,
          nextPage: 0,
        });
        setRowData([]);
        setColumnData([]);
      }

      return () => clearState();
    };

    if (selectedTab !== undefined && selectedTab !== null) {
      getLabels();
    }
  }, [selectedTab, page, pageSize,LabelversionAPiCall]); // Added getFilterParams to dependencies
  // }, [selectedTab, page, pageSize, getFilterParams]); // Added getFilterParams to dependencies

  // Fetch data when pagination changes
  React.useMemo(() => {
    const getLabels = async () => {
      try {
        // console.log("Fetching labels (pagination change):", selectedTab, "page:", page + 1, "pageSize:", pageSize);
        
        const filterParams = getFilterParams();

        const response = await Services.LabelVersion.getLableVersionList(
          selectedTab,
          authData.roleId,
          page + 1, // Convert 0-based to 1-based page number
          pageSize,
          filterParams.filterCol,
          filterParams.filterOperator,
          filterParams.filterValue
        );

        // console.log("API Response (pagination):", response.data);

        // Handle new API response structure
        const apiData = response.data;
        
        // Check if response has the new structure with paging
        if (apiData.paging && apiData.data) {
          // New API structure
          setPaginationData({
            totalRecords: apiData.paging.totalRecords,
            maxPage: apiData.paging.maxPage,
            contentRange: apiData.paging.contentRange,
            previousPage: apiData.paging.previousPage,
            nextPage: apiData.paging.nextPage,
          });

          // Set column data
          setColumnData(
            apiData.data.columns.map((i: any) => {
              return { ...i, field: camelCase(i.name) };
            })
          );

          // Set row data
          setRowData(
            apiData.data.rows.map((i: any, index: number) => {
              return { ...camelizeKeys(i), index: (page * pageSize) + index };
            })
          );

          // console.log("Pagination - Processed rowData length:", apiData.data.rows.length);
          // console.log("Pagination - Total records:", apiData.paging.totalRecords);
        } else {
          // Fallback to old API structure
          console.log("Using old API structure (pagination)");
          setPaginationData({
            totalRecords: apiData.rows?.length || 0,
            maxPage: 1,
            contentRange: `1-${apiData.rows?.length || 0}/${apiData.rows?.length || 0}`,
            previousPage: 0,
            nextPage: 0,
          });

          setColumnData(
            apiData["columns"]?.map((i: any) => {
              return { ...i, field: camelCase(i.name) };
            }) || []
          );

          setRowData(
            apiData["rows"]?.map((i: any, index: number) => {
              return { ...camelizeKeys(i), index: index };
            }) || []
          );
        }
        
      } catch (error) {
        // console.error("Error fetching labels (pagination):", error);
      }

      return () => clearState();
    };

    if (paginationChange && selectedTab !== undefined && selectedTab !== null) {
      getLabels();
      setPaginationChange(false);
    }
  }, [paginationChange, getFilterParams]);

  // Fetch data when labelAction is triggered (for updates, etc.)
  React.useMemo(() => {
    const getLabels = async () => {
      try {
        // console.log("Fetching labels (action):", selectedTab, "page:", page + 1, "pageSize:", pageSize);
        
        const filterParams = getFilterParams();

        const response = await Services.LabelVersion.getLableVersionList(
          selectedTab,
          authData.roleId,
          page + 1, // Convert 0-based to 1-based page number
          pageSize,
          filterParams.filterCol,
          filterParams.filterOperator,
          filterParams.filterValue
        );

        // Handle new API response structure
        const apiData = response.data;
        
        // Check if response has the new structure with paging
        if (apiData.paging && apiData.data) {
          // New API structure
          setPaginationData({
            totalRecords: apiData.paging.totalRecords,
            maxPage: apiData.paging.maxPage,
            contentRange: apiData.paging.contentRange,
            previousPage: apiData.paging.previousPage,
            nextPage: apiData.paging.nextPage,
          });

          // Set column data
          setColumnData(
            apiData.data.columns.map((i: any) => {
              return { ...i, field: camelCase(i.name) };
            })
          );

          // Set row data
          setRowData(
            apiData.data.rows.map((i: any, index: number) => {
              return { ...camelizeKeys(i), index: (page * pageSize) + index };
            })
          );
        } else {
          // Fallback to old API structure
          setPaginationData({
            totalRecords: apiData.rows?.length || 0,
            maxPage: 1,
            contentRange: `1-${apiData.rows?.length || 0}/${apiData.rows?.length || 0}`,
            previousPage: 0,
            nextPage: 0,
          });

          setColumnData(
            apiData["columns"]?.map((i: any) => {
              return { ...i, field: camelCase(i.name) };
            }) || []
          );

          setRowData(
            apiData["rows"]?.map((i: any, index: number) => {
              return { ...camelizeKeys(i), index: index };
            }) || []
          );
        }
        
      } catch (error) {
        // console.error("Error fetching labels (action):", error);
      }

      return () => clearState();
    };

    if (labelAction && selectedTab !== undefined && selectedTab !== null) {
      getLabels();
      updateLabelsData(false);
    }
  }, [labelAction, getFilterParams]);

// React.useEffect(() => {
//   if (selectedTab === undefined || selectedTab === null) return;

//   // const controller = new AbortController();
//   // const { signal } = controller;

//   const getLabels = async () => {
//     try {
//       console.log("Fetching labels for tab:", selectedTab, "page:", page + 1);

//       const filterParams = getFilterParams();

//       const response = await Services.LabelVersion.getLableVersionList(
//         selectedTab,
//         authData.roleId,
//         page + 1,
//         pageSize,
//         filterParams.filterCol,
//         filterParams.filterOperator,
//         filterParams.filterValue,
//         // signal 
//       );

//       // if (signal.aborted) return; 

//       const apiData = response.data;

//       if (apiData.paging && apiData.data) {
//         setPaginationData({
//           totalRecords: apiData.paging.totalRecords,
//           maxPage: apiData.paging.maxPage,
//           contentRange: apiData.paging.contentRange,
//           previousPage: apiData.paging.previousPage,
//           nextPage: apiData.paging.nextPage,
//         });

//         setColumnData(apiData.data.columns.map((i: any) => ({
//           ...i,
//           field: camelCase(i.name),
//         })));

//         setRowData(apiData.data.rows.map((i: any, index: number) => ({
//           ...camelizeKeys(i),
//           index: page * pageSize + index,
//         })));
//       }
//     } catch (error: any) {
//       if (error.name === "CanceledError") {
//         console.log("Previous request aborted");
//         return;
//       }
//       console.error("Error fetching labels:", error);
//     }
//   };

//   getLabels();

//   // return () => controller.abort();
// }, [selectedTab, page, pageSize, getFilterParams]);

  return {
    columnData,
    rowData,
    updateSelectedTab,
    updateLabelsData,
  };
}