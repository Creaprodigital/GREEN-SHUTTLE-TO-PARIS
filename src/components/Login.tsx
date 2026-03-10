import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SignIn, User as UserIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Header from '@/components/Header'

interface LoginProps {
  onLogin: (email: string, isAdmin: boolean) => void
  onNavigateToHome: () => void
  onNavigateToAirportTransfer: () => void
  onNavigateToCorporateEvent?: () => void
  isAdminMode?: boolean
}

export default function Login({ onLogin, onNavigateToHome, onNavigateToAirportTransfer, onNavigateToCorporateEvent, isAdminMode = false }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Veuillez entrer votre email')
      return
    }

    if (!email.includes('@')) {
      toast.error('Veuillez entrer un email valide')
      return
    }

    if (isAdminMode) {
      if (email.toLowerCase() === 'admin@admin.fr' && password === 'admin') {
        onLogin(email, true)
        toast.success('Bienvenue Admin!')
        return
      }
      toast.error('Identifiants admin invalides')
      return
    }

    onLogin(email, false)
    toast.success('Bienvenue Client!')
  }

  return (
    <>
      <Header 
        onNavigateToHome={onNavigateToHome}
        onNavigateToAirportTransfer={onNavigateToAirportTransfer}
        onNavigateToCorporateEvent={onNavigateToCorporateEvent}
      />
      <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 border-accent/20">
            <CardHeader className="text-center border-b border-border pb-6">
              <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserIcon size={32} weight="bold" className="text-accent-foreground" />
              </div>
              <CardTitle className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Green Shuttle To Paris
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {isAdminMode ? 'Admin Access' : 'Client Access'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium uppercase tracking-wide">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="h-12 bg-secondary border-border"
                  />
                </div>

                {isAdminMode && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium uppercase tracking-wide">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-12 bg-secondary border-border"
                    />
                  </div>
                )}

                {isAdminMode ? (
                  <div className="p-3 bg-secondary/50 rounded border border-border text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Admin Credentials:</p>
                    <p>• Email: admin@admin.fr</p>
                    <p>• Password: admin</p>
                  </div>
                ) : (
                  <div className="p-3 bg-secondary/50 rounded border border-border text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Client Access:</p>
                    <p>• Enter your email address to continue</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 font-medium uppercase tracking-widest"
                >
                  <SignIn className="mr-2" size={20} />
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
