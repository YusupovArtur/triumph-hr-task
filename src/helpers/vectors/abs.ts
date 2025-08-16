import { Coords } from '../../types/Coords';

export const abs = (vector: Coords): number => {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2);
};
