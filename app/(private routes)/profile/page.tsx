import css from './ProfilePage.module.css';

import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

import { getMe, checkServerSession } from '@/lib/api/serverApi';


export const metadata: Metadata = {
  title: 'Profile page',
  description: 'User profile page with personal information',
  metadataBase: 'https://09-auth-five-nu.vercel.app/',
  openGraph: {
    title: 'Profile page',
    description: 'User profile page with personal information',
    url: 'https://09-auth-five-nu.vercel.app/',
    images: [
      {
        url: 'https://09-auth-five-nu.vercel.app/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Notehub - Profile page',
      },
    ],
  },
};

const Profile = async () => {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            className={css.avatar}
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
};

export default Profile;