import axios from "axios";

const api = axios.create({
  baseURL: "https://sea-turtle-app-r54qb.ondigitalocean.app/",
  withCredentials: true,
});
export default api;
