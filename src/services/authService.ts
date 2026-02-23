import { IUser } from '@/types';

const STORAGE_KEY = 'medicode_user';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export async function mockLogin(email: string, password: string): Promise<IUser> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!email || password.length < 6) {
    throw new Error('Invalid email or password.');
  }

  const raw = email.split('@')[0].replace(/[._]/g, ' ');
  const name = raw.replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    id: generateId(),
    name,
    email,
    role: 'student',
    created_at: new Date().toISOString(),
  };
}

export async function mockSignup(
  name: string,
  email: string,
  _password: string,
): Promise<IUser> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    id: generateId(),
    name: name.trim(),
    email,
    role: 'student',
    created_at: new Date().toISOString(),
  };
}

export function persistUser(user: IUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function loadUser(): IUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as IUser;
  } catch {
    return null;
  }
}
