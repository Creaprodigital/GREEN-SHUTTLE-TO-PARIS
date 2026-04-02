import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface CodeBlockProps {
  code: string
  language?: 'sql' | 'bash' | 'env'
  title?: string
}

export function CodeBlock({ code, language = 'bash', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-lg border border-border bg-card overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted">
          <span className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2"
          >
            {copied ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5"
              >
                <Check className="text-success" size={16} />
                <span className="text-xs text-success">Copied!</span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Copy size={16} />
                <span className="text-xs">Copy</span>
              </div>
            )}
          </Button>
        </div>
      )}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-foreground leading-relaxed">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  )
}
