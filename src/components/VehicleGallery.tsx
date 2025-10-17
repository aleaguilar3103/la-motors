import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import VehicleCard from "./VehicleCard";
import VehicleDetailModal from "./VehicleDetailModal";
import { Vehicle } from "@/types/vehicle";
import { VehicleService } from "@/services/vehicleService";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Car,
  MessageCircle,
  Shield,
  Award,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import Header from "./Header";

interface VehicleGalleryProps {
  onAdminClick?: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToContact?: () => void;
}

export default function VehicleGallery({
  onAdminClick,
  onNavigateToAbout,
  onNavigateToHome,
  onNavigateToContact,
}: VehicleGalleryProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterMake, setFilterMake] = useState("all");
  const [filterFuelType, setFilterFuelType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const { toast } = useToast();

  // Cargar vehículos al montar el componente
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const data = await VehicleService.getAllVehicles();
      setVehicles(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los vehículos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Obtener marcas y tipos de combustible únicos
  const makes = useMemo(() => {
    const uniqueMakes = [...new Set(vehicles.map((v) => v.make))].sort();
    return uniqueMakes;
  }, [vehicles]);

  const fuelTypes = useMemo(() => {
    const uniqueFuelTypes = [
      ...new Set(vehicles.map((v) => v.fuel_type)),
    ].sort();
    return uniqueFuelTypes;
  }, [vehicles]);

  // Filtrar y ordenar vehículos
  const filteredVehicles = useMemo(() => {
    let filtered = vehicles.filter((vehicle) => {
      const matchesSearch =
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.year.toString().includes(searchTerm);

      const matchesMake = filterMake === "all" || vehicle.make === filterMake;
      const matchesFuelType =
        filterFuelType === "all" || vehicle.fuel_type === filterFuelType;

      let matchesPrice = true;
      if (priceRange !== "all") {
        const price = vehicle.price;
        switch (priceRange) {
          case "under-50m":
            matchesPrice = price < 50000000;
            break;
          case "50m-100m":
            matchesPrice = price >= 50000000 && price < 100000000;
            break;
          case "over-100m":
            matchesPrice = price >= 100000000;
            break;
        }
      }

      return matchesSearch && matchesMake && matchesFuelType && matchesPrice;
    });

    // Ordenar vehículos
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "year-new":
        filtered.sort((a, b) => b.year - a.year);
        break;
      case "year-old":
        filtered.sort((a, b) => a.year - b.year);
        break;
      case "mileage-low":
        filtered.sort((a, b) => a.mileage - b.mileage);
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
    }

    return filtered;
  }, [vehicles, searchTerm, sortBy, filterMake, filterFuelType, priceRange]);

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("newest");
    setFilterMake("all");
    setFilterFuelType("all");
    setPriceRange("all");
  };

  const activeFiltersCount = [
    searchTerm,
    sortBy !== "newest" ? sortBy : null,
    filterMake !== "all" ? filterMake : null,
    filterFuelType !== "all" ? filterFuelType : null,
    priceRange !== "all" ? priceRange : null,
  ].filter(Boolean).length;

  // Componente de carga
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToHome={onNavigateToHome}
        onNavigateToContact={onNavigateToContact}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin access - hidden button */}
        <div
          className="fixed top-20 right-4 opacity-0 hover:opacity-100 transition-opacity duration-300 z-50"
          onDoubleClick={onAdminClick}
          title="Doble clic para acceder al panel de administración"
        >
          <div className="w-8 h-8 bg-black/10 rounded-full"></div>
        </div>

        {/* Búsqueda y Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por marca, modelo o año..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Más Recientes</SelectItem>
                  <SelectItem value="price-low">
                    Precio: Menor a Mayor
                  </SelectItem>
                  <SelectItem value="price-high">
                    Precio: Mayor a Menor
                  </SelectItem>
                  <SelectItem value="year-new">Año: Más Nuevo</SelectItem>
                  <SelectItem value="year-old">Año: Más Antiguo</SelectItem>
                  <SelectItem value="mileage-low">Menor Kilometraje</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterMake} onValueChange={setFilterMake}>
                <SelectTrigger className="w-40 h-12">
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Marcas</SelectItem>
                  {makes.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterFuelType} onValueChange={setFilterFuelType}>
                <SelectTrigger className="w-40 h-12">
                  <SelectValue placeholder="Combustible" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Tipos</SelectItem>
                  {fuelTypes.map((fuelType) => (
                    <SelectItem key={fuelType} value={fuelType}>
                      {fuelType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Rango de Precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Precios</SelectItem>
                  <SelectItem value="under-50m">Menos de ₡50M</SelectItem>
                  <SelectItem value="50m-100m">₡50M - ₡100M</SelectItem>
                  <SelectItem value="over-100m">Más de ₡100M</SelectItem>
                </SelectContent>
              </Select>

              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="h-12 flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Limpiar Filtros
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Encabezado de Resultados */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {loading
                ? "Cargando..."
                : `${filteredVehicles.length} Vehículo${filteredVehicles.length !== 1 ? "s" : ""} Disponible${filteredVehicles.length !== 1 ? "s" : ""}`}
            </h2>
            <p className="text-gray-600 mt-1">
              Descubre nuestra colección premium de vehículos de lujo y alto
              rendimiento
            </p>
          </div>
        </div>

        {/* Grid de Vehículos */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredVehicles.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                layout
              >
                <VehicleCard
                  vehicle={vehicle}
                  onClick={() => handleVehicleClick(vehicle)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron vehículos
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar tus criterios de búsqueda o filtros
            </p>
            <Button onClick={clearFilters} variant="outline">
              Limpiar Todos los Filtros
            </Button>
          </div>
        )}

        {/* Sección Sobre Nosotros */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
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

        {/* Sección de Contacto */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
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
                onClick={() => window.open("https://wa.link/7udyd8", "_blank")}
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
      {/* Modal de Detalle del Vehículo */}
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