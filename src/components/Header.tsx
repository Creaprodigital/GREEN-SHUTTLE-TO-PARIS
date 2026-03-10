import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { User, List, X, CaretDown, SignOut } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  onNavigateToLogin?: (isAdmin: boolean) => void
  onNavigateToChauffeurPrive?: () => void
  onNavigateToAirportTransfer?: () => void
  onNavigateToCorporateEvent?: () => void
  onNavigateToEmbassyDelegation?: () => void
  onNavigateToHome?: () => void
  onLogout?: () => void
  userEmail?: string
  isAdmin?: boolean
}

export default function Header({ onNavigateToLogin, onNavigateToChauffeurPrive, onNavigateToAirportTransfer, onNavigateToCorporateEvent, onNavigateToEmbassyDelegation, onNavigateToHome, onLogout, userEmail, isAdmin }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)

  const menuItems = [
    { label: 'ACCUEIL', href: '#accueil' },
    { label: 'SERVICES DE CHAUFFEUR PRIVÉ', href: '#services', hasDropdown: true },
    { label: 'VÉHICULES DE LUXE', href: '#vehicules' },
    { label: 'CONTACT', href: '#contact' }
  ]

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false)
    setServicesDropdownOpen(false)
    
    if (onNavigateToHome) {
      onNavigateToHome()
    }
    
    setTimeout(() => {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="#accueil" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-2xl font-bold text-accent-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                  H
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="text-foreground font-bold text-xl leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  Haimouri
                </div>
                <div className="text-accent text-xs uppercase tracking-wider font-medium">
                  International
                </div>
              </div>
            </a>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              item.hasDropdown ? (
                <div 
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <span
                    className="text-foreground/80 hover:text-accent text-sm font-medium tracking-wide transition-colors relative group flex items-center gap-1 cursor-default"
                  >
                    {item.label}
                    <CaretDown size={14} className={`transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
                  </span>
                  
                  <AnimatePresence>
                    {servicesDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-xl overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            setServicesDropdownOpen(false)
                            onNavigateToChauffeurPrive?.()
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          Chauffeur Privé
                        </button>
                        <button
                          onClick={() => {
                            setServicesDropdownOpen(false)
                            onNavigateToAirportTransfer?.()
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          Transfert Aéroports / Gares
                        </button>
                        <button
                          onClick={() => {
                            setServicesDropdownOpen(false)
                            onNavigateToCorporateEvent?.()
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          Corporate & Événementiel
                        </button>
                        <button
                          onClick={() => {
                            setServicesDropdownOpen(false)
                            onNavigateToEmbassyDelegation?.()
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          Ambassades & Délégations
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
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
              )
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {userEmail && onLogout ? (
              <>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-foreground/70 uppercase tracking-wide">
                      {isAdmin ? 'Admin' : 'Client'}
                    </p>
                    <p className="text-sm text-foreground font-medium">{userEmail}</p>
                  </div>
                  <Button
                    onClick={onLogout}
                    variant="outline"
                    className="border-accent text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <SignOut className="mr-2" size={18} />
                    Déconnexion
                  </Button>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  onClick={() => onNavigateToLogin?.(false)}
                  variant="outline"
                  className="border-accent text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="mr-2" size={18} />
                  Client
                </Button>
                <Button
                  onClick={() => onNavigateToLogin?.(true)}
                  variant="outline"
                  className="border-accent text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="mr-2" size={18} />
                  Admin
                </Button>
              </div>
            )}

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
                item.hasDropdown ? (
                  <div key={item.href}>
                    <span
                      className="w-full text-left text-foreground/80 text-sm font-medium tracking-wide py-2 flex items-center justify-between cursor-default"
                    >
                      {item.label}
                      <CaretDown size={14} />
                    </span>
                    <div className="pl-4 mt-2 space-y-2">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false)
                          onNavigateToChauffeurPrive?.()
                        }}
                        className="block text-foreground/70 hover:text-accent text-sm transition-colors py-2"
                      >
                        Chauffeur Privé
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false)
                          onNavigateToAirportTransfer?.()
                        }}
                        className="block text-foreground/70 hover:text-accent text-sm transition-colors py-2"
                      >
                        Transfert Aéroports / Gares
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false)
                          onNavigateToCorporateEvent?.()
                        }}
                        className="block text-foreground/70 hover:text-accent text-sm transition-colors py-2"
                      >
                        Corporate & Événementiel
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false)
                          onNavigateToEmbassyDelegation?.()
                        }}
                        className="block text-foreground/70 hover:text-accent text-sm transition-colors py-2"
                      >
                        Ambassades & Délégations
                      </button>
                    </div>
                  </div>
                ) : (
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
                )
              ))}
              {userEmail && onLogout ? (
                <div className="sm:hidden">
                  <div className="mb-4 p-4 bg-secondary rounded-lg">
                    <p className="text-xs text-foreground/70 uppercase tracking-wide mb-1">
                      {isAdmin ? 'Admin' : 'Client'}
                    </p>
                    <p className="text-sm text-foreground font-medium">{userEmail}</p>
                  </div>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      if (onLogout) {
                        onLogout()
                      }
                    }}
                    variant="outline"
                    className="w-full border-accent text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <SignOut className="mr-2" size={18} />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="sm:hidden space-y-2">
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onNavigateToLogin?.(false)
                    }}
                    variant="outline"
                    className="w-full border-accent text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <User className="mr-2" size={18} />
                    Client
                  </Button>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onNavigateToLogin?.(true)
                    }}
                    variant="outline"
                    className="w-full border-accent text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <User className="mr-2" size={18} />
                    Admin
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
