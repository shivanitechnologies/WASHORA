/**
 * CAR SHINE - Central LocalStorage Data Engine
 * Persists and initializes application mock state.
 */

const STORAGE_KEYS = {
  USER: 'cs_user',
  VEHICLES: 'cs_vehicles',
  SERVICES: 'cs_services',
  SUBSCRIPTIONS: 'cs_subscriptions',
  BOOKINGS: 'cs_bookings',
  TECHNICIANS: 'cs_technicians',
  SERVICE_AREAS: 'cs_service_areas',
  NOTIFICATIONS: 'cs_notifications',
  REVIEWS: 'cs_reviews',
  MESSAGES: 'cs_messages',
  SETTINGS: 'cs_settings',
  THEME: 'cs_theme',
  RTL: 'cs_rtl'
};

// Initial Sample Data
const DEFAULT_USER = {
  id: 'usr_pravin',
  name: 'Pravin Kumar',
  email: 'pravin@carshine.com',
  phone: '+91 98401 23456',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  address: {
    flat: 'Flat 4B, Emerald Heights',
    street: '2nd Avenue, Anna Nagar West',
    area: 'Anna Nagar',
    city: 'Chennai',
    pincode: '600040'
  },
  role: 'customer'
};

const DEFAULT_VEHICLES = [
  {
    id: 'veh_01',
    brand: 'Honda',
    model: 'City ZX',
    regNumber: 'TN 09 CB 1234',
    type: 'Sedan',
    color: 'Platinum White Pearl',
    isDefault: true,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'veh_02',
    brand: 'Hyundai',
    model: 'Creta SX(O)',
    regNumber: 'TN 09 AZ 8899',
    type: 'SUV',
    color: 'Titan Grey',
    isDefault: false,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'veh_03',
    brand: 'BMW',
    model: '3 Series M-Sport',
    regNumber: 'TN 07 BE 0007',
    type: 'Luxury',
    color: 'Portimao Blue',
    isDefault: false,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80'
  }
];

