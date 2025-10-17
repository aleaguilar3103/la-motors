export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: 'Gasolina' | 'Diesel' | 'Eléctrico' | 'Híbrido';
  transmission: 'Manual' | 'Automático' | 'CVT';
  drivetrain: 'FWD' | 'RWD' | 'AWD' | '4WD';
  exterior_color: string;
  interior_color: string;
  images: string[];
  features: string[];
  engine: string;
  horsepower: number;
  torque: string;
  fuel_economy_city: number;
  fuel_economy_highway: number;
  seating: number;
  doors: number;
  body_style: string;
  description: string;
  vin: string;
  status: 'disponible' | 'vendido' | 'pendiente';
  created_at: string;
  updated_at: string;
}

export interface VehicleFormData extends Omit<Vehicle, 'id' | 'created_at' | 'updated_at'> {}