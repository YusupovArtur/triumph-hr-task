import { clamp } from './clamp';

export const moveCoordinates = (SVGRect: DOMRect, x: number, y: number, scale: number, dx: number, dy: number) => {
  const dx_rescale = -dx * scale;
  const dy_rescale = -dy * scale;

  const x_max = (SVGRect.width * (1 - scale)) / 2;
  const y_max = (SVGRect.height * (1 - scale)) / 2;

  return { x: clamp(x + dx_rescale, -x_max, x_max), y: clamp(y + dy_rescale, -y_max, y_max) };
};
