import React from "react";
import axios from "axios";
import config from "./config";

const baseUrl = config.baseUrl;

function getPmCodeList() {
  const response = axios({
    method: "GET",
    url: "PmCode/GetPmCodeList",
    baseURL: baseUrl,
  });
  return response;
}

function addPmCode(params: any) {
  const { pmCode, description } = params;

  const postProps = {
    pmcodeId: 0,
    pmcode: pmCode,
    description: description,
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
  };

  const response = axios({
    method: "POST",
    url: "PmCode/AddPmCode",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function updatePmCode(params: any) {
  const { pmCodeId, pmCode, description } = params;

  const postProps = {
    pmcodeId: pmCodeId,
    pmcode: pmCode,
    description: description,
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
  };

  const response = axios({
    method: "POST",
    url: "PmCode/UpdatePmCode",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function getPmCodeListEx() {
  const response = axios({
    method: "GET",
    url: "PmCode/GetPmCodeListEx",
    baseURL: baseUrl,
  });
  return response;
}

const PmCode = {
  getPmCodeList,
  addPmCode,
  updatePmCode,
  getPmCodeListEx,
};

export default PmCode;
