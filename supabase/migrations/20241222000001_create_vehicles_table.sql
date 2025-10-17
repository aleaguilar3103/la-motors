DROP TABLE IF EXISTS public.vehicles CASCADE;

CREATE TABLE public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  mileage INTEGER NOT NULL,
  fuel_type VARCHAR(50) NOT NULL CHECK (fuel_type IN ('Gasolina', 'Diesel', 'Eléctrico', 'Híbrido')),
  transmission VARCHAR(50) NOT NULL CHECK (transmission IN ('Manual', 'Automático', 'CVT')),
  drivetrain VARCHAR(50) NOT NULL CHECK (drivetrain IN ('FWD', 'RWD', 'AWD', '4WD')),
  exterior_color VARCHAR(100) NOT NULL,
  interior_color VARCHAR(100) NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  engine VARCHAR(200) NOT NULL,
  horsepower INTEGER NOT NULL,
  torque VARCHAR(100) NOT NULL,
  fuel_economy_city INTEGER NOT NULL,
  fuel_economy_highway INTEGER NOT NULL,
  seating INTEGER NOT NULL,
  doors INTEGER NOT NULL,
  body_style VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  vin VARCHAR(17) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'vendido', 'pendiente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Admin full access" ON public.vehicles FOR ALL USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;

INSERT INTO public.vehicles (
  make, model, year, price, mileage, fuel_type, transmission, drivetrain,
  exterior_color, interior_color, images, features, engine, horsepower, torque,
  fuel_economy_city, fuel_economy_highway, seating, doors, body_style, description, vin
) VALUES 
(
  'BMW', 'M3 Competition', 2024, 89900, 1250, 'Gasolina', 'Automático', 'RWD',
  'Blanco Alpino', 'Cuero Negro Merino',
  ARRAY[
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'
  ],
  ARRAY[
    'Escape M Performance',
    'Techo de Fibra de Carbono',
    'Suspensión Adaptiva M',
    'Sistema de Sonido Harman Kardon',
    'Carga Inalámbrica',
    'Head-Up Display',
    'Aviso de Cambio de Carril',
    'Monitoreo de Punto Ciego'
  ],
  '3.0L Twin-Turbo I6', 503, '479 lb-ft', 16, 23, 5, 4, 'Sedán',
  'Experimenta la cúspide del rendimiento con este impresionante BMW M3 Competition. Este sedán listo para pista combina lujo con potencia pura, con un motor twin-turbo y suspensión ajustada de precisión.',
  'WBS8M9C59P5K12345'
),
(
  'Mercedes-Benz', 'AMG GT 63 S', 2023, 165900, 2800, 'Gasolina', 'Automático', 'AWD',
  'Negro Magnetita Metálico', 'Cuero Nappa Rojo',
  ARRAY[
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80'
  ],
  ARRAY[
    'Escape AMG Performance',
    'Acabado Interior de Fibra de Carbono',
    'AMG Track Pace',
    'Sonido Envolvente 3D Burmester',
    'Paquete AMG Night',
    'Techo Panorámico',
    'Asientos Multicontorno Activos',
    'AMG Dynamic Select'
  ],
  '4.0L Twin-Turbo V8', 630, '664 lb-ft', 15, 21, 4, 4, 'Coupé',
  'Libera el rendimiento AMG puro con este excepcional GT 63 S. Este coupé de cuatro puertas ofrece aceleración impresionante y lujo en perfecta armonía.',
  'WDDYJ7JA5PA123456'
),
(
  'Porsche', '911 Turbo S', 2024, 230400, 890, 'Gasolina', 'Automático', 'AWD',
  'Rojo Guards', 'Cuero Negro',
  ARRAY[
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80'
  ],
  ARRAY[
    'Paquete Sport Chrono',
    'Frenos Cerámicos Compuestos',
    'Suspensión Activa Porsche',
    'Sonido Envolvente Bose',
    'Sistema de Escape Deportivo',
    'Faros LED Matrix',
    'Gestión de Comunicación Porsche',
    'Control de Crucero Adaptivo'
  ],
  '3.8L Twin-Turbo Flat-6', 640, '590 lb-ft', 15, 20, 4, 2, 'Coupé',
  'La expresión definitiva de la ingeniería Porsche. Este 911 Turbo S combina rendimiento legendario con usabilidad diaria en un paquete icónico.',
  'WP0AB2A99PS123456'
),
(
  'Audi', 'RS e-tron GT', 2023, 142400, 3200, 'Eléctrico', 'Automático', 'AWD',
  'Gris Daytona Perla', 'Cuero Marrón Coñac',
  ARRAY[
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'
  ],
  ARRAY[
    'Carga Rápida 800V',
    'Suspensión Neumática',
    'Sonido Premium Bang & Olufsen',
    'Faros LED Matrix',
    'Cockpit Virtual Plus',
    'Tracción Integral Quattro',
    'Interior de Fibra de Carbono',
    'Frenado Regenerativo'
  ],
  'Motores Eléctricos Duales', 637, '612 lb-ft', 107, 89, 4, 4, 'Sedán',
  'Experimenta el futuro del rendimiento con este impresionante RS e-tron GT. Cero emisiones, máxima emoción y tecnología de vanguardia.',
  'WAUZZZ4G5PN123456'
),
(
  'Lamborghini', 'Huracán EVO', 2023, 248295, 1850, 'Gasolina', 'Automático', 'AWD',
  'Arancio Borealis', 'Alcántara Negro',
  ARRAY[
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80'
  ],
  ARRAY[
    'Lamborghini Dinamica Veicolo Integrata',
    'Paquete de Fibra de Carbono',
    'Sistema de Elevación',
    'Sistema de Sonido Sensonum',
    'Interior de Alcántara',
    'Dirección en Ruedas Traseras',
    'Control de Tracción de Rendimiento',
    'Suspensión Magnetic Ride'
  ],
  '5.2L V10 Aspiración Natural', 631, '443 lb-ft', 13, 18, 2, 2, 'Coupé',
  'Pasión italiana pura se encuentra con tecnología de vanguardia. Este Huracán EVO ofrece una experiencia de conducción inolvidable con su V10 de aspiración natural.',
  'ZHWUC1ZF5PLA12345'
),
(
  'Tesla', 'Model S Plaid', 2024, 108490, 750, 'Eléctrico', 'Automático', 'AWD',
  'Blanco Perla Multi-Capa', 'Interior Premium Negro',
  ARRAY[
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'
  ],
  ARRAY[
    'Tracción Integral Tri-Motor',
    'Pantalla Cinematográfica de 17"',
    'Sistema de Audio Premium',
    'Capacidad de Conducción Autónoma Completa',
    'Actualizaciones Over-the-Air',
    'Modo de Defensa Bioarma',
    'Techo de Cristal',
    'Acceso a Red Supercharger'
  ],
  'Tri-Motor Eléctrico', 1020, '1050+ lb-ft', 120, 115, 5, 4, 'Sedán',
  'El auto de producción con aceleración más rápida jamás fabricado. Experimenta el futuro del rendimiento automotriz con este revolucionario Model S Plaid.',
  '5YJ3E1EA8PF123456'
);