const DEFAULT_SERVICES = [
  {
    id: 'srv_01',
    name: 'Exterior Wash',
    slug: 'exterior-wash',
    tagline: 'High pressure foam wash and spot-free body dry',
    description: 'Complete exterior body wash using pH-neutral snow foam, gentle microfiber wash mitts, wheel degreasing, tyre dressing, and streak-free window wipe down.',
    price: 499,
    duration: '35 - 45 Mins',
    badge: 'Popular for Daily Drive',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
    included: [
      'High-pressure snow foam wash',
      'Microfiber hand wash and dry',
      'Wheel arches & rim degreasing',
      'Tyre shine & gloss dressing',
      'Streak-free exterior glass clean'
    ]
  },
  {
    id: 'srv_02',
    name: 'Interior Cleaning',
    slug: 'interior-cleaning',
    tagline: 'Deep vacuuming, sanitization, and upholstery care',
    description: 'Thorough interior cleaning tackling every corner. Deep vacuuming of floor mats, seats, boot, dashboard UV protection dressing, AC vent steam sanitization, and premium cabin fragrance.',
    price: 699,
    duration: '45 - 60 Mins',
    badge: 'Fresh & Hygienic',
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80',
    included: [
      'Comprehensive cabin & boot vacuuming',
      'Dashboard & door trim UV protection',
      'AC vent antibacterial cleaning',
      'Fabric / leather seat gentle wipe',
      'Long-lasting fragrance burst'
    ]
  },
  {
    id: 'srv_03',
    name: 'Car Polishing',
    slug: 'car-polishing',
    tagline: 'Swirl removal and mirror-like glossy finish',
    description: 'Single-stage dual-action machine polishing designed to eliminate light spider-web swirls, oxidation, and restore intense color depth and showroom gloss.',
    price: 1199,
    duration: '60 - 75 Mins',
    badge: 'Gloss Booster',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
    included: [
      'Clay bar decontamination prep',
      'Dual action machine glaze polish',
      'Swirl & minor scratch reduction',
      'Hydrophobic paint sealant application',
      'Chrome & emblem buffing'
    ]
  },
  {
    id: 'srv_04',
    name: 'Deep Cleaning',
    slug: 'deep-cleaning',
    tagline: 'Intensive restoration for neglected vehicles',
    description: 'A rigorous bumper-to-bumper deep scrub. Removes deep-seated stains, pet hair, dirt buildup, engine bay wipe-down, and heavy mud grime restoration.',
    price: 1499,
    duration: '90 - 110 Mins',
    badge: 'Heavy Duty',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    included: [
      'Hot water seat & carpet extraction',
      'Engine bay cosmetic degrease',
      'Door jambs & boot lid deep degrease',
      'Roof headliner delicate spot treatment',
      'Under-chassis wheel arch spray'
    ]
  },
  {
    id: 'srv_05',
    name: 'Full Car Detailing',
    slug: 'full-car-detailing',
    tagline: 'Complete 360° interior and exterior transformation',
    description: 'Our signature flagship car care treatment. Combines our premium exterior foam wash, 2-stage paint correction, interior hot-water extraction, leather conditioning, and polymer sealant.',
    price: 2999,
    duration: '150 - 180 Mins',
    badge: 'Customer Choice ★ 4.9',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',
    included: [
      'Complete exterior snow foam & de-tar',
      '2-stage paint compound & polish',
      'Deep steam upholstery extraction',
      'Matte finish leather nourishment',
      'Ceramic spray sealant (up to 3 months protection)'
    ]
  },
  {
    id: 'srv_06',
    name: 'Ceramic Coating',
    slug: 'ceramic-coating',
    tagline: '9H nano-ceramic armor for ultimate gloss & protection',
    description: 'Professional grade 9H nano-coating providing extreme hydrophobic water beading, chemical resistance, UV protection, and long-lasting glass-like brilliance.',
    price: 7999,
    duration: 'Full Day Service',
    badge: 'Ultimate Protection',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    included: [
      '3-stage swirl & defect correction',
      '9H Ceramic Nano coating (2 coats)',
      'Windshield rain-repellent coating',
      'Alloy wheel ceramic shield',
      '1 Year warranty with maintenance guide'
    ]
  }
];

const DEFAULT_TECHNICIANS = [
  {
    id: 'tech_01',
    name: 'Ramesh Kumar',
    phone: '+91 94441 55678',
    rating: 4.9,
    totalJobs: 342,
    vanNumber: 'TN 09 AZ 4521',
    vanType: 'Custom Detailing Mobile Van',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    status: 'On Job',
    currentLocation: 'Anna Nagar 2nd Ave, Chennai',
    coordinates: { lat: 13.0850, lng: 80.2101 }
  },
  {
    id: 'tech_02',
    name: 'Suresh Venkatesh',
    phone: '+91 98842 11223',
    rating: 4.8,
    totalJobs: 285,
    vanNumber: 'TN 10 BX 8812',
    vanType: 'Eco Mobile Wash Rig',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    status: 'Available',
    currentLocation: 'Velachery Bypass Road',
    coordinates: { lat: 12.9815, lng: 80.2180 }
  },
  {
    id: 'tech_03',
    name: 'Rajesh Muthu',
    phone: '+91 97909 33445',
    rating: 5.0,
    totalJobs: 410,
    vanNumber: 'TN 02 KC 3390',
    vanType: 'Master Detailing Van',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    status: 'Available',
    currentLocation: 'OMR Perungudi Toll',
    coordinates: { lat: 12.9654, lng: 80.2461 }
  },
  {
    id: 'tech_04',
    name: 'Karthik Subramanian',
    phone: '+91 99403 77889',
    rating: 4.7,
    totalJobs: 198,
    vanNumber: 'TN 05 DM 7721',
    vanType: 'Doorstep Rapid Wash Van',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    status: 'Offline',
    currentLocation: 'Tambaram East',
    coordinates: { lat: 12.9249, lng: 80.1478 }
  }
];

