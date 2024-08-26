import { camelCase } from "lodash";
import React from "react";
import Services from "../Services/Services";
import common from "../utils/common";
import { useDispatch } from "react-redux";
import { setErrorFlag } from "../Redux/PopupSlice/PopupSlice";

const { camelizeKeys } = common;

export function useLabelHistoryData(id: number) {
  const dispatch = useDispatch();
  const [rowData, setRowData] = React.useState<any[]>([]);
  const [columnData, setColumnData] = React.useState<any[]>([]);
  const clearState = () => {
    setRowData([]);
    setColumnData([]);
  };

  React.useMemo(() => {
    const getLabelHistory = async () => {
      try {
        const response = await Services?.LabelHistory?.getLabelHistory(id);
        setColumnData(
          response.data["labelVersionHistory"]?.columns?.map((i: any) => {
            return { ...i, field: camelCase(i?.name) };
          })
        );

        setRowData(
          response.data["labelVersionHistory"]?.rows?.map(
            (i: any, index: number) => {
              return { ...camelizeKeys(i), index: index };
            }
          )
        );
      } catch (error) {
        console.log(error);
        dispatch(setErrorFlag(true));
      }

      return () => clearState();
    };
    if (id) getLabelHistory();
  }, [id]);

  return {
    columnData,
    rowData,
  };
}
