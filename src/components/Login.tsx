import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SignIn, User as UserIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import { useKV } from '@github/spark/hooks'

interface LoginProps {
  onLogin: (email: string, isAdmin: boolean) => void
  onNavigateToHome: () => void
  onNavigateToAirportTransfer: () => void
}

interface AdminAccount {
  email: string
  password: string
}

export default function Login({ onLogin, onNavigateToHome, onNavigateToAirportTransfer }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminAccounts] = useKV<AdminAccount[]>('admin-accounts', [
    { email: 'admin@greenshuttle.com', password: 'admin123' }
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email')
      return
    }

    const adminAccount = adminAccounts?.find(
      acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    )

    if (adminAccount) {
      onLogin(email, true)
      toast.success('Welcome Admin!')
    } else if (password) {
      toast.error('Invalid admin credentials')
    } else {
      onLogin(email, false)
      toast.success('Welcome Client!')
    }
  }

  return (
    <>
      <Header 
        onNavigateToHome={onNavigateToHome}
        onNavigateToAirportTransfer={onNavigateToAirportTransfer}
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
                Access your account
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

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium uppercase tracking-wide">
                    Password <span className="text-muted-foreground text-xs normal-case">(For Admin Only)</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password for admin access"
                    className="h-12 bg-secondary border-border"
                  />
                </div>

                <div className="p-3 bg-secondary/50 rounded border border-border text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Access Information:</p>
                  <p>• Clients: Enter email only</p>
                  <p>• Admins: Enter email and password</p>
                </div>

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
