import { PolygonDragEventData } from './types/PolygonDragEventData';

export {};

declare global {
  interface HTMLElementEventMap {
    'polygon-moved': CustomEvent<PolygonDragEventData>;
    'polygon-moved-inner': CustomEvent<void>;
    'on-polygon-drop': CustomEvent<PolygonDragEventData>;
  }
}
