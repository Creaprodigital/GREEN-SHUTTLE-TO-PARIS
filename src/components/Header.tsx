import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { User, List, X } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  onNavigateToLogin: () => void
}

export default function Header({ onNavigateToLogin }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { label: 'ACCUEIL', href: '#accueil' },
    { label: 'SERVICES DE CHAUFFEUR PRIVÉ', href: '#services' },
    { label: 'VÉHICULES DE LUXE', href: '#vehicules' },
    { label: 'CONTACT', href: '#contact' }
  ]

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="#accueil" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-2xl font-bold text-accent-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                  G
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="text-foreground font-bold text-xl leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  Green Shuttle
                </div>
                <div className="text-accent text-xs uppercase tracking-wider font-medium">
                  To Paris
                </div>
              </div>
            </a>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(item.href)
                }}
                className="text-foreground/80 hover:text-accent text-sm font-medium tracking-wide transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              onClick={onNavigateToLogin}
              variant="outline"
              className="hidden sm:flex border-accent text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <User className="mr-2" size={18} />
              Client / Admin
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground hover:text-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-primary border-t border-accent/20 overflow-hidden"
          >
            <nav className="px-4 py-6 space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(item.href)
                  }}
                  className="block text-foreground hover:text-accent text-sm font-medium tracking-wide transition-colors py-2"
                >
                  {item.label}
                </a>
              ))}
              <Button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onNavigateToLogin()
                }}
                variant="outline"
                className="w-full border-accent text-foreground hover:bg-accent hover:text-accent-foreground sm:hidden"
              >
                <User className="mr-2" size={18} />
                Client / Admin
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
