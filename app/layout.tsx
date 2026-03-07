import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'MediCode Institute',
  description:
    'Bridging the gap between medical education and technology. Learn from industry experts at your own pace.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
