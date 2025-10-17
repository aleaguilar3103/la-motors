import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@/types/vehicle";
import { VehicleService } from "@/services/vehicleService";
import VehicleDetailModal from "./VehicleDetailModal";
import Header from "./Header";
import {
  MessageCircle,
  Phone,
  Clock,
  MapPin,
  Mail,
  Shield,
  Award,
  Users,
} from "lucide-react";

interface AboutPageProps {
  onNavigateToAbout?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToContact?: () => void;
}

export default function AboutPage({
  onNavigateToAbout,
  onNavigateToHome,
  onNavigateToContact,
}: AboutPageProps) {
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
      setVehicles(data);
    } catch (error) {
      console.error("Error loading vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppContact = (message?: string) => {
    const defaultMessage =
      "Hola! Me interesa obtener más información sobre Los Ángeles Motors y sus vehículos.";
    const whatsappUrl = `https://wa.link/7udyd8?text=${encodeURIComponent(message || defaultMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const aboutBlocks = [
    {
      subtitle: "El Origen de la Calidad: Autos de Los Ángeles",
      text: "Los Ángeles Motors no es solo un dealer de autos; somos importadores directos que traemos lo mejor de Los Ángeles, California, a San Carlos. Esta conexión directa es nuestra garantía de calidad y precios competitivos.\\n\\nEn California, los vehículos están sujetos a climas más benignos y a estándares de mantenimiento muy altos, lo que significa que cada unidad que importamos está en condiciones superiores.\\n\\nAl eliminar la cadena de intermediarios, garantizamos que usted acceda a un inventario premium con la máxima transparencia, asegurando que el precio que ve es significativamente más bajo que el promedio del mercado.",
      image:
        "https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=800&q=80",
    },
    {
      subtitle: "El Motor de Nuestros Clientes: Financiamiento sin Estrés",
      text: "Nuestro verdadero diferenciador es el compromiso de que cualquier persona en San Carlos pueda estrenar.\\n\\nEntendemos que el trámite de crédito es a menudo la mayor barrera, por eso simplificamos el proceso al máximo: financiamos hasta el 50% del valor del vehículo con requisitos mínimos y una rapidez inigualable.\\n\\nNuestro enfoque es directo, sin intermediarios ni papeleo excesivo.\\n\\nEn Los Ángeles Motors, le brindamos la confianza, la transparencia y la solución financiera que necesita para pasar de la elección de su carro a tener la llave en la mano, en tiempo récord.",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToHome={onNavigateToHome}
        onNavigateToContact={onNavigateToContact}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            SOBRE NOSOTROS
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce la historia detrás de Los Ángeles Motors y nuestro compromiso
            con la excelencia
          </p>
        </motion.div>

        {/* About Blocks */}
        <div className="space-y-20 mb-20">
          {aboutBlocks.map((block, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
              >
                {/* Text Content */}
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                    {block.subtitle}
                  </h2>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {block.text.split("\\n\\n").map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-lg">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      src={block.image}
                      alt={block.subtitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por Qué Elegirnos?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Somos especialistas en vehículos premium con más de 15 años de
              experiencia en el mercado costarricense
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Garantía Completa
              </h3>
              <p className="text-gray-600">
                Todos nuestros vehículos incluyen garantía extendida y revisión
                técnica al día
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Calidad Premium
              </h3>
              <p className="text-gray-600">
                Seleccionamos únicamente vehículos de las mejores marcas y en
                excelente estado
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Atención Personalizada
              </h3>
              <p className="text-gray-600">
                Nuestro equipo de expertos te acompaña en todo el proceso de
                compra
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Financiamiento
              </h3>
              <p className="text-gray-600">
                Ofrecemos las mejores opciones de financiamiento adaptadas a tus
                necesidades
              </p>
            </div>
          </div>
        </div>

        {/* Vehicles Gallery Section */}
        <div className="mb-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestro Inventario
            </h2>
            <p className="text-xl text-gray-600">
              Descubre nuestra colección completa de vehículos premium
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 animate-pulse shadow-lg"
                >
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
                    <div
                      className="relative"
                      onClick={() => handleVehicleClick(vehicle)}
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={
                            vehicle.images[0] ||
                            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80"
                          }
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
                          <span className="text-gray-500">Kilometraje:</span>{" "}
                          {vehicle.mileage.toLocaleString()} km
                        </div>
                        <div className="text-gray-700">
                          <span className="text-gray-500">Combustible:</span>{" "}
                          {vehicle.fuel_type}
                        </div>
                        <div className="text-gray-700">
                          <span className="text-gray-500">Transmisión:</span>{" "}
                          {vehicle.transmission}
                        </div>
                        <div className="text-gray-700">
                          <span className="text-gray-500">Año:</span>{" "}
                          {vehicle.year}
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
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                ¿Interesado en algún vehículo?
              </h2>
              <p className="text-lg mb-6 text-blue-100">
                Contáctanos ahora y nuestro equipo te ayudará a encontrar el
                vehículo perfecto para ti
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <span>San Carlos, Costa Rica</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>+506 6000 3311</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>+506 8991 4651</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span>info@losangeles-motors.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span>
                    Lun - Vie: 8:00 AM - 6:00 PM | Sáb: 8:00 AM - 4:00 PM
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-4 text-lg"
                onClick={() => handleWhatsAppContact()}
              >
                <MessageCircle className="w-6 h-6 mr-2" />
                Contactar por WhatsApp
              </Button>
              <p className="mt-4 text-blue-100">
                Respuesta inmediata • Asesoría personalizada
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}

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