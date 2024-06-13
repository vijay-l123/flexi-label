import React, { ReactNode, createContext, useContext } from "react";
import { useLabelsData } from "../hooks/useLabelsData";

interface ILabelsProps {
  children?: any;
}

interface ILabelsContextProps {
  rowData: any[];
  columnData: any[];
  updateSelectedTab: (val: any) => void;
  updateLabelsData: (val: any) => void;
}

const LabelsContext = createContext({} as ILabelsContextProps);

export function LabelsContextProvider({ children }: ILabelsProps): JSX.Element {
  const {
    columnData,
    rowData,

    updateSelectedTab,
    updateLabelsData,
  } = useLabelsData();

  const memoedValue = React.useMemo(
    () => ({
      rowData,
      columnData,
      updateSelectedTab,
      updateLabelsData,
    }),
    [rowData, columnData]
  );
  return (
    <LabelsContext.Provider value={memoedValue}>
      {children}
    </LabelsContext.Provider>
  );
}

export default function useLabelsContext() {
  return useContext(LabelsContext);
}