const DEFAULT_BOOKINGS = [
  {
    id: 'CS1024',
    customer: {
      name: 'Pravin Kumar',
      phone: '+91 98401 23456',
      email: 'pravin@carshine.com'
    },
    vehicle: {
      brand: 'Honda',
      model: 'City ZX',
      regNumber: 'TN 09 CB 1234',
      type: 'Sedan'
    },
    service: 'Full Car Detailing',
    servicePrice: 2999,
    date: '2026-11-03',
    timeSlot: '10:30 AM - 01:00 PM',
    address: 'Flat 4B, Emerald Heights, 2nd Avenue, Anna Nagar West, Chennai - 600040',
    status: 'On the Way', // Assigned, Accepted, On the Way, Arrived, In Progress, Completed, Cancelled
    technicianId: 'tech_01',
    paymentMethod: 'UPI / Online Paid',
    paymentStatus: 'Paid',
    etaMinutes: 12,
    createdAt: '2026-11-03T08:15:00.000Z'
  },
  {
    id: 'CS1023',
    customer: {
      name: 'Pravin Kumar',
      phone: '+91 98401 23456',
      email: 'pravin@carshine.com'
    },
    vehicle: {
      brand: 'Hyundai',
      model: 'Creta SX(O)',
      regNumber: 'TN 09 AZ 8899',
      type: 'SUV'
    },
    service: 'Interior Cleaning',
    servicePrice: 699,
    date: '2026-11-05',
    timeSlot: '03:00 PM - 04:30 PM',
    address: 'Flat 4B, Emerald Heights, 2nd Avenue, Anna Nagar West, Chennai - 600040',
    status: 'Confirmed',
    technicianId: 'tech_02',
    paymentMethod: 'Pay on Doorstep (Cash/UPI)',
    paymentStatus: 'Pending',
    etaMinutes: null,
    createdAt: '2026-11-02T14:20:00.000Z'
  },
  {
    id: 'CS1019',
    customer: {
      name: 'Pravin Kumar',
      phone: '+91 98401 23456',
      email: 'pravin@carshine.com'
    },
    vehicle: {
      brand: 'Honda',
      model: 'City ZX',
      regNumber: 'TN 09 CB 1234',
      type: 'Sedan'
    },
    service: 'Exterior Wash',
    servicePrice: 499,
    date: '2026-10-24',
    timeSlot: '09:00 AM - 10:00 AM',
    address: 'Flat 4B, Emerald Heights, 2nd Avenue, Anna Nagar West, Chennai - 600040',
    status: 'Completed',
    technicianId: 'tech_01',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    ratingGiven: 5,
    createdAt: '2026-10-23T11:00:00.000Z'
  },
  {
    id: 'CS1015',
    customer: {
      name: 'Pravin Kumar',
      phone: '+91 98401 23456',
      email: 'pravin@carshine.com'
    },
    vehicle: {
      brand: 'BMW',
      model: '3 Series M-Sport',
      regNumber: 'TN 07 BE 0007',
      type: 'Luxury'
    },
    service: 'Car Polishing',
    servicePrice: 1199,
    date: '2026-10-10',
    timeSlot: '04:00 PM - 05:30 PM',
    address: 'Flat 4B, Emerald Heights, 2nd Avenue, Anna Nagar West, Chennai - 600040',
    status: 'Completed',
    technicianId: 'tech_03',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    ratingGiven: 5,
    createdAt: '2026-10-09T18:00:00.000Z'
  }
];

