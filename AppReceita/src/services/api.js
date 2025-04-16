import axios from "axios";

const api = axios.create({
  baseURL: 'https://api.spoonacular.com/',
});

export default api;