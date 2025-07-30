import Hero from '@/components/Hero'
import Services from '@/components/Services'
import TiffinPlans from '@/components/TiffinPlans'
import DailyMenu from '@/components/DailyMenu'      // ← new
import Gallery from '@/components/Gallery'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="bg-white">
        <Services />
        <TiffinPlans />
        <DailyMenu />        {/* ← new section */}
        <Gallery />
        <Contact />
      </div>
    </main>
  )
}
