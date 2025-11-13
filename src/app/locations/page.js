import RegionalServiceAreas from '@/components/RegionalServiceAreas'

export const metadata = {
  title: 'Service Areas | Atmiya Caterers',
  description:
    'Discover where Atmiya Caterers provides Gujarati and Indian catering across Windsor, Toronto, Etobicoke, London, Waterloo, and beyond.',
}

export default function LocationsPage() {
  return (
    <main>
      <RegionalServiceAreas />
    </main>
  )
}
