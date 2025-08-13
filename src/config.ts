export const POLYGON_CONFIG = {
  viewBox: {
    width: 100,
    height: 100,
  },
  polygonSidesRange: [4, 8],
  fill: '#A00',
  stroke: '#111',
};

export const BUFFER_ZONE_CONFIG = {
  width: POLYGON_CONFIG.viewBox.width * 8,
  height: POLYGON_CONFIG.viewBox.height * 3,
};

export const CANVAS_CONFIG = {
  width: POLYGON_CONFIG.viewBox.width * 8,
  height: POLYGON_CONFIG.viewBox.height * 4,
};
