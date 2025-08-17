import { PolygonData } from '../types/PolygonData';
import { getRandomPolygonData } from './getRandomPolygonData';
import { randomInt } from './randomInt';

export function getPolygonDataArray() {
  const data: PolygonData[] = [];
  for (let i = 0; i < randomInt(5, 20); i++) {
    data.push(getRandomPolygonData());
  }

  return data;
}
