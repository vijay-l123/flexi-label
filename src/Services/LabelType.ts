import React from "react";
import axios from "axios";
import config from "./config";

const baseUrl = config.baseUrl;

function getLabelTypeList() {
  const response = axios({
    method: "GET",
    url: "LabelType/GetLabelTypeList",
    baseURL: baseUrl,
  });
  return response;
}

function addLabelType(params: any) {
  const { type, description } = params;

  const postProps = {
    typeId: 0,
    type: type,
    description: description,
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
  };

  const response = axios({
    method: "POST",
    url: "LabelType/AddLabelType",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function updateLabelType(params: any) {
  const { typeId, type, description } = params;

  const postProps = {
    typeId: typeId,
    type: type,
    description: description,
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
  };

  const response = axios({
    method: "POST",
    url: "LabelType/UpdateLabelType",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function getLabelTypeListEx() {
  const response = axios({
    method: "GET",
    url: "LabelType/GetLabelTypeListEx",
    baseURL: baseUrl,
  });
  return response;
}

const LabelType = {
  getLabelTypeList,
  addLabelType,
  updateLabelType,
  getLabelTypeListEx,
};

export default LabelType;
