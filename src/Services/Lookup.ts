import axios from "axios";
import config from "./config";

const baseUrl = config.baseUrl;

function getLookupList(type: string) {
  const response = axios({
    method: "GET",
    url: `LookUpData/GetLookupList?type=${type}`,
    baseURL: baseUrl,
  });
  return response;
}

function addLookup(params: any) {
  const { type, description } = params;

  const postProps = {
    id: 0,
    type: type,
    description: description,
  };

  const response = axios({
    method: "POST",
    url: "LookUpData/AddLookup",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function updateLookup(params: any) {
  const { id, type, description } = params;

  const postProps = {
    id: id,
    type: type,
    description: description,
  };

  const response = axios({
    method: "POST",
    url: "LookUpData/UpdateLookup",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

const Lookup = {
  getLookupList,
  addLookup,
  updateLookup,
};

export default Lookup;
