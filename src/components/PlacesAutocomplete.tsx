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

    const autocompleteOptions = {
      types: ['geocode'],
      componentRestrictions: { country: 'fr' },
      fields: ['formatted_address', 'geometry', 'name']
    }

    autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(
      inputRef.current,
      autocompleteOptions
    )

    const pacContainer = document.querySelector('.pac-container') as HTMLElement
    if (pacContainer) {
      pacContainer.style.zIndex = '10000'
    }

    const listener = autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace()
      if (place?.formatted_address) {
        const newAddress = place.formatted_address
        setInputValue(newAddress)
        const coords = place.geometry?.location ? {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        } : undefined
        onChange(newAddress, coords)
      }
    })

    const observer = new MutationObserver(() => {
      const containers = document.querySelectorAll('.pac-container')
      containers.forEach((container) => {
        (container as HTMLElement).style.zIndex = '10000'
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      if (listener) {
        (window as any).google.maps.event.removeListener(listener)
      }
      observer.disconnect()
    }
  }, [onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue, undefined)
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
