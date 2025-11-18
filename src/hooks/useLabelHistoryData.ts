import { camelCase } from "lodash";
import React from "react";
import Services from "../Services/Services";
import common from "../utils/common";

const { camelizeKeys } = common;

export function useLabelHistoryData(id: number) {
  const [rowData, setRowData] = React.useState<any[]>([]);
  const [columnData, setColumnData] = React.useState<any[]>([]);
  const clearState = () => {
    setRowData([]);
    setColumnData([]);
  };

  React.useMemo(() => {
    const getLabelHistory = async () => {
      try {
        const response = await Services.LabelHistory.getLabelHistory(id);
        setColumnData(
          response.data["labelVersionHistory"].columns.map((i: any) => {
            return { ...i, field: camelCase(i.name) };
          })
        );
//         setColumnData(
//   response.data["labelVersionHistory"].columns.map((i: any) => ({
//     ...i,
//     // field: camelizeKeys({ [i.name]: "" }) && Object.keys(camelizeKeys({ [i.name]: "" }))[0],
//     field: i.name === "CCF" ? "cCf" : camelCase(i.name),
//   }))
// );


        setRowData(
          response.data["labelVersionHistory"].rows.map(
            (i: any, index: number) => {
              return { ...camelizeKeys(i), index: index };
            }
          )
        );
      } catch (error) {
        console.log(error);
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
