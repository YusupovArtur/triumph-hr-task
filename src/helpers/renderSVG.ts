import { PolygonData } from '../types/PolygonData';
import { renderPolygon } from './renderPolygon';
import { POLYGON_CONFIG } from '../config';

export const renderSVG = (data: PolygonData) => {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${POLYGON_CONFIG.viewBox.width} ${POLYGON_CONFIG.viewBox.height}`);

  svg.appendChild(renderPolygon(data));

  return svg;
};
