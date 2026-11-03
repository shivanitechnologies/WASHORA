# WASHORA – Mobile Car Wash & Doorstep Detailing

> **Your Car, Always Shining.**  
> A premium mobile car wash and doorstep detailing web platform featuring dual homepage layouts, complete customer booking & van tracking cockpit, administrator fleet command center, and technician field console.

---

## 🌟 Overview

**WASHORA** (CAR SHINE) is a full-featured frontend web application designed for on-demand doorstep automotive care. Customers can schedule doorstep foam washes, interior deep steam cleaning, 9H ceramic coating, and machine polishing directly at their residential or corporate parking bay.

The platform provides a simulated real-time operational ecosystem backed by an in-browser reactive database engine (`localStorage`), interactive Leaflet.js GPS tracking radar, and Chart.js analytics.

---

## 🚀 Key Features

### 1. Dual Public Experience
- **Home 1 (Classic)**: Clean, high-converting customer flow with trust metrics, before/after transformation slider, service packages, customer reviews, and Chennai postal code checker.
- **Home 2 (Premium Luxury)**: Full-screen cinematic dark aesthetics, editorial typography, 9H ceramic coating spotlight, and concierge membership privileges.
- **Dedicated Service Deep-Dives**: Dynamic vehicle-tier pricing (Hatchback, Sedan, SUV, Luxury) across all 6 core detailing treatments.
- **Chennai Hubs & Map**: Interactive Leaflet map displaying active dispatch hubs (Anna Nagar, Velachery, OMR, Porur, Guindy, Tambaram).
- **Automotive Magazine**: Filterable car maintenance guides and articles.

### 2. Customer Cockpit & Booking
- **5-Step Booking Wizard**: Select Vehicle ➔ Choose Service ➔ Pick Date & Time Slot ➔ Set Address ➔ Confirm & Pay.
- **Live Van GPS Radar**: Real-time simulated Leaflet map tracking the technician's mobile van en route to the customer's doorstep with countdown ETA.
- **Garage Management**: Add, edit, remove vehicles and designate defaults.
- **Order Management & Invoicing**: Status filtering, cancellation, and GST-compliant printable modal tax invoices.

### 3. Admin Command Center
- **Executive BI Overview**: Key metrics (Total Customers, Bookings, Revenue, Active Technicians) and dual-axis Chart.js revenue trajectories.
- **Dispatch Board**: Interactive dispatcher matching unassigned bookings with the nearest available van rig.
- **Fleet & Catalog Management**: Real-time technician rosters, service catalog price editor, coupon manager, and Chennai PIN code turnaround settings.
- **Customer Support Inbox**: Contact submission viewer with an instant doorstep response composer.
- **Review Moderation**: Star rating audits and public approval toggles.

### 4. Mobile Technician Field App
- **Daily Roster & Equipment Checklist**: Today's scheduled visits, 250L demineralized water levels, and Honda generator fuel status.
- **6-Stage Service Workflow**:
  $$\text{Assigned} \longrightarrow \text{Accepted} \longrightarrow \text{On the Way} \longrightarrow \text{Arrived} \longrightarrow \text{In Progress} \longrightarrow \text{Completed}$$
- **Customer GPS & One-Tap Actions**: Direct phone calling, WhatsApp lead links, and Google Maps navigation shortcuts.
- **Proof of Work Checklist**: Digital vehicle condition inspection and photo upload simulation.

---

## 🎨 Visual Identity & Brand Rules

| Token | Color Code | Role |
| :--- | :--- | :--- |
| **Primary** | `#101820` | Midnight Charcoal (Dominant dark surfaces, cards, headers) |
| **Secondary** | `#D6FF36` | Electric Lime (Interactive accents, CTAs, live radar glow) |
| **Light Canvas** | `#F5F6F3` | Soft Pearl White (Light mode background) |
| **Dark Surface**| `#252E35` | Slate Charcoal (Card surfaces in dark mode) |

- **Strict UI Rules**:
  - Maximum of two primary action buttons in header (`Login` and `Book Now`).
  - Standardized Stackly header navigation order ending with `Dashboard`.
  - Equal dimension `40x40px` buttons for Dark/Light mode and RTL direction switches.
  - Form validation with instantaneous toast alerts.

---

## 🛠️ Tech Stack

