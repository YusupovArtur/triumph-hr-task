import { Coords } from '../types/Coords';

export const rescaleCoordinates = (x: number, y: number, svg: SVGSVGElement): Coords => {
  const rect = svg.getBoundingClientRect();
  const viewBox = svg.viewBox.baseVal;
  const minX = viewBox.x;
  const minY = viewBox.y;

  const scaleX = viewBox.width / rect.width;
  const scaleY = viewBox.height / rect.height;

  return { x: minX + x * scaleX, y: minY + y * scaleY };
};
