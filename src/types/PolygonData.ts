import { Coords } from './Coords';

export interface PolygonData {
  id: number;
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
