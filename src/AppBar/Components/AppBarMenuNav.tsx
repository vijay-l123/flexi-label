import { PowerSettingsNew } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Toolbar,
  Avatar,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import * as React from "react";
import CustomTheme from "../../Theme/CustomTheme";
import Controls from "../../Controls/Controls";
import useAuthContext from "../../Authentication/AuthProvider";
import common from "../../utils/common";
import logo from "../../Images/flexielabel-logo.png";

export default function AppBarMenuNav() {
  const { logout, authData } = useAuthContext();
  console.log("NGXauthData", authData);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      open={isMenuOpen}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
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
      <MenuItem>
        <Avatar /> Profile
      </MenuItem>
      <MenuItem>
        <Avatar /> My account
      </MenuItem>
      <Divider />
      <MenuItem>
        <ListItemIcon>
          <PersonAdd fontSize="small" />
        </ListItemIcon>
        Add another account
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
  return (
    <Box>
      <AppBar
        position="static"
        sx={{ bgcolor: CustomTheme.CustomColor.Primary.dark }}
      >
        <Toolbar>
          <Box sx={{}}>
            <Paper
              elevation={6}
              sx={{
                mx: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: CustomTheme.CustomColor.Primary.dark,
              }}
            >
              <ListItemButton component="a" href="#customized-list">
                <ListItemIcon>
                  <img
                    src={logo}
                    style={{
                      maxWidth: "60px",
                    }}
                    alt="FlexiELabel"
                  ></img>
                </ListItemIcon>
                <ListItemText>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: CustomTheme.CustomColor.Site.lbText,
                    }}
                  >
                    FlexiELabel
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 200,
                      color: CustomTheme.CustomColor.Site.lbAdminText,
                    }}
                  >
                    {common.roles.find(
                      ({ value }) => value === +authData.roleId
                    )?.name || "Admin"}
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </Paper>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Typography>{authData.userName}</Typography>

          <Controls.IconButton size="large" color="secondary" onClick={logout}>
            <PowerSettingsNew></PowerSettingsNew>
          </Controls.IconButton>

          {/* <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            // onMouseOver={handleProfileMenuOpen}
            // onMouseLeave={handleMenuClose}
          >
            <AccountCircle />
          </IconButton> */}
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}
