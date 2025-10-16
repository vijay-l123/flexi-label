import React from "react";
import common from "../utils/common";
import User from "../Services/User";
import { useFilterContext } from "../Context/FilterContext";

const { fetchColRow } = common;

interface IGridState {
  colDefs: any;
  rowData: any;
}

export function useUsersData() {
  const [gridData, setGridData] = React.useState<IGridState>({
    colDefs: [],
    rowData: [],
  });
  const [userAction, setUserAction] = React.useState<boolean>(false);
  const { filter,pageSize, page } = useFilterContext();

  const updateUsersData = React.useCallback((val: boolean) => {
    console.log("updateUsersData", val);
    setUserAction(val);
  }, []);

  const initLoad = React.useRef(false);

  const setGridState = React.useCallback(
    (param: any) =>
      setGridData((prevState: any) => ({
        ...prevState,
        colDefs: param.colDefs,
        rowData: param.rowData,
      })),
    []
  );

  React.useMemo(() => {
    console.log("usememo", userAction);
    if (userAction) {
      fetchUsers(setGridState, { filter, pageSize, page });
      updateUsersData(false);
    }
  }, [userAction,filter, pageSize, page]);

  React.useMemo(() => {
    if (!initLoad.current) {
      fetchUsers(setGridState, { filter, pageSize, page });
      initLoad.current = true;
    }
  }, []);

  return { gridData, updateUsersData };
}

function fetchUsers(setGridState: any,{ filter, pageSize, page }: any) {
  const users = async () => {
      try {
    let response = await User.getUserListEx({
      filterCol: filter.column?.field,
      filterOperator: filter.operator,
      filterValue: filter.value,
      itemPerPage: pageSize,
      pageNo: page,
    });
    const { colDefs, rowData } = fetchColRow(response.data);
    const params = {
      colDefs,
      rowData,
    };
    setGridState(params);
      } catch (error) {
           console.error("Error fetching users:", error);
    setGridState({ colDefs: [], rowData: [] });
      }
  };
  users();
}
