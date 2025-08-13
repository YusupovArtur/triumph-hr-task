import { PolygonData } from '../types/PolygonData';

export const renderPolygon = (data: PolygonData) => {
  const svgNS = 'http://www.w3.org/2000/svg';

  const polygon = document.createElementNS(svgNS, 'polygon');
  const pointsString = data.points.map((point) => point.join(',')).join(' ');

  polygon.setAttribute('points', pointsString);
  polygon.setAttribute('fill', data.fill);
  polygon.setAttribute('stroke', data.stroke);
  polygon.setAttribute('stroke-width', '2');

  return polygon;
};
