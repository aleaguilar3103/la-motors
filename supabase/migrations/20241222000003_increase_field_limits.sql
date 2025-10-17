-- Increase field limits to prevent "value too long" errors
ALTER TABLE public.vehicles 
  ALTER COLUMN make TYPE VARCHAR(200),
  ALTER COLUMN model TYPE VARCHAR(200),
  ALTER COLUMN exterior_color TYPE VARCHAR(200),
  ALTER COLUMN interior_color TYPE VARCHAR(200),
  ALTER COLUMN engine TYPE VARCHAR(500),
  ALTER COLUMN torque TYPE VARCHAR(200),
  ALTER COLUMN body_style TYPE VARCHAR(200),
  ALTER COLUMN vin TYPE VARCHAR(50);

-- Make some fields optional by removing NOT NULL constraints
ALTER TABLE public.vehicles 
  ALTER COLUMN fuel_type DROP NOT NULL,
  ALTER COLUMN transmission DROP NOT NULL,
  ALTER COLUMN drivetrain DROP NOT NULL,
  ALTER COLUMN exterior_color DROP NOT NULL,
  ALTER COLUMN interior_color DROP NOT NULL,
  ALTER COLUMN engine DROP NOT NULL,
  ALTER COLUMN horsepower DROP NOT NULL,
  ALTER COLUMN torque DROP NOT NULL,
  ALTER COLUMN fuel_economy_city DROP NOT NULL,
  ALTER COLUMN fuel_economy_highway DROP NOT NULL,
  ALTER COLUMN seating DROP NOT NULL,
  ALTER COLUMN doors DROP NOT NULL,
  ALTER COLUMN body_style DROP NOT NULL,
  ALTER COLUMN description DROP NOT NULL,
  ALTER COLUMN vin DROP NOT NULL;

-- Update constraints to allow NULL values
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_fuel_type_check;
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_transmission_check;
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_drivetrain_check;

-- Add new constraints that allow NULL
ALTER TABLE public.vehicles ADD CONSTRAINT vehicles_fuel_type_check 
  CHECK (fuel_type IS NULL OR fuel_type IN ('Gasolina', 'Diesel', 'Eléctrico', 'Híbrido'));

ALTER TABLE public.vehicles ADD CONSTRAINT vehicles_transmission_check 
  CHECK (transmission IS NULL OR transmission IN ('Manual', 'Automático', 'CVT'));

ALTER TABLE public.vehicles ADD CONSTRAINT vehicles_drivetrain_check 
  CHECK (drivetrain IS NULL OR drivetrain IN ('FWD', 'RWD', 'AWD', '4WD'));

-- Make VIN unique constraint conditional (only when not null)
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_vin_key;
CREATE UNIQUE INDEX vehicles_vin_unique ON public.vehicles (vin) WHERE vin IS NOT NULL;