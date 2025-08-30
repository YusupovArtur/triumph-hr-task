import { LocalStorageData } from './types/LocalStorageData';

type PolygonConfig = {
  viewBox: {
    width: number;
    height: number;
  };
  polygonSidesRange: [number, number];
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeWidthActive: number;
  paddingShare: number;
  padding: number;
};

export const POLYGON_CONFIG: PolygonConfig = {
  viewBox: {
    width: 90,
    height: 90,
  },
  polygonSidesRange: [4, 8],
  fill: '#A00',
  stroke: '#000',
  strokeWidth: 2,
  strokeWidthActive: 4,
  paddingShare: 0.08,
  padding: 0,
};

POLYGON_CONFIG.padding = Math.max(POLYGON_CONFIG.viewBox.width, POLYGON_CONFIG.viewBox.height) * POLYGON_CONFIG.paddingShare;

export const BG_COLOR = '#1e2938';

export const SVG_CONFIG = {
  width: POLYGON_CONFIG.viewBox.width * 8,
  height: POLYGON_CONFIG.viewBox.height * 4,
  minScale: 0.3,
};

export const AXES_CONFIG = {
  strokeWidth: 2,
  gridWidth: 0.1,
  markLength: 12,
  fontSize: 10,
  labelMargin: 14,
  step: 50,
  strokeColor: '#ccc',
};

const defaultLocalData: LocalStorageData = {
  bufferZonePolygons: [],
  workZonePolygons: [],
  polygonsCoords: {},
};
export const DEFAULT_LOCAL_STORAGE_JSON_DATA = JSON.stringify(defaultLocalData);

export const LOCAL_STORAGE_ITEM = 'data';
