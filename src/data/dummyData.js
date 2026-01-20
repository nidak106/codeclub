// SAMPLE DATA - Replace with actual API data later

export const summaryData = {
  totalConsumed: 450.5,
  solarGenerated: 320.8,
  netEnergy: -129.7, // Negative means export
  estimatedBill: 18500,
  optimizedBill: 12350
};

export const dailyEnergyData = [
  { date: 'Jan 1', consumption: 15.2, solar: 12.5 },
  { date: 'Jan 2', consumption: 16.8, solar: 13.2 },
  { date: 'Jan 3', consumption: 14.5, solar: 11.8 },
  { date: 'Jan 4', consumption: 17.2, solar: 14.5 },
  { date: 'Jan 5', consumption: 15.9, solar: 13.8 },
  { date: 'Jan 6', consumption: 18.3, solar: 15.2 },
  { date: 'Jan 7', consumption: 16.5, solar: 14.0 },
  { date: 'Jan 8', consumption: 15.8, solar: 12.9 },
  { date: 'Jan 9', consumption: 17.1, solar: 14.3 },
  { date: 'Jan 10', consumption: 16.2, solar: 13.5 },
  { date: 'Jan 11', consumption: 14.9, solar: 12.2 },
  { date: 'Jan 12', consumption: 15.5, solar: 13.1 },
  { date: 'Jan 13', consumption: 16.8, solar: 14.2 },
  { date: 'Jan 14', consumption: 17.5, solar: 15.0 }
];

export const monthlyBillComparison = [
  { month: 'Aug', beforeOptimization: 19200, afterOptimization: 13500 },
  { month: 'Sep', beforeOptimization: 18800, afterOptimization: 12800 },
  { month: 'Oct', beforeOptimization: 17500, afterOptimization: 11900 },
  { month: 'Nov', beforeOptimization: 16200, afterOptimization: 10800 },
  { month: 'Dec', beforeOptimization: 18900, afterOptimization: 12600 },
  { month: 'Jan', beforeOptimization: 18500, afterOptimization: 12350 }
];

export const netEnergyFlow = [
  { date: 'Week 1', import: 45.2, export: 38.5 },
  { date: 'Week 2', import: 52.8, export: 42.3 },
  { date: 'Week 3', import: 48.5, export: 40.8 },
  { date: 'Week 4', import: 50.2, export: 45.2 }
];

export const applianceConsumption = [
  { name: 'Air Conditioner', value: 35, color: '#3b82f6' },
  { name: 'Water Heater', value: 20, color: '#10b981' },
  { name: 'Refrigerator', value: 15, color: '#f59e0b' },
  { name: 'Washing Machine', value: 12, color: '#8b5cf6' },
  { name: 'Lighting', value: 10, color: '#ec4899' },
  { name: 'Others', value: 8, color: '#6b7280' }
];

export const applianceAbnormalities = [
  {
    id: 1,
    name: 'Air Conditioner',
    normalUsage: 8.5,
    currentUsage: 8.2,
    status: 'Normal',
    reason: 'Operating within expected range'
  },
  {
    id: 2,
    name: 'Water Heater',
    normalUsage: 4.2,
    currentUsage: 7.8,
    status: 'Abnormal',
    reason: 'Usage 85% higher than normal - possible thermostat issue or increased hot water demand'
  },
  {
    id: 3,
    name: 'Refrigerator',
    normalUsage: 3.5,
    currentUsage: 3.6,
    status: 'Normal',
    reason: 'Operating within expected range'
  },
  {
    id: 4,
    name: 'Washing Machine',
    normalUsage: 2.8,
    currentUsage: 5.2,
    status: 'High Consumption',
    reason: 'Usage during peak hours detected - consider shifting to off-peak times'
  },
  {
    id: 5,
    name: 'Lighting',
    normalUsage: 2.1,
    currentUsage: 2.0,
    status: 'Normal',
    reason: 'Operating within expected range'
  },
  {
    id: 6,
    name: 'TV & Electronics',
    normalUsage: 1.8,
    currentUsage: 1.9,
    status: 'Normal',
    reason: 'Operating within expected range'
  }
];

