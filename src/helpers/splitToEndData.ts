import { PolygonData } from '../types/PolygonData';
import { PolygonId } from '../types/PolygonId';

export function splitToEndData(data: PolygonData[], id: PolygonId): PolygonData[] {
  const index = data.findIndex((dataItem: PolygonData) => dataItem.id === id);

  if (index === -1) {
    return data;
  }

  const [item] = data.splice(index, 1);
  data.push(item as PolygonData);

  return data;
}
