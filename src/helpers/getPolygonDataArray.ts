import { PolygonData } from '../types/PolygonData';
import { genRandomPolygonData } from './genRandomPolygonData';
import { randomInt } from './randomInt';

export const getPolygonDataArray = () => {
  const data: PolygonData[] = [];
  for (let i = 0; i < randomInt(5, 20); i++) {
    data.push(genRandomPolygonData());
  }

  return data;
};