const DEFAULT_SERVICE_AREAS = [
  { pin: '600040', area: 'Anna Nagar', city: 'Chennai', status: 'Active', turnaround: 'Within 45 Mins' },
  { pin: '600042', area: 'Velachery', city: 'Chennai', status: 'Active', turnaround: 'Within 30 Mins' },
  { pin: '600045', area: 'Tambaram', city: 'Chennai', status: 'Active', turnaround: 'Within 45 Mins' },
  { pin: '600116', area: 'Porur', city: 'Chennai', status: 'Active', turnaround: 'Within 40 Mins' },
  { pin: '600032', area: 'Guindy', city: 'Chennai', status: 'Active', turnaround: 'Within 30 Mins' },
  { pin: '600096', area: 'OMR (Old Mahabalipuram Rd)', city: 'Chennai', status: 'Active', turnaround: 'Within 35 Mins' },
  { pin: '600017', area: 'T. Nagar', city: 'Chennai', status: 'Active', turnaround: 'Within 30 Mins' },
  { pin: '600020', area: 'Adyar', city: 'Chennai', status: 'Active', turnaround: 'Within 30 Mins' },
  { pin: '600034', area: 'Nungambakkam', city: 'Chennai', status: 'Active', turnaround: 'Within 35 Mins' },
  { pin: '600083', area: 'K.K. Nagar & Ashok Nagar', city: 'Chennai', status: 'Active', turnaround: 'Within 30 Mins' }
];

const DEFAULT_SUBSCRIPTION = {
  planId: 'plan_premium',
  planName: 'Premium Monthly Plan',
  startDate: '2026-10-15',
  expiryDate: '2026-11-14',
  totalWashes: 4,
  remainingWashes: 3,
  price: 2999,
  billingCycle: 'Monthly',
  autoRenew: true,
  savingsPercent: 25
};

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif_01',
    title: 'Technician on the way!',
    message: 'Ramesh Kumar (Van: TN 09 AZ 4521) is en route to Anna Nagar for your Full Detailing session. ETA: 12 mins.',
    time: '10 mins ago',
    read: false,
    link: 'track-technician.html?id=CS1024',
    icon: 'truck'
  },
  {
    id: 'notif_02',
    title: 'Booking Confirmed (#CS1023)',
    message: 'Interior Cleaning scheduled for Hyundai Creta on Nov 5, 2026 at 03:00 PM.',
    time: 'Yesterday',
    read: true,
    link: 'my-bookings.html',
    icon: 'calendar-check'
  },
  {
    id: 'notif_03',
    title: 'Subscription Washed Used',
    message: '1 wash deducted from your Premium Monthly Plan. 3 washes remaining this month.',
    time: 'Oct 24, 2026',
    read: true,
    link: 'subscriptions.html',
    icon: 'award'
  }
];

const DEFAULT_REVIEWS = [
  {
    id: 'rev_01',
    name: 'Vikram Sundaram',
    role: 'Audi A4 Owner, Chennai',
    service: 'Full Car Detailing',
    rating: 5,
    text: 'CAR SHINE completely blew away my expectations. They arrived with full water tank & high power equipment right in my apartment parking. Not a single drip left behind!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    date: '2 days ago',
    status: 'Approved'
  },
  {
    id: 'rev_02',
    name: 'Ananya Deshmukh',
    role: 'Kia Seltos Owner, Anna Nagar',
    service: 'Interior Cleaning',
    rating: 5,
    text: 'The convenience is unmatched. While I was in a Zoom meeting, Ramesh polished and vacuumed my car to showroom shine. The Electric Lime branding is super slick too!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    date: '1 week ago',
    status: 'Approved'
  },
  {
    id: 'rev_03',
    name: 'Karthik Raja',
    role: 'BMW 5 Series Owner, OMR',
    service: 'Car Polishing',
    rating: 5,
    text: 'Subscribed to the Monthly Wash plan. 4 washes per month doorstep at just ₹2,999 is unbeatable value for high quality detailing chemicals and microfiber care.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    date: '2 weeks ago',
    status: 'Approved'
  },
  {
    id: 'rev_04',
    name: 'Deepak Varma',
    role: 'Harrier Dark Edition Owner',
    service: 'Ceramic Coating',
    rating: 4,
    text: 'Great shine and hydrophobic beading. The water just rolls off the hood! Only reason for 4 stars was technician arrived 10 mins past window due to metro traffic.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    date: '3 weeks ago',
    status: 'Pending'
  }
];

