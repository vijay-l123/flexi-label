import React, { ReactNode, createContext, useContext } from "react";
import { useLabelHistoryData } from "../hooks/useLabelHistoryData";

interface ILabelHistoryProps {
  children?: any;
  id?: any;
}

interface ILabelHistoryContextProps {
  rowData: any[];
  columnData: any[];
}

const LabelHistoryContext = createContext({} as ILabelHistoryContextProps);

export function LabelHistoryContextProvider({
  children,
  id,
}: ILabelHistoryProps): JSX.Element {
  const { columnData, rowData } = useLabelHistoryData(id);

  const memoedValue = React.useMemo(
    () => ({
      rowData,
      columnData,
    }),
    [rowData, columnData]
  );

  return (
    <LabelHistoryContext.Provider value={memoedValue}>
      {children}
    </LabelHistoryContext.Provider>
  );
}

export default function useLabelHistoryContext() {
  return useContext(LabelHistoryContext);
}
