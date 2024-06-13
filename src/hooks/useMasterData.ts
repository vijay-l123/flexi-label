import React from "react";
import common from "../utils/common";
import Anda from "../Services/Anda";
import Product from "../Services/Product";
import PmCode from "../Services/PmCode";
import LabelType from "../Services/LabelType";
import Customer from "../Services/Customers";
import Label from "../Services/Label";

const { fetchColRow } = common;

interface IGridState {
  colDefs: any;
  rowData: any;
}

export function useMasterData(tabValue: number) {
  const [gridData, setGridData] = React.useState<IGridState>({
    colDefs: [],
    rowData: [],
  });

  const [masterAction, setMasterAction] = React.useState<boolean>(false);

  const updateMasterData = React.useCallback((val: boolean) => {
    setMasterAction(val);
  }, []);

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
    if (tabValue === 0) {
      fetchAnda(setGridState);
    }
    if (tabValue === 1) {
      fetchProducts(setGridState);
    }
    if (tabValue === 2) {
      fetchPmCodes(setGridState);
    }
    if (tabValue === 4) {
      fetchLabelTypes(setGridState);
    }
    if (tabValue === 3) {
      fetchCustomers(setGridState);
    }
    if (tabValue === 5) {
      fetchLabels(setGridState);
    }
  }, [tabValue]);

  React.useMemo(() => {
    if (masterAction) {
      if (tabValue === 0) {
        fetchAnda(setGridState);
      }
      if (tabValue === 1) {
        fetchProducts(setGridState);
      }
      if (tabValue === 2) {
        fetchPmCodes(setGridState);
      }
      if (tabValue === 4) {
        fetchLabelTypes(setGridState);
      }
      if (tabValue === 3) {
        fetchCustomers(setGridState);
      }
      if (tabValue === 5) {
        fetchLabels(setGridState);
      }
      updateMasterData(false);
    }
  }, [masterAction]);

  return { gridData, updateMasterData };
}

function fetchAnda(setGridState: any) {
  const anda = async () => {
    let response = await Anda.getAndaListEx();
    const { colDefs, rowData } = fetchColRow(response.data);
    const params = {
      colDefs,
      rowData,
    };
    setGridState(params);
  };
  anda();
}

function fetchProducts(setGridState: any) {
  const products = async () => {
    let response = await Product.getProductListEx();
    const { colDefs, rowData } = fetchColRow(response.data);
    const params = {
      colDefs,
      rowData,
    };
    setGridState(params);
  };
  products();
}
function fetchPmCodes(setGridState: any) {
  const pmCodes = async () => {
    let response = await PmCode.getPmCodeListEx();
    const { colDefs, rowData } = fetchColRow(response.data);
    const params = {
      colDefs,
      rowData,
    };
    setGridState(params);
  };
  pmCodes();
}
function fetchLabelTypes(setGridState: any) {
  const labelTypes = async () => {
    let response = await LabelType.getLabelTypeListEx();
    const { colDefs, rowData } = fetchColRow(response.data);
    const params = {
      colDefs,
      rowData,
    };
    setGridState(params);
  };
  labelTypes();
}
function fetchCustomers(setGridState: any) {
  const customers = async () => {
    let response = await Customer.getCustomerListEx();
    const { colDefs, rowData } = fetchColRow(response.data);
    const params = {
      colDefs,
      rowData,
    };
    setGridState(params);
  };
  customers();
}
function fetchLabels(setGridState: any) {
  const labels = async () => {
    let response = await Label.getLabels();
    const { colDefs, rowData } = fetchColRow(response.data);
    const params = {
      colDefs,
      rowData,
    };
    setGridState(params);
  };
  labels();
}
