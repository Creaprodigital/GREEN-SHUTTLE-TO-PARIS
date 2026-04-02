import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { StepIndicator } from '@/components/config/StepIndicator'
import { ConfigStatus } from '@/components/config/ConfigStatus'
import { ConnectionTester } from '@/components/config/ConnectionTester'
import { CodeBlock } from '@/components/config/CodeBlock'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Database, Lightning, CheckCircle, ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

const STEPS = [
  {
    number: 1,
    title: 'Create Supabase Project',
    description: 'Set up a new project on Supabase'
  },
  {
    number: 2,
    title: 'Create Database Tables',
    description: 'Run the SQL script to create tables'
  },
  {
    number: 3,
    title: 'Get API Credentials',
    description: 'Copy your Project URL and API key'
  },
  {
    number: 4,
    title: 'Configure Environment',
    description: 'Add credentials to .env.local file'
  },
  {
    number: 5,
    title: 'Restart & Verify',
    description: 'Restart the app and test connection'
  }
]

const SQL_SCRIPT = `-- Create all tables
CREATE TABLE fleet (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, image TEXT, "order" INTEGER, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE bookings (id TEXT PRIMARY KEY, email TEXT NOT NULL, pickup_location TEXT NOT NULL, dropoff_location TEXT NOT NULL, pickup_date TEXT NOT NULL, pickup_time TEXT NOT NULL, service_type TEXT NOT NULL, passengers INTEGER DEFAULT 1, status TEXT DEFAULT 'pending', price NUMERIC, notes TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE pricing (id TEXT PRIMARY KEY, vehicle_id TEXT NOT NULL, price_per_km NUMERIC NOT NULL, price_per_minute NUMERIC NOT NULL, price_per_hour NUMERIC NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE service_options (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, price NUMERIC NOT NULL, icon TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE circuits (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, duration TEXT, stops JSONB, pricing JSONB, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE pricing_zones (id TEXT PRIMARY KEY, name TEXT NOT NULL, coordinates JSONB, color TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE zone_forfaits (id TEXT PRIMARY KEY, from_zone TEXT NOT NULL, to_zone TEXT NOT NULL, vehicle_id TEXT NOT NULL, price NUMERIC NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE promo_codes (id TEXT PRIMARY KEY, code TEXT UNIQUE NOT NULL, discount_type TEXT NOT NULL, discount_value NUMERIC NOT NULL, valid_from TIMESTAMPTZ, valid_until TIMESTAMPTZ, max_uses INTEGER, current_uses INTEGER DEFAULT 0, active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE admin_accounts (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE system_settings (key TEXT PRIMARY KEY, value JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());

-- Indexes
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_status ON bookings(status);

-- RLS
ALTER TABLE fleet ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE circuits ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE zone_forfaits ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Policies (public access for simplicity)
CREATE POLICY "Public access" ON fleet FOR ALL USING (true);
CREATE POLICY "Public access" ON pricing FOR ALL USING (true);
CREATE POLICY "Public access" ON service_options FOR ALL USING (true);
CREATE POLICY "Public access" ON circuits FOR ALL USING (true);
CREATE POLICY "Public access" ON pricing_zones FOR ALL USING (true);
CREATE POLICY "Public access" ON zone_forfaits FOR ALL USING (true);
CREATE POLICY "Public access" ON bookings FOR ALL USING (true);
CREATE POLICY "Public access" ON promo_codes FOR ALL USING (true);
CREATE POLICY "Public access" ON admin_accounts FOR ALL USING (true);
CREATE POLICY "Public access" ON system_settings FOR ALL USING (true);`

const ENV_TEMPLATE = `# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`

