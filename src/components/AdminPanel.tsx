import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Vehicle } from '@/types/vehicle';
import { VehicleService } from '@/services/vehicleService';
import VehicleForm from './VehicleForm';
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Car, 
  DollarSign, 
  TrendingUp,
  Users,
  Eye,
  Settings,
  RefreshCw
} from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    vendidos: 0,
    pendientes: 0,
    valorTotal: 0
  });
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deleteVehicle, setDeleteVehicle] = useState<Vehicle | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vehiclesData, statsData] = await Promise.all([
        VehicleService.getAllVehicles(),
        VehicleService.getInventoryStats()
      ]);
      setVehicles(vehiclesData);
      setStats(statsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setSubmitting(true);
      console.log('Attempting to add vehicle:', vehicleData);
      
      await VehicleService.createVehicle(vehicleData);
      
      toast({
        title: "✅ Éxito",
        description: "Vehículo agregado correctamente",
      });
      setShowForm(false);
      await loadData(); // Reload data after successful creation
    } catch (error) {
      console.error('Error adding vehicle:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      toast({
        title: "❌ Error",
        description: `No se pudo agregar el vehículo: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingVehicle) return;
    
    try {
      setSubmitting(true);
      console.log('Attempting to edit vehicle:', editingVehicle.id, vehicleData);
      
      await VehicleService.updateVehicle(editingVehicle.id, vehicleData);
      
      toast({
        title: "✅ Éxito",
        description: "Vehículo actualizado correctamente",
      });
      setEditingVehicle(null);
      setShowForm(false);
      await loadData(); // Reload data after successful update
    } catch (error) {
      console.error('Error editing vehicle:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      toast({
        title: "❌ Error",
        description: `No se pudo actualizar el vehículo: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!deleteVehicle) return;
    
    try {
      console.log('Attempting to delete vehicle:', deleteVehicle.id);
      
      await VehicleService.deleteVehicle(deleteVehicle.id);
      
      toast({
        title: "✅ Éxito",
        description: "Vehículo eliminado correctamente",
      });
      setDeleteVehicle(null);
      await loadData(); // Reload data after successful deletion
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      toast({
        title: "❌ Error",
        description: `No se pudo eliminar el vehículo: ${errorMessage}`,
        variant: "destructive",
      });
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

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-12 w-16" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={loadData}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button
                variant="outline"
                onClick={onLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Vehículos</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Car className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disponibles</p>
                  <p className="text-3xl font-bold text-green-600">{stats.disponibles}</p>
                </div>
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vendidos</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.vendidos}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendientes}</p>
                </div>
                <Users className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Inventario</p>
                  <p className="text-2xl font-bold text-purple-600">{formatPrice(stats.valorTotal)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventario de Vehículos - Sin Tabs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Inventario de Vehículos</h2>
            <Button
              onClick={() => {
                setEditingVehicle(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Vehículo
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {loading ? (
                  <LoadingSkeleton />
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-900">Vehículo</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Precio</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Kilometraje</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Estado</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((vehicle, index) => (
                        <motion.tr
                          key={vehicle.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={vehicle.images[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'}
                                alt={`${vehicle.make} ${vehicle.model}`}
                                className="w-16 h-12 object-cover rounded-lg"
                              />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {vehicle.year} {vehicle.make} {vehicle.model}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {vehicle.exterior_color} • {vehicle.body_style}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-gray-900">
                              {formatPrice(vehicle.price)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-gray-700">
                              {new Intl.NumberFormat('es-US').format(vehicle.mileage)} km
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge variant={getStatusVariant(vehicle.status)}>
                              {getStatusLabel(vehicle.status)}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingVehicle(vehicle);
                                  setShowForm(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteVehicle(vehicle)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Vehicle Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingVehicle ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
                </h2>
                <VehicleForm
                  vehicle={editingVehicle}
                  onSubmit={editingVehicle ? handleEditVehicle : handleAddVehicle}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingVehicle(null);
                  }}
                  loading={submitting}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteVehicle} onOpenChange={() => setDeleteVehicle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Vehículo</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar el {deleteVehicle?.year} {deleteVehicle?.make} {deleteVehicle?.model}? 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVehicle}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}