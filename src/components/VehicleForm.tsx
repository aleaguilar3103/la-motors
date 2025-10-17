import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, X, Save, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { Vehicle, VehicleFormData } from '@/types/vehicle';
import { VehicleService } from '@/services/vehicleService';

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSuccess?: (vehicle: Vehicle) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export default function VehicleForm({ vehicle, onSuccess, onCancel, loading = false }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    price: vehicle?.price || 0,
    mileage: vehicle?.mileage || 0,
    fuel_type: vehicle?.fuel_type || 'Gasolina' as const,
    transmission: vehicle?.transmission || 'Automático' as const,
    drivetrain: vehicle?.drivetrain || 'FWD' as const,
    exterior_color: vehicle?.exterior_color || '',
    interior_color: vehicle?.interior_color || '',
    images: vehicle?.images || [''],
    features: vehicle?.features || [''],
    engine: vehicle?.engine || '',
    seating: vehicle?.seating || 5,
    doors: vehicle?.doors || 4,
    body_style: vehicle?.body_style || '',
    description: vehicle?.description || '',
    status: vehicle?.status || 'disponible' as const,
  });

  // Estados para controlar qué campos están habilitados
  const [fieldEnabled, setFieldEnabled] = useState({
    engine: !!vehicle?.engine,
    seating: !!vehicle?.seating,
    doors: !!vehicle?.doors,
    body_style: !!vehicle?.body_style,
    description: !!vehicle?.description,
    exterior_color: !!vehicle?.exterior_color,
    interior_color: !!vehicle?.interior_color,
    fuel_type: !!vehicle?.fuel_type,
    transmission: !!vehicle?.transmission,
    drivetrain: !!vehicle?.drivetrain,
    features: !!(vehicle?.features && vehicle.features.length > 0 && vehicle.features[0] !== ''),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const multipleFileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuel_type: 'Gasolina' as const,
      transmission: 'Automático' as const,
      drivetrain: 'FWD' as const,
      exterior_color: '',
      interior_color: '',
      images: [''],
      features: [''],
      engine: '',
      seating: 5,
      doors: 4,
      body_style: '',
      description: '',
      status: 'disponible' as const,
    });
    
    setFieldEnabled({
      engine: false,
      seating: false,
      doors: false,
      body_style: false,
      description: false,
      exterior_color: false,
      interior_color: false,
      fuel_type: false,
      transmission: false,
      drivetrain: false,
      features: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(true);

    try {
      // Validación básica
      if (!formData.make.trim() || !formData.model.trim()) {
        throw new Error('Marca y modelo son obligatorios');
      }

      if (!formData.price || formData.price <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }

      if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
        throw new Error('Año inválido');
      }

      console.log('Submitting vehicle data:', formData);

      let result;
      if (vehicle) {
        // Actualizar vehículo existente
        result = await VehicleService.updateVehicle(vehicle.id, formData);
        console.log('Vehicle updated:', result);
      } else {
        // Crear nuevo vehículo
        result = await VehicleService.createVehicle(formData);
        console.log('Vehicle created:', result);
      }

      setSubmitSuccess(true);
      
      // Llamar callback de éxito
      if (onSuccess) {
        onSuccess(result);
      }

      // Limpiar formulario si es creación
      if (!vehicle) {
        resetForm();
      }

      // Auto-cerrar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setSubmitError(errorMessage);
      
      // Auto-limpiar error después de 5 segundos
      setTimeout(() => {
        setSubmitError(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleField = (fieldName: keyof typeof fieldEnabled) => {
    setFieldEnabled(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const handleMultipleFileUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    
    fileArray.forEach((file) => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target?.result as string;
          if (base64String) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images.filter(img => img.trim() !== ''), base64String]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const addSingleImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Información Básica - Campos Obligatorios */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica (Obligatorio)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="make">Marca</Label>
            <Input
              id="make"
              value={formData.make}
              onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
              placeholder="BMW, Mercedes, etc."
              required
            />
          </div>
          
          <div>
            <Label htmlFor="model">Modelo</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              placeholder="M3, AMG GT, etc."
              required
            />
          </div>
          
          <div>
            <Label htmlFor="year">Año</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              min="1900"
              max={new Date().getFullYear() + 1}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="price">Precio (₡)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
              min="0"
              placeholder="50000000"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="mileage">Kilometraje</Label>
            <Input
              id="mileage"
              type="number"
              value={formData.mileage}
              onChange={(e) => setFormData(prev => ({ ...prev, mileage: parseInt(e.target.value) }))}
              min="0"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="vendido">Vendido</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Detalles del Vehículo - Campos Opcionales */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Vehículo (Opcional)</CardTitle>
          <p className="text-sm text-gray-600">Activa solo los campos para los que tengas información</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Especificaciones Técnicas - Lista vertical */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Especificaciones Técnicas</h4>
            
            {/* Tipo de Combustible */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={fieldEnabled.fuel_type}
                  onCheckedChange={() => toggleField('fuel_type')}
                />
                <Label htmlFor="fuel_type" className="font-medium">Tipo de Combustible</Label>
              </div>
              {fieldEnabled.fuel_type && (
                <Select
                  value={formData.fuel_type}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, fuel_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gasolina">Gasolina</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            {/* Transmisión */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={fieldEnabled.transmission}
                  onCheckedChange={() => toggleField('transmission')}
                />
                <Label htmlFor="transmission" className="font-medium">Transmisión</Label>
              </div>
              {fieldEnabled.transmission && (
                <Select
                  value={formData.transmission}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, transmission: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automático">Automático</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            {/* Tracción */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={fieldEnabled.drivetrain}
                  onCheckedChange={() => toggleField('drivetrain')}
                />
                <Label htmlFor="drivetrain" className="font-medium">Tracción</Label>
              </div>
              {fieldEnabled.drivetrain && (
                <Select
                  value={formData.drivetrain}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, drivetrain: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FWD">FWD</SelectItem>
                    <SelectItem value="RWD">RWD</SelectItem>
                    <SelectItem value="AWD">AWD</SelectItem>
                    <SelectItem value="4WD">4WD</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Motor */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={fieldEnabled.engine}
                  onCheckedChange={() => toggleField('engine')}
                />
                <Label htmlFor="engine" className="font-medium">Motor</Label>
              </div>
              {fieldEnabled.engine && (
                <Input
                  id="engine"
                  value={formData.engine}
                  onChange={(e) => setFormData(prev => ({ ...prev, engine: e.target.value }))}
                  placeholder="3.0L Twin-Turbo V6"
                />
              )}
            </div>
            
            {/* Capacidad de Asientos */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={fieldEnabled.seating}
                  onCheckedChange={() => toggleField('seating')}
                />
                <Label htmlFor="seating" className="font-medium">Capacidad de Asientos</Label>
              </div>
              {fieldEnabled.seating && (
                <Input
                  id="seating"
                  type="number"
                  value={formData.seating}
                  onChange={(e) => setFormData(prev => ({ ...prev, seating: parseInt(e.target.value) }))}
                  min="1"
                  max="8"
                />
              )}
            </div>
            
            {/* Número de Puertas */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={fieldEnabled.doors}
                  onCheckedChange={() => toggleField('doors')}
                />
                <Label htmlFor="doors" className="font-medium">Número de Puertas</Label>
              </div>
              {fieldEnabled.doors && (
                <Input
                  id="doors"
                  type="number"
                  value={formData.doors}
                  onChange={(e) => setFormData(prev => ({ ...prev, doors: parseInt(e.target.value) }))}
                  min="2"
                  max="5"
                />
              )}
            </div>
          </div>

          {/* Colores - Separados */}
          <div className="border-t pt-6 space-y-4">
            <h4 className="text-lg font-medium">Colores</h4>
            
            {/* Color Exterior */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={fieldEnabled.exterior_color}
                  onCheckedChange={() => toggleField('exterior_color')}
                />
                <Label htmlFor="exterior_color" className="font-medium">Color Exterior</Label>
              </div>
              {fieldEnabled.exterior_color && (
                <Input
                  id="exterior_color"
                  value={formData.exterior_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, exterior_color: e.target.value }))}
                  placeholder="Blanco Alpino, etc."
                />
              )}
            </div>
            
            {/* Color Interior */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={fieldEnabled.interior_color}
                  onCheckedChange={() => toggleField('interior_color')}
                />
                <Label htmlFor="interior_color" className="font-medium">Color Interior</Label>
              </div>
              {fieldEnabled.interior_color && (
                <Input
                  id="interior_color"
                  value={formData.interior_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, interior_color: e.target.value }))}
                  placeholder="Cuero Negro, etc."
                />
              )}
            </div>
          </div>

          {/* Tipo de Carrocería */}
          <div className="border-t pt-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={fieldEnabled.body_style}
                  onCheckedChange={() => toggleField('body_style')}
                />
                <Label htmlFor="body_style" className="font-medium">Tipo de Carrocería</Label>
              </div>
              {fieldEnabled.body_style && (
                <Input
                  id="body_style"
                  value={formData.body_style}
                  onChange={(e) => setFormData(prev => ({ ...prev, body_style: e.target.value }))}
                  placeholder="Sedán, Coupé, SUV, etc."
                />
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="border-t pt-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={fieldEnabled.description}
                  onCheckedChange={() => toggleField('description')}
                />
                <Label htmlFor="description" className="font-medium">Descripción</Label>
              </div>
              {fieldEnabled.description && (
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción detallada del vehículo..."
                  rows={4}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Imágenes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Imágenes del Vehículo
            <div className="flex gap-2">
              <Button 
                type="button" 
                onClick={() => multipleFileInputRef.current?.click()} 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Subir Múltiples
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input oculto para múltiples archivos */}
          <input
            ref={multipleFileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleMultipleFileUpload(e.target.files);
                // Limpiar el input para permitir seleccionar los mismos archivos de nuevo
                e.target.value = '';
              }
            }}
          />

          {/* Galería de imágenes - Solo mostrar imágenes válidas */}
          {formData.images.length > 0 && formData.images.some(img => img.trim() !== '') && (
            <div>
              <h4 className="font-medium mb-3">Imágenes Subidas ({formData.images.filter(img => img.trim() !== '').length})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.images.map((image, index) => {
                  if (!image.trim()) return null;
                  
                  return (
                    <div key={index} className="relative group">
                      <div className="aspect-video overflow-hidden rounded-lg border bg-gray-50">
                        <img
                          src={image}
                          alt={`Vista previa ${index + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                            imageRendering: 'auto'
                          }}
                          onError={(e) => {
                            console.error('Error loading image:', image);
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                          onLoad={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'block';
                          }}
                        />
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge variant={index === 0 ? "default" : "secondary"} className="text-xs">
                          {index === 0 ? 'Principal' : `${index + 1}`}
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeImage(index)}
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mensajes de Estado */}
          {submitError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {submitError}
              </AlertDescription>
            </Alert>
          )}

          {submitSuccess && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">¡Éxito!</AlertTitle>
              <AlertDescription className="text-green-700">
                {vehicle ? 'Vehículo actualizado correctamente' : 'Vehículo creado correctamente'}
              </AlertDescription>
            </Alert>
          )}

          {/* Información del Sistema de Imágenes */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Sistema de Imágenes Mejorado:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• <strong>Permanentes:</strong> Las imágenes se guardan permanentemente en Base64</li>
                  <li>• <strong>Sin pérdidas:</strong> No se pierden al recargar la página</li>
                  <li>• <strong>Compatibilidad total:</strong> Funcionan en desktop y móvil</li>
                  <li>• <strong>Subida múltiple:</strong> Selecciona varias imágenes a la vez</li>
                  <li>• <strong>Formatos soportados:</strong> JPG, PNG, WebP, GIF</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Características */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Características del Vehículo</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Activa para agregar características especiales</p>
            </div>
            <Switch
              checked={fieldEnabled.features}
              onCheckedChange={() => toggleField('features')}
            />
          </div>
        </CardHeader>
        {fieldEnabled.features && (
          <CardContent className="space-y-4">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Ej: Sistema de navegación GPS"
                  className="flex-1"
                />
                {formData.features.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeFeature(index)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" onClick={addFeature} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Característica
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Botones de Acción */}
      <div className="flex gap-4 pt-6">
        <Button 
          type="submit" 
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {vehicle ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {vehicle ? 'Actualizar Vehículo' : 'Crear Vehículo'}
            </>
          )}
        </Button>
        
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}