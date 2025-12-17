import type { ICategory } from './ICategory';
import type { IVehicle } from './IVehicle';

export interface ILocation {
  id: React.Key;
  categoryId: number | null;
  vehicleId: number | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  category?: ICategory | null;
  vehicle?: IVehicle | null;
}

