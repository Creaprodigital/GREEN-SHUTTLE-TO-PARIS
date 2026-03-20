import { Home, ArrowLeft, Phone } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface NotFoundProps {
  onNavigateToHome: () => void
  onNavigateToServices: () => void
  onNavigateToContact: () => void
}

export default function NotFound({ onNavigateToHome, onNavigateToServices, onNavigateToContact }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <Card className="bg-card border-border p-8 md:p-12 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="text-[120px] md:text-[180px] font-display font-bold text-accent leading-none">
              404
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Page Introuvable
            </h1>
            <p className="text-muted-foreground text-lg">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={onNavigateToHome}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium w-full sm:w-auto"
            >
              <Home className="mr-2" weight="fill" />
              Retour à l'Accueil
            </Button>
            
            <Button
              onClick={onNavigateToServices}
              variant="outline"
              size="lg"
              className="border-accent text-accent hover:bg-accent/10 w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2" />
              Nos Services
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <p className="text-muted-foreground text-sm mb-4">
              Besoin d'aide ? Contactez-nous
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
              <a
                href="tel:+33609613721"
                className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
              >
                <Phone weight="fill" />
                +33 6 09 61 37 21
              </a>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <button
                onClick={onNavigateToContact}
                className="text-accent hover:text-accent/80 transition-colors"
              >
                Formulaire de contact
              </button>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  )
}
