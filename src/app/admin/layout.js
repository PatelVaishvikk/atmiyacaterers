export const metadata = {
  title: 'ATMIYA CATERERS - Admin Dashboard',
  description: 'Admin dashboard for ATMIYA CATERERS',
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}   