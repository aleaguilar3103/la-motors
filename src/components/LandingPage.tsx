import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/types/vehicle';
import { VehicleService } from '@/services/vehicleService';
import VehicleDetailModal from './VehicleDetailModal';
import Header from './Header';
import { 
  Phone, 
  MessageCircle, 
  Shield, 
  Award, 
  Users, 
  CheckCircle,
  Car,
  Clock,
  MapPin,
  Mail,
  CreditCard,
  FileCheck,
  Key
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToGallery: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToContact?: () => void;
}

export default function LandingPage({ 
  onNavigateToGallery, 
  onNavigateToAbout, 
  onNavigateToHome, 
  onNavigateToContact 
}: LandingPageProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await VehicleService.getAllVehicles();
      setVehicles(data.slice(0, 6)); // Show only first 6 vehicles
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppContact = (message?: string) => {
    const defaultMessage = "Hola! Me interesa obtener más información sobre sus vehículos y opciones de financiamiento.";
    const whatsappUrl = `https://wa.link/7udyd8?text=${encodeURIComponent(message || defaultMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const whyChooseItems = [
    {
      icon: CreditCard,
      title: "FINANCIAMIENTO FLEXIBLE",
      text: "Ofrecemos opciones accesibles de financiamiento que se adaptan a tus necesidades. Haz realidad tu sueño de estrenar auto hoy mismo."
    },
    {
      icon: Shield,
      title: "INVENTARIO CERTIFICADO", 
      text: "Todos nuestros vehículos han sido revisados y certificados. Manejamos solo unidades seleccionadas con los más altos estándares de calidad."
    },
    {
      icon: Users,
      title: "SOPORTE LOCAL Y TRANSPARENTE",
      text: "Estamos ubicados en San Carlos. Te acompañamos en todo el proceso con claridad y sin letras pequeñas."
    }
  ];

  const financingSteps = [
    {
      step: "1",
      title: "Escoge y Prueba",
      text: "Visítanos en San Carlos y prueba tu vehículo ideal sin costo ni límite de tiempo de manejo.",
      icon: Car
    },
    {
      step: "2", 
      title: "Aprobación",
      text: "Te financiamos con el 50% del costo del vehículo y aprobación en menos de un minuto.",
      icon: FileCheck
    },
    {
      step: "3",
      title: "Llave en Mano", 
      text: "De inmediato podrás llevarte tu carro en mano o retirarlo el mismo día con firma y revisión documentada.",
      icon: Key
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-['Montserrat',sans-serif]">
      {/* Header */}
      <Header 
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToHome={onNavigateToHome}
        onNavigateToContact={onNavigateToContact}
      />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=80"
            alt="Luxury Car"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            ¡FINANCIAMIENTO DISPONIBLE EN TODOS NUESTROS VEHÍCULOS!
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-gray-200"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            ESTAMOS UBICADOS EN SAN CARLOS, COSTA RICA.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button 
              onClick={() => handleWhatsAppContact()}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 text-lg rounded-full transform hover:scale-105 transition-all duration-200"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              CONTÁCTANOS
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿POR QUÉ ELEGIR LOS ÁNGELES MOTORS?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {whyChooseItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-black border-gray-700 hover:border-orange-500 transition-all duration-300 h-full">
                  <CardContent className="p-8 text-center">
                    <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Vehículos Disponibles
            </h2>
            <p className="text-xl text-gray-600">
              Nuestro listado de vehículos, si no los ve al instante por favor espere mientras cargan, gracias.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse shadow-lg">
                  <div className="aspect-video bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white border-gray-200 hover:border-orange-500 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                    <div className="relative" onClick={() => handleVehicleClick(vehicle)}>
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={vehicle.images[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-orange-500 text-white font-bold">
                          {formatPrice(vehicle.price)}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {vehicle.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                        <div className="text-gray-700">
                          <span className="text-gray-500">Kilometraje:</span> {vehicle.mileage.toLocaleString()} km
                        </div>
                        <div className="text-gray-700">
                          <span className="text-gray-500">Combustible:</span> {vehicle.fuel_type}
                        </div>
                        <div className="text-gray-700">
                          <span className="text-gray-500">Transmisión:</span> {vehicle.transmission}
                        </div>
                        <div className="text-gray-700">
                          <span className="text-gray-500">Año:</span> {vehicle.year}
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleVehicleClick(vehicle)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                      >
                        Ver Detalles
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button 
              onClick={onNavigateToGallery}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 text-lg rounded-full"
            >
              Ver Todos los Vehículos
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Financing Steps Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¡TU CARRO EN 3 PASOS SIMPLES!
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Nuestro proceso de financiamiento es el más rápido de San Carlos. Sigue estos 3 pasos simples para obtener las llaves.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {financingSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-black border-gray-700 hover:border-orange-500 transition-all duration-300 h-full">
                  <CardContent className="p-8 text-center">
                    <div className="relative mb-6">
                      <div className="bg-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-white text-orange-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{step.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button 
              onClick={() => handleWhatsAppContact("Hola! Me interesa solicitar aprobación inmediata para financiamiento de un vehículo.")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 md:px-10 py-3 md:py-4 text-base md:text-xl rounded-full transform hover:scale-105 transition-all duration-200 w-full max-w-md mx-auto"
              size="lg"
            >
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
              <span className="text-sm md:text-xl">SOLICITAR APROBACIÓN INMEDIATA</span>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="lg:col-span-2">
              <img 
                src="https://assets.cdn.filesafe.space/pLPsOipNDbe25NdrJvsQ/media/68e00fe76fa5cab480bb11e0.png" 
                alt="Los Ángeles Motors" 
                className="h-12 w-auto mb-4"
              />
              <p className="text-gray-400 mb-4 max-w-md">
                Especialistas en vehículos premium con más de 15 años de experiencia en el mercado costarricense. Tu sueño de tener el auto perfecto está a solo un paso.
              </p>
              <Button 
                onClick={() => handleWhatsAppContact()}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contactar por WhatsApp
              </Button>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contacto</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span>+506 6000 3311</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span>+506 8991 4651</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-500" />
                  <span>info@losangeles-motors.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>San Carlos, Costa Rica</span>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Horarios</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <div>
                    <div>Lun - Vie: 8:00 AM - 6:00 PM</div>
                    <div>Sáb: 8:00 AM - 4:00 PM</div>
                    <div>Dom: Cerrado</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Los Ángeles Motors. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Vehicle Detail Modal */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVehicle(null);
        }}
      />
    </div>
  );
}