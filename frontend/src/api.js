import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});


export const uploadDocument = (formData) =>
  api.post("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const askRAG = (question) =>
  api.post("/rag/query", { question });

export const searchScholar = (topic, year_low = null, year_high = null, top_k = 5) =>
  api.post("/scholar/search", { topic, year_low, year_high, top_k, summarize: true });

export const fetchUploads = () =>
  api.get("/uploads");
export const fetchHistory = () => api.get("/scholar/history");
export const fetchSummaries = () => api.get("/summaries");
export const fetchGaps = () => api.get("/gaps");

export default api;
