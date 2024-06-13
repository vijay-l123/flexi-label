import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { ReactComponent as LogoSvg } from "../Images/logo_icon_svg.svg";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Controls from "../Controls/Controls";
import CustomTheme from "../Theme/CustomTheme";
import useAuthContext from "../Authentication/AuthProvider";
import common from "../utils/common";

const Sidebar = (props: any) => {
  const { logout, authData } = useAuthContext();
  const { roles } = common;

  const { data, selectedNavItem, handleNavItemChanged } = props;

  const [closeMenu, setCloseMenu] = useState(false);

  const handleCloseMenu = () => {
    setCloseMenu(!closeMenu);
  };
  return (
    <div className={closeMenu === false ? "sidebar" : "sidebar active"}>
      <div
        style={{ display: "flex", alignItems: "center", position: "relative" }}
      >
        <div
          className={
            closeMenu === false ? "logoContainer" : "logoContainer active"
          }
        >
          <div className="icon">
            <LogoSvg />
          </div>
          <div className="title">
            Flexi<div className="titleAfter">ELabel</div>{" "}
          </div>
        </div>
        <div
          className={
            closeMenu === false ? "burgerContainer" : "burgerContainer active"
          }
          onClick={() => {
            handleCloseMenu();
          }}
        >
          <Controls.SvgIcon
            fontSize="medium"
            sx={{ color: CustomTheme.CustomColor.Primary.main }}
          >
            {closeMenu === false ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </Controls.SvgIcon>
        </div>
      </div>

      <div
        className={
          closeMenu === false ? "contentsContainer" : "contentsContainer active"
        }
      >
        {/* <ul>
          {data.map((item: any, index: any) => {
            return (
              <li
                key={item.id}
                className={location.pathname === item.component ? "active" : ""}
              >
                <div className="icon">{item.icon}</div>
                <a href={item.component}>{item.label}</a>
              </li>
            );
          })}
        </ul> */}

        <List
          component="nav"
          // subheader={
          //   <ListSubheader
          //     sx={{
          //       fontSize: "0.75rem",
          //       fontWeight: 600,
          //       color: "#212B36",
          //       textTransform: "uppercase",
          //     }}
          //     component="nav"
          //   >
          //     {subHeader.subHeader}
          //   </ListSubheader>
          // }
        >
          {data.map((item: any, index: any) => (
            <ListItem
              disablePadding
              key={item.id}
              component={NavLink}
              to={item.component}
              selected={selectedNavItem === item.id}
              onClick={(event: any) => handleNavItemChanged(event, item.id)}
            >
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.85rem",
                    fontWeight: 400,
                  }}
                ></ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
      <div
        className={
          closeMenu === false ? "profileContainer" : "profileContainer active"
        }
      >
        <div className="profileGroup">
          <div className="icon">
            <AccountCircleIcon />
          </div>
          <div className="profileContents">
            <p className="name">{authData.userName}</p>
            <p>
              {roles.find((i) => i.value === Number(authData.roleId))?.name}
            </p>
          </div>
        </div>
        <div className="logout">
          <Controls.Button
            type="submit"
            fullWidth
            variant="contained"
            //sx={{ mt: 3, mb: 2, fontSize: "1rem" }}
            startIcon={<LogoutOutlinedIcon></LogoutOutlinedIcon>}
            onClick={logout}
          >
            {closeMenu === false ? "Log Out" : ""}
          </Controls.Button>
          {/* {closeMenu === false ? (
            <Controls.Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontSize: "1rem" }}
              endIcon={<LogoutOutlinedIcon></LogoutOutlinedIcon>}
              onClick={logout}
            >
              Log Out
            </Controls.Button>
          ) : (
            <Controls.SvgIcon
              fontSize="medium"
              sx={{ color: CustomTheme.CustomColor.Primary.main }}
              onClick={logout}
            >
              <LogoutOutlinedIcon></LogoutOutlinedIcon>
            </Controls.SvgIcon>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
