import { reactive, ref, computed } from 'vue'

// Hub Coordinates mapping
export const HUBS = {
  dubai: { x: 220, y: 150, name: 'Dubai Logistics Hub' },
  sharjah: { x: 250, y: 120, name: 'Sharjah Depot' },
  abuDhabi: { x: 80, y: 250, name: 'Abu Dhabi Branch' },
}

// Initial mock data
const initialOrders = [
  {
    id: 'ORD-1001',
    customer: 'Wared Logistics',
    type: 'LTL',
    tempRequirement: 'Chilled',
    stops: [
      { id: 'S1', address: 'Dubai Marina, Marina Heights Tower', contactName: 'Chef Francois', contactPhone: '+971 50 111 2222', weight: 450, volume: 1.2, status: 'Delivered' },
      { id: 'S2', address: 'Downtown Dubai, Address Boulevard', contactName: 'Chef Mario', contactPhone: '+971 50 222 3333', weight: 300, volume: 0.8, status: 'Delivered' }
    ],
    status: 'Delivered',
    createdAt: '2026-06-14T08:30:00Z',
    totalWeight: 750,
    totalVolume: 2.0,
    price: 1250,
    reference_number: 'REF-882910',
    pickup_address: 'Dubai Logistics Hub',
    drop_address: 'Downtown Dubai, Address Boulevard',
    is_pickup_gatepass_required: true,
    is_drop_gatepass_required: false,
    source_branch: 'Dubai Hub',
    destination_branch: 'Dubai Hub',
    current_branch: 'Dubai Hub',
    next_branch: '',
    execution_date: '2026-06-14',
    collected_at: '2026-06-14T09:00:00Z',
    collected_by: 'Faisal Khan',
    delivered_at: '2026-06-14T11:45:00Z',
    delivered_by: 'Faisal Khan',
    completed_at: '2026-06-14T11:50:00Z',
    completed_by: 'Faisal Khan',
    ready_for_invoice_at: '2026-06-14T11:55:00Z',
    ready_for_invoice_by: 'Admin Desk',
    invoice_generated_at: '2026-06-14T12:00:00Z',
    order_rate: 1250,
    payment_type: 'Credit',
    rate_type: 'Per Trip',
    goods_value: 15000,
    is_cross_docking: false,
    expected_pickup_date: '2026-06-14',
    expected_delivery_date: '2026-06-14',
    is_partially_collected: false,
    is_partially_delivered: false,
    cancellation_remarks: '',
    order_remarks: 'Chilled delivery - food service items',
    chargeable_weight: 750,
    gross_weight: 800,
    gross_volumetric_weight: 334,
    oda_charge: 0,
    is_delivery_note_required: true,
    manifest_no: 'MNF-102941'
  },
  {
    id: 'ORD-1002',
    customer: 'Lulu Hypermarket',
    type: 'FTL',
    tempRequirement: 'Dry',
    stops: [
      { id: 'S3', address: 'Abu Dhabi, Mushrif Mall Outlet', contactName: 'Mr. Nader', contactPhone: '+971 52 444 5555', weight: 4500, volume: 12.0, status: 'Pending' }
    ],
    status: 'Planned',
    createdAt: '2026-06-15T07:15:00Z',
    totalWeight: 4500,
    totalVolume: 12.0,
    price: 3400,
    reference_number: 'REF-472019',
    pickup_address: 'Dubai Logistics Hub',
    drop_address: 'Abu Dhabi, Mushrif Mall Outlet',
    is_pickup_gatepass_required: false,
    is_drop_gatepass_required: true,
    source_branch: 'Dubai Hub',
    destination_branch: 'Abu Dhabi Branch',
    current_branch: 'Dubai Hub',
    next_branch: 'Abu Dhabi Branch',
    execution_date: '2026-06-15',
    order_rate: 3400,
    payment_type: 'Credit',
    rate_type: 'Per Ton',
    goods_value: 85000,
    is_cross_docking: true,
    expected_pickup_date: '2026-06-15',
    expected_delivery_date: '2026-06-16',
    is_partially_collected: false,
    is_partially_delivered: false,
    cancellation_remarks: '',
    order_remarks: 'Bulk grocery delivery',
    chargeable_weight: 4500,
    gross_weight: 4650,
    gross_volumetric_weight: 2004,
    oda_charge: 150,
    is_delivery_note_required: true,
    manifest_no: 'MNF-490182'
  },
  {
    id: 'ORD-1003',
    customer: 'Carrefour',
    type: 'LTL',
    tempRequirement: 'Dry',
    stops: [
      { id: 'S4', address: 'Sharjah City Centre', contactName: 'Mr. Shady', contactPhone: '+971 54 777 8888', weight: 1200, volume: 3.5, status: 'Pending' },
      { id: 'S5', address: 'Sharjah Al Majaz Waterfront', contactName: 'Chef Omar', contactPhone: '+971 54 888 9999', weight: 800, volume: 2.2, status: 'Pending' }
    ],
    status: 'Planned',
    createdAt: '2026-06-15T09:00:00Z',
    totalWeight: 2000,
    totalVolume: 5.7,
    price: 1850,
    reference_number: 'REF-902910',
    pickup_address: 'Dubai Logistics Hub',
    drop_address: 'Sharjah Al Majaz Waterfront',
    is_pickup_gatepass_required: false,
    is_drop_gatepass_required: false,
    source_branch: 'Dubai Hub',
    destination_branch: 'Sharjah Depot',
    current_branch: 'Dubai Hub',
    next_branch: 'Sharjah Depot',
    execution_date: '2026-06-15',
    order_rate: 1850,
    payment_type: 'Credit',
    rate_type: 'Per Trip',
    goods_value: 30000,
    is_cross_docking: false,
    expected_pickup_date: '2026-06-15',
    expected_delivery_date: '2026-06-15',
    is_partially_collected: false,
    is_partially_delivered: false,
    cancellation_remarks: '',
    order_remarks: 'Consolidated retail cargo',
    chargeable_weight: 2000,
    gross_weight: 2100,
    gross_volumetric_weight: 952,
    oda_charge: 0,
    is_delivery_note_required: true,
    manifest_no: 'MNF-902812'
  },
  {
    id: 'ORD-1004',
    customer: 'Wared Logistics',
    type: 'LTL',
    tempRequirement: 'Chilled',
    stops: [
      { id: 'S6', address: 'Jumeirah Beach Road, Stop A', contactName: 'Chef Antoine', contactPhone: '+971 50 333 4444', weight: 200, volume: 0.6, status: 'Pending' },
      { id: 'S7', address: 'Al Barsha 1, Stop B', contactName: 'Chef Lin', contactPhone: '+971 50 444 5555', weight: 150, volume: 0.4, status: 'Pending' }
    ],
    status: 'Draft',
    createdAt: '2026-06-15T10:30:00Z',
    totalWeight: 350,
    totalVolume: 1.0,
    price: 900,
    reference_number: 'REF-300412',
    pickup_address: 'Dubai Logistics Hub',
    drop_address: 'Al Barsha 1, Stop B',
    is_pickup_gatepass_required: true,
    is_drop_gatepass_required: false,
    source_branch: 'Dubai Hub',
    destination_branch: 'Dubai Hub',
    current_branch: 'Dubai Hub',
    next_branch: 'Dubai Hub',
    execution_date: '2026-06-16',
    order_rate: 900,
    payment_type: 'Cash',
    rate_type: 'Fixed',
    goods_value: 5000,
    is_cross_docking: false,
    expected_pickup_date: '2026-06-16',
    expected_delivery_date: '2026-06-16',
    is_partially_collected: false,
    is_partially_delivered: false,
    cancellation_remarks: '',
    order_remarks: 'Deliver to rear kitchen entrance',
    chargeable_weight: 350,
    gross_weight: 370,
    gross_volumetric_weight: 167,
    oda_charge: 0,
    is_delivery_note_required: true,
    manifest_no: 'MNF-302910'
  },
  {
    id: 'ORD-1005',
    customer: 'Spinneys',
    type: 'FTL',
    tempRequirement: 'Chilled',
    stops: [
      { id: 'S8', address: 'Spinneys Al Wasl, Dubai', contactName: 'Ms. Sara', contactPhone: '+971 55 321 1100', weight: 3200, volume: 9.5, status: 'Delivered' },
      { id: 'S9', address: 'Spinneys Umm Suqeim, Dubai', contactName: 'Mr. Yusuf', contactPhone: '+971 55 321 2200', weight: 1800, volume: 5.0, status: 'Delivered' }
    ],
    status: 'Delivered',
    createdAt: '2026-06-13T06:00:00Z',
    totalWeight: 5000,
    totalVolume: 14.5,
    price: 4800,
    reference_number: 'REF-771029',
    pickup_address: 'Dubai Logistics Hub',
    drop_address: 'Spinneys Umm Suqeim, Dubai',
    is_pickup_gatepass_required: true,
    is_drop_gatepass_required: true,
    source_branch: 'Dubai Hub',
    destination_branch: 'Dubai Hub',
    current_branch: 'Dubai Hub',
    next_branch: '',
    execution_date: '2026-06-13',
    collected_at: '2026-06-13T06:30:00Z',
    collected_by: 'Ahmed Al-Mansoori',
    delivered_at: '2026-06-13T10:00:00Z',
    delivered_by: 'Ahmed Al-Mansoori',
    completed_at: '2026-06-13T10:15:00Z',
    completed_by: 'Ahmed Al-Mansoori',
    ready_for_invoice_at: '2026-06-13T10:30:00Z',
    ready_for_invoice_by: 'Admin Desk',
    invoice_generated_at: '2026-06-13T11:00:00Z',
    order_rate: 4800,
    payment_type: 'Credit',
    rate_type: 'Per Trip',
    goods_value: 95000,
    is_cross_docking: false,
    expected_pickup_date: '2026-06-13',
    expected_delivery_date: '2026-06-13',
    is_partially_collected: false,
    is_partially_delivered: false,
    cancellation_remarks: '',
    order_remarks: 'Temperature sensor active tracking requested',
    chargeable_weight: 5000,
    gross_weight: 5120,
    gross_volumetric_weight: 2421,
    oda_charge: 0,
    is_delivery_note_required: true,
    manifest_no: 'MNF-771928'
  },
  {
    id: 'ORD-1006',
    customer: 'Union Coop',
    type: 'LTL',
    tempRequirement: 'Dry',
    stops: [
      { id: 'S10', address: 'Union Coop Al Barsha, Dubai', contactName: 'Mr. Hamad', contactPhone: '+971 56 789 0001', weight: 900, volume: 2.8, status: 'Delivered' }
    ],
    status: 'Delivered',
    createdAt: '2026-06-12T09:30:00Z',
    totalWeight: 900,
    totalVolume: 2.8,
    price: 1100,
    reference_number: 'REF-662910',
    pickup_address: 'Dubai Logistics Hub',
    drop_address: 'Union Coop Al Barsha, Dubai',
    is_pickup_gatepass_required: false,
    is_drop_gatepass_required: false,
    source_branch: 'Dubai Hub',
    destination_branch: 'Dubai Hub',
    current_branch: 'Dubai Hub',
    next_branch: '',
    execution_date: '2026-06-12',
    collected_at: '2026-06-12T10:00:00Z',
    collected_by: 'John Doe',
    delivered_at: '2026-06-12T12:30:00Z',
    delivered_by: 'John Doe',
    completed_at: '2026-06-12T12:40:00Z',
    completed_by: 'John Doe',
    ready_for_invoice_at: '2026-06-12T12:50:00Z',
    ready_for_invoice_by: 'Admin Desk',
    invoice_generated_at: '2026-06-12T13:00:00Z',
    order_rate: 1100,
    payment_type: 'Credit',
    rate_type: 'Fixed',
    goods_value: 12000,
    is_cross_docking: false,
    expected_pickup_date: '2026-06-12',
    expected_delivery_date: '2026-06-12',
    is_partially_collected: false,
    is_partially_delivered: false,
    cancellation_remarks: '',
    order_remarks: 'Deliver to main warehouse ramp 2',
    chargeable_weight: 900,
    gross_weight: 930,
    gross_volumetric_weight: 468,
    oda_charge: 0,
    is_delivery_note_required: true,
    manifest_no: 'MNF-662900'
  },
  {
    id: 'ORD-1007',
    customer: 'Carrefour',
    type: 'FTL',
    tempRequirement: 'Dry',
    stops: [
      { id: 'S11', address: 'Carrefour Abu Dhabi, Khalidiyah Mall', contactName: 'Mr. Saeed', contactPhone: '+971 52 900 1122', weight: 6500, volume: 20.0, status: 'Pending' }
    ],
    status: 'Draft',
    createdAt: '2026-06-15T11:45:00Z',
    totalWeight: 6500,
    totalVolume: 20.0,
    price: 5200,
    reference_number: 'REF-284910',
    pickup_address: 'Dubai Logistics Hub',
    drop_address: 'Carrefour Abu Dhabi, Khalidiyah Mall',
    is_pickup_gatepass_required: false,
    is_drop_gatepass_required: true,
    source_branch: 'Dubai Hub',
    destination_branch: 'Abu Dhabi Branch',
    current_branch: 'Dubai Hub',
    next_branch: 'Abu Dhabi Branch',
    execution_date: '2026-06-16',
    order_rate: 5200,
    payment_type: 'Credit',
    rate_type: 'Per CBM',
    goods_value: 120000,
    is_cross_docking: false,
    expected_pickup_date: '2026-06-16',
    expected_delivery_date: '2026-06-17',
    is_partially_collected: false,
    is_partially_delivered: false,
    cancellation_remarks: '',
    order_remarks: 'Standard FTL dry run',
    chargeable_weight: 6500,
    gross_weight: 6700,
    gross_volumetric_weight: 3340,
    oda_charge: 250,
    is_delivery_note_required: true,
    manifest_no: 'MNF-284001'
  }
]

