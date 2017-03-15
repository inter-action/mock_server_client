import axios from "axios";

axios.defaults.baseURL = "http://localhost:9000/api/";
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export function get() {
  return axios;
}