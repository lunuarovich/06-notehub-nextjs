import axios from "axios";
import { Note, NotesResponse } from "@/types/note";

const api = axios.create({
  baseURL: "https://next-v1-notes-api.goit.study",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export const fetchNotes = async (
  page: number,
  query: string
): Promise<NotesResponse> => {
  const { data } = await api.get("/notes", {
    params: { page, q: query },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get(`/notes/${id}`);
  return data;
};

export const createNote = async (note: Omit<Note, "id" | "createdAt">) => {
  const { data } = await api.post("/notes", note);
  return data;
};

export const deleteNote = async (id: string) => {
  await api.delete(`/notes/${id}`);
};