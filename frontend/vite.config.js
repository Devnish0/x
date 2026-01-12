import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
le {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}code: "ERR_BAD_RESPONSE"config: {transitional: {…}, adapter: Array(3), transformRequest: Array(1), transformResponse: Array(1), timeout: 0, …}message: "Request failed with status code 500"name: "AxiosError"request: XMLHttpRequest {rqProxyXhr: XMLHttpRequest, responseRule: undefined, onreadystatechange: null, …}response: {data: '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta char…<pre>Internal Server Error</pre>\n</body>\n</html>\n', status: 500, statusText: '', headers: ot, config: {…}, …}status: 500stack: "AxiosError: Request failed with status code 500\n    at jm (https://intiger.vercel.app/assets/index-KBXTM-WV.js:23:1083)\n    at XMLHttpRequest.Z (https://intiger.vercel.app/assets/index-KBXTM-WV.js:23:5822)\n    at nn.request (https://intiger.vercel.app/assets/index-KBXTM-WV.js:25:2094)\n    at async onSubmit (https://intiger.vercel.app/assets/index-KBXTM-WV.js:28:23810)"[[Prototype]]: Error