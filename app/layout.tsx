import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from '@/context/SidebarContext';
import SidebarDrawer from '@/components/layout/SidebarDrawer';
import PageShiftWrapper from '@/components/layout/PageShiftWrapper';

export const metadata = {
  title: 'MediCode Institute',
  description:
    'Bridging the gap between medical education and technology. Learn from industry experts at your own pace.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <AuthProvider>
          <SidebarProvider>
            {/* Sidebar sits at z-10, behind the page */}
            <SidebarDrawer />
            {/* Entire page shifts right to reveal sidebar */}
            <PageShiftWrapper>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </PageShiftWrapper>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
