import { Coords } from '../../types/Coords';

export const multiply = (k: number, vector: Coords): Coords => {
  return { x: k * vector.x, y: k * vector.y };
};
