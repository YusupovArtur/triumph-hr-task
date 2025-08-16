import { Coords } from '../../types/Coords';

export const getVector = (coords1: Coords, coords2: Coords): Coords => {
  return { x: coords2.x - coords1.x, y: coords2.y - coords1.y };
};
