'use client';
import css from './SignInPage.module.css';
import { useAuthStore } from '@/lib/store/authStore';

import { LoginRequest, login } from '@/lib/api/clientApi';

import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const setUser = useAuthStore(store => store.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as LoginRequest;
      const res = await login(formValues);

      if (res) {
        setUser(res);
        router.push('/profile');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      if (isAxiosError(error)) {
        setError(
          error?.response?.data?.error ??
            error?.message ??
            'Oops.. something went wrong'
        );
      } else {
        setError('Oops.. something went wrong');
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <form action={handleSubmit} className={css.form}>
        <h1 className={css.formTitle}>Sign In</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log In
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
};

export default SignIn;