const initialVehicles = [
  { id: 'VH-101', name: 'Volvo FH16 Coldrunner', type: 'Heavy Truck', tempType: 'Chilled', capacityWeight: 15000, capacityVolume: 45, plateNumber: 'A-29402', status: 'Available' },
  { id: 'VH-102', name: 'Scania R450 Box', type: 'Heavy Truck', tempType: 'Dry', capacityWeight: 18000, capacityVolume: 50, plateNumber: 'D-88291', status: 'Available' },
  { id: 'VH-103', name: 'Isuzu NPR Chill-Max', type: 'Medium Truck', tempType: 'Chilled', capacityWeight: 6000, capacityVolume: 20, plateNumber: 'H-37190', status: 'Available' },
  { id: 'VH-104', name: 'Hino 300 Cargo', type: 'Medium Truck', tempType: 'Dry', capacityWeight: 5000, capacityVolume: 18, plateNumber: 'J-55104', status: 'Available' },
]

const initialDrivers = [
  { id: 'DR-201', name: 'Ahmed Al-Mansoori', licenseType: 'Heavy', phone: '+971 50 999 8881', status: 'Available' },
  { id: 'DR-202', name: 'Rajesh Kumar', licenseType: 'Heavy', phone: '+971 50 999 8882', status: 'Available' },
  { id: 'DR-203', name: 'Faisal Khan', licenseType: 'Light', phone: '+971 50 999 8883', status: 'Available' },
  { id: 'DR-204', name: 'John Doe', licenseType: 'Light', phone: '+971 50 999 8884', status: 'Available' },
  { id: 'DR-205', name: 'Tariq Mahmood', licenseType: 'Heavy', phone: '+971 50 999 8885', status: 'Available' }
]

