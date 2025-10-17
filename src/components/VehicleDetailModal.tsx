import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Vehicle } from '@/types/vehicle';
import ImageLightbox from './ImageLightbox';
import { 
  Car, 
  Fuel, 
  Gauge, 
  Calendar, 
  Cog, 
  Users, 
  DoorOpen,
  MessageCircle,
  MapPin,
  X
} from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleDetailModal({ vehicle, isOpen, onClose }: VehicleDetailModalProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Resetear el lightbox cuando se cierre el modal principal
  useEffect(() => {
    if (!isOpen) {
      setLightboxOpen(false);
      setLightboxIndex(0);
    }
  }, [isOpen]);

  if (!vehicle) return null;

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

  const handleWhatsAppContact = () => {
    const message = `Hola! Estoy interesado en el ${vehicle.year} ${vehicle.make} ${vehicle.model} por ${formatPrice(vehicle.price)}. ¿Podrían darme más información?`;
    const whatsappUrl = `https://wa.link/7udyd8?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleImageClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const specItems = [
    { icon: Cog, label: 'Motor', value: vehicle.engine },
    { icon: Users, label: 'Asientos', value: vehicle.seating ? `${vehicle.seating} Asientos` : null },
    { icon: DoorOpen, label: 'Puertas', value: vehicle.doors ? `${vehicle.doors} Puertas` : null },
    { icon: Car, label: 'Carrocería', value: vehicle.body_style },
    { icon: Calendar, label: 'Año', value: vehicle.year.toString() },
    { icon: Fuel, label: 'Combustible', value: vehicle.fuel_type }
  ].filter(item => item.value); // Solo mostrar items que tienen valor

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0 bg-white">
          <div className="relative">
            {/* Header */}
            <DialogHeader className="p-6 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </DialogTitle>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={getStatusVariant(vehicle.status)}
                      className="font-semibold"
                    >
                      {getStatusLabel(vehicle.status)}
                    </Badge>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(vehicle.price)}
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Image Carousel */}
            <div className="px-6 mb-6">
              <Carousel className="w-full">
                <CarouselContent>
                  {vehicle.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[16/9] overflow-hidden rounded-xl relative">
                        <img
                          src={image}
                          alt={`${vehicle.make} ${vehicle.model} - Imagen ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay clickeable para ampliar */}
                        <div 
                          className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center cursor-pointer group"
                          onClick={(e) => handleImageClick(index, e)}
                        >
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
                            Click para ampliar
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {vehicle.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4 bg-black/80 text-white border-black/80 hover:bg-black hover:text-white w-12 h-12" />
                    <CarouselNext className="right-4 bg-black/80 text-white border-black/80 hover:bg-black hover:text-white w-12 h-12" />
                  </>
                )}
              </Carousel>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Key Stats */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Información Clave</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Gauge className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <div className="font-semibold">{formatMileage(vehicle.mileage)}</div>
                        <div className="text-sm text-gray-600">Kilómetros</div>
                      </div>
                      {vehicle.fuel_type && (
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <Fuel className="w-6 h-6 mx-auto mb-2 text-primary" />
                          <div className="font-semibold">{vehicle.fuel_type}</div>
                          <div className="text-sm text-gray-600">Combustible</div>
                        </div>
                      )}
                      {vehicle.transmission && (
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <Car className="w-6 h-6 mx-auto mb-2 text-primary" />
                          <div className="font-semibold">{vehicle.transmission}</div>
                          <div className="text-sm text-gray-600">Transmisión</div>
                        </div>
                      )}
                      {vehicle.drivetrain && (
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <Cog className="w-6 h-6 mx-auto mb-2 text-primary" />
                          <div className="font-semibold">{vehicle.drivetrain}</div>
                          <div className="text-sm text-gray-600">Tracción</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Specifications */}
                  {specItems.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Especificaciones</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {specItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <item.icon className="w-5 h-5 text-primary" />
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-sm text-gray-600">{item.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description - Moved to the end */}
                  {vehicle.description && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Descripción</h3>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Vehículo confiable y económico</span>
                      </div>
                      <div className="flex items-start gap-2 mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Ideal para ciudad y uso diario</span>
                      </div>
                      <div className="flex items-start gap-2 mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Mantenimiento al día</span>
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {vehicle.features && vehicle.features.length > 0 && vehicle.features[0] !== '' && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Características y Opciones</h3>
                      <div className="grid md:grid-cols-2 gap-2">
                        {vehicle.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Vehicle Details */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Detalles del Vehículo</h3>
                    <div className="space-y-3">
                      {vehicle.exterior_color && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Color Exterior</span>
                          <span className="font-medium">{vehicle.exterior_color}</span>
                        </div>
                      )}
                      {vehicle.interior_color && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Color Interior</span>
                          <span className="font-medium">{vehicle.interior_color}</span>
                        </div>
                      )}
                      {vehicle.body_style && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Carrocería</span>
                          <span className="font-medium">{vehicle.body_style}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kilometraje</span>
                        <span className="font-medium">{formatMileage(vehicle.mileage)} km</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
                    <h3 className="text-lg font-semibold mb-4">¿Interesado en este vehículo?</h3>
                    <div className="space-y-4">
                      <Button 
                        className="w-full bg-white text-green-600 hover:bg-gray-100 font-bold" 
                        onClick={handleWhatsAppContact}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contactar por WhatsApp
                      </Button>
                      <div className="text-sm text-green-100 space-y-2">
                        <p className="font-medium">✓ Respuesta inmediata</p>
                        <p className="font-medium">✓ Asesoría personalizada</p>
                        <p className="font-medium">✓ Financiamiento disponible</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      <ImageLightbox
        images={vehicle.images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}