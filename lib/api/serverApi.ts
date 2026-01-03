import { api } from '@/app/api/api';
import type { Note, NewNote } from '@/types/note';
import type { User } from '@/types/user';
import type { AxiosResponse } from 'axios';
import type { SessionResponse } from '@/types/session';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { cookies } from 'next/headers';

/* ================= HELPERS ================= */

async function getAuthHeaders() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const cookieHeader = [
    accessToken ? `accessToken=${accessToken}` : null,
    refreshToken ? `refreshToken=${refreshToken}` : null,
  ].filter(Boolean).join('; ');

  return {
    headers: {
      Cookie: cookieHeader,
    },
  };
}



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
  const headers = (await getAuthHeaders()).headers;

  const response = await api.get<NoteHttpResponse>('/notes', {
    params: {
      search: query,
      page,
      perPage: 12,
      ...(tag ? { tag } : {}),
    },
    headers,
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const headers = (await getAuthHeaders()).headers;

  const response = await api.get<Note>(`/notes/${id}`, { headers });

  return response.data;
}


export async function createNote(newNote: NewNote): Promise<Note> {
  const headers = (await getAuthHeaders()).headers;

  const response = await api.post<Note>('/notes', newNote, { headers });

  return response.data;
}


export async function deleteNote(id: string): Promise<Note> {
  const headers = (await getAuthHeaders()).headers;

  const response = await api.delete<Note>(`/notes/${id}`, { headers });

  return response.data;
}


/* ================= USER ================= */

export async function getMe(): Promise<User> {
  const headers = (await getAuthHeaders()).headers;

  const response = await api.get<User>('/users/me', { headers });

  return response.data;
}

/* ================= AUTH ================= */

export async function checkServerSession(): Promise<AxiosResponse<SessionResponse>> {
  try {
    const headers = (await getAuthHeaders()).headers;
    return await api.get<SessionResponse>('/auth/session', { headers });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      redirect('/sign-in');
    }
    throw error;
  }
}





