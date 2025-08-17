import { PolygonData } from './PolygonData';
import { Coords } from './Coords';

export type LocalStorageData = {
  bufferZonePolygons: PolygonData[];
  workZonePolygons: PolygonData[];
  polygonsCoords: Record<number, Coords>;
};
