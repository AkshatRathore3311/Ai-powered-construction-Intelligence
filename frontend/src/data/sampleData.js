/**
 * SAMPLE DATA FOR UI DEVELOPMENT ONLY
 * ----------------------------------------------------
 * NOTE: These records serve as realistic placeholders for UI design,
 * layout validation, and component state testing during Phase 1.
 * Real data will be supplied by FastAPI and Supabase in Phases 2-6.
 */

export const SAMPLE_DASHBOARD_METRICS = {
  safetyScore: 94.2,
  safetyScoreDelta: "+2.4%",
  activeAlerts: 3,
  inspectionsCompletedToday: 18,
  pendingPlanReviews: 4,
  highRiskCracks: 2,
  weatherRiskLevel: "Moderate",
  siteOperationalStatus: "Full Clearance",
};

export const SAMPLE_WEEKLY_SAFETY_TREND = [
  { day: "Mon", complianceRate: 92, minorViolations: 4, criticalAlerts: 0 },
  { day: "Tue", complianceRate: 95, minorViolations: 2, criticalAlerts: 1 },
  { day: "Wed", complianceRate: 89, minorViolations: 6, criticalAlerts: 2 },
  { day: "Thu", complianceRate: 96, minorViolations: 2, criticalAlerts: 0 },
  { day: "Fri", complianceRate: 94, minorViolations: 3, criticalAlerts: 0 },
  { day: "Sat", complianceRate: 98, minorViolations: 1, criticalAlerts: 0 },
  { day: "Sun", complianceRate: 97, minorViolations: 1, criticalAlerts: 0 },
];

export const SAMPLE_INSPECTION_DISTRIBUTION = [
  { name: "PPE Compliance", count: 48, fill: "#3b82f6" },
  { name: "Crack / Structural", count: 32, fill: "#eab308" },
  { name: "Hazard Zones", count: 19, fill: "#ef4444" },
  { name: "Equipment Check", count: 26, fill: "#10b981" },
];

export const SAMPLE_RECENT_ALERTS = [
  {
    id: "ALT-1092",
    title: "PPE Violation - Missing Hardhat & High-Vis",
    zone: "Zone 3 - Steel Framing Tower B",
    timestamp: "12 mins ago",
    severity: "High",
    status: "Investigating",
    confidence: "96.4%",
  },
  {
    id: "ALT-1091",
    title: "Structural Crack Width Exceeded 3.2mm",
    zone: "Column C4 - Basement Retention Wall",
    timestamp: "45 mins ago",
    severity: "Critical",
    status: "Action Required",
    confidence: "98.1%",
  },
  {
    id: "ALT-1090",
    title: "High Wind Gust Advisory (34 knots)",
    zone: "Tower Crane 02 - Upper Boom",
    timestamp: "2 hours ago",
    severity: "Warning",
    status: "Crane Paused",
    confidence: "N/A - Weather Feed",
  },
  {
    id: "ALT-1089",
    title: "Scaffold Guardrail Displaced",
    zone: "North Face Scaffolding - Tier 4",
    timestamp: "3 hours ago",
    severity: "Medium",
    status: "Resolved",
    confidence: "91.8%",
  },
];

export const SAMPLE_SITES = [
  { id: "site-1", name: "Metro Heights Tower A", code: "MHT-01", location: "Sector 62, City Center" },
  { id: "site-2", name: "Apex Industrial Logistics Hub", code: "AIL-04", location: "Harbor Expressway West" },
  { id: "site-3", name: "Riverfront Residential Park", code: "RRP-12", location: "South Shore Basin" },
];

export const SAMPLE_SAFETY_ANALYSIS_PRESET = {
  imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1000&q=80",
  detections: [
    { label: "Worker (Hard Hat: Verified, Vest: Verified)", bbox: [120, 150, 240, 420], confidence: 0.98, status: "safe" },
    { label: "Worker (Missing High-Vis Vest)", bbox: [320, 140, 430, 410], confidence: 0.93, status: "violation" },
    { label: "Heavy Machinery Swing Radius Unbarricaded", bbox: [520, 200, 780, 500], confidence: 0.89, status: "hazard" },
    { label: "Approved Scaffolding Harness Anchor", bbox: [180, 60, 260, 140], confidence: 0.95, status: "safe" },
  ],
  summary: {
    totalPeople: 2,
    ppeCompliantWorkers: 1,
    ppeNonCompliantWorkers: 1,
    perimeterHazards: 1,
    siteSafetyRating: "78% - Attention Needed",
  },
};

export const SAMPLE_CRACK_ANALYSIS_PRESET = {
  imageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80",
  type: "Diagonal Shear Crack",
  severity: "High - Structural Risk",
  estimatedLength: "84.5 cm",
  estimatedWidth: "3.4 mm",
  structuralImpact: "High shear stress propagation identified along beam-column joint. Immediate shoring and ultrasonic testing recommended.",
  repairUrgency: "Immediate (Within 48h)",
  recommendedMethod: "Epoxy Injection with Carbon Fiber Reinforced Polymer (CFRP) wrap reinforcement",
  confidence: "97.3%",
};

export const SAMPLE_VALUATION_COMPS = [
  { address: "144 Skyline Blvd, Sector 62", sqft: 1850, price: "$740,000", pricePerSqft: "$400", date: "10 days ago" },
  { address: "190 Metro Heights Ave", sqft: 2200, price: "$895,000", pricePerSqft: "$406", date: "3 weeks ago" },
  { address: "88 Horizon Plaza", sqft: 1600, price: "$655,000", pricePerSqft: "$409", date: "1 month ago" },
];