const initialTrips = [
  {
    id: 'TRP-3001',
    tripName: 'Dubai Marina - Downtown Chilled Loop',
    driver: initialDrivers[2], // Faisal Khan
    vehicle: initialVehicles[1], // Toyota HiAce CoolBox
    orders: [initialOrders[0]],
    status: 'Completed',
    startTime: '2026-06-14T09:00:00Z',
    endTime: '2026-06-14T11:45:00Z',
    currentStopIndex: 2,
    currentX: HUBS.dubai.x,
    currentY: HUBS.dubai.y
  },
  {
    id: 'TRP-3002',
    tripName: 'Spinneys Dubai Chilled FTL Run',
    driver: initialDrivers[0], // Ahmed Al-Mansoori
    vehicle: initialVehicles[0], // Volvo FH16 Coldrunner
    orders: [initialOrders[4]], // ORD-1005
    status: 'Completed',
    startTime: '2026-06-13T06:30:00Z',
    endTime: '2026-06-13T10:00:00Z',
    currentStopIndex: 2,
    currentX: HUBS.dubai.x,
    currentY: HUBS.dubai.y
  },
  {
    id: 'TRP-3003',
    tripName: 'Union Coop Al Barsha Dry Run',
    driver: initialDrivers[3], // John Doe
    vehicle: initialVehicles[3], // Hino 300 Cargo
    orders: [initialOrders[5]], // ORD-1006
    status: 'Completed',
    startTime: '2026-06-12T10:00:00Z',
    endTime: '2026-06-12T12:30:00Z',
    currentStopIndex: 1,
    currentX: HUBS.dubai.x,
    currentY: HUBS.dubai.y
  },
  {
    id: 'TRP-3004',
    tripName: 'Union Coop Al Barsha Dry Run',
    driver: initialDrivers[3], // John Doe
    vehicle: initialVehicles[3], // Hino 300 Cargo
    orders: [initialOrders[5]], // ORD-1006
    status: 'Active',
    startTime: '2026-06-12T10:00:00Z',
    endTime: '2026-06-12T12:30:00Z',
    currentStopIndex: 1,
    currentX: HUBS.dubai.x,
    currentY: HUBS.dubai.y
  },
  {
    id: 'TRP-3005',
    tripName: 'Union Coop Al Barsha Dry Run',
    driver: initialDrivers[3], // John Doe
    vehicle: initialVehicles[3], // Hino 300 Cargo
    orders: [initialOrders[5]], // ORD-1006
    status: 'Active',
    startTime: '2026-06-12T10:00:00Z',
    endTime: '2026-06-12T12:30:00Z',
    currentStopIndex: 1,
    currentX: HUBS.dubai.x,
    currentY: HUBS.dubai.y
  },
  {
    id: 'TRP-3006',
    tripName: 'Union Coop Al Barsha Dry Run',
    driver: initialDrivers[3], // John Doe
    vehicle: initialVehicles[3], // Hino 300 Cargo
    orders: [initialOrders[5]], // ORD-1006
    status: 'Completed',
    startTime: '2026-06-12T10:00:00Z',
    endTime: '2026-06-12T12:30:00Z',
    currentStopIndex: 1,
    currentX: HUBS.dubai.x,
    currentY: HUBS.dubai.y
  }
]

