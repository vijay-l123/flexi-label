import React from "react";
import common from "../utils/common";
import User from "../Services/User";

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
      fetchUsers(setGridState);
      updateUsersData(false);
    }
  }, [userAction]);

  React.useMemo(() => {
    if (!initLoad.current) {
      fetchUsers(setGridState);
      initLoad.current = true;
    }
  }, []);

  return { gridData, updateUsersData };
}

function fetchUsers(setGridState: any) {
  const users = async () => {
    let response = await User.getUserListEx();
    const { colDefs, rowData } = fetchColRow(response.data);
    const params = {
      colDefs,
      rowData,
    };
    setGridState(params);
  };
  users();
}
