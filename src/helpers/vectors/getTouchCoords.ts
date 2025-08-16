import { Coords } from '../../types/Coords';

export const getTouchCoords = (touch: Touch): Coords => {
  return { x: touch.clientX, y: touch.clientY };
};
