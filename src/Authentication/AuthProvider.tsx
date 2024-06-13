import axios from "axios";
import React, { ReactNode, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAxiosHandlerContext } from "../AxiosHandler/AxiosHandler";
import { canEdit } from "../Modal/utilModal";
import AuthService from "../Services/AuthService";
interface IProps {
  children?: ReactNode;
}

interface ILoginParams {
  userName: string;
  password: string;
}
interface init {
  login: (params: ILoginParams) => void;
  logout: () => void;
  authData: any;
  canEdit: boolean;
}
export function removeAuthData() {
  localStorage.removeItem("authUser");
  axios.defaults.headers.common["Authorization"] = "";
  delete axios.defaults.headers.common["Authorization"];
}
export function setAuthData(jsonData: any) {
  localStorage.setItem("authUser", JSON.stringify(jsonData));
}
export function getAuthData() {
  return {
    authData:
      localStorage.getItem("authUser") !== null
        ? JSON.parse(localStorage.getItem("authUser") ?? "")
        : "",
  };
}

const AuthContext = createContext({} as init);

export function AuthProvider({ children }: IProps): JSX.Element {
  const navigate = useNavigate();

  const { authData } = getAuthData();

  const { setAlertMessage, setSbOpen, setAlertSeverity } =
    useAxiosHandlerContext();

  React.useEffect(() => {
    if (authData && authData.user) {
      //  navigate("/dashboard");
      // const page = window.location.href;
      // if(page.toLocaleLowerCase().includes('dashboard'))
      // if(page.toLocaleLowerCase().includes('dashboard'))
      // if(page.toLocaleLowerCase().includes('dashboard'))
    } else {
      navigate("elabel/login");
      removeAuthData();
      localStorage.removeItem("selectedNavItem");
    }
  }, [authData]);

  function login(params: ILoginParams) {
    AuthService.authenticate(params).then(
      (response) => {
        console.log(response);
        const {
          authToken: token,
          logIn: userName,
          name: user,
          token_ID: tokenId,
          user_Id: userId,
          validTo,
          role,
        } = response.data;

        const roleId = `${role}`;

        const jsonData = {
          token,
          user,
          userName,
          tokenId,
          userId,
          validTo,
          roleId,
        };
        setAuthData(jsonData);

        navigate("elabel/dashboard");
        localStorage.setItem("selectedNavItem", "0");
        setAlertSeverity("info");
        setSbOpen(true);
        setAlertMessage("Logged In Successfully!");
      },
      (error) => {
        console.log(error);
        setAlertSeverity("error");
        setSbOpen(true);
        setAlertMessage("401: Unauthorized!");
        removeAuthData();
      }
    );
  }

  async function logout() {
    navigate("/login");
    removeAuthData();
    localStorage.removeItem("selectedNavItem");
    setAlertSeverity("info");
    setSbOpen(true);
    setAlertMessage("Logged Out Successfully!");
  }

  const memoedValue = React.useMemo(() => {
    let isEditable = canEdit(authData.roleId);
    return { login, logout, authData, canEdit: isEditable };
  }, [authData]);
  return (
    <AuthContext.Provider value={memoedValue}>{children} </AuthContext.Provider>
  );
}

export default function useAuthContext() {
  return useContext(AuthContext);
}
