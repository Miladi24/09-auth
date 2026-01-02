'use client';
import css from './EditProfilePage.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { updateMe } from '@/lib/api/clientApi';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const EditProfilePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useAuthStore(store => store.user);
  const setUser = useAuthStore(store => store.setUser);

  const { mutate, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: updatedUser => {
      setUser(updatedUser);
      queryClient.invalidateQueries({
        queryKey: ['me'],
      });
      router.push('/profile');
    },
  });

  if (!user) {
    return <p>Loading profile...</p>;
  }

  const handleSubmit = async (formData: FormData) => {
    const username = formData.get('username') as string;

    if (!username || !username.trim()) return;
    mutate({ username });
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src="https://ac.goit.global/fullstack/react/default-avatar.jpg"
          alt="User Avatar"
          className={css.avatar}
          width={120}
          height={120}
        />

        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit(new FormData(e.currentTarget));
          }}
          className={css.profileInfo}
        >
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              id="username"
              name="username"
              className={css.input}
              defaultValue={user.username ?? ''}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isPending}
            >
              Save
            </button>
            <button
              onClick={() => router.back()}
              type="button"
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfilePage;