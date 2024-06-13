import { camelCase } from "lodash";
import React from "react";
import useAuthContext from "../Authentication/AuthProvider";
import Services from "../Services/Services";
import common from "../utils/common";

const {
  TLabelStatus,
  TRoleType,
  tabData,
  TButtonClick,
  fetchConfirmationTitle,
  camelizeKeys,
} = common;

export function useLabelsData() {
  const [rowData, setRowData] = React.useState<any[]>([]);
  const [columnData, setColumnData] = React.useState<any[]>([]);
  const [selectedTab, setSelectedTab] = React.useState<any>();
  const [labelAction, setLabelAction] = React.useState<boolean>(false);

  const { authData } = useAuthContext();

  const clearState = () => {
    setRowData([]);
    setColumnData([]);
  };

  const updateSelectedTab = React.useCallback((val: any) => {
    setSelectedTab(val);
  }, []);

  const updateLabelsData = React.useCallback((val: boolean) => {
    setLabelAction(val);
  }, []);

  React.useMemo(() => {
    const getLabels = async () => {
      try {
        const response = await Services.LabelVersion.getLableVersionList(
          selectedTab,
          authData.roleId
        );
        setColumnData(
          response.data["columns"].map((i: any) => {
            return { ...i, field: camelCase(i.name) };
          })
        );

        setRowData(
          response.data["rows"].map((i: any, index: number) => {
            return { ...camelizeKeys(i), index: index };
          })
        );
      } catch (error) {
        console.log(error);
      }

      return () => clearState();
    };
    if (selectedTab) getLabels();
  }, [selectedTab]);

  React.useMemo(() => {
    const getLabels = async () => {
      try {
        const response = await Services.LabelVersion.getLableVersionList(
          selectedTab,
          authData.roleId
        );
        setColumnData(
          response.data["columns"].map((i: any) => {
            return { ...i, field: camelCase(i.name) };
          })
        );

        setRowData(
          response.data["rows"].map((i: any, index: number) => {
            return { ...camelizeKeys(i), index: index };
          })
        );
      } catch (error) {
        console.log(error);
      }

      return () => clearState();
    };
    if (labelAction) {
      getLabels();
      updateLabelsData(false);
    }
  }, [labelAction]);

  return {
    columnData,
    rowData,

    updateSelectedTab,
    updateLabelsData,
  };
}
