import DailyMenu from '@/components/DailyMenu'  // ← Capital D

export const metadata = {
  title: 'Daily Tiffin Menu | Fresh Gujarati Meals Delivered',
  description:
    'Check today’s Atmiya Caterers tiffin lineup featuring homestyle Gujarati sabzis, rotis, farsan, and add-ons prepared for Windsor and GTA deliveries.',
  keywords: [
    'daily tiffin Windsor',
    'Gujarati meal plan Ontario',
    'Atmiya daily menu',
    'fresh Indian lunch delivery'
  ]
}

export default function DailyMenuPage() {
  return <DailyMenu />
}
