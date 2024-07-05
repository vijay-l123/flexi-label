import React, { ReactNode, createContext, useContext, useEffect } from "react";
import { useMasterData } from "../hooks/useMasterData";
import Services from "../Services/Services";
import { useDispatch, useSelector } from "react-redux";
import { setTabValueRedux } from "../Redux/MasterDataUpdateSlice/LookupUpdate";

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
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = React.useState(0);
  const [lookupvalue, setLookupvalue] = React.useState('1');
  const [addLookupFlag, setAddLookupFlag] = React.useState(false);
  const [editLookupFlag, setEditLookupFlag] = React.useState(false);
  console.log("MasterAuthContext : lookupvalue",lookupvalue);
  const {isCreate , isEdit} = useSelector((state: any) => state.lookupDataFlags)
  
  const handleTabChange = (val: number) => {
    setTabValue(val)
    dispatch(setTabValueRedux(val));
  };

  // const handleLookupChange = (e:any) : void => {
  //   console.log("111",e.target.value);
  //   setLookupvalue(e.target.value);
  //   }
  const { getLookupList } = Services.Lookup
  useEffect(() => {
    // setLookupvalue('1')
    if(isCreate || isEdit) {
      getLookupList('1');
    }
  },[lookupvalue, getLookupList, isCreate, isEdit])
  const { gridData, updateMasterData } = useMasterData(tabValue, lookupvalue);

  const memoedValue = React.useMemo(
    () => ({
      tabValue,
      handleTabChange,
      // handleLookupChange,
      setAddLookupFlag,
      setEditLookupFlag,
      gridData,
      updateMasterData,
      setLookupvalue,
      lookupvalue
    }),
    [tabValue, gridData, lookupvalue,setLookupvalue, setAddLookupFlag, setEditLookupFlag]
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