const DEFAULT_MESSAGES = [
  {
    id: 'msg_01',
    name: 'Kavitha Ramachandran',
    email: 'kavitha.r@gmail.com',
    phone: '+91 98412 34567',
    subject: 'Corporate Fleet Washing in Guindy DLF Tech Park',
    message: 'Hello CAR SHINE team, we have 15 company vehicles parked in DLF Cybercity. Do you offer bulk corporate packages or bi-weekly subscriptions for company cars?',
    date: '2026-11-02 03:45 PM',
    status: 'Unread',
    replied: false,
    reply: null
  },
  {
    id: 'msg_02',
    name: 'Santhosh Balan',
    email: 'santhosh.b@outlook.com',
    phone: '+91 94451 98765',
    subject: 'Ceramic Coating Inquiry for New Thar Roxx',
    message: 'I took delivery of my Mahindra Thar Roxx last week. Can you do the 9H ceramic coating at my independent house in Mogappair East? What power socket is needed?',
    date: '2026-11-01 11:20 AM',
    status: 'Replied',
    replied: true,
    reply: 'Our mobile van is 100% self-powered with Honda ultra-silent generator and 250L demineralized water tank! No power/water hookup needed.'
  },
  {
    id: 'msg_03',
    name: 'Dr. Arun Kumar',
    email: 'dr.arun@apollohospitals.org',
    phone: '+91 97890 12345',
    subject: 'Water Spot Removal on German Paint',
    message: 'Hard water residue on my Mercedes C220d panoramic roof. Will your Full Detailing package remove acid rain etchings without damaging the glass?',
    date: '2026-10-30 05:10 PM',
    status: 'Read',
    replied: false,
    reply: null
  }
];

const DEFAULT_SETTINGS = {
  brandName: 'CAR SHINE',
  tagline: 'Your Car, Always Shining.',
  supportEmail: 'support@carshine.com',
  dispatchPhone: '+91 98401 99999',
  headquarters: 'Anna Nagar West, Chennai, Tamil Nadu - 600040',
  operatingHours: '07:00 AM - 08:00 PM',
  taxRatePercent: 18,
  currency: 'INR (₹)',
  maxRadiusKm: 35,
  autoAssignTechnicians: true,
  smsNotifications: true,
  emailInvoices: true,
  rainGuaranteeHours: 24
};

// Initialize Storage
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(DEFAULT_VEHICLES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(DEFAULT_BOOKINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TECHNICIANS)) {
    localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(DEFAULT_TECHNICIANS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SERVICE_AREAS)) {
    localStorage.setItem(STORAGE_KEYS.SERVICE_AREAS, JSON.stringify(DEFAULT_SERVICE_AREAS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS)) {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(DEFAULT_SUBSCRIPTION));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
  }
  const existingMsgs = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  if (!existingMsgs || JSON.parse(existingMsgs).length === 0) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(DEFAULT_MESSAGES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
}

