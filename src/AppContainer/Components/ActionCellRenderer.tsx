import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Controls from "../../Controls/Controls";
import { Typography } from "@mui/material";
import {
  Visibility,
  BorderColorOutlined,
  Settings,
  Wysiwyg,
  AddCardRounded,
  InsertComment,
} from "@mui/icons-material";
import CustomTheme from "../../Theme/CustomTheme";
import { checkAlreadyApproved, showButton } from "../../Modal/utilModal";
import useAuthContext from "../../Authentication/AuthProvider";
import common from "../../utils/common";

type params = {
  rowParams: any;
  editClick: () => void;
  approveClick?: () => void;
  resendClick?: () => void;
  submitForReviewClick?: () => void;
  isEditMasterData?: boolean;
  reviewClick?: () => void;
  isCreateVersion?: boolean;
  createVersionClick?: () => void;
  addNotesClick?: () => void;
};

export default function ActionCellRenderer(inputParams: params) {
  console.log("inputparams", inputParams.rowParams);

  const { TLabelStatus, TRoleType, roles } = common;
  const [anchorMenu, setAnchorMenu] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorMenu);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorMenu(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorMenu(null);
  };

  const { authData } = useAuthContext();

  return (
    <React.Fragment>
      {(!checkAlreadyApproved({
        rowState: inputParams.rowParams.row,
        authData,
      }) ||
        inputParams.isEditMasterData ||
        ((inputParams.rowParams.row.status === TLabelStatus.Active ||
          inputParams.rowParams.row.status === undefined) &&
          authData.roleId === TRoleType.Initiator)) && (
        <div>
          <Controls.IconButton
            id="demo-customized-button"
            aria-controls={isMenuOpen ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isMenuOpen ? "true" : undefined}
            variant="contained"
            onClick={handleClick}
            size="small"
            onMouseOver={handleClick}
            color="primary"
          >
            <Settings color="secondary"></Settings>{" "}
            <Typography>Action</Typography>
          </Controls.IconButton>

          {/* <Button
        id="demo-customized-button"
        aria-controls={isMenuOpen ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isMenuOpen ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
      >
        Options
      </Button> */}
          <Menu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",

              onMouseLeave: handleClose,
            }}
            anchorEl={anchorMenu}
            open={isMenuOpen}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {showButton({
              rowState: inputParams.rowParams.row,
              currentButton: "AddNotes",
              authData,
            }) &&
              !inputParams.isEditMasterData && (
                <MenuItem onClick={inputParams.addNotesClick} disableRipple>
                  <Controls.SvgIcon fontSize="small" sx={{ mx: 1 }}>
                    <InsertComment />
                  </Controls.SvgIcon>
                  <Typography fontSize="small">Add Notes</Typography>
                </MenuItem>
              )}
            {(showButton({
              rowState: inputParams.rowParams.row,
              currentButton: "Edit",
              authData,
            }) ||
              inputParams.isEditMasterData) && (
              <MenuItem onClick={inputParams.editClick} disableRipple>
                <Controls.SvgIcon fontSize="small" sx={{ mx: 1 }}>
                  <BorderColorOutlined />
                </Controls.SvgIcon>
                <Typography fontSize="small">Edit</Typography>
              </MenuItem>
            )}
            {showButton({
              rowState: inputParams.rowParams.row,
              currentButton: "SubmitForReview",
              authData,
            }) && (
              <MenuItem
                onClick={inputParams.submitForReviewClick}
                disableRipple
              >
                <Controls.SvgIcon
                  fontSize="small"
                  sx={{ mx: 1, color: CustomTheme.CustomColor.Indigo.main }}
                >
                  <Visibility />
                </Controls.SvgIcon>
                <Typography fontSize="small">Submit for Review</Typography>
              </MenuItem>
            )}
            {showButton({
              rowState: inputParams.rowParams.row,
              currentButton: "Review",
              authData,
            }) && (
              <MenuItem onClick={inputParams.reviewClick} disableRipple>
                <Controls.SvgIcon
                  fontSize="small"
                  sx={{ mx: 1, color: CustomTheme.CustomColor.Alert.info }}
                >
                  <Wysiwyg />
                </Controls.SvgIcon>
                <Typography fontSize="small">Review</Typography>
              </MenuItem>
            )}
            {/* {showButton({
              rowState: inputParams.rowParams.row,
              currentButton: "Approve",
              authData,
            }) && (
              <MenuItem onClick={inputParams.approveClick} disableRipple>
                <Controls.SvgIcon
                  fontSize="small"
                  sx={{ mx: 1, color: CustomTheme.CustomColor.Green.darker }}
                >
                  <TaskAlt />
                </Controls.SvgIcon>
                <Typography fontSize="small">Approve</Typography>
              </MenuItem>
            )}
            {showButton({
              rowState: inputParams.rowParams.row,
              currentButton: "Resend",
              authData,
            }) && (
              <MenuItem onClick={inputParams.resendClick} disableRipple>
                <Controls.SvgIcon
                  fontSize="small"
                  sx={{ mx: 1, color: CustomTheme.CustomColor.DeepOrange.main }}
                >
                  <ReplyAll />
                </Controls.SvgIcon>
                <Typography fontSize="small">Resend</Typography>
              </MenuItem>
            )} */}
            {inputParams.isCreateVersion && (
              <MenuItem onClick={inputParams.createVersionClick} disableRipple>
                <Controls.SvgIcon
                  fontSize="medium"
                  sx={{ mx: 1, color: CustomTheme.CustomColor.Green.dark }}
                >
                  <AddCardRounded />
                </Controls.SvgIcon>
                <Typography fontSize="small">Create New Revision</Typography>
              </MenuItem>
            )}
          </Menu>
        </div>
      )}
    </React.Fragment>
  );
}
