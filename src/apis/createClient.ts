import axios from "axios";
import {API_BASE_URL} from "../App";

export const addClient = async (name: string, formatDocument: string) => {
  const response = await axios.post(`${API_BASE_URL}/clients`, {
    name,
    formatDocument,
  });
  return response.data;
};
