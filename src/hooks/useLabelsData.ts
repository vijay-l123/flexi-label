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

  const getFilterParams = React.useCallback(() => {
    if (
      filter.column?.field &&
      filter.operator &&
      (filter.filterValue !== undefined || filter.value)
    ) {
      const filterParams = {
        filterCol: filter.column.field,
        filterOperator: filter.operator,
        filterValue: filter.filterValue || filter.value || "",
      };
      return filterParams;
    }
    return {
      filterCol: "",
      filterOperator: "",
      filterValue: "",
    };
  }, [filter]);

  React.useMemo(() => {
    const getLabels = async () => {
      try {
        const filterParams = getFilterParams();

        const response = await Services.LabelVersion.getLableVersionList(
          selectedTab,
          authData.roleId,
          page + 1,
          pageSize,
          filterParams.filterCol,
          filterParams.filterOperator,
          filterParams.filterValue
        );
        const apiData = response.data;
        if (apiData.paging && apiData.data) {
          setPaginationData({
            totalRecords: apiData.paging.totalRecords,
            maxPage: apiData.paging.maxPage,
            contentRange: apiData.paging.contentRange,
            previousPage: apiData.paging.previousPage,
            nextPage: apiData.paging.nextPage,
          });
          setColumnData(
            apiData.data.columns.map((i: any) => {
              return { ...i, field: camelCase(i.name) };
            })
          );
          setRowData(
            apiData.data.rows.map((i: any, index: number) => {
              return { ...camelizeKeys(i), index: page * pageSize + index };
            })
          );
        } else {
          setPaginationData({
            totalRecords: apiData.rows?.length || 0,
            maxPage: 1,
            contentRange: `1-${apiData.rows?.length || 0}/${
              apiData.rows?.length || 0
            }`,
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
  }, [selectedTab, page, pageSize, LabelversionAPiCall]);
  React.useMemo(() => {
    const getLabels = async () => {
      try {
        const filterParams = getFilterParams();

        const response = await Services.LabelVersion.getLableVersionList(
          selectedTab,
          authData.roleId,
          page + 1,
          pageSize,
          filterParams.filterCol,
          filterParams.filterOperator,
          filterParams.filterValue
        );
        const apiData = response.data;
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
              return { ...camelizeKeys(i), index: page * pageSize + index };
            })
          );
        } else {
          console.log("Using old API structure (pagination)");
          setPaginationData({
            totalRecords: apiData.rows?.length || 0,
            maxPage: 1,
            contentRange: `1-${apiData.rows?.length || 0}/${
              apiData.rows?.length || 0
            }`,
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
      } catch (error) {}

      return () => clearState();
    };

    if (paginationChange && selectedTab !== undefined && selectedTab !== null) {
      getLabels();
      setPaginationChange(false);
    }
  }, [paginationChange, getFilterParams]);

  React.useMemo(() => {
    const getLabels = async () => {
      try {
        const filterParams = getFilterParams();

        const response = await Services.LabelVersion.getLableVersionList(
          selectedTab,
          authData.roleId,
          page + 1,
          pageSize,
          filterParams.filterCol,
          filterParams.filterOperator,
          filterParams.filterValue
        );
        const apiData = response.data;
        if (apiData.paging && apiData.data) {
          setPaginationData({
            totalRecords: apiData.paging.totalRecords,
            maxPage: apiData.paging.maxPage,
            contentRange: apiData.paging.contentRange,
            previousPage: apiData.paging.previousPage,
            nextPage: apiData.paging.nextPage,
          });
          setColumnData(
            apiData.data.columns.map((i: any) => {
              return { ...i, field: camelCase(i.name) };
            })
          );
          setRowData(
            apiData.data.rows.map((i: any, index: number) => {
              return { ...camelizeKeys(i), index: page * pageSize + index };
            })
          );
        } else {
          setPaginationData({
            totalRecords: apiData.rows?.length || 0,
            maxPage: 1,
            contentRange: `1-${apiData.rows?.length || 0}/${
              apiData.rows?.length || 0
            }`,
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
      } catch (error) {}

      return () => clearState();
    };

    if (labelAction && selectedTab !== undefined && selectedTab !== null) {
      getLabels();
      updateLabelsData(false);
    }
  }, [labelAction, getFilterParams]);

  return {
    columnData,
    rowData,
    updateSelectedTab,
    updateLabelsData,
  };
}