const initialInvoices = [
  {
    id: 'INV-4001',
    orderId: 'ORD-1001',
    tripId: 'TRP-3001',
    customer: 'Wared Logistics',
    amount: 1250,
    tax: 62.5,
    total: 1312.5,
    status: 'Paid',
    createdAt: '2026-06-14T12:00:00Z',
    dueDate: '2026-07-14T12:00:00Z'
  },
  {
    id: 'INV-4002',
    orderId: 'ORD-1005',
    tripId: 'TRP-3002',
    customer: 'Spinneys',
    amount: 4800,
    tax: 240,
    total: 5040,
    status: 'Paid',
    createdAt: '2026-06-13T11:00:00Z',
    dueDate: '2026-07-13T11:00:00Z'
  },
  {
    id: 'INV-4003',
    orderId: 'ORD-1006',
    tripId: 'TRP-3003',
    customer: 'Union Coop',
    amount: 1100,
    tax: 55,
    total: 1155,
    status: 'Sent',
    createdAt: '2026-06-12T13:00:00Z',
    dueDate: '2026-07-12T13:00:00Z'
  },
  {
    id: 'INV-4004',
    orderId: 'ORD-1002',
    tripId: 'TRP-3001',
    customer: 'Lulu Hypermarket',
    amount: 3400,
    tax: 170,
    total: 3570,
    status: 'Sent',
    createdAt: '2026-06-15T08:00:00Z',
    dueDate: '2026-07-15T08:00:00Z'
  },
  {
    id: 'INV-4005',
    orderId: 'ORD-1003',
    tripId: 'TRP-3002',
    customer: 'Carrefour',
    amount: 1850,
    tax: 92.5,
    total: 1942.5,
    status: 'Draft',
    createdAt: '2026-06-15T09:30:00Z',
    dueDate: '2026-07-15T09:30:00Z'
  },
  {
    id: 'INV-4006',
    orderId: 'ORD-1004',
    tripId: 'TRP-3003',
    customer: 'Wared Logistics',
    amount: 900,
    tax: 45,
    total: 945,
    status: 'Draft',
    createdAt: '2026-06-15T11:00:00Z',
    dueDate: '2026-07-15T11:00:00Z'
  },
  {
    id: 'INV-4007',
    orderId: 'ORD-1007',
    tripId: 'TRP-3001',
    customer: 'Carrefour',
    amount: 5200,
    tax: 260,
    total: 5460,
    status: 'Draft',
    createdAt: '2026-06-15T12:00:00Z',
    dueDate: '2026-07-15T12:00:00Z'
  }
]

