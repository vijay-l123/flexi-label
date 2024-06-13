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

const { TRoleType } = common;

// const FireNav = styled(List)<{ component?: React.ElementType }>({
//   "& .MuiListItemButton-root": {
//     paddingLeft: 24,
//     paddingRight: 24,
//   },
//   "& .MuiListItemIcon-root": {
//     minWidth: 0,
//     marginRight: 16,
//   },
//   "& .MuiSvgIcon-root": {
//     fontSize: 20,
//   },
// });

function Dashboard() {
  const [tabValue, setTabValue] = React.useState(1);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState<any>([]);
  const [isEdit, setEdit] = React.useState(false);
  const [newType, setNewType] = React.useState(0);
  const [isCreateNewVersion, setCreateNewVersion] = React.useState(false);
  const selectedTab = React.useRef(1);
  const { authData } = useAuthContext();

  const { tabs } = useTabs(authData.roleId);

  console.log("tabs", tabs);

  const handleTabChange = (event: any, value: any) => {
    setTabValue(value);
    selectedTab.current = value;
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
    newTypeState: 5, //isEdit ? 5 : newType,//To make it new label information by default
    defaultToLabel: true,
    setNewTypeState: (val: number) => setNewType(val),
    isCreateNewVersion: isCreateNewVersion,
  };

  const editModalProps: any = {
    modalState: (val: boolean) => {
      setModalState(val);
      resetStates();
    },
    rowState: (val: any) => setRowData({ ...val }),
    editState: (val: any) => setEdit(val),
    selectedTab: selectedTab.current,
    createNewVersionState: (val: any) => setCreateNewVersion(val),
  };

  function resetStates() {
    setRowData({});
    setEdit(false);
    setNewType(0);
    setCreateNewVersion(false);
  }

  //const;
  return (
    <React.Fragment>
      {modalOpen && <LabelModalPopup {...modalProps}></LabelModalPopup>}
      {/* {authData.roleId === TRoleType.Initiator && (
        <Box component="div" sx={{ display: "flex" }}>
          <Box sx={{ flexGrow: 1 }} />
          <Controls.Button
            variant="contained"
            onClick={() => setModalState(true)}
            startIcon={<AddIcon />}
          >
            Create New
          </Controls.Button>
        </Box>
      )} */}
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
