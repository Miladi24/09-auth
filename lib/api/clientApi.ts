import nextServer from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

import axios from 'axios';

export const clientApi = axios.create({
  baseURL: '/api',
  withCredentials: true,
});


interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  tag?: string;
}

export const fetchNotes = async (
  page = 1,
  search = "",
  tag?: string
): Promise<FetchNotesResponse> => {
  const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      search: search || undefined,
      tag,
    },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await nextServer.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (
  data: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const res = await nextServer.post<Note>("/notes", data);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await nextServer.delete<Note>(`/notes/${id}`);

  return data;
};

/* ================= AUTH ================= */

export async function register({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> {
  const { data } = await nextServer.post<User>("/auth/register", {
    email,
    password,
  });
  return data;
}

interface LoginData {
  email: string;
  password: string;
}

export async function login(data: LoginData): Promise<User> {
  const res = await nextServer.post<User>("/auth/login", data);

  return res.data;
}

export async function logout(): Promise<void> {
  await nextServer.post("/auth/logout");
}

export const checkSession = async (): Promise<User> => {
  const { data } = await nextServer.get<User>("/auth/session");

  return data;
};

export const getMe = async (): Promise<User | null> => {
  try {
    const { data } = await nextServer.get<User>("/users/me");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null; 
    }
    throw error; 
  }
};

export const updateMe = async (data: { username: string }): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", data);

  return res.data;
};