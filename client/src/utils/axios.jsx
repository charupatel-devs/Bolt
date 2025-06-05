import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.asisauctions.com.au",
});


export default instance;
