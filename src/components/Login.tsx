import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SignIn, User as UserIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface LoginProps {
  onLogin: (email: string, isAdmin: boolean) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

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

    onLogin(email, isAdmin)
    toast.success(`Welcome ${isAdmin ? 'Admin' : 'Client'}!`)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
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

              <div className="flex items-center gap-3 p-4 bg-secondary rounded border border-border">
                <input
                  type="checkbox"
                  id="admin-mode"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                <Label htmlFor="admin-mode" className="text-sm cursor-pointer">
                  Login as Administrator
                </Label>
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
  )
}
