import React from "react";
import common from "../utils/common";
import Anda from "../Services/Anda";
import Product from "../Services/Product";
import PmCode from "../Services/PmCode";
import LabelType from "../Services/LabelType";
import Customer from "../Services/Customers";
import Label from "../Services/Label";
import Lookup from "../Services/Lookup";
import { useDispatch } from "react-redux";
import { setLookupGridData } from "../Redux/MasterDataUpdateSlice/LookupUpdate";
import { useFilterContext } from "../Context/FilterContext";

const { fetchColRow, LookupDropdownData } = common;

interface IGridState {
  colDefs: any;
  rowData: any;
  pagedInfo?: any;
}

export function useMasterData(tabValue: number, lookupType: string) {
  const dispatch = useDispatch();
  const { filter, pageSize, page } = useFilterContext();
  const [gridData, setGridData] = React.useState<IGridState>({
    colDefs: [],
    rowData: [],
    pagedInfo: null,
  });

  const [masterAction, setMasterAction] = React.useState<boolean>(false);

  const updateMasterData = React.useCallback((val: boolean) => {
    setMasterAction(val);
  }, []);

  const setGridState = React.useCallback(
    (param: any) => {
      
      setGridData((prevState: any) => ({
        ...prevState,
        colDefs: param.colDefs,
        rowData: tabValue === 6 ? param.rowData?.reverse() :param.rowData,
        pagedInfo: param.pagedInfo,
      }));
      if (tabValue === 6) {
        dispatch(setLookupGridData(param));
      }
    },
    [dispatch, tabValue]
  );

  React.useMemo(() => {
    const paginationParams = {
      filter: filter.filterValue !== undefined ? {
        filterCol: filter.column?.field,
        filterOperator: filter.operator,
        filterValue: filter.filterValue,
      } : {
        filterCol: "",
        filterOperator: "",
        filterValue: "",
      },
      pageSize,
      page: page + 1, 
    };

    if (tabValue === 0) {
      fetchAnda(setGridState, paginationParams);
    }
    if (tabValue === 1) {
      fetchProducts(setGridState, paginationParams);
    }
    if (tabValue === 2) {
      fetchPmCodes(setGridState, paginationParams);
    }
    if (tabValue === 4) {
      fetchLabelTypes(setGridState, paginationParams);
    }
    if (tabValue === 3) {
      fetchCustomers(setGridState, paginationParams);
    }
    if (tabValue === 5) {
      fetchLabels(setGridState, paginationParams);
    }
    if (tabValue === 6) {
      fetchLookups(setGridState, lookupType, paginationParams);
    }
  }, [tabValue, lookupType, setGridState, pageSize, page, filter]);

  React.useMemo(() => {
    if (masterAction) {
      const paginationParams = {
        filter: filter.filterValue !== undefined ? {
          filterCol: filter.column?.field,
          filterOperator: filter.operator,
          filterValue: filter.filterValue,
        } : {
          filterCol: "",
          filterOperator: "",
          filterValue: "",
        },
        pageSize,
        page: page + 1, 
      };

      if (tabValue === 0) {
        fetchAnda(setGridState, paginationParams);
      }
      if (tabValue === 1) {
        fetchProducts(setGridState, paginationParams);
      }
      if (tabValue === 2) {
        fetchPmCodes(setGridState, paginationParams);
      }
      if (tabValue === 4) {
        fetchLabelTypes(setGridState, paginationParams);
      }
      if (tabValue === 3) {
        fetchCustomers(setGridState, paginationParams);
      }
      if (tabValue === 5) {
        fetchLabels(setGridState, paginationParams);
      }
      if (tabValue === 6) {
        fetchLookups(setGridState, lookupType, paginationParams);
      }
      updateMasterData(false);
    }
  }, [masterAction, lookupType, setGridState, tabValue, updateMasterData, pageSize, page, filter]);

  return { gridData, updateMasterData };
}

function fetchAnda(setGridState: any, paginationParams: any) {
  const anda = async () => {
    try {
      let response = await Anda.getAndaListEx({
        ...paginationParams.filter,
        ItemsPerPage: paginationParams.pageSize,
        PageNumber: paginationParams.page,
      });

      const apiData = response.data;
      const pagedInfo = apiData.pagedInfo;
      
      const transformedData = {
        columns: apiData.data.columns,
        rows: apiData.data.rows
      };

      const { colDefs, rowData } = fetchColRow(transformedData);
      const params = {
        colDefs,
        rowData,
        pagedInfo
      };
      setGridState(params);
    } catch (error) {
      console.error("Error fetching Anda data:", error);
      setGridState({ colDefs: [], rowData: [], pagedInfo: null });
    }
  };
  anda();
}