// Create the reactive global store
export const store = reactive({
  currentUserRole: (typeof window !== 'undefined' && localStorage.getItem('user_role')) || null,
  orders: initialOrders,
  vehicles: initialVehicles,
  drivers: initialDrivers,
  trips: initialTrips,
  invoices: initialInvoices,

  // Dashboard & Navigation State
  selectedBranch: 'All Branches',
  dateRange: 'Today',
  activeAdminTab: 'dashboard',

  // Simulation Active Track
  activeSimulationTripId: null,
  simulationIntervalId: null,
  simulatedVehiclePosition: { x: HUBS.dubai.x, y: HUBS.dubai.y },
  simulatedTripStatusText: '',

  // Simulation details
  simulatingTrip: null
})

// Computed states
export const stats = computed(() => {
  const filteredOrders = store.orders
  const activeTripsCount = store.trips.filter(t => t.status === 'Active').length
  const completedTripsCount = store.trips.filter(t => t.status === 'Completed').length
  const totalOrdersCount = filteredOrders.length

  const fleetUtilization = Math.round(
    (store.vehicles.filter(v => v.status === 'On Trip' || v.status === 'Assigned').length / store.vehicles.length) * 100
  )

  const totalRevenue = store.invoices.reduce((sum, inv) => sum + inv.total, 0)

  return {
    totalOrdersCount,
    activeTripsCount,
    completedTripsCount,
    fleetUtilization,
    totalRevenue
  }
})

