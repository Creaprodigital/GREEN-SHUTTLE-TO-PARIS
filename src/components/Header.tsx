import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { User, List, X, SignOut, CaretDown, Phone } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

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
  const [scrolled, setScrolled] = useState(false)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const services = [
    { id: 'cdg', label: 'Aéroport CDG' },
    { id: 'orly', label: 'Aéroport Orly' },
    { id: 'beauvais', label: 'Aéroport Beauvais' },
    { id: 'city-tour', label: 'Visite de Paris' },
    { id: 'versailles', label: 'Château de Versailles' },
    { id: 'wine', label: 'Route des Vins' },
    { id: 'normandy', label: 'Normandie' },
    { id: 'mont-saint-michel', label: 'Mont Saint-Michel' },
    { id: 'long-distance', label: 'Longue Distance' },
    { id: 'travel-agency', label: 'Agences de Voyage' },
    { id: 'fashion-week', label: 'Fashion Week' },
    { id: 'events', label: 'Événements' }
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-primary/98 backdrop-blur-md shadow-lg' : 'bg-primary/95 backdrop-blur-sm'
    } border-b border-accent/20`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <button 
              onClick={onNavigateToHome}
              className="flex items-center space-x-2 md:space-x-3 group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-accent rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-xl md:text-2xl font-bold text-accent-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                  E
                </span>
              </div>
              <div className="hidden xs:block">
                <div className="text-foreground font-bold text-lg md:text-xl leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  ELGOH
                </div>
                <div className="text-accent text-[10px] md:text-xs uppercase tracking-wider font-medium">
                  Chauffeur Privé
                </div>
              </div>
            </button>
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
                          className="w-full px-4 py-2.5 text-left text-sm text-foreground/80 hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <span className="font-medium">{service.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <a href="tel:+33609613721" className="hidden sm:flex items-center gap-2 text-foreground/80 hover:text-accent transition-colors">
              <Phone size={18} weight="fill" />
              <span className="text-sm font-medium">+33 6 09 61 37 21</span>
            </a>

            {userEmail && onLogout ? (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-foreground/70 uppercase tracking-wide">
                      {isAdmin ? 'Admin' : 'Client'}
                    </p>
                    <p className="text-sm text-foreground font-medium truncate max-w-[150px]">{userEmail}</p>
                  </div>
                  <Button
                    onClick={onLogout}
                    variant="outline"
                    size={isMobile ? "sm" : "default"}
                    className="border-accent text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <SignOut className="md:mr-2" size={18} />
                    <span className="hidden md:inline">Déconnexion</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  onClick={() => onNavigateToClient?.()}
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="border-accent text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="md:mr-2" size={16} />
                  <span className="hidden lg:inline">Client</span>
                </Button>
                <Button
                  onClick={() => onNavigateToLogin?.(true)}
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="border-accent text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="md:mr-2" size={16} />
                  <span className="hidden lg:inline">Admin</span>
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
            className="lg:hidden bg-primary border-t border-accent/20 overflow-hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <nav className="px-3 py-4 md:px-4 md:py-6 space-y-3">
              <a href="tel:+33609613721" className="flex sm:hidden items-center gap-2 text-foreground/80 hover:text-accent transition-colors py-2">
                <Phone size={18} weight="fill" />
                <span className="text-sm font-medium">+33 6 09 61 37 21</span>
              </a>

              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setMobileMenuOpen(false)
                    if (item.onClick) {
                      item.onClick()
                    }
                  }}
                  className="block w-full text-left text-foreground hover:text-accent text-sm font-medium tracking-wide transition-colors py-2.5 px-2 hover:bg-accent/10 rounded"
                >
                  {item.label}
                </button>
              ))}
              
              <div>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="flex items-center justify-between w-full text-left text-foreground hover:text-accent text-sm font-medium tracking-wide transition-colors py-2.5 px-2 hover:bg-accent/10 rounded"
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
                      <div className="pl-3 mt-2 space-y-1.5">
                        {services.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setMobileServicesOpen(false)
                              onNavigateToService?.(service.id)
                            }}
                            className="flex items-center w-full text-left text-foreground/80 hover:text-accent text-sm py-2 px-2 transition-colors hover:bg-accent/10 rounded"
                          >
                            <span className="text-sm">{service.label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {userEmail && onLogout ? (
                <div className="md:hidden border-t border-accent/20 pt-4 mt-4">
                  <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
                    <p className="text-xs text-foreground/70 uppercase tracking-wide mb-1">
                      {isAdmin ? 'Admin' : 'Client'}
                    </p>
                    <p className="text-sm text-foreground font-medium truncate">{userEmail}</p>
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
                <div className="md:hidden space-y-2 border-t border-accent/20 pt-4 mt-4">
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onNavigateToClient?.()
                    }}
                    variant="outline"
                    className="w-full border-accent text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <User className="mr-2" size={18} />
                    Espace Client
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
                    Espace Admin
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
