import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Replace with your backend base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all call flow configurations
export const fetchCallFlows = async () => {
  try {
    const response = await api.get("/callflow-configs");
    return response.data;
  } catch (error) {
    console.error("Error fetching call flows:", error);
    throw error;
  }
};

// Create a new call flow configuration
export const createCallFlow = async (callFlow: any) => {
  try {
    const response = await api.post("/callflow-configs", callFlow);
    return response.data;
  } catch (error) {
    console.error("Error creating call flow:", error);
    throw error;
  }
};

// Other potential API calls (if needed)

// Update a call flow configuration
export const updateCallFlow = async (id: number, callFlow: any) => {
  try {
    const response = await api.put(`/callflow-configs/${id}`, callFlow);
    return response.data;
  } catch (error) {
    console.error("Error updating call flow:", error);
    throw error;
  }
};

// Delete a call flow configuration
export const deleteCallFlow = async (id: number) => {
  try {
    const response = await api.delete(`/callflow-configs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting call flow:", error);
    throw error;
  }
};

export {};
