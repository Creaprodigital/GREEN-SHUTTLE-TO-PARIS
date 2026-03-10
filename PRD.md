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

The design should evoke sophistication, reliability, and modern luxury - the feeling of a first-class travel experience. Clean, spacious layouts with premium photography, elegant typography, and a color palette that conveys trust and exclusivity.

## Color Selection

A sophisticated palette balancing deep navy professionalism with warm gold accents for luxury touches.

- **Primary Color**: Deep Navy (oklch(0.25 0.05 250)) - Conveys trust, professionalism, and premium quality
- **Secondary Colors**: Soft Slate (oklch(0.45 0.02 250)) for supporting elements and backgrounds
- **Accent Color**: Warm Gold (oklch(0.75 0.15 85)) - Luxury highlights for CTAs and important elements
- **Foreground/Background Pairings**: 
  - Primary Navy (oklch(0.25 0.05 250)): White text (oklch(0.98 0 0)) - Ratio 12.8:1 ✓
  - Accent Gold (oklch(0.75 0.15 85)): Deep Navy text (oklch(0.25 0.05 250)) - Ratio 5.2:1 ✓
  - Background Light (oklch(0.98 0 0)): Foreground Navy (oklch(0.25 0.05 250)) - Ratio 12.8:1 ✓
  - Muted Slate (oklch(0.92 0.01 250)): Muted Navy text (oklch(0.45 0.02 250)) - Ratio 6.1:1 ✓

## Font Selection

Typography should balance modern elegance with excellent readability - professional serif for headlines to convey prestige, clean sans-serif for body content.

- **Typographic Hierarchy**: 
  - H1 (Hero Title): Playfair Display Bold/56px/tight letter spacing/leading-none - Creates dramatic impact
  - H2 (Section Headers): Playfair Display SemiBold/36px/tight/leading-tight - Elegant section divisions
  - H3 (Card Titles): Inter SemiBold/24px/normal/leading-snug - Clean, readable
  - Body (Main Content): Inter Regular/16px/normal/leading-relaxed - Maximum readability
  - Small (Supporting): Inter Regular/14px/normal/leading-normal - Subtle details
  - Button Text: Inter Medium/16px/slight letter spacing - Clear CTAs

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
