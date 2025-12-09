
let vehiclesData = null;

export async function loadVehiclesData() {
  if (vehiclesData) {
    return vehiclesData;
  }

  try {
    const response = await fetch('/json/vehicles.json');
    if (!response.ok) {
      throw new Error(`Failed to load vehicles data: ${response.status}`);
    }
    vehiclesData = await response.json();
    return vehiclesData;
  } catch (error) {
    console.error('Error loading vehicles data:', error);
    // Return fallback data structure
    return {
      vehicles: {
        cars: [],
        bikes: []
      }
    };
  }
}

export async function getCarMakes() {
  const data = await loadVehiclesData();
  return data.vehicles.cars.map(car => car.make);
}


export async function getBikeMakes() {
  const data = await loadVehiclesData();
  return data.vehicles.bikes.map(bike => bike.make);
}


export async function getCarModels(make) {
  const data = await loadVehiclesData();
  const car = data.vehicles.cars.find(c => c.make === make);
  return car ? car.models.map(model => model.name) : [];
}


export async function getBikeModels(make) {
  const data = await loadVehiclesData();
  const bike = data.vehicles.bikes.find(b => b.make === make);
  return bike ? bike.models.map(model => model.name) : [];
}


export async function getCarYears(make, model) {
  const data = await loadVehiclesData();
  const car = data.vehicles.cars.find(c => c.make === make);
  if (!car) return [];
  
  const modelData = car.models.find(m => m.name === model);
  return modelData ? modelData.years : [];
}


export async function getBikeYears(make, model) {
  const data = await loadVehiclesData();
  const bike = data.vehicles.bikes.find(b => b.make === make);
  if (!bike) return [];
  
  const modelData = bike.models.find(m => m.name === model);
  return modelData ? modelData.years : [];
}

export async function getVehicleData(type = 'cars') {
  const data = await loadVehiclesData();
  return data.vehicles[type] || [];
}

export async function getTransformedVehicleData(type = 'cars') {

  const vehicleData = await getVehicleData(type);

  return vehicleData.map(vehicle => ({
    make: vehicle.make,
    models: vehicle.models.map(model => ({
      name: model.name,
      years: model.years
    }))
  }));
}

export function isSupportedVehicleType(type) {
  return ['cars', 'bikes'].includes(type);
}

export function getVehicleTypeFromCategory(categoryName) {
  if (!categoryName) return "cars";

  const lower = categoryName.toLowerCase();

  const typeMap = [
    { keys: ["motorbike", "bike"], value: "bikes" },
    { keys: ["caravan", "motorhome"], value: "caravans_motorhomes" },
    { keys: ["boats", "marine"], value: "boats_and_marine" },
    { keys: ["aircraft"], value: "aircrafts" },
    { keys: ["buses"], value: "buses" },
    { keys: ["horse", "floats"], value: "horse_floats" },
    { keys: ["specialist"], value: "specialist_cars" },
    { keys: ["trailers"], value: "trailers" },
    { keys: ["trucks"], value: "trucks" },
    { keys: ["wrecked"], value: "wrecked_cars" },
  ];

  for (const { keys, value } of typeMap) {
    if (keys.some((k) => lower.includes(k))) return value;
  }

  return "cars";
}

