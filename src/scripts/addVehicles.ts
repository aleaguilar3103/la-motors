import { VehicleService } from '@/services/vehicleService';

// Datos de los 5 vehículos a agregar
const vehiclesToAdd = [
  {
    make: 'Hyundai',
    model: 'Elantra',
    year: 2019,
    price: 7950000,
    mileage: 0, // No se especificó
    fuel_type: 'Gasolina' as const,
    transmission: 'Automático' as const,
    drivetrain: 'FWD' as const, // 4x2 = FWD
    engine: '1.800 cc gasolina',
    doors: 4,
    body_style: 'Sedán',
    status: 'disponible' as const,
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80', // Hyundai Elantra
    ],
    features: []
  },
  {
    make: 'Nissan',
    model: 'Rogue',
    year: 2020,
    price: 10500000,
    mileage: 50256, // 50.256 millas convertidas a km (aprox 80,900 km)
    engine: '2.500 cc',
    transmission: 'Automático' as const,
    drivetrain: 'FWD' as const, // 4x2 = FWD
    status: 'disponible' as const,
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80', // Nissan SUV
    ],
    features: []
  },
  {
    make: 'Ford',
    model: 'EcoSport SE',
    year: 2018,
    price: 6950000,
    mileage: 80980,
    engine: '1.500 cc',
    transmission: 'Automático' as const,
    drivetrain: 'FWD' as const, // 4x2 = FWD
    interior_color: 'Tela',
    status: 'disponible' as const,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', // Ford SUV
    ],
    features: []
  },
  {
    make: 'Toyota',
    model: 'Corolla LE',
    year: 2015,
    price: 7200000,
    mileage: 154728,
    engine: '1.800 cc',
    transmission: 'Manual' as const,
    interior_color: 'Tela',
    status: 'disponible' as const,
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80', // Toyota Corolla
    ],
    features: []
  },
  {
    make: 'Nissan',
    model: 'Pathfinder',
    year: 2018,
    price: 9300000,
    mileage: 0, // No se especificó
    transmission: 'Automático' as const,
    drivetrain: 'FWD' as const, // 4x2 = FWD
    seating: 7,
    status: 'disponible' as const,
    description: 'Ideal para familia y viajes largos',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80', // Nissan SUV
    ],
    features: ['Capacidad para 7 pasajeros', 'Ideal para familia', 'Perfecto para viajes largos']
  }
];

export async function addAllVehicles() {
  console.log('🚗 Iniciando proceso de agregar vehículos...');
  
  const results = [];
  
  for (let i = 0; i < vehiclesToAdd.length; i++) {
    const vehicle = vehiclesToAdd[i];
    try {
      console.log(`\n📝 Agregando vehículo ${i + 1}/5: ${vehicle.make} ${vehicle.model} ${vehicle.year}`);
      
      const result = await VehicleService.createVehicle(vehicle);
      results.push({ success: true, vehicle: result });
      
      console.log(`✅ ${vehicle.make} ${vehicle.model} agregado exitosamente`);
    } catch (error) {
      console.error(`❌ Error agregando ${vehicle.make} ${vehicle.model}:`, error);
      results.push({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
  }
  
  // Resumen
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n📊 Resumen:`);
  console.log(`✅ Vehículos agregados exitosamente: ${successful}`);
  console.log(`❌ Vehículos con error: ${failed}`);
  
  if (failed > 0) {
    console.log('\n🔍 Errores encontrados:');
    results.forEach((result, index) => {
      if (!result.success) {
        console.log(`- ${vehiclesToAdd[index].make} ${vehiclesToAdd[index].model}: ${result.error}`);
      }
    });
  }
  
  return results;
}

// Ejecutar si se llama directamente
if (typeof window !== 'undefined') {
  // Solo ejecutar en el navegador
  (window as any).addAllVehicles = addAllVehicles;
  console.log('🔧 Script cargado. Ejecuta addAllVehicles() en la consola para agregar los vehículos.');
}