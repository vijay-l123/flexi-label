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

function getLabels(params: any = {}) {
  const response = axios({
    method: "GET",
    url: "Label/GetLabelListEx",
    baseURL: baseUrl,
    params, // pass pagination / filter / sort params to API (e.g. page, pageSize, search)
  }).then((res) => {
    // Normalize new API shape:
    // {
    //   pagedInfo: { ... },
    //   data: { columns: [...], rows: [...], name: ... }
    // }
    const payload = res?.data || {};
    const pagedInfo = payload.pagedInfo || {};
    const dataNode = payload.data || {};
    const columns = dataNode.columns || [];
    const rows = dataNode.rows || [];
    const name = dataNode.name ?? null;

    return {
      pagedInfo,
      data: {
        columns,
        rows,
        name,
      },
      raw: payload, // keep raw payload if callers need other fields
    };
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
    remarks
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
    remarks,

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
  // debugger
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