export const applianceDetails = [
  {
    id: 1,
    name: 'Air Conditioner',
    currentUsage: 8.2,
    trend: [
      { day: 'Mon', usage: 7.5 },
      { day: 'Tue', usage: 8.1 },
      { day: 'Wed', usage: 8.5 },
      { day: 'Thu', usage: 8.0 },
      { day: 'Fri', usage: 8.2 },
      { day: 'Sat', usage: 9.1 },
      { day: 'Sun', usage: 8.8 }
    ],
    suggestion: 'AC usage is optimal. Consider setting temperature to 24°C for better efficiency.',
    status: 'Normal'
  },
  {
    id: 2,
    name: 'Water Heater',
    currentUsage: 7.8,
    trend: [
      { day: 'Mon', usage: 4.2 },
      { day: 'Tue', usage: 4.5 },
      { day: 'Wed', usage: 6.8 },
      { day: 'Thu', usage: 7.2 },
      { day: 'Fri', usage: 7.8 },
      { day: 'Sat', usage: 7.5 },
      { day: 'Sun', usage: 7.9 }
    ],
    suggestion: 'Water heater showing abnormally high usage. Check thermostat settings and insulation. Consider reducing temperature from 60°C to 50°C.',
    status: 'Abnormal'
  },
  {
    id: 3,
    name: 'Refrigerator',
    currentUsage: 3.6,
    trend: [
      { day: 'Mon', usage: 3.4 },
      { day: 'Tue', usage: 3.5 },
      { day: 'Wed', usage: 3.6 },
      { day: 'Thu', usage: 3.7 },
      { day: 'Fri', usage: 3.6 },
      { day: 'Sat', usage: 3.5 },
      { day: 'Sun', usage: 3.8 }
    ],
    suggestion: 'Refrigerator operating efficiently. Ensure door seals are clean and avoid frequent opening.',
    status: 'Normal'
  },
  {
    id: 4,
    name: 'Washing Machine',
    currentUsage: 5.2,
    trend: [
      { day: 'Mon', usage: 2.8 },
      { day: 'Tue', usage: 3.1 },
      { day: 'Wed', usage: 2.9 },
      { day: 'Thu', usage: 4.5 },
      { day: 'Fri', usage: 5.2 },
      { day: 'Sat', usage: 4.8 },
      { day: 'Sun', usage: 5.0 }
    ],
    suggestion: 'Washing machine usage is unusually high during peak hours (6-10 PM). Shift washing to off-peak times (11 PM - 6 AM) to reduce costs by up to 40%.',
    status: 'High Consumption'
  },
  {
    id: 5,
    name: 'Lighting',
    currentUsage: 2.0,
    trend: [
      { day: 'Mon', usage: 1.9 },
      { day: 'Tue', usage: 2.0 },
      { day: 'Wed', usage: 2.1 },
      { day: 'Thu', usage: 2.0 },
      { day: 'Fri', usage: 2.2 },
      { day: 'Sat', usage: 2.3 },
      { day: 'Sun', usage: 2.1 }
    ],
    suggestion: 'Lighting usage is normal. Consider switching to LED bulbs for additional 30% energy savings.',
    status: 'Normal'
  },
  {
    id: 6,
    name: 'TV & Electronics',
    currentUsage: 1.9,
    trend: [
      { day: 'Mon', usage: 1.7 },
      { day: 'Tue', usage: 1.8 },
      { day: 'Wed', usage: 2.0 },
      { day: 'Thu', usage: 1.9 },
      { day: 'Fri', usage: 2.1 },
      { day: 'Sat', usage: 2.2 },
      { day: 'Sun', usage: 2.0 }
    ],
    suggestion: 'Electronics usage is within normal range. Enable standby mode when not in use to save energy.',
    status: 'Normal'
  }
];

export const billingPrediction = {
  daily: [
    { date: 'Day 1', predicted: 620, actual: 615 },
    { date: 'Day 2', predicted: 635, actual: 642 },
    { date: 'Day 3', predicted: 610, actual: 608 },
    { date: 'Day 4', predicted: 645, actual: null },
    { date: 'Day 5', predicted: 630, actual: null },
    { date: 'Day 6', predicted: 655, actual: null },
    { date: 'Day 7', predicted: 640, actual: null }
  ],
  monthly: {
    currentMonth: 12350,
    predictedNextMonth: 12800,
    previousMonth: 12600,
    averageLast3Months: 12430
  }
};

export const netMeteringSummary = {
  unitsImported: 450.5,
  unitsExported: 320.8,
  netUnits: 129.7,
  importCost: 18500,
  exportCredit: 6150,
  finalBill: 12350,
  monthlyBreakdown: [
    { month: 'Aug', imported: 485, exported: 298, net: 187 },
    { month: 'Sep', imported: 472, exported: 312, net: 160 },
    { month: 'Oct', imported: 458, exported: 325, net: 133 },
    { month: 'Nov', imported: 442, exported: 305, net: 137 },
    { month: 'Dec', imported: 468, exported: 315, net: 153 },
    { month: 'Jan', imported: 450.5, exported: 320.8, net: 129.7 }
  ]
};
