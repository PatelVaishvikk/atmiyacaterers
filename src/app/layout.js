// app/layout.js
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
      {/* suppressHydrationWarning silences React hydration mismatches on the client */}
      <body suppressHydrationWarning className="font-sans">
        <Header />
        {/* you can also scope this to just <main> if you prefer */}
        <main suppressHydrationWarning>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
