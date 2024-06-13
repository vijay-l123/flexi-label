import { Box, Grid } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import CustomTheme from "../Theme/CustomTheme";
import * as React from "react";
import SpeedIcon from "@mui/icons-material/Speed";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useState } from "react";
import Profile from "../Profile/Components/Profile";
import Dashboard from "../Dashboard/Components/Dashboard";
import User from "../User/Components/User";
import Master from "../Master/Components/Master";
import useDocumentTitle from "../hooks/useDocumentTitle";
import common from "../utils/common";
import useAuthContext from "../Authentication/AuthProvider";
import { IMenuNavItems } from "../utils/types";
import Sidebar from "../Sidebar/Sidebar";

const { TAppPage, TRoleType, fetchMenuNavData } = common;

const data: IMenuNavItems = [
  {
    icon: <SpeedIcon />,
    label: "Labels",
    id: 0,
    component: "dashboard",
    role: [
      TRoleType.Initiator,
      TRoleType.FinalHOD,
      TRoleType.HOD,
      TRoleType.LabelViewers,
      TRoleType.PackingDepartment,
      TRoleType.QA,
    ],
  },
  {
    icon: <FactCheckIcon />,
    label: "Master Data",
    id: 1,
    component: "master",
    role: [TRoleType.Initiator],
  },
  {
    icon: <ManageAccountsIcon />,
    label: "User Management",
    id: 2,
    component: "user",
    role: [
      TRoleType.FinalHOD,
      TRoleType.HOD,
      // TRoleType.LabelViewers,
      // TRoleType.PackingDepartment,
      TRoleType.QA,
    ],
  },
];

function Page(props: any) {
  const titlePrefix = "FlexiELabel | ";
  useDocumentTitle(`${titlePrefix}${props.title}`);
  return <React.Fragment>{props.content} </React.Fragment>;
}

function DashboardPage() {
  localStorage.setItem("selectedNavItem", "0");
  return (
    <React.Fragment>
      <Page content={<Dashboard />} title={TAppPage.Labels} />
    </React.Fragment>
  );
}
function UserPage() {
  return (
    <React.Fragment>
      <Page content={<User />} title={TAppPage.UserManagement} />
    </React.Fragment>
  );
}
function MasterPage() {
  return (
    <React.Fragment>
      <Page content={<Master />} title={TAppPage.Master} />
    </React.Fragment>
  );
}
function ProfilePage() {
  return (
    <React.Fragment>
      <Page content={<Profile />} title={TAppPage.Profile} />
    </React.Fragment>
  );
}

function Home() {
  const [selectedNavItem, setSelectedNavItem] = useState(0);

  const { authData } = useAuthContext();

  const menuData = fetchMenuNavData(data, authData.roleId);

  const handleNavItemChanged = (event: any, id: number) => {
    //setSelectedNavItem(id);
    localStorage.setItem("selectedNavItem", id.toString());
  };

  React.useEffect(() => {
    const existingNav = localStorage.getItem("selectedNavItem") || 0;
    setSelectedNavItem(+existingNav);
  }, [localStorage.getItem("selectedNavItem")]);
  return (
    // <div>
    //   <div className="App">
    //     <Routes>
    //       {/* <Route path="/" element={<Dashboard />}></Route> */}
    //       <Route path="dashboard" element={<DashboardPage />}></Route>
    //       <Route path="user" element={<UserPage />}></Route>
    //       <Route path="profile" element={<ProfilePage />}></Route>
    //       <Route path="master" element={<MasterPage />}></Route>
    //     </Routes>
    //   </div>
    //   <div>
    //     <Sidebar
    //       data={menuData}
    //       selectedNavItem={selectedNavItem}
    //       handleNavItemChanged={handleNavItemChanged}
    //     />
    //   </div>
    // </div>

    <Box
      sx={{
        height: "100vh",
        bgcolor: CustomTheme.CustomColor.Site.bgColor,
        flex: "auto",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Grid container spacing={0}>
        {/* <Grid item xs={12} sx={{ my: 0.5 }}>
          <AppBarMenuNav></AppBarMenuNav>
        </Grid> */}

        <Grid item xs={12} style={{ display: "flex" }}>
          {/* <Dashboard /> */}
          <Sidebar
            data={menuData}
            selectedNavItem={selectedNavItem}
            handleNavItemChanged={handleNavItemChanged}
          />

          <div style={{ flex: "auto" }}>
            <div className="title">
              {document?.title?.split("|")[1]?.trim()}{" "}
              <div className="stripLine" style={{ width: "80%" }}></div>
            </div>

            <div className="appContent">
              <Routes>
                {/* <Route path="/" element={<Dashboard />}></Route> */}
                <Route path="*" element={<DashboardPage />}></Route>
                <Route path="dashboard" element={<DashboardPage />}></Route>
                <Route path="user" element={<UserPage />}></Route>
                <Route path="profile" element={<ProfilePage />}></Route>
                <Route path="master" element={<MasterPage />}></Route>
              </Routes>
            </div>
          </div>
        </Grid>
        {/* <Grid item xs={0.5}>
         
         
        </Grid> */}
      </Grid>
    </Box>
  );
}

export default Home;
