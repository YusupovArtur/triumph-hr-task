import { PolygonData } from '../types/PolygonData';
import { DataSource } from '../types/DataSource';
import { renderSVG } from '../helpers/renderSVG';
import { POLYGON_CONFIG } from '../config';

/**
 * Template for the PolygonItem web component, defining styles and structure.
 * @private
 */
const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>
    :host {
      display: inline-block;
      user-select: none;
      margin: 0;
      padding: 0;
      border: 0;
    }
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      border: 0;
      font: inherit;
      vertical-align: baseline;
    }
    svg {
      display: block;
      width: ${POLYGON_CONFIG.viewBox.width}px;
      height: ${POLYGON_CONFIG.viewBox.height}px;
    }
    .wrap {
      display: block;
      width: fit-content;
      height: fit-content;
      cursor: grab;
    }
  </style>
  <div class="wrap" draggable="true"></div>
`;

/**
 * A custom web component that renders an SVG polygon and supports drag-and-drop.
 * The component displays a polygon based on provided PolygonData and allows dragging
 * to move the polygon between zones (e.g., BufferZone and WorkZone).
 * Uses Shadow DOM to encapsulate styles and structure.
 *
 * @example
 * ```html
 * <polygon-item data-source="buffer-zone"></polygon-item>
 * ```
 * ```typescript
 * const polygonItem = document.querySelector('polygon-item') as PolygonItem;
 * polygonItem.data = { points: [[10, 10], [20, 20], [10, 20]], fill: 'lightblue', stroke: 'blue' };
 * polygonItem.dragstartCallback = () => console.log('Drag started');
 * ```
 */
export class PolygonItem extends HTMLElement {
  /**
   * The polygon data containing points, fill, and stroke properties.
   * @private
   */
  private _data: PolygonData | null = null;

  /**
   * The wrapper div element that contains the SVG and handles drag events.
   * @private
   */
  private _wrap: HTMLElement;

  /**
   * The source identifier for the component (e.g., 'buffer-zone' or 'work-zone').
   * Used to track the origin of the polygon during drag-and-drop.
   */
  public dataSource: DataSource = null;

  /**
   * Optional callback function invoked when the dragstart event is triggered.
   * Useful for notifying parent components (e.g., to stop dragging the WorkZone).
   */
  public dragstartCallback: (() => void) | undefined = undefined;

  /**
   * Initializes the component, sets up Shadow DOM, and attaches event listeners for drag-and-drop.
   */
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(tpl.content.cloneNode(true));
    this._wrap = shadow.querySelector('.wrap')!;

    // Handle dragstart event for drag-and-drop
    this._wrap.addEventListener('dragstart', (event: DragEvent) => {
      if (this.dragstartCallback) {
        this.dragstartCallback();
      }

      if (!this._data) return;
      event.dataTransfer?.setData(
        'text/plain',
        JSON.stringify({
          data: this._data,
          dataSource: this.dataSource,
        }),
      );
      event.dataTransfer!.effectAllowed = 'move';
    });

    // Prevent mousemove and mousedown events from bubbling to parent elements
    this._wrap.addEventListener('mousemove', (event: MouseEvent) => {
      event.stopPropagation();
    });

    this._wrap.addEventListener('mousedown', (event: MouseEvent) => {
      event.stopPropagation();
    });
  }

  /**
   * Sets the polygon data and triggers rendering.
   * Also stores the serialized data in the dataset for external access.
   * @param polygonData - The data defining the polygon's points, fill, and stroke.
   */
  set data(polygonData: PolygonData) {
    this._data = polygonData;
    this.dataset.serialized = JSON.stringify(polygonData);
    this.render();
  }

  /**
   * Gets the current polygon data.
   * @returns The current PolygonData or null if not set.
   */
  get data(): PolygonData | null {
    return this._data;
  }

  /**
   * Renders the SVG polygon inside the wrapper div based on the current data.
   * Clears previous content and uses renderSVG to generate the SVG element.
   * @private
   */
  private render() {
    this._wrap.innerHTML = '';
    if (!this._data || !Array.isArray(this._data.points)) return;

    this._wrap.appendChild(renderSVG(this._data));
  }
}

/**
 * Registers the PolygonItem as a custom element with the tag name 'polygon-item'.
 */
customElements.define('polygon-item', PolygonItem);
