import axios from "axios";
import config from "./config";

const baseUrl = config.baseUrl;

function getLabelHistory(id: number) {
  const response = axios({
    method: "GET",
    url: "Label/LabelHistory?id=" + id,
    baseURL: baseUrl,
  });
  return response;
}

const LabelHistory = {
  getLabelHistory,
};

export default LabelHistory;
