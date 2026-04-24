import React from "react";
import common from "../utils/common";
import User from "../Services/User";
import { useFilterContext } from "../Context/FilterContext";

const { fetchColRow } = common;

interface IGridState {
  colDefs: any;
  rowData: any;
  pagedInfo?: any; 
}

export function useUsersData() {
  const [gridData, setGridData] = React.useState<IGridState>({
    colDefs: [],
    rowData: [],
    pagedInfo: null, 
  });
  const [userAction, setUserAction] = React.useState<boolean>(false);
  const { filter, pageSize, page } = useFilterContext();

  const updateUsersData = React.useCallback((val: boolean) => {
    setUserAction(val);
  }, []);

  const initLoad = React.useRef(false);

  const setGridState = React.useCallback(
    (param: any) =>
      setGridData((prevState: any) => ({
        ...prevState,
        colDefs: param.colDefs,
        rowData: param.rowData,
        pagedInfo: param.pagedInfo,
      })),
    []
  );
 
    React.useMemo(() => {
    if (userAction) {
      fetchUsers(setGridState, { filter, pageSize, page });
      updateUsersData(false);
    }
  }, [userAction, pageSize, page, filter]);

  React.useMemo(() => {
    if (!initLoad.current) {
      fetchUsers(setGridState, { filter: {}, pageSize, page }); 
      initLoad.current = true;
    }
  }, [pageSize, page]);

  //new
  React.useEffect(() => {
    if (initLoad.current) {
      fetchUsers(setGridState, { filter, pageSize, page });
    }
  }, [pageSize, page, filter]);
  //

  return { gridData, updateUsersData };
}

function fetchUsers(setGridState: any, { filter, pageSize, page }: any) {
  const users = async () => {
    try {
      const filterParams = filter.filterValue !== undefined ? {
        filterCol: filter.column?.field,
        filterOperator: filter.operator,
        filterValue: filter.filterValue, // Use the processed filterValue
      } : {
        filterCol: "",
        filterOperator: "",
        filterValue: "",
      };

      let response = await User.getUserListEx({
        ...filterParams,
        ItemsPerPage: pageSize,
        PageNumber: page + 1,
      });

      // Handle new API response structure
      const apiData = response.data;
      
      // Process the new pagedInfo structure
      const pagedInfo = apiData.pagedInfo;
      // console.log('Pagination Info:', pagedInfo);
      
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
      // console.error("Error fetching users:", error);
      setGridState({ colDefs: [], rowData: [], pagedInfo: null });
    }
  };
  users();
}