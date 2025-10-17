import { Vehicle } from '../types/vehicle';

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'BMW',
    model: 'M3 Competition',
    year: 2024,
    price: 89900000,
    mileage: 1250,
    fuel_type: 'Gasolina',
    transmission: 'Automático',
    drivetrain: 'RWD',
    exterior_color: 'Blanco Alpino',
    interior_color: 'Cuero Negro Merino',
    images: [
      'https://cdn.pixabay.com/photo/2016/04/01/12/11/car-1300629_1280.jpg',
      'https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_1280.jpg',
      'https://cdn.pixabay.com/photo/2016/02/13/13/11/oldtimer-1197800_1280.jpg',
      'https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg'
    ],
    features: [
      'Escape M Performance',
      'Techo de Fibra de Carbono',
      'Suspensión M Adaptativa',
      'Sistema de Sonido Harman Kardon',
      'Carga Inalámbrica',
      'Head-Up Display',
      'Advertencia de Salida de Carril',
      'Monitoreo de Punto Ciego'
    ],
    engine: '3.0L Twin-Turbo I6',
    seating: 5,
    doors: 4,
    body_style: 'Sedán',
    description: 'Experimenta la cúspide del rendimiento con este impresionante BMW M3 Competition. Este sedán listo para pista combina lujo con potencia pura.',
    vin: 'WBS8M9C59P5K12345',
    status: 'disponible',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    make: 'Mercedes-Benz',
    model: 'AMG GT 63 S',
    year: 2023,
    price: 165900000,
    mileage: 2800,
    fuel_type: 'Gasolina',
    transmission: 'Automático',
    drivetrain: 'AWD',
    exterior_color: 'Negro Magnetita Metálico',
    interior_color: 'Cuero Nappa Rojo',
    images: [
      'https://cdn.pixabay.com/photo/2018/04/10/11/33/car-3307916_1280.jpg',
      'https://cdn.pixabay.com/photo/2017/08/06/22/01/books-2596809_1280.jpg',
      'https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg',
      'https://cdn.pixabay.com/photo/2015/05/28/23/12/auto-788747_1280.jpg'
    ],
    features: [
      'Escape AMG Performance',
      'Acabado Interior de Fibra de Carbono',
      'AMG Track Pace',
      'Sonido Envolvente 3D Burmester',
      'Paquete AMG Night',
      'Techo Panorámico',
      'Asientos Multicontorno Activos',
      'AMG Dynamic Select'
    ],
    engine: '4.0L Twin-Turbo V8',
    seating: 4,
    doors: 4,
    body_style: 'Coupé',
    description: 'Libera el rendimiento AMG puro con este excepcional GT 63 S. Este coupé de cuatro puertas ofrece aceleración impresionante y lujo en perfecta armonía.',
    vin: 'WDDYJ7JA5PA123456',
    status: 'disponible',
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z'
  },
  {
    id: '3',
    make: 'Porsche',
    model: '911 Turbo S',
    year: 2024,
    price: 230400000,
    mileage: 890,
    fuel_type: 'Gasolina',
    transmission: 'Automático',
    drivetrain: 'AWD',
    exterior_color: 'Rojo Guards',
    interior_color: 'Cuero Negro',
    images: [
      'https://cdn.pixabay.com/photo/2012/11/02/13/02/car-63930_1280.jpg',
      'https://cdn.pixabay.com/photo/2016/04/01/12/11/car-1300629_1280.jpg',
      'https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_1280.jpg',
      'https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg'
    ],
    features: [
      'Paquete Sport Chrono',
      'Frenos Cerámicos Compuestos',
      'Suspensión Activa Porsche',
      'Sonido Envolvente Bose',
      'Sistema de Escape Deportivo',
      'Faros LED Matrix',
      'Gestión de Comunicación Porsche',
      'Control de Crucero Adaptativo'
    ],
    engine: '3.8L Twin-Turbo Flat-6',
    seating: 4,
    doors: 2,
    body_style: 'Coupé',
    description: 'La expresión definitiva de la ingeniería Porsche. Este 911 Turbo S combina rendimiento legendario con usabilidad diaria.',
    vin: 'WP0AB2A99PS123456',
    status: 'disponible',
    created_at: '2024-01-08T09:15:00Z',
    updated_at: '2024-01-08T09:15:00Z'
  },
  {
    id: '4',
    make: 'Audi',
    model: 'RS e-tron GT',
    year: 2023,
    price: 142400000,
    mileage: 3200,
    fuel_type: 'Eléctrico',
    transmission: 'Automático',
    drivetrain: 'AWD',
    exterior_color: 'Gris Daytona Perla',
    interior_color: 'Cuero Marrón Coñac',
    images: [
      'https://cdn.pixabay.com/photo/2018/04/10/11/33/car-3307916_1280.jpg',
      'https://cdn.pixabay.com/photo/2016/02/13/13/11/oldtimer-1197800_1280.jpg',
      'https://cdn.pixabay.com/photo/2015/05/28/23/12/auto-788747_1280.jpg',
      'https://cdn.pixabay.com/photo/2012/11/02/13/02/car-63930_1280.jpg'
    ],
    features: [
      'Carga Rápida 800V',
      'Suspensión Neumática',
      'Sonido Premium Bang & Olufsen',
      'Faros LED Matrix',
      'Cockpit Virtual Plus',
      'Tracción Integral Quattro',
      'Interior de Fibra de Carbono',
      'Frenado Regenerativo'
    ],
    engine: 'Motores Eléctricos Duales',
    seating: 4,
    doors: 4,
    body_style: 'Sedán',
    description: 'Experimenta el futuro del rendimiento con este impresionante RS e-tron GT. Cero emisiones, máxima emoción y tecnología de vanguardia.',
    vin: 'WAUZZZ4G5PN123456',
    status: 'disponible',
    created_at: '2024-01-05T16:45:00Z',
    updated_at: '2024-01-05T16:45:00Z'
  }
];

// Mock admin credentials (in a real app, this would be handled by a proper auth system)
export const mockAdmin = {
  username: 'admin',
  password: 'admin123'
};