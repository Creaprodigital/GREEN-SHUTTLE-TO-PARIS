import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { User, List, X, SignOut, CaretDown } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  onNavigateToLogin?: (isAdmin: boolean) => void
  onNavigateToHome?: () => void
  onNavigateToServices?: () => void
  onNavigateToAbout?: () => void
  onNavigateToContact?: () => void
  onNavigateToClient?: () => void
  onNavigateToService?: (serviceId: string) => void
  onLogout?: () => void
  userEmail?: string
  isAdmin?: boolean
}

export default function Header({ onNavigateToLogin, onNavigateToHome, onNavigateToServices, onNavigateToAbout, onNavigateToContact, onNavigateToClient, onNavigateToService, onLogout, userEmail, isAdmin }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const services = [
    { id: 'cdg', label: 'Aéroport CDG', icon: '✈️' },
    { id: 'orly', label: 'Aéroport Orly', icon: '✈️' },
    { id: 'beauvais', label: 'Aéroport Beauvais', icon: '✈️' },
    { id: 'city-tour', label: 'Visite de Paris', icon: '🗼' },
    { id: 'versailles', label: 'Château de Versailles', icon: '👑' },
    { id: 'wine', label: 'Route des Vins', icon: '🍷' },
    { id: 'normandy', label: 'Normandie', icon: '🏰' },
    { id: 'mont-saint-michel', label: 'Mont Saint-Michel', icon: '⛪' },
    { id: 'long-distance', label: 'Longue Distance', icon: '🚗' },
    { id: 'travel-agency', label: 'Agences de Voyage', icon: '🏢' },
    { id: 'fashion-week', label: 'Fashion Week', icon: '👗' },
    { id: 'events', label: 'Événements', icon: '🎭' }
  ]

  const menuItems = [
    { label: 'ACCUEIL', onClick: onNavigateToHome || (() => {}) },
    { label: 'QUI SOMMES-NOUS', onClick: onNavigateToAbout || (() => {}) },
    { label: 'CONTACT', onClick: onNavigateToContact || (() => {}) }
  ]

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setServicesDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false)
    }, 300)
  }

  const handleServiceClick = (serviceId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setServicesDropdownOpen(false)
    onNavigateToService?.(serviceId)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="#accueil" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-2xl font-bold text-accent-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                  E
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="text-foreground font-bold text-xl leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  ELGOH
                </div>
                <div className="text-accent text-xs uppercase tracking-wider font-medium">
                  VTC Premium
                </div>
              </div>
            </a>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick()
                  }
                }}
                className="text-foreground/80 hover:text-accent text-sm font-medium tracking-wide transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
              </button>
            ))}
            
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => onNavigateToServices?.()}
                className="text-foreground/80 hover:text-accent text-sm font-medium tracking-wide transition-colors relative group flex items-center gap-1"
              >
                NOS SERVICES
                <CaretDown size={14} className={`transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
              </button>

              <AnimatePresence>
                {servicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="absolute top-full left-0 mt-2 w-64 bg-card border border-accent/20 shadow-lg overflow-hidden"
                  >
                    <div className="py-2">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => handleServiceClick(service.id)}
                          className="w-full px-4 py-2.5 text-left text-sm text-foreground/80 hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3"
                        >
                          <span className="text-lg">{service.icon}</span>
                          <span className="font-medium">{service.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                  onClick={() => onNavigateToClient?.()}
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
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setMobileMenuOpen(false)
                    if (item.onClick) {
                      item.onClick()
                    }
                  }}
                  className="block w-full text-left text-foreground hover:text-accent text-sm font-medium tracking-wide transition-colors py-2"
                >
                  {item.label}
                </button>
              ))}
              
              <div>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="flex items-center justify-between w-full text-left text-foreground hover:text-accent text-sm font-medium tracking-wide transition-colors py-2"
                >
                  NOS SERVICES
                  <CaretDown size={16} className={`transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 mt-2 space-y-2">
                        {services.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setMobileServicesOpen(false)
                              onNavigateToService?.(service.id)
                            }}
                            className="flex items-center gap-3 w-full text-left text-foreground/80 hover:text-accent text-sm py-2 transition-colors"
                          >
                            <span>{service.icon}</span>
                            <span>{service.label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
                      onNavigateToClient?.()
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
