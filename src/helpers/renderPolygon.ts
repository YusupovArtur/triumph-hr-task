import { PolygonData } from '../types/PolygonData';

export const renderPolygon = (data: PolygonData) => {
  const svgNS = 'http://www.w3.org/2000/svg';

  const polygon = document.createElementNS(svgNS, 'polygon');
  const pointsString = data.points.map((point) => `${point.x},${point.y}`).join(' ');

  polygon.setAttribute('points', pointsString);
  polygon.setAttribute('fill', data.fill);
  polygon.setAttribute('stroke', data.stroke);
  polygon.setAttribute('stroke-width', data.strokeWidth.toString());

  return polygon;
};
