import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  FormHelperText,
  MenuItem,
  Select,
  Breakpoint,
} from "@mui/material";
import {
  Close,
  CheckCircle,
  CheckCircleOutline,
  Save,
  Visibility,
  ReplyAll,
  TaskAlt,
  InsertComment,
} from "@mui/icons-material";
import React from "react";
import Controls from "../../Controls/Controls";
import CustomTheme from "../../Theme/CustomTheme";
import { showButton } from "../utilModal";
import common from "../../utils/common";

const { TButtonClick } = common;

const style = {
  p: 4,
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  m: "auto",
};

export interface IPopupProps {
  isPopup: boolean;
  closePopup: (val: boolean) => void;
  children: any;
  dialogTitle: string;
  form: any;
  maxWidth?: string;
  editRowState?: any;
  authData?: any;
  handleWorkflowProcess?: any;
}

function Popup(props: IPopupProps) {
  const {
    isPopup,
    closePopup,
    dialogTitle,
    form,
    children,
    maxWidth,
    editRowState,
    authData,
    handleWorkflowProcess,
  } = props;

  let mxWidth = !maxWidth ? "xs" : (maxWidth as Breakpoint);
  console.log("popupparams", props);

  const handleClose = () => {
    closePopup(false);
  };
  return (
    <Dialog
      fullWidth
      open={isPopup}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      maxWidth={mxWidth}
      sx={style}
    >
      <DialogTitle
        sx={{
          // mt: 2,
          // mb: 2,
          px: 2,
          py: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: CustomTheme.CustomColor.Primary.dark, // "#d1c4e9",
          color: CustomTheme.CustomColor.Common.white,
        }}
      >
        {dialogTitle}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions
        sx={{ backgroundColor: CustomTheme.CustomColor.Site.bgColor }}
      >
        {" "}
        <Controls.Button
          variant="outlined"
          onClick={handleClose}
          startIcon={<Close></Close>}
        >
          Close
        </Controls.Button>
        {form.trim().toLowerCase() === "confirmationbox" && (
          <Controls.Button
            type="submit"
            form={form}
            variant="contained"
            // onClick={handleClose}
            startIcon={<CheckCircle></CheckCircle>}
          >
            Ok
          </Controls.Button>
        )}
        {form.trim().toLowerCase() === "addnotesbox" && (
          <Controls.Button
            type="submit"
            form={form}
            variant="contained"
            // onClick={handleClose}
            startIcon={<InsertComment></InsertComment>}
          >
            Add Notes
          </Controls.Button>
        )}
        {editRowState?.isEdit &&
          showButton({
            rowState: editRowState?.row,
            currentButton: "Resend",
            authData,
          }) && (
            <Controls.Button
              // type="submit"
              sx={{
                backgroundColor: `${CustomTheme.CustomColor.DeepOrange.main}`,
              }}
              variant="contained"
              form="boxForm"
              startIcon={<ReplyAll></ReplyAll>}
              onClick={() => {
                handleWorkflowProcess(TButtonClick.Resend, editRowState);
                // handleClose();
              }}
            >
              Resend
            </Controls.Button>
          )}
        {editRowState?.isEdit &&
          showButton({
            rowState: editRowState?.row,
            currentButton: "Approve",
            authData,
          }) && (
            <Controls.Button
              // type="submit"
              sx={{
                backgroundColor: `${CustomTheme.CustomColor.Green.darker}`,
              }}
              variant="contained"
              form="boxForm"
              startIcon={<TaskAlt></TaskAlt>}
              onClick={() => {
                handleWorkflowProcess(TButtonClick.Approve, editRowState);
                //handleClose();
              }}
            >
              Approve
            </Controls.Button>
          )}
      </DialogActions>
    </Dialog>
  );
}

export default Popup;
