// app/layout.js
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'
// import AdminAccessButton from '@/components/AdminAccessButton'

export const metadata = {
  title: 'Atmiya Catering – Premium Catering Services',
  description: 'Professional catering services for all your special events. Fresh, delicious food prepared with love.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add Font Awesome for icons used in admin panel */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      {/* suppressHydrationWarning silences React hydration mismatches on the client */}
      <body suppressHydrationWarning className="font-sans">
        <ConditionalLayout>{children}</ConditionalLayout>
        {/* <AdminAccessButton /> */}
      </body>
    </html>
  )
}

