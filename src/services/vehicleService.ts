import { supabase } from "@/lib/supabase";
import { Vehicle, VehicleFormData } from "@/types/vehicle";

// Mock data as fallback
const mockVehicles: Vehicle[] = [];
export const VEHICLE_STORAGE_BUCKET = "la-motors-inventory";

export class VehicleService {
  // Obtener todos los vehículos
  static async getAllVehicles(): Promise<Vehicle[]> {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // Silently return mock data on error
        return mockVehicles;
      }

      return data || [];
    } catch (error) {
      // Silently return mock data on connection error
      return mockVehicles;
    }
  }

  // Obtener un vehículo por ID
  static async getVehicleById(id: string): Promise<Vehicle | null> {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return mockVehicles.find((v) => v.id === id) || null;
      }

      return data;
    } catch (error) {
      return mockVehicles.find((v) => v.id === id) || null;
    }
  }

  // Crear un nuevo vehículo
  static async createVehicle(vehicleData: VehicleFormData): Promise<Vehicle> {
    try {
      // Limpiar y preparar los datos
      const cleanedData = {
        make: vehicleData.make?.trim() || "",
        model: vehicleData.model?.trim() || "",
        year: vehicleData.year || new Date().getFullYear(),
        price: vehicleData.price || 0,
        mileage: vehicleData.mileage || 0,
        status: vehicleData.status || "disponible",
        images: Array.isArray(vehicleData.images)
          ? vehicleData.images.filter((img) => img && img.trim() !== "")
          : [],

        // Campos opcionales
        ...(vehicleData.fuel_type && { fuel_type: vehicleData.fuel_type }),
        ...(vehicleData.transmission && {
          transmission: vehicleData.transmission,
        }),
        ...(vehicleData.drivetrain && { drivetrain: vehicleData.drivetrain }),
        ...(vehicleData.exterior_color && {
          exterior_color: vehicleData.exterior_color.trim(),
        }),
        ...(vehicleData.interior_color && {
          interior_color: vehicleData.interior_color.trim(),
        }),
        ...(vehicleData.engine && { engine: vehicleData.engine.trim() }),
        ...(vehicleData.seating && { seating: vehicleData.seating }),
        ...(vehicleData.doors && { doors: vehicleData.doors }),
        ...(vehicleData.body_style && {
          body_style: vehicleData.body_style.trim(),
        }),
        ...(vehicleData.description && {
          description: vehicleData.description.trim(),
        }),

        ...(Array.isArray(vehicleData.features) &&
          vehicleData.features.some((f) => f && f.trim() !== "") && {
            features: vehicleData.features.filter((f) => f && f.trim() !== ""),
          }),

        vin:
          vehicleData.vin?.trim() ||
          `AUTO${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      };

      const { data, error } = await supabase
        .from("vehicles")
        .insert([cleanedData])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(`Error al crear el vehículo: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Create vehicle error:", error);
      throw error instanceof Error
        ? error
        : new Error("Error desconocido al crear el vehículo");
    }
  }

  // Actualizar un vehículo
  static async updateVehicle(
    id: string,
    vehicleData: Partial<VehicleFormData>,
  ): Promise<Vehicle> {
    try {
      // Preparar datos de actualización
      const cleanedData: any = {};

      if (vehicleData.make !== undefined)
        cleanedData.make = vehicleData.make?.trim() || "";
      if (vehicleData.model !== undefined)
        cleanedData.model = vehicleData.model?.trim() || "";
      if (vehicleData.year !== undefined) cleanedData.year = vehicleData.year;
      if (vehicleData.price !== undefined)
        cleanedData.price = vehicleData.price;
      if (vehicleData.mileage !== undefined)
        cleanedData.mileage = vehicleData.mileage;
      if (vehicleData.status !== undefined)
        cleanedData.status = vehicleData.status;

      // Campos opcionales
      if (vehicleData.fuel_type !== undefined)
        cleanedData.fuel_type = vehicleData.fuel_type || null;
      if (vehicleData.transmission !== undefined)
        cleanedData.transmission = vehicleData.transmission || null;
      if (vehicleData.drivetrain !== undefined)
        cleanedData.drivetrain = vehicleData.drivetrain || null;
      if (vehicleData.exterior_color !== undefined)
        cleanedData.exterior_color = vehicleData.exterior_color?.trim() || null;
      if (vehicleData.interior_color !== undefined)
        cleanedData.interior_color = vehicleData.interior_color?.trim() || null;
      if (vehicleData.engine !== undefined)
        cleanedData.engine = vehicleData.engine?.trim() || null;
      if (vehicleData.seating !== undefined)
        cleanedData.seating = vehicleData.seating || null;
      if (vehicleData.doors !== undefined)
        cleanedData.doors = vehicleData.doors || null;
      if (vehicleData.body_style !== undefined)
        cleanedData.body_style = vehicleData.body_style?.trim() || null;
      if (vehicleData.description !== undefined)
        cleanedData.description = vehicleData.description?.trim() || null;
      if (vehicleData.vin !== undefined)
        cleanedData.vin = vehicleData.vin?.trim() || null;

      if (vehicleData.images !== undefined) {
        cleanedData.images = Array.isArray(vehicleData.images)
          ? vehicleData.images.filter((img) => img && img.trim() !== "")
          : [];
      }
      if (vehicleData.features !== undefined) {
        cleanedData.features = Array.isArray(vehicleData.features)
          ? vehicleData.features.filter((f) => f && f.trim() !== "")
          : [];
      }

      const { data, error } = await supabase
        .from("vehicles")
        .update(cleanedData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        throw new Error(`Error al actualizar el vehículo: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Update vehicle error:", error);
      throw error instanceof Error
        ? error
        : new Error("Error desconocido al actualizar el vehículo");
    }
  }

  // Eliminar un vehículo
  static async deleteVehicle(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("vehicles").delete().eq("id", id);

      if (error) {
        console.error("Supabase delete error:", error);
        throw new Error(`Error al eliminar el vehículo: ${error.message}`);
      }
    } catch (error) {
      console.error("Delete vehicle error:", error);
      throw error instanceof Error
        ? error
        : new Error("Error desconocido al eliminar el vehículo");
    }
  }

  // Buscar vehículos
  static async searchVehicles(searchTerm: string): Promise<Vehicle[]> {
    try {
      const vehicles = await this.getAllVehicles();
      return vehicles.filter(
        (vehicle) =>
          vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.year.toString().includes(searchTerm),
      );
    } catch (error) {
      console.error("Error al buscar vehículos:", error);
      return mockVehicles;
    }
  }

  // Filtrar vehículos por marca
  static async getVehiclesByMake(make: string): Promise<Vehicle[]> {
    try {
      const vehicles = await this.getAllVehicles();
      return vehicles.filter((vehicle) => vehicle.make === make);
    } catch (error) {
      console.error("Error al filtrar por marca:", error);
      return mockVehicles.filter((vehicle) => vehicle.make === make);
    }
  }

  // Obtener estadísticas del inventario
  static async getInventoryStats() {
    try {
      const vehicles = await this.getAllVehicles();

      const total = vehicles.length;
      const disponibles = vehicles.filter(
        (v) => v.status === "disponible",
      ).length;
      const vendidos = vehicles.filter((v) => v.status === "vendido").length;
      const pendientes = vehicles.filter(
        (v) => v.status === "pendiente",
      ).length;
      const valorTotal = vehicles.reduce((sum, v) => sum + Number(v.price), 0);

      return {
        total,
        disponibles,
        vendidos,
        pendientes,
        valorTotal,
      };
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      return {
        total: mockVehicles.length,
        disponibles: mockVehicles.filter((v) => v.status === "disponible")
          .length,
        vendidos: mockVehicles.filter((v) => v.status === "vendido").length,
        pendientes: mockVehicles.filter((v) => v.status === "pendiente").length,
        valorTotal: mockVehicles.reduce((sum, v) => sum + Number(v.price), 0),
      };
    }
  }

  // Subir imagen de vehículo al storage
  static async uploadVehicleImage(file: File, vehicleId: string): Promise<string> {
    try {
      // Validar el archivo
      if (!file) {
        throw new Error("No se proporcionó ningún archivo");
      }

      // Validar tipo de archivo
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        throw new Error("Tipo de archivo no válido. Use JPG, PNG o WEBP");
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("El archivo es demasiado grande. Máximo 5MB");
      }

      // Generar nombre único para el archivo
      const fileExt = file.name.split(".").pop();
      const fileName = `${vehicleId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      // Subir archivo
      const { data, error } = await supabase.storage
        .from(VEHICLE_STORAGE_BUCKET)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new Error(`Error al subir imagen: ${error.message}`);
      }

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from(VEHICLE_STORAGE_BUCKET)
        .getPublicUrl(data.path);

      if (!publicUrlData?.publicUrl) {
        throw new Error("No se pudo obtener la URL pública de la imagen");
      }

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Upload image error:", error);
      throw error instanceof Error
        ? error
        : new Error("Error desconocido al subir la imagen");
    }
  }

  // Eliminar imagen del storage
  static async deleteVehicleImage(imageUrl: string): Promise<void> {
    try {
      // Extraer el path de la URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split(`/storage/v1/object/public/${VEHICLE_STORAGE_BUCKET}/`);
      
      if (pathParts.length < 2) {
        throw new Error("URL de imagen inválida");
      }

      const filePath = pathParts[1];

      const { error } = await supabase.storage
        .from(VEHICLE_STORAGE_BUCKET)
        .remove([filePath]);

      if (error) {
        throw new Error(`Error al eliminar imagen: ${error.message}`);
      }
    } catch (error) {
      console.error("Delete image error:", error);
      // No lanzar error para no bloquear otras operaciones
      console.warn("Continuando sin eliminar la imagen del storage");
    }
  }
}