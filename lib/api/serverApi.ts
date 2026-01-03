import { api } from '@/app/api/api';
import type { Note, NewNote } from '@/types/note';
import type { User } from '@/types/user';
import type { AxiosResponse } from 'axios';
import type { SessionResponse } from '@/types/session';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { cookies } from 'next/headers';


/* ================= NOTES ================= */

export interface NoteHttpResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesProps {
  query: string;
  page: number;
  tag?: string | null;
}

export async function fetchNotes({
  query,
  page = 1,
  tag,
}: FetchNotesProps): Promise<NoteHttpResponse> {
  const response = await api.get<NoteHttpResponse>('/notes', {
    params: {
      search: query,
      page,
      perPage: 12,
      ...(tag ? { tag } : {}),
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(newNote: NewNote): Promise<Note> {
  const response = await api.post<Note>('/notes', newNote);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}

/* ================= USER ================= */

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const response = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}


export async function checkServerSession(): Promise<AxiosResponse<SessionResponse>> {
  try {
    return await api.get<SessionResponse>('/auth/session');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      redirect('/sign-in');
    }
    throw error;
  }
}


