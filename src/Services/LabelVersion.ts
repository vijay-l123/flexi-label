import React from "react";
import axios from "axios";
import { FourGPlusMobiledataOutlined } from "@mui/icons-material";
import config from "./config";

const baseUrl = config.baseUrl;

function getLableVersionList(selectedTab: number, roleId: number) {
  const postProps = {
    userRole: +roleId,
    status: selectedTab,
  };
  const url = "LabelVersion/GetLableListEx2";

  const response = axios({
    method: "POST",
    url: url,
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
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
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
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
    //fileData: null,
    // fileName: fileName,
    // isFileInfoChanged: isFileInfoChanged,
    fileId: fileId,
    remarks: remarks,
    status: 0,
    foldSize,
    flatSize,
    ccf
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
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
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
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
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
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
