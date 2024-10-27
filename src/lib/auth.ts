import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export interface UserSession {
  userId: string;
  email: string;
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
}
