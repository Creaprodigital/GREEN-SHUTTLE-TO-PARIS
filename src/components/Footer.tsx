import { Separator } from '@/components/ui/separator'

export default function Footer() {
  return (
    <footer className="bg-primary border-t-2 border-accent text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
              Green Shuttle To Paris
            </h3>
            <p className="text-muted-foreground text-sm font-light">
              Premier chauffeur service delivering excellence to Paris and beyond.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4 uppercase tracking-widest text-sm">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-light">
              <li className="hover:text-accent transition-colors cursor-pointer">Airport Transfers</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Business Travel</li>
              <li className="hover:text-accent transition-colors cursor-pointer">City Rides</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Hourly Bookings</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 uppercase tracking-widest text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-light">
              <li className="hover:text-accent transition-colors cursor-pointer">About Us</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Careers</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Press</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Partners</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 uppercase tracking-widest text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-light">
              <li className="hover:text-accent transition-colors cursor-pointer">Help Center</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Contact</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Safety</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Terms of Service</li>
            </ul>
          </div>
        </div>

        <Separator className="bg-border mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-light">
          <p>&copy; 2024 Green Shuttle To Paris. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-accent transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-accent transition-colors cursor-pointer">Cookie Policy</span>
            <span className="hover:text-accent transition-colors cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
