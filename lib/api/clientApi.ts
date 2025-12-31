import nextServer from '@/lib/api/api';

import { User } from '@/types/user';
import { Note, NewNote } from '@/types/note';

export type RegisterRequest = {
  email: string;
  password: string;
};

export async function register(data: RegisterRequest) {
  const response = await nextServer.post<User>('/api/auth/register', data);
  return response.data;
}

export type LoginRequest = {
  email: string;
  password: string;
};

export async function login(data: LoginRequest) {
  const response = await nextServer.post<User>('/api/auth/login', data);
  return response.data;
}

export async function logout(): Promise<void> {
  await nextServer.post('/api/auth/logout');
}

export async function getMe(): Promise<User> {
  const response = await nextServer.get<User>('/users/me');
  return response.data;
} 

type UpdateMeProps = {
  username: string;
};

export async function updateMe(data: UpdateMeProps): Promise<User> {
  const response = await nextServer.patch<User>('/users/me', data);
  return response.data;
}

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
  const response = await nextServer.get<NoteHttpResponse>('/notes', {
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
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(newNote: NewNote): Promise<Note> {
  const response = await nextServer.post<Note>('/notes', newNote);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function checkSession(): Promise<User> {
  const response = await nextServer.get('/api/auth/session');
  return response.data;
}