import { Separator } from '@/components/ui/separator'

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              LuxeRide
            </h3>
            <p className="text-primary-foreground/80 text-sm">
              Premium chauffeur service delivering excellence in every journey.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Airport Transfers</li>
              <li>Business Travel</li>
              <li>City Rides</li>
              <li>Hourly Bookings</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Partners</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Help Center</li>
              <li>Contact</li>
              <li>Safety</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        <Separator className="bg-primary-foreground/20 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
          <p>&copy; 2024 LuxeRide. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Cookie Policy</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