// Data Access API
const StorageService = {
  getUser: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}'),
  saveUser: (user) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),

  getVehicles: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES) || '[]'),
  addVehicle: (vehicle) => {
    const list = StorageService.getVehicles();
    vehicle.id = 'veh_' + Date.now();
    if (vehicle.isDefault) {
      list.forEach(v => v.isDefault = false);
    }
    list.push(vehicle);
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(list));
    return vehicle;
  },
  deleteVehicle: (id) => {
    let list = StorageService.getVehicles();
    list = list.filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(list));
  },
  setDefaultVehicle: (id) => {
    const list = StorageService.getVehicles();
    list.forEach(v => v.isDefault = (v.id === id));
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(list));
  },

  getServices: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]'),
  getServiceById: (id) => StorageService.getServices().find(s => s.id === id || s.slug === id),

  getBookings: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]'),
  getBookingById: (id) => StorageService.getBookings().find(b => b.id === id),
  addBooking: (bookingData) => {
    const bookings = StorageService.getBookings();
    const newId = 'CS' + (1025 + bookings.length);
    const newBooking = {
      id: newId,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      ...bookingData
    };
    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // Also trigger notification
    StorageService.addNotification({
      title: `Booking Confirmed (#${newId})`,
      message: `Your ${newBooking.service} for ${newBooking.vehicle.brand} ${newBooking.vehicle.model} is booked for ${newBooking.date} at ${newBooking.timeSlot}.`,
      link: `track-technician.html?id=${newId}`,
      icon: 'calendar-check'
    });

    return newBooking;
  },
  updateBookingStatus: (id, newStatus) => {
    const bookings = StorageService.getBookings();
    const item = bookings.find(b => b.id === id);
    if (item) {
      item.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

      StorageService.addNotification({
        title: `Service Status: ${newStatus}`,
        message: `Booking #${id} status changed to ${newStatus}.`,
        link: `track-technician.html?id=${id}`,
        icon: 'bell'
      });
    }
  },

  getTechnicians: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.TECHNICIANS) || '[]'),
  getTechnicianById: (id) => StorageService.getTechnicians().find(t => t.id === id),
  updateTechnicianStatus: (id, status) => {
    const list = StorageService.getTechnicians();
    const tech = list.find(t => t.id === id);
    if (tech) {
      tech.status = status;
      localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(list));
    }
  },
  getTechnicianJobs: (techId = 'tech_01') => {
    const bookings = StorageService.getBookings();
    return bookings.filter(b => b.technicianId === techId || (!b.technicianId && techId === 'tech_01'));
  },

  getServiceAreas: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICE_AREAS) || '[]'),
  checkAreaAvailability: (query) => {
    const q = (query || '').trim().toLowerCase();
    const areas = StorageService.getServiceAreas();
    return areas.find(a => a.pin === q || a.area.toLowerCase().includes(q));
  },

  getSubscription: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS) || '{}'),
  
  getNotifications: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'),
  addNotification: (item) => {
    const list = StorageService.getNotifications();
    list.unshift({
      id: 'notif_' + Date.now(),
      time: 'Just now',
      read: false,
      ...item
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },
  markAllNotificationsRead: () => {
    const list = StorageService.getNotifications();
    list.forEach(n => n.read = true);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  getReviews: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]'),
  toggleReviewStatus: (id) => {
    const list = StorageService.getReviews();
    const rev = list.find(r => r.id === id);
    if (rev) {
      rev.status = (rev.status === 'Approved' ? 'Pending' : 'Approved');
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(list));
    }
    return rev;
  },
  deleteReview: (id) => {
    let list = StorageService.getReviews();
    list = list.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(list));
  },
  addReview: (review) => {
    const list = StorageService.getReviews();
    const newRev = {
      id: 'rev_' + Date.now(),
      date: 'Just now',
      status: 'Approved',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      ...review
    };
    list.unshift(newRev);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(list));
    return newRev;
  },

  getMessages: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]'),
  addMessage: (msg) => {
    const list = StorageService.getMessages();
    list.unshift({
      id: 'msg_' + Date.now(),
      date: new Date().toLocaleString(),
      status: 'Unread',
      replied: false,
      reply: null,
      ...msg
    });
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list));
  },
  updateMessageStatus: (id, status) => {
    const list = StorageService.getMessages();
    const m = list.find(item => item.id === id);
    if (m) {
      m.status = status;
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list));
    }
  },
  replyMessage: (id, replyText) => {
    const list = StorageService.getMessages();
    const m = list.find(item => item.id === id);
    if (m) {
      m.status = 'Replied';
      m.replied = true;
      m.reply = replyText;
      m.replyDate = new Date().toLocaleString();
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list));
    }
  },
  deleteMessage: (id) => {
    let list = StorageService.getMessages();
    list = list.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list));
  },

  getSettings: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(DEFAULT_SETTINGS)),
  saveSettings: (settings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
};

// Initialize immediately on script evaluation
initStorage();
