import React, { ReactNode, createContext, useContext } from "react";
import { useMasterData } from "../hooks/useMasterData";

interface IMasterProps {
  children?: ReactNode;
}
interface IMasterAuthProps {
  tabValue: any;
  gridData: any;
  handleTabChange: (val: any) => void;
  updateMasterData: (val: any) => void;
}

const MasterAuthContext = createContext({} as IMasterAuthProps);

export function MasterAuthProvider({ children }: IMasterProps): JSX.Element {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (val: number) => setTabValue(val);

  const { gridData, updateMasterData } = useMasterData(tabValue);

  const memoedValue = React.useMemo(
    () => ({
      tabValue,
      handleTabChange,
      gridData,
      updateMasterData,
    }),
    [tabValue, gridData]
  );
  return (
    <MasterAuthContext.Provider value={memoedValue}>
      {children}
    </MasterAuthContext.Provider>
  );
}

export default function useMasterAuthContext() {
  return useContext(MasterAuthContext);
}
