import nextServer from "./api";
import { cookies } from "next/headers";

import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { AxiosResponse } from "axios";


interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  tag?: string;
}

const getCookieHeader = async (): Promise<string> => {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
};

export const fetchNotes = async (
  page = 1,
  search = "",
  tag?: string
): Promise<FetchNotesResponse> => {
  const cookieHeader = await getCookieHeader();

  const response = await nextServer.get("/notes", {
    params: {
      page,
      perPage: 12,
      search: search || undefined,
      tag,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieHeader = await getCookieHeader();

  const response = await nextServer.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
};

export const checkSession = async (): Promise<AxiosResponse<User>> => {
  const cookieHeader = await getCookieHeader();

  return nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const getMe = async (): Promise<User> => {
  const cookieHeader = await getCookieHeader();

  const response = await nextServer.get("/users/me", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
};
