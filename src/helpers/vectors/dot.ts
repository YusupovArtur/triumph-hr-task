import { Coords } from '../../types/Coords';

export const dot = (coords1: Coords, coords2: Coords): number => {
  return coords1.x * coords2.x + coords1.y * coords2.y;
};
