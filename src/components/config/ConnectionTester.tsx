import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@supabase/supabase-js'
import { Lightning, CheckCircle, XCircle, Eye, EyeSlash } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

export function ConnectionTester() {
  const [url, setUrl] = useState('')
  const [key, setKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const validateUrl = (url: string) => {
    return url.startsWith('https://') && url.includes('.supabase.co')
  }

  const validateKey = (key: string) => {
    return key.startsWith('eyJ') && key.length > 100
  }

  const testConnection = async () => {
    if (!validateUrl(url)) {
      setResult({ success: false, message: 'Invalid URL format. Must start with https:// and include .supabase.co' })
      return
    }

    if (!validateKey(key)) {
      setResult({ success: false, message: 'Invalid API key format. Must be a valid JWT token' })
      return
    }

    setTesting(true)
    setResult(null)

    try {
      const testClient = createClient(url, key)
      const { error } = await testClient.from('fleet').select('count', { count: 'exact', head: true })
      
      if (error) {
        if (error.message.includes('does not exist')) {
          setResult({ 
            success: false, 
            message: 'Connection successful but tables not found. Please run the SQL script (Step 2)' 
          })
        } else {
          setResult({ success: false, message: `Connection failed: ${error.message}` })
        }
      } else {
        setResult({ success: true, message: 'Connection successful! All tables are accessible.' })
      }
    } catch (error) {
      setResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Lightning size={24} className="text-accent" />
            Test Connection
          </h3>
          <p className="text-sm text-muted-foreground">
            Verify your Supabase credentials before saving them
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-url">Project URL</Label>
            <Input
              id="test-url"
              type="url"
              placeholder="https://your-project.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`font-mono ${url && !validateUrl(url) ? 'border-destructive' : ''}`}
            />
            {url && !validateUrl(url) && (
              <p className="text-xs text-destructive">URL must start with https:// and include .supabase.co</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-key">Anonymous (public) Key</Label>
            <div className="relative">
              <Input
                id="test-key"
                type={showKey ? 'text' : 'password'}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className={`font-mono pr-10 ${key && !validateKey(key) ? 'border-destructive' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {key && !validateKey(key) && (
              <p className="text-xs text-destructive">Key must be a valid JWT token starting with eyJ</p>
            )}
          </div>
        </div>

        <Button
          onClick={testConnection}
          disabled={testing || !url || !key || !validateUrl(url) || !validateKey(key)}
          className="w-full"
        >
          {testing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Lightning size={20} />
            </motion.div>
          ) : (
            <>
              <Lightning size={20} />
              Test Connection
            </>
          )}
        </Button>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert variant={result.success ? 'default' : 'destructive'} className={result.success ? 'border-success bg-success/10' : ''}>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle size={20} className="text-success" weight="fill" />
                  ) : (
                    <XCircle size={20} weight="fill" />
                  )}
                  <AlertDescription className={result.success ? 'text-success' : ''}>
                    {result.message}
                  </AlertDescription>
                </div>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
