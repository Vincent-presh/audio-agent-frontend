import axios from "axios";

const API_BASE_URL = "http://localhost:9000/api";

export const createTask = async (clientId: string, videoUrl: string) => {
  const response = await axios.post(`${API_BASE_URL}/tasks`, {
    clientId,
    videoUrl,
  });
  return response.data;
};
