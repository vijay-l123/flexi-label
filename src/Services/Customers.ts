import React from "react";
import axios from "axios";
import config from "./config";

const baseUrl = config.baseUrl;

function getCustomerList() {
  const response = axios({
    method: "GET",
    url: "Customer/GetCustomerList",
    baseURL: baseUrl,
  });
  return response;
}

function addCustomer(params: any) {
  const { customerName, address, code } = params;
  const postProps = {
    name: customerName,
    address: address,
    code: code,
  };

  const response = axios({
    method: "POST",
    url: "Customer/AddCustomer",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function updateCustomer(params: any) {
  const { customerId, customerName, address, code } = params;
  const postProps = {
    customerId: customerId,
    name: customerName,
    address: address,
    code: code,
  };

  const response = axios({
    method: "POST",
    url: "Customer/UpdateCustomer",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function getCustomerListEx() {
  const response = axios({
    method: "GET",
    url: "Customer/GetCustomerListExs",
    baseURL: baseUrl,
  });
  return response;
}

const Customer = {
  getCustomerList,
  addCustomer,
  updateCustomer,
  getCustomerListEx,
};

export default Customer;
