import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface PlacesAutocompleteProps {
  value: string
  onChange: (value: string, coords?: { lat: number; lng: number }) => void
  placeholder?: string
  className?: string
  id?: string
  icon?: React.ReactNode
}

export default function PlacesAutocomplete({
  value,
  onChange,
  placeholder,
  className,
  id,
  icon
}: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    if (!inputRef.current || !(window as any).google) return

    autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'],
      componentRestrictions: { country: 'fr' }
    })

    const listener = autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace()
      if (place?.formatted_address) {
        setInputValue(place.formatted_address)
        const coords = place.geometry?.location ? {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        } : undefined
        onChange(place.formatted_address, coords)
      }
    })

    return () => {
      if (listener) {
        (window as any).google.maps.event.removeListener(listener)
      }
    }
  }, [onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    if (!newValue) {
      onChange(newValue, undefined)
    }
  }

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      <Input
        ref={inputRef}
        id={id}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn(icon ? 'pl-11' : '', className)}
        autoComplete="off"
      />
    </div>
  )
}
