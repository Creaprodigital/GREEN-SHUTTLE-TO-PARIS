# Planning Guide

Green Shuttle To Paris - A premium chauffeur service booking platform that enables users to reserve professional transportation to Paris and beyond with an elegant, trustworthy interface. Now includes comprehensive client and admin portals for booking management.

**Experience Qualities**: 
1. **Luxurious** - The interface should feel refined and premium, reflecting the high-end nature of the service
2. **Trustworthy** - Clean, professional design that builds confidence in the booking process
3. **Effortless** - Streamlined booking flow that makes reserving a ride feel simple and intuitive

**Complexity Level**: Complex Application (advanced functionality with multiple views)
This is a comprehensive booking platform with multi-step forms, client/admin authentication, dashboard views for booking management, and persistent data storage. It requires state management, role-based access control, and CRUD operations on bookings.

## Essential Features

**Booking Form**
- Functionality: Multi-step form collecting pickup location, destination, date/time, service type, and user email
- Purpose: Core conversion point - enables users to request a chauffeur service
- Trigger: User interaction with prominent booking widget on homepage
- Progression: Select service type → Enter pickup location → Enter destination → Choose date/time → Enter email → Submit request
- Success criteria: Form validates inputs, stores booking data with pending status, displays confirmation message

**Client Authentication & Dashboard**
- Functionality: Email-based login system allowing clients to access their personal booking dashboard
- Purpose: Enable users to view and track all their reservations in one place
- Trigger: User clicks "Client / Admin" button and logs in as client
- Progression: Enter email → Access dashboard → View all personal bookings with status, details, and pricing
- Success criteria: Users can see only their own bookings filtered by email, with clear status indicators

**Admin Dashboard**
- Functionality: Administrative panel with full booking management capabilities
- Purpose: Allow administrators to view all bookings, update statuses, set prices, and manage reservations
- Trigger: User logs in with admin checkbox selected
- Progression: Enter email + check admin → Access admin panel → View/search/filter all bookings → Update status/price → Delete bookings
- Success criteria: Admin can manage all bookings, filter by status, search by details, modify booking information in real-time

**Booking Management System**
- Functionality: Persistent storage and CRUD operations for all bookings
- Purpose: Maintain booking history and allow modifications from admin side
- Trigger: Booking creation from homepage form or updates from admin dashboard
- Progression: Create booking → Store with unique ID → Allow admin updates → Reflect changes in client/admin views
- Success criteria: All bookings persist between sessions, updates are immediate, data integrity maintained

**Status Tracking**
- Functionality: Visual status indicators for bookings (pending, confirmed, completed, cancelled)
- Purpose: Provide clear visibility into booking lifecycle for both clients and admins
- Trigger: Booking creation or admin status update
- Progression: Initial "pending" status → Admin confirms → Changes to "confirmed" → Eventually "completed" or "cancelled"
- Success criteria: Color-coded badges, status changes reflected in real-time, intuitive status workflow

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

**404 Error Page**
- Functionality: Elegant error page displayed when users navigate to non-existent routes
- Purpose: Maintain brand experience even during errors and guide users back to valid pages
- Trigger: User attempts to access invalid URL or broken link
- Progression: View 404 message → See helpful navigation options → Return to home, services, or contact
- Success criteria: Clear error communication, maintains luxury aesthetic, provides easy navigation back to site

## Edge Case Handling

- **Empty Form Submission**: Validate all required fields (including email) before submission, highlight missing inputs with clear error messages
- **Invalid Email Format**: Check for valid email format, show helpful error if @ symbol missing or format incorrect
- **Unauthorized Access**: Login required to access client/admin dashboards, redirect to login if attempting direct access
- **No Bookings Found**: Display empty state with helpful message and icon when user has no bookings
- **Admin vs Client Access**: Clearly differentiate admin capabilities (full CRUD) from client view (read-only)
- **Concurrent Updates**: Handle potential conflicts when admin updates booking while client is viewing
- **Invalid Price Input**: Validate numeric price input, only accept positive numbers
- **Search/Filter No Results**: Show appropriate message when filters return no bookings
- **Past Date/Time Selection**: Prevent selection of past dates in booking form, default to current date/time + 1 hour minimum
- **Logout Confirmation**: Clear user session and redirect to home when logging out
- **Incomplete Booking**: Persist partial form data so users can return to complete booking
- **Invalid Navigation**: Display 404 page for broken links or non-existent routes with branded design and easy navigation back to site

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
  - Card (service showcases, booking cards in dashboards with custom shadows and subtle hover lifts)
  - Button (primary with gold accent for CTAs, secondary with outline, logout/login actions)
  - Input (clean fields with floating labels, custom focus states, email/text/date/time types)
  - Select (custom dropdown for service type, status updates, filters, passengers)
  - Tabs (for switching between one-way/round-trip/hourly booking types)
  - Badge (status indicators with color coding: yellow=pending, green=confirmed, blue=completed, red=cancelled)
  - Separator (subtle dividers between content sections)
  - Table-like Card Grid (for displaying booking information in structured format)
  - Search & Filter Controls (admin dashboard filtering by status and search term)

- **Customizations**: 
  - Custom booking form card with elevated shadow and rounded corners
  - Service cards with image overlays and gradient backgrounds
  - Custom date/time picker with brand colors
  - Hero section with full-width background treatment

- **States**: 
  - Buttons: Subtle scale on hover (1.02x), deeper shadow on hover, smooth color transitions, fixed position "Client/Admin" button in top-right
  - Inputs: Border color shift and subtle glow on focus, smooth label animation, icon integration on left side
  - Cards: Gentle lift effect (translateY -4px) with enhanced shadow on hover, status-based border coloring
  - Badges: Color-coded by status with semi-transparent backgrounds and matching borders
  - Form steps: Progress indicator showing current step with gold accent
  - Login: Checkbox for admin mode selection
  - Dashboard Navigation: Header with user info and logout button

- **Icon Selection**: 
  - Car (vehicle service type indicator, empty states)
  - MapPin (location inputs - filled and outline variants)
  - Calendar/Clock (date/time selection)
  - CheckCircle (service features, confirmation, status updates)
  - XCircle (cancellation, errors)
  - ArrowRight (navigation, CTAs, form progression)
  - Users/User (passenger count, user profile, authentication)
  - Shield (safety/insurance highlights)
  - SignIn/SignOut (authentication actions)
  - EnvelopeSimple (email input field)
  - Trash (delete booking action in admin)

- **Spacing**: 
  - Container max-width: max-w-7xl
  - Section padding: py-16 lg:py-24
  - Card padding: p-6 lg:p-8
  - Grid gaps: gap-6 lg:gap-8
  - Form field spacing: space-y-4

- **Mobile**: 
  - Single column layout for service cards and booking details on mobile, 2 columns on desktop
  - Fixed "Client/Admin" button remains accessible in top-right corner
  - Collapsible form sections to reduce vertical scroll
  - Touch-optimized input sizes (min-h-12)
  - Simplified hero with smaller typography scale
  - Dashboard tables stack vertically on mobile
  - Statistics cards in admin dashboard: 2 columns on mobile, 5 columns on desktop
  - Filter controls stack vertically on mobile devices
