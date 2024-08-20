import React from "react";
import axios from "axios";
import config from "./config";

const baseUrl = config.baseUrl;

// function uploadDocument(params: any) {
//   const { fileData } = params;

//   console.log("ffff", fileData);

//   const postProps = {
//     uploadFile: fileData,
//   };

//   // const url = "http://35.235.126.33:9999/FlexiElableApi/Document/Upload";
//   // const formData = new FormData();
//   // formData.append("file", fileData);
//   // const config = {
//   //   headers: {
//   //     "content-type": "multipart/form-data",
//   //   },
//   // };
//   //const response = axios.post(url, { uploadFile: formData }, config);

//   // const formData = new FormData();
//   // formData.append("uploadFile", fileData);

//   // const res = fetch(
//   //   "http://35.235.126.33:9999/FlexiElableApi/Document/Upload",
//   //   {
//   //     method: "POST",
//   //     body: formData,
//   //   }
//   // ).then((res) => res.json());

//   // return res;

//   const response = axios({
//     headers: {
//       "content-type": "multipart/form-data",
//     },
//     method: "POST",
//     url: "/Document/Upload",
//     baseURL: baseUrl,

//     data: {
//       ...postProps,
//     },
//   });

//   return response;
// }

// function uploadDocument(params: any) {
//   const { fileData } = params; // fileData should be an array of files
//   const formData = new FormData();

//   // Loop through the files and append each one to the formData
//   fileData.forEach((file: File) => {
//     formData.append("uploadFile", file);
//   });

//   const response = axios({
//     headers: {
//       "content-type": "multipart/form-data",
//     },
//     method: "POST",
//     url: "/Document/Upload",
//     baseURL: baseUrl,
//     data: formData, // Use the FormData object
//   });

//   return response;
// }

function uploadDocument(params: any) {
  const { fileData } = params; // fileData should be an array of files
  const formData = new FormData();

  // Loop through the files and append each one to the formData
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
    data: formData, // Use the FormData object
  });

  return response;
}


// function updateDocument(params: any) {
//   const { fileId, fileData } = params;

//   console.log("ffff", fileData);

//   const postProps = {
//     FileId: fileId,
//     uploadFile: fileData,
//   };

//   const response = axios({
//     headers: {
//       "content-type": "multipart/form-data",
//     },
//     method: "POST",
//     url: "/Document/Updatefile",
//     baseURL: baseUrl,

//     data: {
//       ...postProps,
//     },
//   });

//   return response;
// }

// function updateDocument(params: any) {
//   const { fileId, fileData } = params; // fileData should be an array of files
//   const formData = new FormData();

//   // Loop through the files and append each one to the formData
//   fileData.forEach((file: File) => {
//     formData.append("uploadFile", file);
//   });

//   formData.append("FileId", fileId);

//   const response = axios({
//     headers: {
//       "content-type": "multipart/form-data",
//     },
//     method: "POST",
//     url: "/Document/Updatefile",
//     baseURL: baseUrl,
//     data: formData, // Use the FormData object
//   });

//   return response;
// }

function updateDocument(params: { fileId: string; fileData: File[] }) {
  const { fileId, fileData } = params; // fileData should be an array of files
  const formData = new FormData();

  // Loop through the files and append each one to the formData
  fileData.forEach((file: File) => {
    formData.append("uploadFile", file);
  });

  formData.append("FileId", fileId);

  return axios({
    headers: {
      "content-type": "multipart/form-data",
    },
    method: "POST",
    url: `/Document/Updatefile?FileId=${fileId}`, // Correct URL with query parameter
    baseURL: baseUrl,
    data: formData, // Use the FormData object
  });
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
