import axios from "axios";
import {API_BASE_URL} from "../App";

interface Client {
  _id: string;
  name: string;
}

// Function to fetch clients from the backend
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clients`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch clients", error);
    throw new Error("Unable to fetch clients");
  }
};
