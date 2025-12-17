import type { IUser } from './IUser';
import type { ILocation } from './ILocation';

export interface IFavorite {
  userId: number;
  transportLocationId: number;
  user?: IUser;
  transportLocation?: ILocation;
}

