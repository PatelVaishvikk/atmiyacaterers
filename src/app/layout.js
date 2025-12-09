import { Inter, Playfair_Display, Shrikhand } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

const shrikhand = Shrikhand({
  weight: '400',
  subsets: ['gujarati', 'latin'],
  display: 'swap',
  variable: '--font-shrikhand',
})

export const metadata = {
  title: 'Atmiya Catering | Indian & Gujarati Caterers in Windsor, Toronto, Etobicoke, London & Waterloo',
  description: 'Ontario’s trusted Gujarati and Indian catering team for weddings, corporate events, and celebrations across Windsor, Toronto, Etobicoke, London, Waterloo, and the GTA.',
  keywords: [
    'best caterers in Windsor',
    'Gujarati catering Windsor',
    'Indian wedding caterers Windsor',
    'Windsor tiffin and corporate meals',
    'Toronto Gujarati catering',
    'Indian catering Etobicoke',
    'Gujarati wedding catering London Ontario',
    'Waterloo Indian food catering',
    'Ontario Gujarati tiffin service',
    'Atmiya Caterers'
  ],
  openGraph: {
    title: 'Atmiya Catering | Indian & Gujarati Caterers in Ontario',
    description: 'Book Windsor, Toronto, Etobicoke, London, and Waterloo’s favourite Gujarati & Indian caterers for unforgettable events.',
    type: 'website',
    url: 'https://atmiya-caterers.com/',
    images: [
      {
        url: 'https://atmiya-caterers.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Atmiya Catering - Gujarati & Indian Catering in Ontario'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atmiya Catering | Gujarati & Indian Caterers',
    description: 'Serving Windsor, Toronto, Etobicoke, London & Waterloo with authentic Gujarati catering.',
    images: ['https://atmiya-caterers.com/og-image.jpg']
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  }
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: 'Atmiya Caterers',
  url: 'https://atmiya-caterers.com/',
  servesCuisine: ['Gujarati', 'Indian'],
  areaServed: [
    'Windsor, Ontario',
    'Toronto, Ontario',
    'Etobicoke, Ontario',
    'London, Ontario',
    'Waterloo, Ontario'
  ],
  serviceArea: {
    '@type': 'Place',
    name: 'Greater Toronto Area & Southwestern Ontario'
  },
  sameAs: [
    'https://www.instagram.com/',
    'https://www.facebook.com/'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    areaServed: 'CA',
    availableLanguage: 'English'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${shrikhand.variable}`}>
      <head>
        {/* Add Font Awesome for icons used in admin panel */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <meta name="keywords" content="best caterers in Windsor, Gujarati catering Windsor, Indian wedding caterers Windsor, Windsor tiffin and corporate meals, Toronto Gujarati catering, Indian catering Etobicoke, Gujarati wedding catering London, Waterloo Indian catering, Atmiya Caterers Ontario" />
        <meta name="geo.region" content="CA-ON" />
        <meta name="geo.placename" content="Windsor, Toronto, Etobicoke, London, Waterloo" />
        <meta name="geo.position" content="43.6532;-79.3832" />
        <meta name="ICBM" content="43.6532, -79.3832" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      {/* suppressHydrationWarning silences React hydration mismatches on the client */}
      <body suppressHydrationWarning className="font-sans antialiased text-gray-900 bg-white">
        <ConditionalLayout>{children}</ConditionalLayout>
        {/* <AdminAccessButton /> */}
      </body>
    </html>
  )
}
