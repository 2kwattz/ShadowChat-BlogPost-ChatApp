// Network Client Axios Instance

import axios from "axios"; // HTTP Request Maker

const BASE_URL = "http://localhost:3000";

const networkClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

export default networkClient;