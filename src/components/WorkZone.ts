import { Zone } from '../classes/Zone';
import { PolygonItem } from './PolygonItem';
import { CANVAS_CONFIG, POLYGON_CONFIG } from '../config';
import { clamp } from '../helpers/clamp';
import { moveCoordinates } from '../helpers/moveCoordinates';

/**
 * Template for the WorkZone web component, defining styles and structure.
 * @private
 */
const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>
    :host {
      display: block;
      width: fit-content;
      height: fit-content;
      border: 1px solid #aaa;
      background-color: #FFFFFF;
      overflow: auto;
    }
    svg {
      display: block;
      background-color: #f0f0f0;
      cursor: move;
      width: ${CANVAS_CONFIG.width}px;
      height: ${CANVAS_CONFIG.height}px;
    }
  </style>
  <div>
    <svg></svg>
  </div>
`;

/**
 * A custom web component representing a working area for displaying SVG polygons in a grid.
 * Inherits from Zone to manage an array of PolygonData and supports drag-and-drop for moving
 * polygons between zones (e.g., BufferZone). Uses an SVG element with dynamic viewBox for
 * zooming and panning. Polygons are rendered as PolygonItem components within foreignObject
 * elements, arranged in a grid based on CANVAS_CONFIG and POLYGON_CONFIG.
 *
 * @example
 * ```html
 * <work-zone></work-zone>
 * ```
 * ```typescript
 * const workZone = document.querySelector('work-zone') as WorkZone;
 * workZone.data = [
 *   { points: [[10, 10], [20, 20], [10, 20]], fill: 'lightblue', stroke: 'blue' },
 *   { points: [[30, 30], [40, 40], [30, 40]], fill: 'lightgreen', stroke: 'green' }
 * ];
 * ```
 */
export class WorkZone extends Zone {
  /**
   * The SVG element that displays the grid of polygons and handles zooming/panning.
   * @private
   */
  private _svg: SVGSVGElement;

  /**
   * The current scale factor for zooming (1 = default, <1 = zoom in, >1 = zoom out).
   * @private
   */
  private scale: number = 1;

  /**
   * The offset coordinates for panning the SVG viewBox.
   * @private
   */
  private delta: { x: number; y: number } = { x: 0, y: 0 };

  /**
   * Indicates whether the user is currently dragging the SVG for panning.
   * @private
   */
  private isDragging: boolean = false;

  /**
   * The last recorded mouse X-coordinate during dragging.
   * @private
   */
  private lastMouseX: number = 0;

  /**
   * The last recorded mouse Y-coordinate during dragging.
   * @private
   */
  private lastMouseY: number = 0;

  /**
   * Initializes the component, sets up Shadow DOM, and attaches event listeners for
   * zooming (wheel), panning (mousedown, mousemove, mouseup, mouseleave), and drag-and-drop.
   * Sets the dataSource to 'work-zone' for identifying the component in drag-and-drop operations.
   */
  constructor() {
    super();
    this.dataSource = 'work-zone';
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(tpl.content.cloneNode(true));

    this._svg = shadow.querySelector('svg')!;
    this._svg.setAttribute('viewBox', `0 0 ${CANVAS_CONFIG.width} ${CANVAS_CONFIG.height}`);

    this._svg.addEventListener('wheel', this.handleWheel.bind(this));
    this._svg.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this._svg.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this._svg.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this._svg.addEventListener('mouseleave', this.handleMouseUp.bind(this));

    this.setDragAndDropHandler();
  }

  /**
   * Renders the array of PolygonData as a grid of PolygonItem components within the SVG.
   * Each PolygonItem is placed inside a foreignObject at calculated grid coordinates.
   * Updates the viewBox after rendering.
   * @protected
   */
  protected render() {
    while (this._svg.firstChild) {
      this._svg.removeChild(this._svg.firstChild);
    }

    const n = Math.floor(CANVAS_CONFIG.width / POLYGON_CONFIG.viewBox.width);

    this._data.forEach((polygonData, index) => {
      const offsetX = (index % n) * POLYGON_CONFIG.viewBox.width;
      const offsetY = Math.floor(index / n) * POLYGON_CONFIG.viewBox.height;

      const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      foreignObject.setAttribute('x', String(offsetX));
      foreignObject.setAttribute('y', String(offsetY));
      foreignObject.setAttribute('width', String(POLYGON_CONFIG.viewBox.width));
      foreignObject.setAttribute('height', String(POLYGON_CONFIG.viewBox.height));

      const item = document.createElement('polygon-item') as PolygonItem;
      item.data = polygonData;
      item.dragstartCallback = this.handleMouseUp.bind(this);
      item.dataSource = this.dataSource;

      foreignObject.appendChild(item);
      this._svg.appendChild(foreignObject);
    });

    this.updateViewBox();
  }

  /**
   * Updates the SVG viewBox based on the current scale and delta (panning offset).
   * The viewBox is calculated to center the content and apply zoom.
   * @private
   */
  private updateViewBox() {
    const x1 = (CANVAS_CONFIG.width / 2) * (1 - this.scale) + this.delta.x;
    const width = CANVAS_CONFIG.width * this.scale;
    const y1 = (CANVAS_CONFIG.height / 2) * (1 - this.scale) + this.delta.y;
    const height = CANVAS_CONFIG.height * this.scale;
    this._svg.setAttribute('viewBox', `${x1} ${y1} ${width} ${height}`);
  }

  /**
   * Handles mouse wheel events to zoom the SVG viewBox.
   * Adjusts the scale within the range [0.1, 1] and updates the viewBox.
   * @param event - The WheelEvent triggered by mouse wheel scrolling.
   * @private
   */
  private handleWheel(event: WheelEvent) {
    event.preventDefault();
    const dZoom = -this.scale * 0.075 * Math.sign(event.deltaY);
    this.scale = clamp(this.scale - dZoom, 0.1, 1);

    this.delta = moveCoordinates(this._svg.getBoundingClientRect(), this.delta.x, this.delta.y, this.scale, 0, 0);
    this.updateViewBox();
  }

  /**
   * Handles mouse move events to pan the SVG viewBox during dragging.
   * Updates delta based on mouse movement and refreshes the viewBox.
   * @param event - The MouseEvent triggered by mouse movement.
   * @private
   */
  private handleMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    const dx = event.clientX - this.lastMouseX;
    const dy = event.clientY - this.lastMouseY;

    this.delta = moveCoordinates(this._svg.getBoundingClientRect(), this.delta.x, this.delta.y, this.scale, dx, dy);
    this.updateViewBox();

    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  }

  /**
   * Handles mouse down events to initiate panning.
   * Sets the dragging state and records the initial mouse position.
   * Changes the cursor to indicate dragging.
   * @param event - The MouseEvent triggered by pressing the mouse button.
   * @private
   */
  private handleMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
    this._svg.style.cursor = 'grabbing';
  }

  /**
   * Handles mouse up and mouse leave events to end panning.
   * Resets the dragging state and restores the default cursor.
   * @private
   */
  private handleMouseUp() {
    this.isDragging = false;
    this._svg.style.cursor = 'move';
  }
}

/**
 * Registers the WorkZone as a custom element with the tag name 'work-zone'.
 */
customElements.define('work-zone', WorkZone);
