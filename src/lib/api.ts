import axios from "axios";

// Base URL for the deployed Render backend. Override with VITE_API_URL when needed.
const BASE_URL = import.meta.env.VITE_API_URL || "https://smart-assistant-new-backed-2.onrender.com";

export type AskResponse = {
  question: string;
  answer: string;
};

export type UploadResponse = {
  success?: boolean;
  message?: string;
  fileName?: string;
  fileUri?: string;
  mimeType?: string;
  displayName?: string;
  state?: string;
};

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token if present (frontend-only placeholder)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("il_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * API service placeholders — wire these to your FastAPI backend.
 * All methods return the raw response data.
 */
export const IntelliLearnAPI = {
  health: () => api.get("/").then((r) => r.data),
  // Uses fetch so the browser sets the multipart boundary automatically.
  upload: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}/upload`, { method: "POST", body: formData });
    let data: UploadResponse | null = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok || !data || data.success === false) {
      throw new Error(data?.message || `Upload failed (${res.status})`);
    }
    return data;
  },
  ask: (question: string, signal?: AbortSignal, fileName?: string) =>
    api
      .post<AskResponse>("/ask", fileName ? { question, fileName } : { question }, { signal })
      .then((response) => response.data),
  notes: (fileName: string) =>
    api
      .post<{ success?: boolean; fileName?: string; notes?: string; message?: string }>("/notes", { fileName })
      .then((r) => r.data),
  mcq: (docId: string, count: number, difficulty: string) =>
    api.get("/mcq", { params: { doc_id: docId, count, difficulty } }).then((r) => r.data),
  flashcards: (docId: string) => api.get("/flashcards", { params: { doc_id: docId } }).then((r) => r.data),
  analytics: () => api.get("/analytics").then((r) => r.data),
  ocr: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.get("/ocr", { params: {} }).then((r) => r.data);
  },
  formula: (docId: string) => api.get("/formula", { params: { doc_id: docId } }).then((r) => r.data),
  code: (docId: string) => api.get("/code", { params: { doc_id: docId } }).then((r) => r.data),
};
