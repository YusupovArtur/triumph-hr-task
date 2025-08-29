import { PolygonData } from './PolygonData';
import { DataSource } from './DataSource';

export type PolygonDragEventData = {
  data: PolygonData;
  dataSource: DataSource;
  dropId: number | null;
  dragstartOffset: {
    x: number;
    y: number;
  };
};
