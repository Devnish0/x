import axios from "axios";
const MODE = "production";
let baseURL =
  MODE === "production"
    ? "https://sea-turtle-app-r54qb.ondigitalocean.app/"
    : "/";
const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
export default api;

// lol hey there
