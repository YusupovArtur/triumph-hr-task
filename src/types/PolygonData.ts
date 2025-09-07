import { Coords } from './Coords';
import { PolygonId } from './PolygonId';

export interface PolygonData {
  id: PolygonId;
  points: Coords[];
  fill: string;
  stroke: string;
  strokeWidth: number;
  sizes: {
    minX: number;
    minY: number;
    width: number;
    height: number;
  };
}
