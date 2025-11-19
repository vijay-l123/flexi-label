import React, { ReactNode, createContext, useContext } from "react";
import { useLabelsData } from "../hooks/useLabelsData";
import Services from "../Services/Services";
import { fetchLookupDataAsync } from "../Redux/MasterDataUpdateSlice/getLookupSlice";
import { useDispatch } from "react-redux";

interface ILabelsProps {
  children?: any;
}

interface ILabelsContextProps {
  rowData: any[];
  columnData: any[];
  LabelversionAPiCall: any;
  updateSelectedTab: (val: any) => void;
  updateLabelsData: (val: any) => void;
  productList: any;
  andaList: any;
  labelTypes: any;
  lookpup: any;
  pmCodes: any;
  customers: any;
  setLabelversionAPiCall: (val: any) => void;
  setCustomers: (val: any) => void;
  setLabelTypes: (val: any) => void;
  setPmCodes: (val: any) => void;
  setProductList: (val: any) => void;
  setAndaList: (val: any) => void;
  setLookUp: (val: any) => void;
}
interface IAndaTypes {
  andaid: number;
  andanumber: string;
  startDate: string;
  endData: string;
  isActive: boolean;
}
const LabelsContext = createContext({} as ILabelsContextProps);

export function LabelsContextProvider({ children }: ILabelsProps): JSX.Element {
    const [LabelversionAPiCall, setLabelversionAPiCall] = React.useState(false);
  
  const {
    columnData,
    rowData,

    updateSelectedTab,
    updateLabelsData,
  } = useLabelsData(LabelversionAPiCall);
  // console.log("LabelversionAPiCall :LabelsContext",LabelversionAPiCall);
  const [andaList, setAndaList] = React.useState<IAndaTypes[]>([]);
  const [productList, setProductList] = React.useState<any[]>([]);
  const [pmCodes, setPmCodes] = React.useState<any[]>([]);
  const [labelTypes, setLabelTypes] = React.useState<any[]>([]);
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [lookpup, setLookUp] = React.useState<any[]>([]);
    // console.log('lookpupcontext',lookpup);
    // console.log('andaList',andaList);

    const dispatch = useDispatch()

      React.useMemo(() => {
    const fetchAndaList = async () => {
      try {
        let response = await Services.Anda.getAndaList();
        // console.log("response",response);
            setAndaList(response.data);
      
      } catch (error) {
        console.log(error);
      }
    };

    const fetchProductList = async () => {
      try {
        let response = await Services.Product.getProductList();
        setProductList(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPmCodes = async () => {
      try {
        let response = await Services.PmCode.getPmCodeList();
        setPmCodes(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchLabelTypes = async () => {
      try {
        let response = await Services.LabelType.getLabelTypeList();
        setLabelTypes(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCustomers = async () => {
      try {
        let response = await Services.Customer.getCustomerList();
        setCustomers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchLookup = async () => {
      try {
        let response = await Services.Lookup.getversionLookupList();        
        setLookUp(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
        fetchAndaList();
        fetchProductList();
        fetchPmCodes();
        fetchLabelTypes();
        fetchCustomers();
        fetchLookup();
           dispatch(fetchLookupDataAsync());
    //     break;
    // }

  }, []);
  const memoedValue = React.useMemo(
    () => ({
      rowData,
      columnData,
      updateSelectedTab,
      updateLabelsData,
      LabelversionAPiCall,setLabelversionAPiCall,
      customers,labelTypes,pmCodes,productList,andaList,
      setAndaList,setLabelTypes,setCustomers,setPmCodes,setProductList,lookpup,setLookUp
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
