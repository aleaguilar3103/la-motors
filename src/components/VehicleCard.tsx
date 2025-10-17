import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/types/vehicle';
import { Car, Fuel, Gauge, Calendar } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
}

export default function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('es-CR').format(mileage);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'Disponible';
      case 'vendido':
        return 'Vendido';
      case 'pendiente':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'default';
      case 'vendido':
        return 'secondary';
      case 'pendiente':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border-0 rounded-2xl">
        <div className="relative">
          <div className="aspect-video overflow-hidden rounded-xl bg-gray-100 relative">
            <img
              src={vehicle.images[0]}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                display: 'block'
              }}
              onError={(e) => {
                console.error('Error loading vehicle image:', vehicle.images[0]);
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTEyLjVMMTc1IDg3LjVIMTI1VjEzNy41SDE3NUwyMDAgMTEyLjVaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0yMDAgMTEyLjVMMjI1IDg3LjVIMjc1VjEzNy41SDIyNUwyMDAgMTEyLjVaIiBmaWxsPSIjOUI5QjlCIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3Mjg0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4K';
              }}
              onLoad={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'block';
              }}
            />
            <div className="absolute top-3 right-3">
              <Badge variant={vehicle.status === 'disponible' ? 'default' : 'secondary'}>
                {vehicle.status === 'disponible' ? 'Disponible' : 
                 vehicle.status === 'vendido' ? 'Vendido' : 'Pendiente'}
              </Badge>
            </div>
          </div>
          <div className="absolute top-4 left-4">
            <Badge 
              variant={getStatusVariant(vehicle.status)}
              className="bg-white/90 text-gray-900 hover:bg-white/95 font-semibold px-3 py-1"
            >
              {getStatusLabel(vehicle.status)}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge className="bg-black/80 text-white hover:bg-black/90 font-bold px-3 py-1">
              {formatPrice(vehicle.price)}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {vehicle.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Gauge className="w-4 h-4" />
                <span className="text-sm font-medium">{formatMileage(vehicle.mileage)} km</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Fuel className="w-4 h-4" />
                <span className="text-sm font-medium">{vehicle.fuel_type}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Car className="w-4 h-4" />
                <span className="text-sm font-medium">{vehicle.transmission}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{vehicle.year}</span>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {vehicle.exterior_color} • {vehicle.body_style}
                </span>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="text-primary font-semibold text-sm"
                >
                  Ver Detalles →
                </motion.div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}