- **Markup & Styling**: HTML5, CSS3, Tailwind CSS (CDN)
- **Typography**: Google Fonts (*Manrope* & *Inter*)
- **Icons**: Lucide Icons
- **Mapping & Geolocation**: Leaflet.js
- **Data Visualizations**: Chart.js
- **State Management**: Reactive Vanilla JavaScript engine utilizing browser `localStorage`

---

## 📁 Repository Structure

```
├── index.html                   # Classic Home 1
├── home-2.html                  # Premium Cinematic Home 2
├── about.html                   # About Us & 4-Stage Protocol
├── services.html                # Detailing Services Catalog
├── service-details.html         # Dynamic Service Inspector (?id=srv_01..06)
├── pricing.html                 # Single Wash vs Subscription Plans
├── service-areas.html           # Chennai Hubs & Interactive Leaflet Map
├── blog.html                    # Car Care Magazine
├── blog-details.html            # Maintenance Guide
├── contact.html                 # Contact Us & WhatsApp Concierge
│
├── login.html                   # Authentication - Login
├── register.html                # Authentication - Sign Up
├── forgot-password.html         # Password Reset Request
├── reset-password.html          # New Password Setup with Strength Meter
│
├── customer/                    # Customer Portal (12 pages)
│   ├── dashboard.html           # Overview & Active Job Card
│   ├── book-wash.html           # 5-Step Booking Wizard
│   ├── my-bookings.html         # Bookings Ledger & Tax Invoices
│   ├── booking-details.html     # Deep-dive Service Timeline
│   ├── track-technician.html    # Live Leaflet Van GPS Radar
│   ├── my-vehicles.html         # Garage Management
│   ├── service-history.html     # Past Records & Book Again
│   ├── subscriptions.html       # Monthly Wash Plans
│   ├── payments.html            # Payment Receipts & History
│   ├── notifications.html       # Notifications Center
│   ├── profile.html             # Profile & Address Editor
│   └── settings.html            # Theme, RTL, and Channel Toggles
│
├── admin/                       # Admin Command Center (14 pages)
│   ├── dashboard.html           # Operations Overview & Chart.js
│   ├── customers.html           # Customer Directory & Search
│   ├── bookings.html            # Master Bookings Console
│   ├── technicians.html         # Van Fleet Directory
│   ├── assign-technician.html   # Smart Dispatcher Console
│   ├── services.html            # Services Catalog Manager
│   ├── pricing.html             # Tier Packages & Coupons
│   ├── subscriptions.html       # Recurring Subscribers & MRR
│   ├── service-areas.html       # Chennai PIN Codes Manager
│   ├── payments.html            # Financial Settlements Ledger
│   ├── reviews.html             # Review Moderation Console
│   ├── messages.html            # Inquiries & Support Reply Composer
│   ├── analytics.html           # BI Analytics & SLA Reports
│   └── settings.html            # Operational Parameters & Tax Rates
│
├── technician/                  # Technician Field Console (3 pages)
│   ├── dashboard.html           # Mobile Cockpit & Today's Shift
│   ├── assigned-jobs.html       # Jobs Roster & Direct Navigation
│   └── job-details.html         # 6-Stage Workflow Progression Screen
│
├── legal/                       # Compliance & Policies (4 pages)
│   ├── privacy-policy.html      # Privacy & Vehicle Photo Policy
│   ├── terms.html               # Terms of Service & Rig Guarantee
│   ├── cancellation-policy.html # Cancellation & Rain Guarantee
│   └── faq.html                 # Categorized Accordion FAQ
│
├── errors/                      # Special Pages (3 pages)
│   ├── 404.html                 # Custom 404 Not Found
│   ├── coming-soon.html         # PPF Studio Launch with Live Countdown
│   └── maintenance.html         # Server Maintenance Notice
│
└── assets/
    ├── css/                     # style.css, dashboard.css, animations.css
    └── js/                      # storage.js, theme.js, rtl.js, main.js
```

---

## 🚦 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shivanitechnologies/WASHORA.git
   cd WASHORA
   ```

2. **Open in Browser**:
   - Double click `index.html` or open with Live Server in VS Code.
   - No build step, Node dependencies, or server setup required.

---

## 📄 License

© 2026 CAR SHINE Technologies Pvt Ltd. All rights reserved.
