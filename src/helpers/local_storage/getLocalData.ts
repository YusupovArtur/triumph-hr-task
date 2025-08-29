import { LocalStorageData } from '../../types/LocalStorageData';
import { DEFAULT_LOCAL_STORAGE_JSON_DATA, LOCAL_STORAGE_ITEM } from '../../config';
import { isLocalStorageData } from './isLocalStorageData';
import { getPolygonDataArray } from '../getPolygonDataArray';

const defaultData: LocalStorageData = {
  bufferZonePolygons: getPolygonDataArray(),
  workZonePolygons: [],
  polygonsCoords: {},
};

export function getLocalData(): LocalStorageData {
  const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ITEM) ?? DEFAULT_LOCAL_STORAGE_JSON_DATA) as unknown;

  if (isLocalStorageData(saved)) {
    return saved;
  }

  localStorage.removeItem(LOCAL_STORAGE_ITEM);
  return defaultData;
}
