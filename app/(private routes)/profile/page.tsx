
import css from "./ProfilePage.module.css";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getMe } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "User profile",
  description: "This is the user profile page",
  openGraph: {
    title: `User profile`,
    description: "This is the user profile page",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile`,
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "The user profile page",
      },
    ],
  },
};

export default async function ProfilePage() {
  const data = await getMe();

  if (!data) {
    return <p>Login, please</p>;
  }
  return (
    <>
      {data && (
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
                src={data.avatar}
                alt="User Avatar"
                width={120}
                height={120}
                className={css.avatar}
              />
            </div>
            <div className={css.profileInfo}>
              <p>Username: {data.username}</p>
              <p>Email: {data.email}</p>
            </div>
          </div>
        </main>
      )}
    </>
  );
}