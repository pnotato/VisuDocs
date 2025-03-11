import axios from "axios";

export const axiosp = axios.create({ baseURL: 'http://localhost:3000'});

// Was running into problems with proxying in Vite :( This is my temporary solution until I figure out how to fix it. 