import { api } from '@/app/api/api';
import type { Note, NewNote } from '@/types/note';
import type { User } from '@/types/user';
import { cookies } from 'next/headers';

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
  const cookieStore = cookies();
  const response = await api.get<NoteHttpResponse>('/notes', {
    headers: { 
      Cookie: cookieStore.toString(),
    },
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
  const cookieStore = cookies();
  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: (await cookieStore).toString(),
    },
  });
  
  return response.data;
}

export async function createNote(newNote: NewNote): Promise<Note> {
  const cookieStore = await cookies();
  const response = await api.post<Note>('/notes', newNote, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await api.delete<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const response = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}

export async function checkSession(): Promise<User> {
  const response = await api.get<User>('/auth/session');
  return response.data;
}