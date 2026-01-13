import axios from "axios";
let baseURL =
  import.meta.env.NODE_ENV === "production"
    ? "https://sea-turtle-app-r54qb.ondigitalocean.app/"
    : "/";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
export default api;