// Methods
export function selectRole(role) {
  store.currentUserRole = role
  if (typeof window !== 'undefined') {
    if (role) {
      localStorage.setItem('user_role', role)
    } else {
      localStorage.removeItem('user_role')
    }
  }
}

export function createOrder(orderData) {
  const nextIdNum = Math.max(...store.orders.map(o => parseInt(o.id.split('-')[1]))) + 1
  const calculatedWeight = orderData.stops?.reduce((sum, s) => sum + s.weight, 0) || 0
  const calculatedVolume = orderData.stops?.reduce((sum, s) => sum + s.volume, 0) || 0
  const priceValue = orderData.order_rate || orderData.price || 500
  const newOrder = {
    id: `ORD-${nextIdNum}`,
    customer: orderData.customer || 'Wared Logistics',
    type: orderData.type || 'LTL',
    tempRequirement: orderData.tempRequirement || 'Dry',
    stops: orderData.stops || [],
    status: orderData.status || 'Draft',
    createdAt: new Date().toISOString(),
    totalWeight: calculatedWeight,
    totalVolume: calculatedVolume,
    price: priceValue,

    // Assigning new fields from orderData or defaults
    reference_number: orderData.reference_number || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
    pickup_address: orderData.pickup_address || 'Dubai Logistics Hub',
    drop_address: orderData.drop_address || (orderData.stops && orderData.stops[0]?.address) || '',
    is_pickup_gatepass_required: orderData.is_pickup_gatepass_required || false,
    is_drop_gatepass_required: orderData.is_drop_gatepass_required || false,
    source_branch: orderData.source_branch || 'Dubai Hub',
    destination_branch: orderData.destination_branch || 'Dubai Hub',
    current_branch: orderData.current_branch || 'Dubai Hub',
    next_branch: orderData.next_branch || '',
    execution_date: orderData.execution_date || new Date().toISOString().split('T')[0],
    order_rate: priceValue,
    payment_type: orderData.payment_type || 'Credit',
    rate_type: orderData.rate_type || 'Per Trip',
    goods_value: orderData.goods_value || 0,
    is_cross_docking: orderData.is_cross_docking || false,
    expected_pickup_date: orderData.expected_pickup_date || new Date().toISOString().split('T')[0],
    expected_delivery_date: orderData.expected_delivery_date || new Date().toISOString().split('T')[0],
    is_partially_collected: orderData.is_partially_collected || false,
    is_partially_delivered: orderData.is_partially_delivered || false,
    cancellation_remarks: orderData.cancellation_remarks || '',
    order_remarks: orderData.order_remarks || '',
    chargeable_weight: orderData.chargeable_weight || calculatedWeight,
    gross_weight: orderData.gross_weight || calculatedWeight,
    gross_volumetric_weight: orderData.gross_volumetric_weight || Math.round(calculatedVolume * 167),
    oda_charge: orderData.oda_charge || 0,
    is_delivery_note_required: orderData.is_delivery_note_required !== undefined ? orderData.is_delivery_note_required : true,
    manifest_no: orderData.manifest_no || `MNF-${Math.floor(100000 + Math.random() * 900000)}`,
    
    // Optional status transition timestamps/logs
    collected_at: orderData.collected_at,
    collected_by: orderData.collected_by,
    delivered_at: orderData.delivered_at,
    delivered_by: orderData.delivered_by,
    cancelled_at: orderData.cancelled_at,
    cancelled_by: orderData.cancelled_by,
    completed_at: orderData.completed_at,
    completed_by: orderData.completed_by,
    ready_for_invoice_at: orderData.ready_for_invoice_at,
    ready_for_invoice_by: orderData.ready_for_invoice_by,
    invoice_generated_at: orderData.invoice_generated_at,
  }
  store.orders.unshift(newOrder)
  return newOrder
}

