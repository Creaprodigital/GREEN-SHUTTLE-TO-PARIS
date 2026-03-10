declare global {
  interface Window {
    google: typeof google
  }
}

declare namespace google {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number)
      lat(): number
      lng(): number
    }

    namespace places {
      interface AutocompleteOptions {
        types?: string[]
        componentRestrictions?: {
          country?: string | string[]
        }
        fields?: string[]
      }

      interface PlaceResult {
        formatted_address?: string
        geometry?: {
          location: LatLng
        }
        name?: string
        place_id?: string
      }

      class Autocomplete {
        constructor(
          inputField: HTMLInputElement,
          options?: AutocompleteOptions
        )
        addListener(
          eventName: string,
          handler: () => void
        ): google.maps.MapsEventListener
        getPlace(): PlaceResult
      }
    }

    namespace event {
      function removeListener(listener: MapsEventListener): void
    }

    interface MapsEventListener {
      remove(): void
    }
  }
}

export {}
