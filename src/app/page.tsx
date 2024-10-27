import Link from 'next/link';
import LogoutButton from '@/components/auth/LogoutButton';
import { getSession } from '@/lib/auth';

export default async function HomePage() {
  const user = await getSession();
  return (
    <div>
      <h1>Welcome to the Course Platform</h1>
      <Link className="bg-blue-300 rounded-xl p-2" href={'/course'}>
        Go to course
      </Link>
      {!user ? (
        <>
          <p>You are not logged in.</p>
          <Link href="/login">Login</Link>
          {' | '}
          <Link href="/enroll">Enroll</Link>
        </>
      ) : (
        <>
          <p>Welcome back, {user.email}!</p>
          <Link href="/course">Go to Course</Link>
          {' | '}
          <LogoutButton />
        </>
      )}
    </div>
  );
}
