import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="container section-padding">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-2xl font-serif font-bold">Delicious Catering</span>
            </div>
            <p className="text-gray-300 mb-6">
              Creating memorable culinary experiences for over 10 years. Quality food, exceptional service, unforgettable moments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors">
                <span>📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors">
                <span>📷</span>
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors">
                <span>🐦</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/food-catalogue" className="text-gray-300 hover:text-white transition-colors">Food Catalogue</Link></li>
              <li><Link href="/gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</Link></li> {/* ← added */}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              <li><span className="text-gray-300">Wedding Catering</span></li>
              <li><span className="text-gray-300">Corporate Events</span></li>
              <li><span className="text-gray-300">Private Parties</span></li>
              <li><span className="text-gray-300">Daily Tiffin</span></li>
              <li><span className="text-gray-300">Event Planning</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Info</h3>
            <div className="space-y-3">
              <p className="text-gray-300">📍 495 Curry Ave<br />Windsor</p>
              <p className="text-gray-300">📞 +1 5199927920</p>
              <p className="text-gray-300">✉️ atmiyacaters@gmail.com</p>
              <p className="text-gray-300">🕒 Mon-Sat: 8AM-8PM</p>
            </div>
          </div>
        </div>

 <div className="border-t border-gray-600 mt-12 pt-8 text-center">
  <p className="text-gray-300 inline-block relative">
    © 2025{' '}
    <span className="relative">
      <span>Atmiya Catering</span>
      {/* Invisible admin link overlaying the words above */}
      <Link
        href="/admin"
        prefetch={false}
        aria-label="Open admin"
        className="absolute inset-0 opacity-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
      >
        {/* empty – we just need a clickable area; becomes visible on keyboard focus */}
      </Link>
    </span>
    . All rights reserved. | Made with ❤️ for food lovers
  </p>
</div>

        </div>
      
    </footer>
  )
}

