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

const AuthService = {
  authenticate,
};

export default AuthService;
