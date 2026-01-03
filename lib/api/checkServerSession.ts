import nextServer from './api';
import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';
import type { User } from '@/types/user';
import type { SessionResponse } from '@/types/session';
import { api } from '@/app/api/api';


export async function checkServerSession() {
  return api.get<SessionResponse>('/auth/session');
}



