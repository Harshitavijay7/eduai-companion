export const DOCS_KEY = "intellilearn_docs";

export type StoredDoc = {
  id: string;
  name: string;
  subject: string;
  pages?: number;
  size?: string;
  uploadedAt: string;
  color: string;
  fileName?: string;
  fileUri?: string;
  mimeType?: string;
  displayName?: string;
  state?: string;
};

export function getStoredDocs(): StoredDoc[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DOCS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredDocs(docs: StoredDoc[]) {
  window.localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
}

export function addStoredDoc(doc: StoredDoc) {
  saveStoredDocs([doc, ...getStoredDocs()]);
}

export function removeStoredDoc(id: string) {
  saveStoredDocs(getStoredDocs().filter((d) => d.id !== id));
}
