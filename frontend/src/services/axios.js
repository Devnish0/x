import axios from "axios";

const api = axios.create({
  baseURL: "https://sea-turtle-app-r54qb.ondigitalocean.app/",
  // baseURL: "http:/localhost:5000",

  withCredentials: true,
});
export default api;
