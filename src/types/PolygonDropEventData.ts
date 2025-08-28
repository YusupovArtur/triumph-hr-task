import { PolygonDragEventData } from './PolygonDragEventData';

export type PolygonDropEventData = PolygonDragEventData & {
  dropId: number;
};
