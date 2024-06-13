import React from "react";
import "./App.css";
import "../src/styles/main.scss";
import { ThemeProvider } from "@emotion/react";
import { Routes, Route } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import Login from "./Login/Components/login";
import CustomTheme from "./Theme/CustomTheme";
import { AuthProvider } from "./Authentication/AuthProvider";
import Home from "./Home/Home";
import useDocumentTitle from "./hooks/useDocumentTitle";
import common from "./utils/common";
import { AxiosHandlerContextProvider } from "./AxiosHandler/AxiosHandler";

const { TAppPage } = common;

const theme = createTheme({
  typography: {
    fontFamily: ["Mulish", "Inter", "Public Sans", "Arial", "sans-serif"].join(
      ","
    ),
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          color: CustomTheme.CustomColor.Common.black,
        },
        filledSuccess: {
          backgroundColor: CustomTheme.CustomColor.Alert.success,
        },
        filledError: {
          backgroundColor: CustomTheme.CustomColor.Alert.error,
        },
        filledWarning: {
          backgroundColor: CustomTheme.CustomColor.Alert.warning,
        },
        filledInfo: {
          backgroundColor: CustomTheme.CustomColor.Alert.info,
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {},
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .MuiTabs-indicator": {
            backgroundColor: CustomTheme.CustomColor.Tab.indBgColor,
            height: "3px",
          },
          "& .MuiTabs-flexContainer": {
            display: "flex",
            flexWrap: "wrap",
            columnGap: "5px",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderColor: "#F1F1F1",
          borderStyle: "solid",
          borderWidth: 1,
          textTransform: "none",

          color: CustomTheme.CustomColor.Common.textblue,
          backgroundColor: CustomTheme.CustomColor.Primary.light,

          ":hover": {
            backgroundColor: CustomTheme.CustomColor.Primary.light,
            color: CustomTheme.CustomColor.Common.black,
          },
          "&.Mui-selected": {
            backgroundColor: CustomTheme.CustomColor.Common.white,
            color: CustomTheme.CustomColor.Common.black,
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ":hover": {
            backgroundColor: CustomTheme.CustomColor.Primary.light,
            color: CustomTheme.CustomColor.Common.black,
          },
          "&.Mui-selected": {
            backgroundColor: CustomTheme.CustomColor.Primary.main,
            color: CustomTheme.CustomColor.Common.white,
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          color: CustomTheme.CustomColor.Common.black,
          borderTop: "1px solid #F1F1F1",
          borderBottom: "1px solid #F1F1F1",

          ":hover": {
            borderRadius: 6,
            backgroundColor: CustomTheme.CustomColor.Primary.light,
            color: CustomTheme.CustomColor.Common.black,
            "& .MuiSvgIcon-root": {
              color: CustomTheme.CustomColor.Common.black,
            },
          },
          "&.Mui-selected": {
            backgroundColor: CustomTheme.CustomColor.Primary.light,
            color: CustomTheme.CustomColor.Common.black,
            borderTop: "none",
            borderBottom: "none",
            borderLeft: "5px solid",
            borderColor: CustomTheme.CustomColor.Primary.main,
            "& .MuiSvgIcon-root": {
              color: CustomTheme.CustomColor.Common.black,
            },
          },
        },
      },
    },
  },
  palette: {
    primary: {
      ...CustomTheme.CustomColor.Primary,
    },
    secondary: {
      ...CustomTheme.CustomColor.Secondary,
    },
    error: {
      ...CustomTheme.CustomColor.Error,
    },
  },
});

function Page(props: any) {
  const titlePrefix = "FlexiELabel | ";
  useDocumentTitle(`${titlePrefix}${props.title}`);
  return <React.Fragment>{props.content} </React.Fragment>;
}

function LoginPage() {
  return (
    <React.Fragment>
      <Page content={<Login />} title={TAppPage.Login}></Page>
    </React.Fragment>
  );
}

function HomePage() {
  return (
    <React.Fragment>
      <Page content={<Home />} title={TAppPage.Labels}></Page>
    </React.Fragment>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AxiosHandlerContextProvider>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<HomePage />}></Route>
            <Route path="/elabel/login" element={<LoginPage />}></Route>
            <Route path="/elabel/*" element={<HomePage />}></Route>
          </Routes>
        </AuthProvider>
      </AxiosHandlerContextProvider>
    </ThemeProvider>
  );
}

export default App;