export function createTrip(name, driverId, vehicleId, orderIds) {
  const driver = store.drivers.find(d => d.id === driverId)
  const vehicle = store.vehicles.find(v => v.id === vehicleId)
  const orders = store.orders.filter(o => orderIds.includes(o.id))

  // Update statuses
  driver.status = 'Assigned'
  vehicle.status = 'Assigned'
  orders.forEach(o => { o.status = 'Planned' })

  const nextIdNum = Math.max(...store.trips.map(t => parseInt(t.id.split('-')[1]))) + 1
  const newTrip = {
    id: `TRP-${nextIdNum}`,
    tripName: name,
    driver,
    vehicle,
    orders,
    status: 'Scheduled',
    currentStopIndex: -1,
    currentX: HUBS.dubai.x,
    currentY: HUBS.dubai.y
  }

  store.trips.unshift(newTrip)
  return newTrip
}

// Generate Invoice
export function generateInvoice(order, tripId) {
  const nextIdNum = Math.max(...store.invoices.map(inv => parseInt(inv.id.split('-')[1]))) + 1
  const tax = Math.round(order.price * 0.05 * 100) / 100 // 5% VAT in UAE
  const newInvoice = {
    id: `INV-${nextIdNum}`,
    orderId: order.id,
    tripId: tripId,
    customer: order.customer,
    amount: order.price,
    tax: tax,
    total: order.price + tax,
    status: 'Sent',
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days net
  }
  store.invoices.unshift(newInvoice)
  order.invoice_generated_at = newInvoice.createdAt
  return newInvoice
}

