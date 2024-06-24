import React, { ReactNode, createContext, useContext } from "react";
import { useMasterData } from "../hooks/useMasterData";

interface IMasterProps {
  children?: ReactNode;
}
interface IMasterAuthProps {
  tabValue: any;
  gridData: any;
  lookupvalue:any;
  setLookupvalue:any;
  handleTabChange: (val: any) => void;
  updateMasterData: (val: any) => void;
  // handleLookupChange: (val: any) => void;
}

const MasterAuthContext = createContext({} as IMasterAuthProps);

export function MasterAuthProvider({ children }: IMasterProps): JSX.Element {
  const [tabValue, setTabValue] = React.useState(0);
  const [lookupvalue, setLookupvalue] = React.useState(0);
  console.log("MasterAuthContext : lookupvalue",lookupvalue);
  
  const handleTabChange = (val: number) => setTabValue(val);

  // const handleLookupChange = (e:any) : void => {
  //   console.log("111",e.target.value);
  //   setLookupvalue(e.target.value);
  //   }
  const { gridData, updateMasterData } = useMasterData(tabValue);

  const memoedValue = React.useMemo(
    () => ({
      tabValue,
      handleTabChange,
      // handleLookupChange,
      gridData,
      updateMasterData,
      setLookupvalue,
      lookupvalue
    }),
    [tabValue, gridData, lookupvalue,setLookupvalue]
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
