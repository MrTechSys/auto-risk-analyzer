export interface VINIntel {
  make: string;
  model: string;
  year: number;
  msrp: number;
  safetyRating: number; // 1-5
  adasFeatures: string[];
  vehicleClass: string;
}

const MOCK_VIN_DATA: Record<string, VINIntel> = {
  // Tesla Model 3
  '5YJ3': {
    make: 'Tesla',
    model: 'Model 3',
    year: 2022,
    msrp: 46990,
    safetyRating: 5,
    adasFeatures: ['Autopilot', 'Automatic Emergency Braking', 'Lane Departure Warning'],
    vehicleClass: 'Luxury Electric Sedan'
  },
  // Ford F-150
  '1FTF': {
    make: 'Ford',
    model: 'F-150',
    year: 2021,
    msrp: 35000,
    safetyRating: 4,
    adasFeatures: ['Pre-Collision Assist', 'Blind Spot Information System'],
    vehicleClass: 'Full-Size Pickup'
  },
  // Honda Civic
  '1HGC': {
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    msrp: 25000,
    safetyRating: 5,
    adasFeatures: ['Honda Sensing', 'Adaptive Cruise Control', 'Collision Mitigation Braking'],
    vehicleClass: 'Compact Sedan'
  }
};

export function decodeVIN(vin: string): VINIntel | null {
  if (!vin || vin.length < 4) return null;
  
  const prefix = vin.substring(0, 4).toUpperCase();
  const intel = MOCK_VIN_DATA[prefix];
  
  if (intel) {
    return {
      ...intel,
      // If VIN is full length, we could theoretically extract the year from the 10th char
      // but for this demo, we use the mock data year.
    };
  }
  
  // Generic fallback if prefix not recognized
  return {
    make: 'Generic',
    model: 'Vehicle',
    year: 2020,
    msrp: 30000,
    safetyRating: 3,
    adasFeatures: ['Standard Airbags', 'ABS'],
    vehicleClass: 'Passenger Vehicle'
  };
}
