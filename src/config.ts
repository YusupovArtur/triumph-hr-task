export const POLYGON_CONFIG = {
  viewBox: {
    width: 100,
    height: 100,
  },
  polygonSidesRange: [4, 8],
  fill: '#A00',
  stroke: '#111',
  strokeWidth: 2,
  strokeWidthActive: 4,
  paddingShare: 0.08,
  padding: 0,
};

POLYGON_CONFIG.padding = Math.max(POLYGON_CONFIG.viewBox.width, POLYGON_CONFIG.viewBox.height) * POLYGON_CONFIG.paddingShare;

export const SVG_CONFIG = {
  width: POLYGON_CONFIG.viewBox.width * 8,
  height: POLYGON_CONFIG.viewBox.height * 4,
  minScale: 0.3,
};

export const AXES_CONFIG = {
  strokeWidth: 2,
  gridWidth: 0.5,
  markLength: 12,
  fontSize: 10,
  labelMargin: 14,
  step: 50,
  strokeColor: '#000',
  gridColor: '#ccc',
};

export const LOCAL_STORAGE_ITEM = 'data';
