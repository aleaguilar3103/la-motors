-- Eliminar tabla si existe (empezar desde cero)
DROP TABLE IF EXISTS public.vehicles CASCADE;

-- Crear tabla vehicles con todos los campos
CREATE TABLE public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Información básica (requeridos)
  make VARCHAR(200) NOT NULL,
  model VARCHAR(200) NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  mileage INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'vendido', 'pendiente')),
  
  -- Especificaciones técnicas (opcionales)
  fuel_type VARCHAR(50) CHECK (fuel_type IN ('Gasolina', 'Diesel', 'Eléctrico', 'Híbrido')),
  transmission VARCHAR(50) CHECK (transmission IN ('Manual', 'Automático', 'CVT')),
  drivetrain VARCHAR(50) CHECK (drivetrain IN ('FWD', 'RWD', 'AWD', '4WD')),
  
  -- Colores (opcionales)
  exterior_color VARCHAR(200),
  interior_color VARCHAR(200),
  
  -- Arrays (requeridos con default vacío)
  images TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  
  -- Motor y rendimiento (opcionales)
  engine VARCHAR(500),
  horsepower INTEGER,
  torque VARCHAR(200),
  fuel_economy_city INTEGER,
  fuel_economy_highway INTEGER,
  
  -- Capacidad (opcionales)
  seating INTEGER,
  doors INTEGER,
  
  -- Otros detalles (opcionales)
  body_style VARCHAR(200),
  description TEXT,
  vin VARCHAR(50),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para updated_at
CREATE TRIGGER update_vehicles_updated_at 
BEFORE UPDATE ON public.vehicles
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir todas las operaciones (público)
CREATE POLICY "Allow all operations" ON public.vehicles
FOR ALL 
USING (true)
WITH CHECK (true);

-- Crear índice único para VIN (solo cuando no es null)
CREATE UNIQUE INDEX vehicles_vin_unique ON public.vehicles (vin) WHERE vin IS NOT NULL;

-- Crear índices para mejorar el rendimiento de búsquedas
CREATE INDEX vehicles_make_idx ON public.vehicles (make);
CREATE INDEX vehicles_status_idx ON public.vehicles (status);
CREATE INDEX vehicles_created_at_idx ON public.vehicles (created_at DESC);

-- Agregar tabla a realtime (opcional, para actualizaciones en tiempo real)
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;

-- Insertar 3 vehículos de ejemplo para probar
INSERT INTO public.vehicles (
  make, model, year, price, mileage, fuel_type, transmission, drivetrain,
  exterior_color, interior_color, images, features, engine, horsepower, torque,
  fuel_economy_city, fuel_economy_highway, seating, doors, body_style, description, vin, status
) VALUES 
(
  'BMW', 'M3 Competition', 2024, 89900, 1250, 'Gasolina', 'Automático', 'RWD',
  'Blanco Alpino', 'Cuero Negro Merino',
  ARRAY[
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80'
  ],
  ARRAY['Escape M Performance', 'Techo de Fibra de Carbono', 'Suspensión Adaptiva M', 'Sistema de Sonido Harman Kardon'],
  '3.0L Twin-Turbo I6', 503, '479 lb-ft', 16, 23, 5, 4, 'Sedán',
  'Experimenta la cúspide del rendimiento con este impresionante BMW M3 Competition. Motor de 503 HP, aceleración de 0-100 km/h en 3.8 segundos.',
  'WBS8M9C59P5K12345', 'disponible'
),
(
  'Mercedes-Benz', 'AMG GT 63 S', 2023, 165900, 2800, 'Gasolina', 'Automático', 'AWD',
  'Negro Magnetita Metálico', 'Cuero Nappa Rojo',
  ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'],
  ARRAY['Escape AMG Performance', 'AMG Track Pace', 'Suspensión Neumática AMG RIDE CONTROL+', 'Techo Panorámico'],
  '4.0L Twin-Turbo V8', 630, '664 lb-ft', 15, 21, 4, 4, 'Coupé',
  'Libera el rendimiento AMG puro con este excepcional GT 63 S. Potencia brutal de 630 HP en un diseño elegante y deportivo.',
  'WDDYJ7JA5PA123456', 'disponible'
),
(
  'Porsche', '911 Turbo S', 2024, 230400, 890, 'Gasolina', 'Automático', 'AWD',
  'Rojo Guards', 'Cuero Negro',
  ARRAY['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80'],
  ARRAY['Paquete Sport Chrono', 'Frenos Cerámicos Compuestos', 'Sistema de Escape Deportivo', 'Asientos Deportivos Plus'],
  '3.8L Twin-Turbo Flat-6', 640, '590 lb-ft', 15, 20, 4, 2, 'Coupé',
  'La expresión definitiva de la ingeniería Porsche. 640 HP de potencia pura, 0-100 km/h en 2.7 segundos. Perfección alemana.',
  'WP0AB2A99PS123456', 'disponible'
);