export default function App() {
  const [currentStep, setCurrentStep] = useState(1)

  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Create a Supabase Project</h3>
            <div className="space-y-3 text-sm">
              <StepItem number={1}>
                Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-mono">supabase.com</a>
              </StepItem>
              <StepItem number={2}>
                Sign up or log in with GitHub
              </StepItem>
              <StepItem number={3}>
                Click <strong>"New Project"</strong>
              </StepItem>
              <StepItem number={4}>
                Fill in the details:
                <ul className="ml-6 mt-2 space-y-1 list-disc">
                  <li>Name: <code className="font-mono bg-muted px-1.5 py-0.5 rounded">elgoh-chauffeur</code></li>
                  <li>Database Password: Choose a strong password</li>
                  <li>Region: <code className="font-mono bg-muted px-1.5 py-0.5 rounded">Europe West</code></li>
                </ul>
              </StepItem>
              <StepItem number={5}>
                Wait ~2 minutes for project creation
              </StepItem>
            </div>
            <Alert className="mt-6">
              <AlertDescription className="flex items-center gap-2">
                <CheckCircle size={16} />
                <span>Once created, you'll see your project dashboard</span>
              </AlertDescription>
            </Alert>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Create Database Tables</h3>
            <div className="space-y-3 text-sm mb-4">
              <StepItem number={1}>
                In your Supabase dashboard, click <strong>SQL Editor</strong> in the sidebar
              </StepItem>
              <StepItem number={2}>
                Click <strong>"+ New query"</strong>
              </StepItem>
              <StepItem number={3}>
                Copy the SQL script below and paste it into the editor
              </StepItem>
              <StepItem number={4}>
                Click <strong>"Run"</strong> (or press Ctrl+Enter)
              </StepItem>
              <StepItem number={5}>
                You should see <code className="font-mono bg-muted px-1.5 py-0.5 rounded">Success. No rows returned</code>
              </StepItem>
            </div>
            <CodeBlock code={SQL_SCRIPT} language="sql" title="SQL Script - Create Tables" />
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Get API Credentials</h3>
            <div className="space-y-3 text-sm">
              <StepItem number={1}>
                Click <strong>Settings</strong> (⚙️ icon) in the bottom left sidebar
              </StepItem>
              <StepItem number={2}>
                Click <strong>API</strong> in the settings sidebar
              </StepItem>
              <StepItem number={3}>
                Copy these two values:
                <div className="ml-6 mt-2 space-y-2">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium mb-1">Project URL</div>
                    <code className="text-xs font-mono text-muted-foreground">https://abcdefgh.supabase.co</code>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium mb-1">anon public key</div>
                    <code className="text-xs font-mono text-muted-foreground">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</code>
                  </div>
                </div>
              </StepItem>
            </div>
            <Alert className="mt-6">
              <AlertDescription className="flex items-center gap-2">
                <CheckCircle size={16} />
                <span>Keep these values handy for the next step</span>
              </AlertDescription>
            </Alert>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Configure Environment Variables</h3>
            <div className="space-y-3 text-sm mb-4">
              <StepItem number={1}>
                Create a file named <code className="font-mono bg-muted px-1.5 py-0.5 rounded">.env.local</code> in your project root
              </StepItem>
              <StepItem number={2}>
                Copy the template below and replace with your actual values
              </StepItem>
              <StepItem number={3}>
                Save the file
              </StepItem>
            </div>
            <CodeBlock code={ENV_TEMPLATE} language="env" title=".env.local" />
            <Alert>
              <AlertDescription className="text-xs">
                ⚠️ Never commit .env.local to Git! It contains sensitive credentials.
              </AlertDescription>
            </Alert>
          </div>
        )
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Restart & Verify</h3>
            <div className="space-y-3 text-sm">
              <StepItem number={1}>
                Stop your development server (Ctrl+C in terminal)
              </StepItem>
              <StepItem number={2}>
                Restart it with:
                <CodeBlock code="npm run dev" language="bash" />
              </StepItem>
              <StepItem number={3}>
                Check the browser console (F12) - you should see:
                <div className="mt-2 p-3 bg-success/10 border border-success rounded-lg">
                  <code className="text-xs font-mono text-success">✅ Supabase configured and connected</code>
                </div>
              </StepItem>
              <StepItem number={4}>
                Use the <strong>Test Connection</strong> tab to verify everything works
              </StepItem>
            </div>
            <Alert className="mt-6 bg-success/10 border-success">
              <AlertDescription className="flex items-center gap-2 text-success">
                <CheckCircle size={16} weight="fill" />
                <span className="font-semibold">Configuration Complete!</span>
              </AlertDescription>
            </Alert>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Database size={40} className="text-primary" weight="duotone" />
            <h1 className="text-4xl font-bold font-mono tracking-tight">
              Supabase Configuration
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Quick start guide to connect your application to Supabase
          </p>
        </motion.div>

        <Tabs defaultValue="guide" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="guide">
              <Database size={18} className="mr-2" />
              Guide
            </TabsTrigger>
            <TabsTrigger value="test">
              <Lightning size={18} className="mr-2" />
              Test
            </TabsTrigger>
            <TabsTrigger value="status">
              <CheckCircle size={18} className="mr-2" />
              Status
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guide" className="space-y-6">
            <div className="grid lg:grid-cols-[350px_1fr] gap-6">
              <Card className="p-6 h-fit lg:sticky lg:top-6">
                <StepIndicator
                  steps={STEPS}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </Card>

              <Card className="p-6">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent(currentStep)}
                </motion.div>

                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <button
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                    disabled={currentStep === 5}
                    className="text-sm text-accent hover:text-accent/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="test">
            <ConnectionTester />
          </TabsContent>

          <TabsContent value="status">
            <ConfigStatus />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface StepItemProps {
  number: number
  children: React.ReactNode
}

function StepItem({ number, children }: StepItemProps) {
  return (
    <div className="flex gap-3">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
        {number}
      </span>
      <div className="flex-1 pt-0.5">{children}</div>
    </div>
  )
}
