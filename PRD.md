# Planning Guide

A premium chauffeur service booking platform that enables users to reserve professional transportation with an elegant, trustworthy interface.

**Experience Qualities**: 
1. **Luxurious** - The interface should feel refined and premium, reflecting the high-end nature of the service
2. **Trustworthy** - Clean, professional design that builds confidence in the booking process
3. **Effortless** - Streamlined booking flow that makes reserving a ride feel simple and intuitive

**Complexity Level**: Light Application (multiple features with basic state)
This is a booking-focused application with a multi-step form, service showcase, and informational sections. It requires state management for the booking flow but doesn't need complex backend integration or multiple views.

## Essential Features

**Booking Form**
- Functionality: Multi-step form collecting pickup location, destination, date/time, and service type
- Purpose: Core conversion point - enables users to request a chauffeur service
- Trigger: User interaction with prominent booking widget on homepage
- Progression: Select service type → Enter pickup location → Enter destination → Choose date/time → Review details → Submit request
- Success criteria: Form validates inputs, stores booking data, displays confirmation message

**Service Type Selection**
- Functionality: Display available service tiers (Business, First Class, SUV) with descriptions and features
- Purpose: Help users choose the right service level for their needs
- Trigger: User clicks service selector in booking flow or browses service cards
- Progression: View service options → Compare features → Select preferred service → Continue to booking
- Success criteria: Clear differentiation between services, smooth selection experience

**Location & DateTime Input**
- Functionality: Smart input fields for pickup/dropoff locations and scheduling
- Purpose: Capture essential trip details with minimal friction
- Trigger: User progresses through booking form
- Progression: Enter pickup address → Enter destination → Select date → Select time → Confirm
- Success criteria: Intuitive input with helpful labels, clear validation

**Service Highlights Showcase**
- Functionality: Display key benefits (professional drivers, premium vehicles, reliability, global coverage)
- Purpose: Build trust and communicate value proposition
- Trigger: Page load, user scrolls through homepage
- Progression: User views hero → Reads service benefits → Explores service types → Initiates booking
- Success criteria: Compelling content presentation, smooth scroll experience

## Edge Case Handling

- **Empty Form Submission**: Validate all required fields before submission, highlight missing inputs with clear error messages
- **Invalid Locations**: Show helpful hints for location format, suggest valid inputs
- **Past Date/Time Selection**: Prevent selection of past dates, default to current date/time + 1 hour minimum
- **No Service Selected**: Require service type selection before proceeding, default to most popular option
- **Incomplete Booking**: Persist partial form data so users can return to complete booking

## Design Direction

The design should evoke sophisticated luxury, exclusivity, and timeless elegance - inspired by high-end hospitality and premium lifestyle brands. The aesthetic uses a dramatic black background with crisp white typography and rich gold accents, creating a refined and prestigious atmosphere reminiscent of luxury hotels and exclusive chauffeur services.

## Color Selection

A sophisticated monochromatic palette with rich black backgrounds, crisp whites, and luxurious gold accents.

- **Primary Color**: Deep Black (oklch(0.15 0 0)) - Conveys sophistication, exclusivity, and premium luxury
- **Secondary Colors**: Charcoal (oklch(0.22 0 0)) for subtle backgrounds and layering depth
- **Accent Color**: Rich Gold (oklch(0.75 0.14 75)) - Luxury highlights for CTAs, borders, and emphasis
- **Foreground/Background Pairings**: 
  - Primary Black (oklch(0.15 0 0)): White text (oklch(0.98 0 0)) - Ratio 14.2:1 ✓
  - Accent Gold (oklch(0.75 0.14 75)): Black text (oklch(0.15 0 0)) - Ratio 7.8:1 ✓
  - Card Dark (oklch(0.18 0 0)): White text (oklch(0.98 0 0)) - Ratio 13.1:1 ✓
  - Muted Dark (oklch(0.25 0 0)): Muted White text (oklch(0.65 0 0)) - Ratio 4.9:1 ✓

## Font Selection

Typography should convey timeless elegance and sophistication - refined serif for headlines creating luxury appeal, clean sans-serif for modern readability.

- **Typographic Hierarchy**: 
  - H1 (Hero Title): Cormorant Garamond Bold/56px/tight letter spacing/leading-none - Elegant, sophisticated impact
  - H2 (Section Headers): Cormorant Garamond SemiBold/40px/tight/leading-tight - Refined section divisions
  - H3 (Card Titles): Montserrat SemiBold/24px/normal/leading-snug - Modern, clean
  - Body (Main Content): Montserrat Regular/16px/normal/leading-relaxed - Professional readability
  - Small (Supporting): Montserrat Light/14px/normal/leading-normal - Subtle, refined details
  - Button Text: Montserrat Medium/16px/wider letter spacing - Prestigious CTAs

## Animations

Animations should feel refined and purposeful - subtle entrance effects as content scrolls into view, smooth state transitions for form interactions, and gentle hover effects that respond to user attention without distraction.

## Component Selection

- **Components**: 
  - Card (service showcases with custom shadows and subtle hover lifts)
  - Button (primary with gold accent, secondary with navy outline, large touch targets)
  - Input (clean fields with floating labels, custom focus states)
  - Select (custom dropdown for service type, date/time pickers)
  - Tabs (for switching between one-way/round-trip/hourly booking types)
  - Badge (to highlight service features like "Most Popular")
  - Separator (subtle dividers between content sections)

- **Customizations**: 
  - Custom booking form card with elevated shadow and rounded corners
  - Service cards with image overlays and gradient backgrounds
  - Custom date/time picker with brand colors
  - Hero section with full-width background treatment

- **States**: 
  - Buttons: Subtle scale on hover (1.02x), deeper shadow on hover, smooth color transitions
  - Inputs: Border color shift and subtle glow on focus, smooth label animation
  - Cards: Gentle lift effect (translateY -4px) with enhanced shadow on hover
  - Form steps: Progress indicator showing current step with gold accent

- **Icon Selection**: 
  - Car (vehicle service type indicator)
  - MapPin (location inputs)
  - Calendar/Clock (date/time selection)
  - CheckCircle (service features, confirmation)
  - ArrowRight (navigation, CTAs)
  - Users (passenger count)
  - Shield (safety/insurance highlights)

- **Spacing**: 
  - Container max-width: max-w-7xl
  - Section padding: py-16 lg:py-24
  - Card padding: p-6 lg:p-8
  - Grid gaps: gap-6 lg:gap-8
  - Form field spacing: space-y-4

- **Mobile**: 
  - Single column layout for service cards on mobile, 2-3 columns on desktop
  - Sticky booking CTA button on mobile at bottom of viewport
  - Collapsible form sections to reduce vertical scroll
  - Touch-optimized input sizes (min-h-12)
  - Simplified hero with smaller typography scale
