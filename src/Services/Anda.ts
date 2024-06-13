import React from "react";
import axios from "axios";
import config from "./config";

function getAndaList() {
  const response = axios({
    method: "GET",
    url: "Anda/GetAndaList",
    baseURL: config.baseUrl,
  });
  return response;
}

function addAnda(params: any) {
  const { andaNumber, startDate, endDate, isActive } = params;

  const postProps = {
    andaid: 0,
    andanumber: andaNumber,
    //startDate,
    // endDate,
    isActive,
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
  };

  const response = axios({
    method: "POST",
    url: "Anda/AddAnda",
    baseURL: config.baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function updateAnda(params: any) {
  const { andaId, andaNumber, startDate, endDate, isActive } = params;

  const postProps = {
    andaid: andaId,
    andanumber: andaNumber,
    // startDate,
    // endDate,
    isActive,
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
  };

  const response = axios({
    method: "POST",
    url: "Anda/UpdateAnda",
    baseURL: config.baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function getAndaListEx() {
  const response = axios({
    method: "GET",
    url: "Anda/GetAndaListEx",
    baseURL: config.baseUrl,
  });

  return response;
}

const Anda = {
  getAndaList,
  addAnda,
  updateAnda,
  getAndaListEx,
};

export default Anda;
