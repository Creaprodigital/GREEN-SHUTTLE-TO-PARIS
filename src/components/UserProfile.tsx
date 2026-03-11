import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, MapPin, Phone, Envelope, Check, X } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { UserProfile as UserProfileType } from '@/types/user'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface UserProfileProps {
  userEmail: string
}

export default function UserProfile({ userEmail }: UserProfileProps) {
  const [profile, setProfile] = useKV<UserProfileType>('user-profile-' + userEmail, {
    email: userEmail,
    firstName: '',
    lastName: '',
    phone: '',
    billingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UserProfileType>(profile || {
    email: userEmail,
    firstName: '',
    lastName: '',
    phone: '',
    billingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  })

  useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('billingAddress.')) {
      const addressField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress!,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSave = () => {
    const updatedProfile = {
      ...formData,
      email: userEmail,
      updatedAt: Date.now()
    }
    
    setProfile(updatedProfile)
    setIsEditing(false)
    toast.success('Profil mis à jour avec succès')
  }

  const handleCancel = () => {
    setFormData(profile || {
      email: userEmail,
      firstName: '',
      lastName: '',
      phone: '',
      billingAddress: {
        street: '',
        city: '',
        postalCode: '',
        country: 'France'
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
    setIsEditing(false)
  }

  return (
    <Card className="border-2 border-accent/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <User size={20} weight="fill" className="sm:w-6 sm:h-6" />
              Mon Profil
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              Gérez vos informations personnelles
            </CardDescription>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="border-2 border-accent/30 hover:border-accent hover:bg-accent/10"
            >
              Modifier
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-xs sm:text-sm flex items-center gap-2">
                <User size={14} />
                Prénom
              </Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="Votre prénom"
                  className="border-2"
                />
              ) : (
                <p className="text-sm sm:text-base text-foreground py-2 px-3 bg-muted/30 rounded-md min-h-[40px] flex items-center">
                  {formData.firstName || <span className="text-muted-foreground italic">Non renseigné</span>}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-xs sm:text-sm flex items-center gap-2">
                <User size={14} />
                Nom
              </Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Votre nom"
                  className="border-2"
                />
              ) : (
                <p className="text-sm sm:text-base text-foreground py-2 px-3 bg-muted/30 rounded-md min-h-[40px] flex items-center">
                  {formData.lastName || <span className="text-muted-foreground italic">Non renseigné</span>}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs sm:text-sm flex items-center gap-2">
              <Envelope size={14} />
              Email
            </Label>
            <p className="text-sm sm:text-base text-foreground py-2 px-3 bg-muted/50 rounded-md min-h-[40px] flex items-center border border-border">
              {userEmail}
            </p>
            <p className="text-xs text-muted-foreground">
              L'email ne peut pas être modifié
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs sm:text-sm flex items-center gap-2">
              <Phone size={14} />
              Téléphone
            </Label>
            {isEditing ? (
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="border-2"
              />
            ) : (
              <p className="text-sm sm:text-base text-foreground py-2 px-3 bg-muted/30 rounded-md min-h-[40px] flex items-center">
                {formData.phone || <span className="text-muted-foreground italic">Non renseigné</span>}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="text-sm sm:text-base font-semibold mb-4 flex items-center gap-2">
            <MapPin size={16} weight="fill" />
            Adresse de Facturation
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street" className="text-xs sm:text-sm">
                Rue et Numéro
              </Label>
              {isEditing ? (
                <Input
                  id="street"
                  value={formData.billingAddress?.street || ''}
                  onChange={(e) => handleChange('billingAddress.street', e.target.value)}
                  placeholder="123 Rue de la République"
                  className="border-2"
                />
              ) : (
                <p className="text-sm sm:text-base text-foreground py-2 px-3 bg-muted/30 rounded-md min-h-[40px] flex items-center">
                  {formData.billingAddress?.street || <span className="text-muted-foreground italic">Non renseigné</span>}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-xs sm:text-sm">
                  Code Postal
                </Label>
                {isEditing ? (
                  <Input
                    id="postalCode"
                    value={formData.billingAddress?.postalCode || ''}
                    onChange={(e) => handleChange('billingAddress.postalCode', e.target.value)}
                    placeholder="75001"
                    className="border-2"
                  />
                ) : (
                  <p className="text-sm sm:text-base text-foreground py-2 px-3 bg-muted/30 rounded-md min-h-[40px] flex items-center">
                    {formData.billingAddress?.postalCode || <span className="text-muted-foreground italic">Non renseigné</span>}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-xs sm:text-sm">
                  Ville
                </Label>
                {isEditing ? (
                  <Input
                    id="city"
                    value={formData.billingAddress?.city || ''}
                    onChange={(e) => handleChange('billingAddress.city', e.target.value)}
                    placeholder="Paris"
                    className="border-2"
                  />
                ) : (
                  <p className="text-sm sm:text-base text-foreground py-2 px-3 bg-muted/30 rounded-md min-h-[40px] flex items-center">
                    {formData.billingAddress?.city || <span className="text-muted-foreground italic">Non renseigné</span>}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-xs sm:text-sm">
                Pays
              </Label>
              {isEditing ? (
                <Input
                  id="country"
                  value={formData.billingAddress?.country || 'France'}
                  onChange={(e) => handleChange('billingAddress.country', e.target.value)}
                  placeholder="France"
                  className="border-2"
                />
              ) : (
                <p className="text-sm sm:text-base text-foreground py-2 px-3 bg-muted/30 rounded-md min-h-[40px] flex items-center">
                  {formData.billingAddress?.country || 'France'}
                </p>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 pt-4"
          >
            <Button
              onClick={handleSave}
              className="flex-1 gap-2 bg-accent hover:bg-accent/90"
            >
              <Check size={18} weight="bold" />
              Enregistrer
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 gap-2 border-2"
            >
              <X size={18} weight="bold" />
              Annuler
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