// Simulation logic
export function startSimulation(tripId) {
  if (store.activeSimulationTripId) {
    stopSimulation()
  }

  const trip = store.trips.find(t => t.id === tripId)
  if (!trip) return

  trip.status = 'Active'
  trip.startTime = new Date().toISOString()
  trip.driver.status = 'On Trip'
  trip.vehicle.status = 'On Trip'

  // Mark orders as En Route
  trip.orders.forEach(o => {
    o.status = 'En Route'
    o.collected_at = new Date().toISOString()
    o.collected_by = trip.driver.name
    o.current_branch = 'Dubai Hub'
    o.next_branch = o.destination_branch || 'Abu Dhabi Branch'
  })

  store.activeSimulationTripId = tripId
  store.simulatingTrip = trip
  store.simulatedVehiclePosition = { x: HUBS.dubai.x, y: HUBS.dubai.y }
  store.simulatedTripStatusText = 'Departing Dubai Logistics Hub...'

  // Set up waypoint simulation coordinates
  const path = []

  // Start Hub
  path.push({ x: HUBS.dubai.x, y: HUBS.dubai.y, label: 'Departing Dubai Logistics Hub' })

  // Build path waypoints based on orders and stops
  trip.orders.forEach(order => {
    order.stops.forEach((stop, idx) => {
      // Create coordinates depending on address string
      let stopCoord = { x: HUBS.dubai.x, y: HUBS.dubai.y }
      if (stop.address.toLowerCase().includes('abu dhabi') || stop.address.toLowerCase().includes('yas')) {
        stopCoord = { x: HUBS.abuDhabi.x, y: HUBS.abuDhabi.y }
      } else if (stop.address.toLowerCase().includes('sharjah')) {
        stopCoord = { x: HUBS.sharjah.x, y: HUBS.sharjah.y }
      } else {
        stopCoord = { x: HUBS.dubai.x + (idx === 0 ? -30 : 20), y: HUBS.dubai.y + (idx === 0 ? 30 : -20) }
      }

      // Add a mid waypoint
      const midX = (path[path.length - 1].x + stopCoord.x) / 2
      const midY = (path[path.length - 1].y + stopCoord.y) / 2
      path.push({ x: midX, y: midY, label: `In Transit to Stop ${idx + 1}: ${stop.address}` })

      // Stop waypoint
      path.push({
        x: stopCoord.x,
        y: stopCoord.y,
        label: `Arrived at Stop: ${stop.address}. Unloading cargo...`,
        action: () => {
          stop.status = 'Delivered'
          // If all stops in order delivered, mark order delivered
          const allDelivered = order.stops.every(s => s.status === 'Delivered')
          if (allDelivered) {
            order.status = 'Delivered'
            order.delivered_at = new Date().toISOString()
            order.delivered_by = trip.driver.name
            order.completed_at = new Date().toISOString()
            order.completed_by = 'System Simulator'
            order.ready_for_invoice_at = new Date().toISOString()
            order.ready_for_invoice_by = 'System Simulator'
            order.current_branch = order.destination_branch || 'Abu Dhabi Branch'
            order.next_branch = ''
            
            const invoice = generateInvoice(order, trip.id)
            order.invoice_generated_at = invoice.createdAt
          }
        }
      })
    })
  })

  // Return to warehouse
  path.push({
    x: HUBS.dubai.x,
    y: HUBS.dubai.y,
    label: 'Returning to Dubai Logistics Hub. Trip Completed!',
    action: () => {
      trip.status = 'Completed'
      trip.endTime = new Date().toISOString()
      trip.driver.status = 'Available'
      trip.vehicle.status = 'Available'
      stopSimulation()
    }
  })

  let currentStep = 0

  store.simulationIntervalId = setInterval(() => {
    if (currentStep >= path.length) {
      stopSimulation()
      return
    }

    const target = path[currentStep]

    store.simulatedVehiclePosition = { x: target.x, y: target.y }
    trip.currentX = target.x
    trip.currentY = target.y
    store.simulatedTripStatusText = target.label

    if (target.action) {
      target.action()
    }

    currentStep++
  }, 3000)
}

export function stopSimulation() {
  if (store.simulationIntervalId) {
    clearInterval(store.simulationIntervalId)
    store.simulationIntervalId = null
  }
  store.activeSimulationTripId = null
  store.simulatingTrip = null
}

export function createVehicle(vehicleData) {
  const nextIdNum = Math.max(...store.vehicles.map(v => parseInt(v.id.split('-')[1]))) + 1
  const newVehicle = {
    id: `VH-${nextIdNum}`,
    name: vehicleData.name || 'New Vehicle',
    type: vehicleData.type || 'Light Van',
    tempType: vehicleData.tempType || 'Dry',
    capacityWeight: vehicleData.capacityWeight || 1000,
    capacityVolume: vehicleData.capacityVolume || 5,
    plateNumber: vehicleData.plateNumber || 'TBD',
    status: vehicleData.status || 'Available'
  }
  store.vehicles.push(newVehicle)
  return newVehicle
}

export function updateVehicle(id, updates) {
  const vehicle = store.vehicles.find(v => v.id === id)
  if (vehicle) {
    Object.assign(vehicle, updates)
  }
  return vehicle
}

export function createDriver(driverData) {
  const nextIdNum = Math.max(...store.drivers.map(d => parseInt(d.id.split('-')[1]))) + 1
  const newDriver = {
    id: `DR-${nextIdNum}`,
    name: driverData.name || 'New Driver',
    licenseType: driverData.licenseType || 'Light',
    phone: driverData.phone || 'TBD',
    status: driverData.status || 'Available'
  }
  store.drivers.push(newDriver)
  return newDriver
}

export function updateDriver(id, updates) {
  const driver = store.drivers.find(d => d.id === id)
  if (driver) {
    Object.assign(driver, updates)
  }
  return driver
}
