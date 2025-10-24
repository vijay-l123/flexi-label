import React from "react";
import axios from "axios";
import { FourGPlusMobiledataOutlined } from "@mui/icons-material";
import config from "./config";

const baseUrl = config.baseUrl;

function getLableVersionList(
  selectedTab: number, 
  roleId: number, 
  pageNumber: number = 1, 
  itemsPerPage: number = 25,
  filterCol?: string,
  filterOperator?: string,
  filterValue?: string
) {

  const postProps: any = {
    userRole: +roleId,
    status: selectedTab,
    pageNumber: +pageNumber,
    itemsPerPage: +itemsPerPage,
    filterCol: (filterCol),
    filterOperator: filterOperator ?? "",
    filterValue: filterValue ?? "",
  };

  const url = `LabelVersion/GetLableListEx2`;

  console.log("API Request URL:", url);
  console.log("API Request Body:", postProps);

  const response = axios({
    method: "POST",
    url: url,
    baseURL: baseUrl,
    headers: { "Content-Type": "application/json" },
    data: postProps,
  });
  return response;
}

function addLabelVersion(params: any) {
  const {
    versionNo,
    labelInfoId,
    fileData,
    fileName,
    isFileInfoChanged,
    fileId,
    remarks,
    //    implementationDate,
    // color,
    printer,
    proofNum,
    jobNumber,
    foldSize,
    flatSize,
    ccf
  } = params;

  const postProps = {
    id: 0,
    labelInfoId: labelInfoId,
    versionNo: versionNo,
    fileName: fileName,
    // implementationDate:implementationDate,
    // color:color,
    isFileInfoChanged: fileName === "" ? false : isFileInfoChanged,
    fileId: +fileId,
    remarks: remarks,
    status: 0,
    fileData: null,
    printer: printer,
    proofNum: proofNum,
    jobNumber: jobNumber,
    foldSize,
    flatSize,
    ccf
  };

  const response = axios({
    method: "POST",
    url: "LabelVersion/AddNewLableVersion",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function updateLabelVersion(params: any) {
  const {
    id,
    labelInfoId,
    versionNo,
    fileData,
    fileName,
    isFileInfoChanged,
    fileId,
    remarks,
    foldSize,
    flatSize,
    ccf
  } = params;

  const postProps = {
    id: id,
    labelInfoId: labelInfoId,
    versionNo: versionNo,
    fileId: fileId,
    remarks: remarks,
    status: 0,
    foldSize,
    flatSize,
    ccf
  };

  const response = axios({
    method: "POST",
    url: "LabelVersion/UpdateLabelVersion",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function submitForReview(params: any) {
  const { labelVersionId, remarks } = params;

  const postProps = {
    labelVersionId: labelVersionId,
    remarks: remarks,
  };

  const response = axios({
    method: "POST",
    url: "LabelVersion/SubmitForReview",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function processReview(params: any) {
  const { labelVersionId, remarks, action } = params;

  const postProps = {
    labelVersionId: labelVersionId,
    remarks: remarks,
    action: action,
  };

  const response = axios({
    method: "POST",
    url: "LabelVersion/ProcessReview",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function addNotes(params: any) {
  const { id, notes } = params;
  const postProps = {
    labelVersionId: id,
    notes: notes,
  };
  const response = axios({
    method: "POST",
    url: "LabelVersion/AddNotes",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

const LabelVersion = {
  getLableVersionList,
  updateLabelVersion,
  addLabelVersion,
  submitForReview,
  processReview,
  addNotes,
};

export default LabelVersion;