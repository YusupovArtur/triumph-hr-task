import { PolygonData } from '../types/PolygonData';
import { POLYGON_CONFIG } from '../config';
import { randomInt } from './randomInt';

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function genRandomPolygonData(
  viewBox = POLYGON_CONFIG.viewBox,
  polygonSidesRange = POLYGON_CONFIG.polygonSidesRange,
  fill = POLYGON_CONFIG.fill,
  stroke = POLYGON_CONFIG.stroke,
): PolygonData {
  const n = randomInt(polygonSidesRange[0], polygonSidesRange[1]);
  const maxLength = Math.min(viewBox.width, viewBox.height) / 2;

  const points: [number, number][] = [];

  for (let i = 0; i < n; i++) {
    const fi = (2 * Math.PI * i) / n + randomFloat(-Math.PI / n, Math.PI / n);
    const len = randomFloat(maxLength / 3, maxLength);

    const x = Math.sin(fi) * len + viewBox.width / 2;
    const y = Math.cos(fi) * len + viewBox.height / 2;
    points.push([Math.round(x), Math.round(y)]);
  }

  return { id: randomInt(100000, 1000000), points: points, fill: fill, stroke: stroke };
}
