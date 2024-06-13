import React from "react";
import axios from "axios";
import config from "./config";

const baseUrl = config.baseUrl;

function getLabelList() {
  const response = axios({
    method: "GET",
    url: "Label/GetLabelList",
    baseURL: baseUrl,
  });
  return response;
}

function getLabels() {
  const response = axios({
    method: "GET",
    url: "Label/GetLabelListEx",
    baseURL: baseUrl,
  });
  return response;
}

function addLabel(params: any) {
  const {
    andaId,
    productId,
    pmCodeId,
    labelTypeId,
    customerId,
    printer,
    ndcNumber,
    jobNumber,
    tabletCount,
    andaNumber,
    customerName,
    productName,
    labelType,
    pmCode,
    labelDescription,
  } = params;

  const postProps = {
    id: 0,
    andaid: andaId,
    productId: productId,
    pmcodeId: pmCodeId,
    labelTypeId: labelTypeId,
    customerId: customerId,
    printer: printer,
    ndcNumber: ndcNumber,
    jobNumber: jobNumber,
    tabletCount: tabletCount,
    andaNumber,
    customerName,
    productName,
    labelType,
    pmCode,
    labelDescription,

    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
  };

  const response = axios({
    method: "POST",
    url: "Label/AddNewLabel",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function updateLabel(params: any) {
  const {
    id,
    andaId,
    productId,
    pmCodeId,
    labelTypeId,
    customerId,
    printer,
    ndcNumber,
    jobNumber,
    tabletCount,
    labelDescription,
  } = params;

  const postProps = {
    id: id,
    andaid: andaId,
    productId: productId,
    pmcodeId: pmCodeId,
    labelTypeId: labelTypeId,
    customerId: customerId,
    printer: printer,
    ndcNumber: ndcNumber,
    jobNumber: jobNumber,
    tabletCount: tabletCount,
    labelDescription,
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
  };

  const response = axios({
    method: "POST",
    url: "Label/UpdateLabel",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

const Label = {
  getLabelList,
  getLabels,
  addLabel,
  updateLabel,
};

export default Label;
