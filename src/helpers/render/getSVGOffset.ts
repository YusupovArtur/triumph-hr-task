import { clamp } from '../clamp';
import { Coords } from '../../types/Coords';

export const getSVGOffset = (SVGRect: DOMRect, x: number, y: number, scale: number, dx: number, dy: number): Coords => {
  const dx_rescale = -dx * scale;
  const dy_rescale = -dy * scale;

  const maxX = (SVGRect.width * (1 - scale)) / 2;
  const maxY = (SVGRect.height * (1 - scale)) / 2;

  return { x: clamp(x + dx_rescale, -maxX, maxX), y: clamp(y + dy_rescale, -maxY, maxY) };
};
