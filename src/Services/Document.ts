import React from "react";
import axios from "axios";
import config from "./config";

const baseUrl = config.baseUrl;

function uploadDocument(params: any) {
  const { fileData } = params; 
  const formData = new FormData();

  fileData.forEach((file: File) => {
    formData.append("uploadFiles", file);
  });

  const response = axios({
    headers: {
      "content-type": "multipart/form-data",
    },
    method: "POST",
    url: "/Document/Upload",
    baseURL: baseUrl,
    data: formData,
  });

  return response;
}

function updateDocument(params: any) {
  const { fileId, fileData } = params; 
  const formData = new FormData();

  fileData.forEach((file: File) => {
    formData.append("uploadFile", file);
  });

  formData.append("FileId", fileId);

  const response = axios({
    headers: {
      "content-type": "multipart/form-data",
    },
    method: "POST",
    url: "/Document/Updatefile",
    baseURL: baseUrl,
    data: formData,
  });

  return response;
}

function downloadDocument(fileId: number) {
  const response = axios({
    method: "GET",

    url: "/Document/DownlaodFile?id=" + fileId,

    baseURL: baseUrl,
  });

  return response;
}

const Document = {
  updateDocument,
  uploadDocument,
  downloadDocument,
};

export default Document;
