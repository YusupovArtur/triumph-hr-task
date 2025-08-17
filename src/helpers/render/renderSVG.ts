import { PolygonData } from '../../types/PolygonData';
import { renderPolygon } from './renderPolygon';
import { POLYGON_CONFIG } from '../../config';

export const renderSVG = (data: PolygonData) => {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');

  const padding = POLYGON_CONFIG.padding;

  svg.setAttribute(
    'viewBox',
    `${data.sizes.minX - padding / 2} ${data.sizes.minY - padding / 2} ${data.sizes.width + padding} ${data.sizes.height + padding}`,
  );

  svg.appendChild(renderPolygon(data));
  svg.style.width = `${data.sizes.width + padding}px`;
  svg.style.height = `${data.sizes.height + padding}px`;

  return svg;
};
