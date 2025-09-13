'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Check if we're on an admin page
  const isAdminPage = pathname.startsWith('/admin') || 
                     pathname === '/admin-access' ||
                     pathname === '/garba-booking';

  // For admin pages, render without header/footer
  if (isAdminPage) {
    return <div className="admin-page-layout">{children}</div>;
  }

  // For regular pages, render with header and footer
  return (
    <>
      <Header />
      <main suppressHydrationWarning>
        {children}
      </main>
      <Footer />
    </>
  );
}
