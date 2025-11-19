import { Box, Button, Paper, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import GridLayout from "../../AppContainer/Components/GridLayout";
import withPaperLayout from "../../HOC/withPaperLayout";
import LabelModalPopup from "../../Modal/Components/LabelModalPopup";
import AddIcon from "@mui/icons-material/Add";
import Controls from "../../Controls/Controls";
import common from "../../utils/common";
import useAuthContext, { getAuthData } from "../../Authentication/AuthProvider";
import { useTabs } from "../../hooks/useTabs";
import withLabels from "../../HOC/withLabels";
import { IModalProps } from "../../utils/types";
import { useDispatch } from "react-redux";
import { setCreateNewVersionRedux } from "../../Redux/MasterDataUpdateSlice/LookupUpdate";
import { useFilterContext } from "../../Context/FilterContext";
import useLabelsContext from "../../Context/LabelsContext";
import { GridColumnVisibilityModel } from "@mui/x-data-grid";

const { TRoleType } = common;
function Dashboard() {
  const [tabValue, setTabValue] = React.useState(1);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState<any>([]);
  const [isEdit, setEdit] = React.useState(false);
  const [newType, setNewType] = React.useState(0);
  const [isCreateNewVersion, setCreateNewVersion] = React.useState(false);
  const [isChangeColor, setChangeColor] = React.useState(false);
  const [isImplementationDate, setImplementationDate] = React.useState(false);
  const selectedTab = React.useRef(1);
  const { authData } = useAuthContext();
  const { setLabelversionAPiCall } = useLabelsContext();
    const {setErrors,setFilter,setPage,setPageSize} = useFilterContext();

setLabelversionAPiCall(false);
  const dispatch = useDispatch();

  const { tabs } = useTabs(authData.roleId);

  const handleTabChange = (event: any, value: any) => {
    setTabValue(value);
    selectedTab.current = value;
      setFilter({});
  setErrors({});
     setPageSize(25)
      setPage(0);
  };

  const setModalState = (val: boolean) => setModalOpen(val);

  const modalProps: IModalProps = {
    isOpen: modalOpen,
    closeModal: (val) => {
      setModalState(val);
      resetStates();
    },
    editState: isEdit,
    rowState: isEdit && rowData,
    newTypeState: 5,
    defaultToLabel: true,
    selectedTab: selectedTab.current,
    setNewTypeState: (val: number) => setNewType(val),
    isCreateNewVersion: isCreateNewVersion,
    isChangeColor: isChangeColor,
    isImplementationDate: isImplementationDate,
  };

  const editmodalHandler = (val: any) => {
    setCreateNewVersion(val);
    dispatch(setCreateNewVersionRedux(val));
  }
  const editColormodalHandler = (val: any) => {
    setChangeColor(val);
  }
  const editimplementaiondatemodalHandler = (val: any) => {
    setImplementationDate(val);
  }

  const editModalProps: any = {
    modalState: (val: boolean) => {
      setModalState(val);
      resetStates();
    },
    rowState: (val: any) => setRowData({ ...val }),
    editState: (val: any) => setEdit(val),
    selectedTab: selectedTab.current,
    createNewVersionState: (val: any) => editmodalHandler(val),
    changeColorState: (val: any) => editColormodalHandler(val),
    changeImplementationDateState: (val: any) => editimplementaiondatemodalHandler(val),
  };

  function resetStates() {
    setRowData({});
    setEdit(false);
    setNewType(0);
    setCreateNewVersion(false);
    setChangeColor(false);
    setImplementationDate(false);
  }

  //const;
  return (
    <React.Fragment>
      {modalOpen && <LabelModalPopup {...modalProps}></LabelModalPopup>}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((tab, tIndex) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      <GridLayout {...editModalProps}></GridLayout>
    </React.Fragment>
  );
}

const paperLayoutGridProps = {
  paperHeight: "85vh",
  boxHeight: "70vh",
};
const hocComponent = withLabels(Dashboard);

export default withPaperLayout(hocComponent, paperLayoutGridProps);
