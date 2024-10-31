import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const getProtectedResource = () => {
  return axios.get(API_URL + "protected-resource", { headers: authHeader() });
};
