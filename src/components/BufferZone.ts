import { Zone } from '../classes/Zone';
import { PolygonItem } from './PolygonItem';
import { BG_COLOR, POLYGON_CONFIG } from '../config';
import { PolygonDropEventData } from '../types/PolygonDropEventData';
import { PolygonDragEventData } from '../types/PolygonDragEventData';
import { shiftIndexes } from '../helpers/shiftIndexes';

/**
 * Template for the BufferZone web component, defining styles and structure.
 * @private
 */
const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    }
    :host {
      display: block;
      max-width: 50rem;
      width: 100%;
      height: 25dvh;
      overflow: auto;
      border-radius: 1rem;
      background-color: ${BG_COLOR};
      margin-bottom: 0.5rem;
    }
    .container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 0.5rem;
      align-items: center;
      align-content: flex-start;
      height: 100%;
    }
  </style>
  <div class="container"></div>
`;

/**
 * A custom web component representing a buffer zone for storing SVG polygons.
 * Displays an array of PolygonData as PolygonItem components in a horizontal flex layout.
 * Supports drag-and-drop functionality for moving polygons to other zones (e.g., WorkZone).
 * Inherits from Zone, which provides data handling and drag-and-drop setup.
 * Uses Shadow DOM to encapsulate styles and structure.
 *
 * @example
 * ```html
 * <buffer-zone></buffer-zone>
 * ```
 * ```typescript
 * const bufferZone = document.querySelector('buffer-zone') as BufferZone;
 * bufferZone._data = [
 *   { points: [[10, 10], [20, 20], [10, 20]], fill: 'lightblue', stroke: 'blue' },
 *   { points: [[30, 30], [40, 40], [30, 40]], fill: 'lightgreen', stroke: 'green' }
 * ];
 * ```
 */
export class BufferZone extends Zone {
  /**
   * The container element that holds PolygonItem components.
   * @private
   */
  private _container: HTMLElement;

  /**
   * Initializes the component, sets up Shadow DOM, and configures drag-and-drop.
   * Sets the dataSource to 'buffer-zone' to identify the component in drag-and-drop operations.
   */
  constructor() {
    super();

    this.dataSource = 'buffer-zone';
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(tpl.content.cloneNode(true));
    this._container = shadow.querySelector('.container')!;
  }

  connectedCallback() {
    this.setDragAndDropHandler();
    this.addEventListener('on-polygon-drop', this.onPolygonDrop);
  }

  /**
   * Renders the array of PolygonData as PolygonItem components in a flex container.
   * Clears the container and creates a new PolygonItem for each data entry.
   * @protected
   */
  protected render() {
    this._container.innerHTML = '';
    this._data.forEach((polygonData) => {
      const item = document.createElement('polygon-item') as PolygonItem;
      item.data = polygonData;
      item.dataSource = this.dataSource;
      this._container.appendChild(item);
    });
  }

  private onPolygonDrop = (event: CustomEvent<PolygonDropEventData>) => {
    event.stopPropagation();
    if (event.detail.dataSource !== this.dataSource) {
      this.data.push(event.detail.data);
      this.dispatchEvent(
        new CustomEvent<PolygonDragEventData>('polygon-moved', {
          detail: event.detail,
          bubbles: true,
          composed: true,
        }),
      );
    }

    const dragStartId = event.detail.data.id;
    const dropId = event.detail.dropId;

    const index1 = this.data.findIndex((data) => data.id === dragStartId);
    const index2 = this.data.findIndex((data) => data.id === dropId);

    if (index1 !== -1 && this.data[index1]) {
      this.data[index1].strokeWidth = POLYGON_CONFIG.strokeWidth;
    }

    if (index2 !== -1 && this.data[index2]) {
      this.data[index2].strokeWidth = POLYGON_CONFIG.strokeWidth;
    }

    if (index1 !== -1 && index2 !== -1) {
      this.data = shiftIndexes(this.data, index1, index2);
      this.render();
    }
  };
}

/**
 * Registers the BufferZone as a custom element with the tag name 'buffer-zone'.
 */
customElements.define('buffer-zone', BufferZone);
