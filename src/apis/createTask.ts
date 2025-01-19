import axios from "axios";
import {API_BASE_URL} from "../App";

export const createTask = async (
  clientId: string,
  videoUrl: string,
  socketId: String
) => {
  const response = await axios.post(`${API_BASE_URL}/tasks`, {
    clientId,
    videoUrl,
    socketId,
  });
  return response.data;
};
