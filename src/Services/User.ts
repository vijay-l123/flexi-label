import React from "react";
import axios from "axios";
import config from "./config";

const baseUrl = config.baseUrl;

function getUserList() {
  const response = axios({
    method: "GET",
    url: "User/GetUsers",
    baseURL: baseUrl,
  });
  return response;
}

function addUser(params: any) {
  const {
    firstName,
    lastName,
    logIn,
    password,
    roleId,
    userId,
    roleName,
    isActive,
  } = params;
  const postProps = {
    firstName: firstName,
    lastName: lastName,
    logIn: logIn,
    password: password,
    roleId: roleId,
    userId: userId,
    roleName: roleName,
    isActive: isActive,
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
  };

  const response = axios({
    method: "POST",
    url: "User/AddUser",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function updateUser(params: any) {
  const {
    firstName,
    lastName,
    logIn,
    password,
    roleId,
    userId,
    roleName,
    isActive,
  } = params;
  const postProps = {
    firstName: firstName,
    lastName: lastName,
    logIn: logIn,
    password: password,
    roleId: roleId,
    userId: userId,
    roleName: roleName,
    isActive: isActive,
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
  };

  const response = axios({
    method: "POST",
    url: "User/UpdateUser",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function resetMyPassword(params: any) {
  const { oldPassword, newPassword, userId } = params;
  const postProps = {
    oldPassword: oldPassword,
    newPassword: newPassword,
    userId: userId,
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
  };

  const response = axios({
    method: "POST",
    url: "User/ResetMyPassword",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function resetUserPassword(params: any) {
  const { password, userId } = params;
  const postProps = {
    password: password,
    userId: userId,
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
  };

  const response = axios({
    method: "POST",
    url: "User/ResetUserPassword",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function getUserListEx() {
  const response = axios({
    method: "GET",
    url: "User/GetUsersEx",
    baseURL: baseUrl,
  });
  return response;
}

const User = {
  getUserList,
  addUser,
  updateUser,
  resetMyPassword,
  resetUserPassword,
  getUserListEx,
};

export default User;
