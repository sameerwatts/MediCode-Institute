import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SidebarProvider } from '@/context/SidebarContext';
import PublicSidebarSlot from '@/components/layout/AppSidebar/PublicSidebarSlot';
import PageShiftWrapper from '@/components/layout/PageShiftWrapper';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <PublicSidebarSlot />
      <PageShiftWrapper>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </PageShiftWrapper>
    </SidebarProvider>
  );
}
