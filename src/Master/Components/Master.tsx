import { Tabs, Tab, Box, FormControl, Select, MenuItem } from "@mui/material";
import React, { ReactNode } from "react";
import useAuthContext from "../../Authentication/AuthProvider";
import useMasterAuthContext from "../../Context/MasterAuthContext";
import Controls from "../../Controls/Controls";

import DisplayGrid from "../../Controls/DisplayGrid";
import AddIcon from "@mui/icons-material/Add";
import withMaster from "../../HOC/WithMaster";
import withPaperLayout from "../../HOC/withPaperLayout";
import LabelModalPopup from "../../Modal/Components/LabelModalPopup";
import common from "../../utils/common";
import { IModalProps } from "../../utils/types";
import ActionCellRenderer from "../../AppContainer/Components/ActionCellRenderer";

const { TRoleType } = common;
function Master(): JSX.Element {
  const { tabValue, handleTabChange, gridData, updateMasterData,setLookupvalue,lookupvalue
    // handleLookupChange 
  } =
    useMasterAuthContext();
  const { authData } = useAuthContext();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);
  const [rowData, setRowData] = React.useState<any>([]);
  const [newType, setNewType] = React.useState(0);
  const isNewVersionClicked = React.useRef(false);

  //
  const { masterTabData,LookupDropdownData } = common;
console.log("masterTabData",masterTabData,tabValue,LookupDropdownData);

  const editClickEvent = (params: any): void => {
    setModalState(true);
    setRowData(params.row);
    setEdit(true);
    isNewVersionClicked.current = false;
  };

  const createVersionClickEvent = (params: any): void => {
    setModalState(true);
    setRowData(params.row);
    setEdit(true);
    isNewVersionClicked.current = true;
  };
// const handleLookupChange = (e:any) : void => {
// console.log("111",e.target.value);

// }
  const gridProps = {
    colDefs: [
      //...hiddenColDef,
      {
        field: "actions",
        headerName: "Action",
        type: "actions",
        headerClassName: "super-app-theme--header",
        cellClassName: "super-app-theme--cell",
        maxWidth: 200,
        renderCell: (params: any) => (
          <ActionCellRenderer
            rowParams={params}
            editClick={() => editClickEvent(params)}
            isEditMasterData={true}
            isCreateVersion={tabValue === 5}
            createVersionClick={() => createVersionClickEvent(params)}
          />
        ),

        // getActions: (params: any) => [
        //   <GridActionsCellItem
        //     showInMenu
        //     icon={<BorderColorOutlinedIcon />}
        //     label="Edit"
        //     onClick={() => {
        //       console.log("popupdata", params);
        //       modalState(true);
        //       rowState(params.row);
        //       editState(true);
        //     }}
        //   />,
        // ],
      },
      ...gridData.colDefs,
    ],
    rowData: gridData.rowData,
  };

  const setModalState = (val: boolean) => setModalOpen(val);
  function resetStates() {
    setRowData({});
    setEdit(false);
    setNewType(0);
    isNewVersionClicked.current = false;
  }

  const modalProps: IModalProps = {
    isOpen: modalOpen,
    closeModal: (val) => {
      setModalState(val);
      resetStates();
    },
    editState: isEdit,
    rowState: isEdit && rowData,
    newTypeState: tabValue, //isEdit ? tabValue : newType,- will show the tab based in create  new dropdown
    defaultToLabel: false,
    setNewTypeState: (val: number) => setNewType(val),
    isCreateNewVersion: isNewVersionClicked.current,
  };
  return (
    <React.Fragment>
      <LabelModalPopup {...modalProps}></LabelModalPopup>
      {authData.roleId === TRoleType.Initiator && (
        <Box component="div" sx={{ display: "flex" }}>
          <Box sx={{ flexGrow: 1 }} />
          <Controls.Button
            variant="contained"
            onClick={() => {
              setModalState(true);
              isNewVersionClicked.current = false;
            }}
            startIcon={<AddIcon />}
          >
            Create New
          </Controls.Button>
        </Box>
      )}
    <Box sx={{display:'flex',justifyContent:"space-between",alignItems:'center'}}>
    <Tabs
        value={tabValue}
        onChange={(event, value) => handleTabChange(value)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {masterTabData.map((tab, tIndex) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
  {tabValue === 6 && 
      <FormControl sx={{ minWidth: "11%" }}>
      <Select
        required
        fullWidth
        // displayEmpty
        size="small"
        label='Select Lookup'
        labelId="select-types-label"
        id="Select Lookup"
        name="Select Lookup"
        // value={newType}
        // defaultValue={lookupvalue[0]}
        onChange={(e) =>setLookupvalue(e.target.value)}
        // disabled={true}
        // sx={{
        //   backgroundColor: CustomTheme.CustomColor.Common.white,
        // }}

        // error={formValues.roles.error}
      >
        {LookupDropdownData.map((item, index) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {/* <FormHelperText sx={{ color: "#D32F2F" }}>
          {formValues.roles.error && formValues.roles.errorMessage}
        </FormHelperText> */}
    </FormControl>
  }
    </Box>
      <DisplayGrid {...gridProps} />
    </React.Fragment>
  );
}

const paperLayoutGridProps = {
  paperHeight: "85vh",
  boxHeight: "70vh",
};

export default withPaperLayout(withMaster(Master), paperLayoutGridProps);
