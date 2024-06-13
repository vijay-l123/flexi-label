import { Snackbar, Alert, Backdrop, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState, createContext } from "react";
import CustomTheme from "../Theme/CustomTheme";

interface IContextProps {
  children?: any;
}

interface IAxiosHandlerContextprops {
  sbOpen: any;
  alertMessage: any;
  alertSeverity: any;
  backDropOpen: any;
  handleAlertClose: any;
  setAlertSeverity: any;
  setSbOpen: any;
  setAlertMessage: any;
}

export type AlertColor = "success" | "info" | "warning" | "error";

const AxiosHandlerContext = createContext({} as IAxiosHandlerContextprops);

export const AxiosHandlerContextProvider = ({
  children,
}: IContextProps): JSX.Element => {
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const [sbOpen, setSbOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [backDropOpen, setBackDropOpen] = useState(false);

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSbOpen(false);
  };

  useEffect(() => {
    axios.interceptors.request.use((config: any) => {
      const authData =
        localStorage.getItem("authUser") !== null
          ? JSON.parse(localStorage.getItem("authUser") ?? "")
          : "";
      if (!config.headers.Authorization && authData.token) {
        config.headers.Authorization = `${authData.token}`;
      }
      return config;
    });
    axios.interceptors.request.use((request) => {
      setBackDropOpen(true);
      return request;
    });

    axios.interceptors.response.use();

    // Create an Axios interceptor for handling errors
    const interceptor = axios.interceptors.response.use(
      (res) => {
        setBackDropOpen(false);
        if (
          res.config.method?.toUpperCase() === "POST" &&
          !res.config.url?.toLowerCase().includes("auth") &&
          !res.config.url?.toLowerCase().includes("get")
        ) {
          setAlertSeverity("success");
          setSbOpen(true);
          setAlertMessage("Saved Successfully!");
        }
        return res;
      },
      (error) => {
        setBackDropOpen(false);
        setAlertSeverity("error");
        setSbOpen(true);
        setAlertMessage(
          error.response &&
            error.response.data &&
            error.response.data !== "" &&
            error.response.status !== 500
            ? error.response.data
            : "Error Saving!"
        );
        console.log(error);
        return Promise.reject(
          (error.response && error.response.data) ?? "Error Saving!"
        );
      }
    );

    // Clean up the interceptor when the component is unmounted
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const memoedValue = {
    sbOpen,
    alertMessage,
    alertSeverity,
    backDropOpen,
    handleAlertClose,
    setAlertSeverity,
    setSbOpen,
    setAlertMessage,
  };

  return (
    <AxiosHandlerContext.Provider value={memoedValue}>
      {children}
      <Backdrop
        sx={{
          color: CustomTheme.CustomColor.Common.white,
          zIndex: (theme) => theme.zIndex.modal + 1,
        }}
        open={backDropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        autoHideDuration={4000}
        open={sbOpen}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleAlertClose}
          severity={alertSeverity ?? "info"}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </AxiosHandlerContext.Provider>
  );
};

export const useAxiosHandlerContext = () =>
  React.useContext(AxiosHandlerContext);
