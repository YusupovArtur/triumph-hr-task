import { PolygonData } from '../../types/PolygonData';
import { Coords } from '../../types/Coords';
import { LocalStorageData } from '../../types/LocalStorageData';

function isCoords(obj: any): obj is Coords {
  return typeof obj === 'object' && obj !== null && typeof obj.x === 'number' && typeof obj.y === 'number';
}

function isPolygonData(obj: any): obj is PolygonData {
  if (typeof obj !== 'object' || obj === null) return false;

  if (
    typeof obj.id !== 'number' ||
    !Array.isArray(obj.points) ||
    typeof obj.fill !== 'string' ||
    typeof obj.stroke !== 'string' ||
    typeof obj.strokeWidth !== 'number' ||
    typeof obj.sizes !== 'object' ||
    obj.sizes === null
  ) {
    return false;
  }

  if (!obj.points.every(isCoords)) return false;

  const sizes = obj.sizes;
  if (
    typeof sizes.minX !== 'number' ||
    typeof sizes.minY !== 'number' ||
    typeof sizes.width !== 'number' ||
    typeof sizes.height !== 'number'
  ) {
    return false;
  }

  return true;
}

export function isLocalStorageData(obj: any): obj is LocalStorageData {
  if (typeof obj !== 'object' || obj === null) return false;

  if (
    !Array.isArray(obj.bufferZonePolygons) ||
    !Array.isArray(obj.workZonePolygons) ||
    typeof obj.polygonsCoords !== 'object' ||
    obj.polygonsCoords === null
  ) {
    return false;
  }

  if (!obj.bufferZonePolygons.every(isPolygonData) || !obj.workZonePolygons.every(isPolygonData)) {
    return false;
  }

  for (const key in obj.polygonsCoords) {
    if (isNaN(Number(key)) || !isCoords(obj.polygonsCoords[key])) {
      return false;
    }
  }

  return true;
}