export const SAMPLE_PROJECT_PLAN = {
  projectName: "Phase 2 Commercial Shell & Core",
  estimatedDuration: "180 Calendar Days",
  targetCompletion: "Nov 2027",
  budgetBand: "$3,450,000 - $3,800,000",
  milestones: [
    { phase: "Substructure & Foundation Pouring", duration: "35 days", risk: "Low", dependency: "Soil Testing Approval", status: "Completed" },
    { phase: "Reinforced Concrete Core & Columns", duration: "50 days", risk: "Medium", dependency: "Formwork Inspection", status: "In Progress" },
    { phase: "Structural Steel Truss Assembly", duration: "30 days", risk: "High", dependency: "Crane Availability & Wind", status: "Pending" },
    { phase: "Exterior Facade & Glazing Envelope", duration: "40 days", risk: "Medium", dependency: "Truss Clearance", status: "Pending" },
    { phase: "MEP Rough-In & Interior Partitioning", duration: "25 days", risk: "Low", dependency: "Enclosure Sign-off", status: "Pending" },
  ],
  materialEstimates: [
    { item: "Ready-Mix Concrete (M40/M50)", quantity: "2,400 cu.m", cost: "$432,000" },
    { item: "Rebar Steel (Grade 60)", quantity: "380 metric tons", cost: "$361,000" },
    { item: "Structural Steel Beams (A992)", quantity: "195 tons", cost: "$410,000" },
    { item: "Architectural Curtain Wall Glass", quantity: "3,800 sq.m", cost: "$684,000" },
  ],
};

export const SAMPLE_WEATHER_DATA = {
  current: {
    temp: "24°C",
    condition: "Partly Cloudy",
    humidity: "62%",
    windSpeed: "22 km/h",
    windGust: "35 km/h",
    precipitationChance: "15%",
    uvIndex: "6 - High",
    airQualityIndex: "48 - Good",
  },
  advisories: [
    {
      type: "crane",
      title: "Tower Crane Operation Advisory",
      level: "Normal with Caution",
      desc: "Wind speeds below critical 38 km/h limit. Monitor afternoon gusts.",
      color: "emerald",
    },
    {
      type: "concrete",
      title: "Concrete Curing Conditions",
      level: "Optimal Window",
      desc: "Moderate ambient temperature (24°C) with 62% humidity. Rapid moisture loss risk is minimal today.",
      color: "blue",
    },
    {
      type: "heat",
      title: "Worker Hydration Protocol",
      level: "Level 1 Standard",
      desc: "UV index rising after 12:30 PM. Mandatory 10-minute shade and water breaks every 90 minutes.",
      color: "amber",
    },
  ],
  forecast: [
    { time: "09:00", temp: "21°C", wind: "14 km/h", rain: "5%", condition: "Sunny" },
    { time: "12:00", temp: "25°C", wind: "22 km/h", rain: "10%", condition: "Partly Cloudy" },
    { time: "15:00", temp: "26°C", wind: "28 km/h", rain: "25%", condition: "Breezy" },
    { time: "18:00", temp: "22°C", wind: "18 km/h", rain: "20%", condition: "Clear" },
    { time: "21:00", temp: "19°C", wind: "12 km/h", rain: "5%", condition: "Clear" },
  ],
};

export const SAMPLE_HISTORY_ITEMS = [
  {
    id: "HIS-9012",
    date: "2026-10-24 16:30",
    category: "Safety Monitoring",
    title: "Zone 4 Scaffolding Scan",
    site: "Metro Heights Tower A",
    summary: "2 PPE violations identified; 1 unlatched toe-board.",
    status: "Completed",
    badgeColor: "rose",
  },
  {
    id: "HIS-9011",
    date: "2026-10-24 14:15",
    category: "Crack Detection",
    title: "Retention Wall Segment B",
    site: "Riverfront Residential Park",
    summary: "Hairline shrink crack (0.8mm). Non-structural, monitor quarterly.",
    status: "Completed",
    badgeColor: "emerald",
  },
  {
    id: "HIS-9010",
    date: "2026-10-23 11:00",
    category: "Real Estate Valuation",
    title: "Commercial Shell Val-Estimate",
    site: "Apex Industrial Logistics Hub",
    summary: "Valuation estimated at $4.2M based on regional cap rates.",
    status: "Completed",
    badgeColor: "blue",
  },
  {
    id: "HIS-9009",
    date: "2026-10-22 09:45",
    category: "Project Planning",
    title: "Milestone Schedule Revision 3",
    site: "Metro Heights Tower A",
    summary: "Substructure timeline accelerated by 6 calendar days.",
    status: "Completed",
    badgeColor: "amber",
  },
  {
    id: "HIS-9008",
    date: "2026-10-21 17:10",
    category: "Safety Monitoring",
    title: "Excavation Pit Perimeter Inspection",
    site: "Apex Industrial Logistics Hub",
    summary: "Safety barricades fully compliant with OSHA 1926 subpart P.",
    status: "Completed",
    badgeColor: "emerald",
  },
];

export const SAMPLE_KNOWLEDGE_QUESTIONS = [
  "What are the minimum OSHA clearance distances for mobile cranes near 50kV power lines?",
  "What is the maximum permissible crack width in water-retaining reinforced concrete structures (ACI 224R)?",
  "How do ambient temperature and wind speed affect early-age plastic shrinkage in concrete slabs?",
  "What are the key ASTM standards required for structural steel welding inspection?",
];
