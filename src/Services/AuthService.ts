import React from "react";
import axios from "axios";
import config from "./config";

function authenticate(params: any) {
  const postProps = {
    error: "",
    login: params.userName,
    password: params.password,
    roleId: params.roleId,
  };

  const response = axios({
    method: "POST",
    url: "api/Authenticate/login",
    baseURL: config.baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}
function passwordCheckForProcees(params: any) {
  const postProps = {
    userId: params.userId,
    password: params.password,
  };

  const response = axios({
    method: "POST",
    url: "api/Authenticate/validatePassword",
    baseURL: config.baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

const AuthService = {
  authenticate,
  passwordCheckForProcees
};

export default AuthService;