function fetchProducts(setGridState: any, paginationParams: any) {
  const products = async () => {
    try {
      let response = await Product.getProductListEx({
        ...paginationParams.filter,
        ItemsPerPage: paginationParams.pageSize,
        PageNumber: paginationParams.page,
      });

      const apiData = response.data;
      const pagedInfo = apiData.pagedInfo;
      
      const transformedData = {
        columns: apiData.data.columns,
        rows: apiData.data.rows
      };

      const { colDefs, rowData } = fetchColRow(transformedData);
      const params = {
        colDefs,
        rowData,
        pagedInfo
      };
      setGridState(params);
    } catch (error) {
      console.error("Error fetching Product data:", error);
      setGridState({ colDefs: [], rowData: [], pagedInfo: null });
    }
  };
  products();
}

function fetchPmCodes(setGridState: any, paginationParams: any) {
  const pmCodes = async () => {
    try {
      let response = await PmCode.getPmCodeListEx({
        ...paginationParams.filter,
        ItemsPerPage: paginationParams.pageSize,
        PageNumber: paginationParams.page,
      });

      const apiData = response.data;
      const pagedInfo = apiData.pagedInfo;
      
      const transformedData = {
        columns: apiData.data.columns,
        rows: apiData.data.rows
      };

      const { colDefs, rowData } = fetchColRow(transformedData);
      const params = {
        colDefs,
        rowData,
        pagedInfo
      };
      setGridState(params);
    } catch (error) {
      console.error("Error fetching PmCode data:", error);
      setGridState({ colDefs: [], rowData: [], pagedInfo: null });
    }
  };
  pmCodes();
}

function fetchLabelTypes(setGridState: any, paginationParams: any) {
  const labelTypes = async () => {
    try {
      let response = await LabelType.getLabelTypeListEx({
        ...paginationParams.filter,
        ItemsPerPage: paginationParams.pageSize,
        PageNumber: paginationParams.page,
      });

      const apiData = response.data;
      const pagedInfo = apiData.pagedInfo;
      
      const transformedData = {
        columns: apiData.data.columns,
        rows: apiData.data.rows
      };

      const { colDefs, rowData } = fetchColRow(transformedData);
      const params = {
        colDefs,
        rowData,
        pagedInfo
      };
      setGridState(params);
    } catch (error) {
      console.error("Error fetching LabelType data:", error);
      setGridState({ colDefs: [], rowData: [], pagedInfo: null });
    }
  };
  labelTypes();
}

function fetchCustomers(setGridState: any, paginationParams: any) {
  const customers = async () => {
    try {
      let response = await Customer.getCustomerListEx({
        ...paginationParams.filter,
        ItemsPerPage: paginationParams.pageSize,
        PageNumber: paginationParams.page,
      });

      // Handle new API response structure
      const apiData = response.data;
      const pagedInfo = apiData.pagedInfo;
      
      // Transform the new data structure
      const transformedData = {
        columns: apiData.data.columns,
        rows: apiData.data.rows
      };

      const { colDefs, rowData } = fetchColRow(transformedData);
      const params = {
        colDefs,
        rowData,
        pagedInfo
      };
      setGridState(params);
    } catch (error) {
      console.error("Error fetching Customer data:", error);
      setGridState({ colDefs: [], rowData: [], pagedInfo: null });
    }
  };
  customers();
}

function fetchLabels(setGridState: any, paginationParams: any) {
  const labels = async () => {
    try {
      let response = await Label.getLabels({
        ...paginationParams.filter,
        ItemsPerPage: paginationParams.pageSize,
        PageNumber: paginationParams.page,
      });

      // Handle normalized response structure from Label service
      const pagedInfo = response.pagedInfo;
      const transformedData = {
        columns: response.data.columns,
        rows: response.data.rows
      };

      const { colDefs, rowData } = fetchColRow(transformedData);
      const params = {
        colDefs,
        rowData,
        pagedInfo
      };
      setGridState(params);
    } catch (error) {
      console.error("Error fetching Label data:", error);
      setGridState({ colDefs: [], rowData: [], pagedInfo: null });
    }
  };
  labels();
}

function fetchLookups(setGridState: any, type: string, paginationParams: any) {
  const lookups = async () => {
    try {
      let response = await Lookup.getLookupList(type, {
        ...paginationParams.filter,
        ItemsPerPage: paginationParams.pageSize,
        PageNumber: paginationParams.page,
      });

      // Handle new API response structure
      const apiData = response.data;
      const pagedInfo = apiData.pagedInfo;
      
      // Transform the new data structure
      const transformedData = {
        columns: apiData.data.columns,
        rows: apiData.data.rows
      };

      const { colDefs, rowData } = fetchColRow(transformedData);

      const formattedRowData = rowData.map((row: any) => {
        const lookupItem = LookupDropdownData.find(item => item.value == row.type);
        return {
          ...row,
          type: lookupItem ? lookupItem.label : row.type, 
        };
      });

      const params = {
        colDefs,
        rowData: formattedRowData.reverse(),
        pagedInfo
      };
      setGridState(params);
    } catch (error) {
      console.error("Error fetching Lookup data:", error);
      setGridState({ colDefs: [], rowData: [], pagedInfo: null });
    }
  };
  lookups();
}