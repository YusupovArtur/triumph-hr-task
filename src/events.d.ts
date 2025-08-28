import { PolygonDragEventData } from './types/PolygonDragEventData';
import { PolygonDropEventData } from './types/PolygonDropEventData';

export {};

declare global {
  interface HTMLElementEventMap {
    'polygon-moved': CustomEvent<PolygonDragEventData>;
    'polygon-moved-inner': CustomEvent<void>;
    'on-polygon-drop': CustomEvent<PolygonDropEventData>;
  }
}
