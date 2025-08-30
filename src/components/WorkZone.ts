import { Zone } from '../classes/Zone';
import { PolygonItem } from './PolygonItem';
import { getSVGOffset } from '../helpers/render/getSVGOffset';
import { getTouchCoords } from '../helpers/vectors/getTouchCoords';
import { getTouchOffsetAndScale } from '../helpers/render/getTouchOffsetAndScale';
import { renderAxes } from '../helpers/render/renderAxes';
import { rescaleCoordinates } from '../helpers/rescaleCoordinates';
import { clamp } from '../helpers/clamp';
import { PolygonDragEventData } from '../types/PolygonDragEventData';
import { Coords } from '../types/Coords';
import { SVG_CONFIG, POLYGON_CONFIG, BG_COLOR } from '../config';
import { getDeviceType } from '../helpers/getDeviceType';

/**
 * Template for the WorkZone web component, defining styles and structure.
 * @private
 */
const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>
    :host {
      display: block;
      max-width: 50rem;
      width: 100%;
      height: fit-content;
    }
    svg {
      display: block;
      background-color: ${BG_COLOR};
      cursor: move;
      max-width: 50rem;
      width: 100%;
      height: 50dvh;
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
   * Stores the current coordinates (x, y) for each polygon, indexed by polygon id.
   * Used to position PolygonItem components in the SVG.
   * @private
   */
  private _polygonsCoords: Record<number, Coords> = {};

  /**
   * The group (<g>) element inside the SVG that contains axes/grid rendering.
   * Updated on scale and panning changes.
   * @private
   */
  private readonly _axesGroup: SVGGElement;

  /**
   * The SVG element that displays the grid of polygons and handles zooming/panning.
   * @private
   */
  private readonly _svg: SVGSVGElement;

  /**
   * The current scale factor for zooming (1 = default, <1 = zoom in, >1 = zoom out).
   * @private
   */
  private scale: number = 1;

  /**
   * The offset coordinates for panning the SVG viewBox.
   * @private
   */
  private offset: Coords = { x: 0, y: 0 };

  /**
   * Indicates whether the user is currently dragging the SVG for panning.
   * @private
   */
  private isDragging: boolean = false;

  /**
   * The last recorded mouse or touch coordinates during dragging.
   * @private
   */
  private lastMouseCoords: Coords | null = null;
  private lastTouchCoords: Coords | null = null;
  private lastTouchCoords1: Coords | null = null;
  private lastTouchCoords2: Coords | null = null;

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
    const svgRect = this._svg.getBoundingClientRect();
    this._svg.setAttribute('viewBox', `0 0 ${svgRect.width} ${svgRect.height}`);

    this._svg.addEventListener('wheel', this.handleWheel);
    this._svg.addEventListener('mousedown', this.handleMouseDown);
    this._svg.addEventListener('mousemove', this.handleMouseMove);
    this._svg.addEventListener('mouseup', this.handleMouseUp);
    this._svg.addEventListener('mouseleave', this.handleMouseUp);

    this._axesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this._axesGroup.setAttribute('id', 'axes');
    this._svg.appendChild(this._axesGroup);
    this.updateViewBox();
  }

  connectedCallback() {
    this.setDragAndDropHandler();
    this.addEventListener('drop', (event) => {
      event.preventDefault();
      const json = event.dataTransfer?.getData('text/plain');
      if (!json) return;

      try {
        const dataTransfer: PolygonDragEventData = JSON.parse(json);
        const svgRect = this._svg.getBoundingClientRect();

        let x = event.clientX - svgRect.left;
        let y = event.clientY - svgRect.top;
        const rescaledCoords = rescaleCoordinates(x, y, this._svg);
        const dx =
          getDeviceType() === 'desktop'
            ? dataTransfer.dragstartOffset.x * this.scale - (dataTransfer.data.sizes.width + POLYGON_CONFIG.padding) / 2
            : 0;
        const dy =
          getDeviceType() === 'desktop'
            ? dataTransfer.dragstartOffset.y * this.scale - (dataTransfer.data.sizes.height + POLYGON_CONFIG.padding) / 2
            : 0;
        rescaledCoords.x -= (dataTransfer.data.sizes.width + POLYGON_CONFIG.padding) / 2 + dx;
        rescaledCoords.y -= (dataTransfer.data.sizes.height + POLYGON_CONFIG.padding) / 2 + dy;
        x = clamp(rescaledCoords.x, 0, svgRect.width - (dataTransfer.data.sizes.width + POLYGON_CONFIG.padding));
        y = clamp(rescaledCoords.y, 0, svgRect.height - (dataTransfer.data.sizes.height + POLYGON_CONFIG.padding));
        this._polygonsCoords[dataTransfer.data.id] = { x, y };

        if (dataTransfer.dataSource === this.dataSource) {
          this._data.sort((a, b) => (a.id === dataTransfer.data.id ? 1 : b.id === dataTransfer.data.id ? -1 : 0));
          this._data.forEach((dataItem) => {
            dataItem.strokeWidth = POLYGON_CONFIG.strokeWidth;
          });
          this.render();
          this.dispatchEvent(new CustomEvent('polygon-moved-inner'));
        }
      } catch (error) {
        console.error('Drop event error', error);
      }
    });

    window.addEventListener('resize', () => {
      this.updateViewBox.call(this);
      this.render.call(this);
    });
    this._svg.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this._svg.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
  }

  get polygonsCoords() {
    return this._polygonsCoords;
  }

  set polygonsCoords(value: Record<number, Coords>) {
    this._polygonsCoords = value;
    this.render();
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
    this._svg.appendChild(this._axesGroup);

    const svgRect = this._svg.getBoundingClientRect();
    this._data.forEach((data) => {
      const coords: Coords = this._polygonsCoords[data.id] ?? { x: 0, y: 0 };
      const x = clamp(coords.x, 0, svgRect.width - (data.sizes.width + POLYGON_CONFIG.padding));
      const y = clamp(coords.y, 0, svgRect.height - (data.sizes.height + POLYGON_CONFIG.padding));

      const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      foreignObject.setAttribute('x', String(x));
      foreignObject.setAttribute('y', String(y));
      foreignObject.setAttribute('width', String(data.sizes.width + POLYGON_CONFIG.padding));
      foreignObject.setAttribute('height', String(data.sizes.height + POLYGON_CONFIG.padding));

      const item = document.createElement('polygon-item') as PolygonItem;
      item.data = data;
      item.dragstartCallback = this.handleMouseUp;
      item.dataSource = this.dataSource;

      foreignObject.appendChild(item);
      this._svg.appendChild(foreignObject);
    });
  }

  /**
   * Updates the SVG viewBox based on the current scale (zoom) and offset (pan).
   * Re-centers the content and redraws axes/grid.
   * @private
   */
  private updateViewBox() {
    const svgRect = this._svg.getBoundingClientRect();
    const x1 = (svgRect.width / 2) * (1 - this.scale) + this.offset.x;
    const y1 = (svgRect.height / 2) * (1 - this.scale) + this.offset.y;
    this._svg.setAttribute('viewBox', `${x1} ${y1} ${svgRect.width * this.scale} ${svgRect.height * this.scale}`);

    renderAxes(this._svg, this._axesGroup, this.scale);
  }

  /**
   * Handles mouse wheel events to zoom the SVG viewBox.
   * Adjusts the scale within the range [0.1, 1] and updates the viewBox.
   * @param event - The WheelEvent triggered by mouse wheel scrolling.
   * @private
   */
  private handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const dZoom = -this.scale * 0.075 * Math.sign(event.deltaY);
    this.scale = clamp(this.scale - dZoom, SVG_CONFIG.minScale, 1);

    this.offset = getSVGOffset(this._svg.getBoundingClientRect(), this.offset.x, this.offset.y, this.scale, 0, 0);
    this.updateViewBox();
  };

  /**
   * Handles mouse move events to pan the SVG viewBox during dragging.
   * Updates offset based on mouse movement and refreshes the viewBox.
   * @param event - The MouseEvent triggered by mouse movement.
   * @private
   */
  private handleMouseMove = (event: MouseEvent) => {
    if (!this.isDragging) return;
    if (this.lastMouseCoords === null) return;

    const dx = event.clientX - this.lastMouseCoords.x;
    const dy = event.clientY - this.lastMouseCoords.y;
    this.offset = getSVGOffset(this._svg.getBoundingClientRect(), this.offset.x, this.offset.y, this.scale, dx, dy);
    this.updateViewBox();

    this.lastMouseCoords = { x: event.clientX, y: event.clientY };
  };

  /**
   * Handles mouse down events to initiate panning.
   * Sets the dragging state and records the initial mouse position.
   * Changes the cursor to indicate dragging.
   * @param event - The MouseEvent triggered by pressing the mouse button.
   * @private
   */
  private handleMouseDown = (event: MouseEvent) => {
    this.isDragging = true;
    this.lastMouseCoords = { x: event.clientX, y: event.clientY };
    this._svg.style.cursor = 'grabbing';
  };

  /**
   * Handles mouse up and mouse leave events to end panning.
   * Resets the dragging state and restores the default cursor.
   * @private
   */
  private handleMouseUp = () => {
    this.isDragging = false;
    this._svg.style.cursor = 'move';
  };

  /**
   * Handles touchmove events for panning (single touch) and pinch-to-zoom (multitouch).
   * Prevents default scrolling, calculates new scale and offset, and updates viewBox.
   * @param event - The TouchEvent containing one or two touch points.
   * @private
   */
  private handleTouchMove(event: TouchEvent) {
    event.preventDefault();
    event.stopPropagation();
    const newOffsetAndScale = getTouchOffsetAndScale(
      this._svg.getBoundingClientRect(),
      event,
      this.offset,
      this.scale,
      this.lastTouchCoords,
      this.lastTouchCoords1,
      this.lastTouchCoords2,
    );
    if (newOffsetAndScale) {
      this.scale = newOffsetAndScale.scale;
      this.offset = newOffsetAndScale.offset;
      this.updateViewBox();
    }
    if (event.touches.length === 1 && event.touches[0]) {
      this.lastTouchCoords = getTouchCoords(event.touches[0]);
    } else if (event.touches.length === 2 && event.touches[0] && event.touches[1]) {
      this.lastTouchCoords1 = getTouchCoords(event.touches[0]);
      this.lastTouchCoords2 = getTouchCoords(event.touches[1]);
    }
  }

  /**
   * Handles touchend events to reset stored touch coordinates
   * when the gesture ends or fingers are lifted.
   * @private
   */
  private handleTouchEnd() {
    this.lastTouchCoords = null;
    this.lastTouchCoords1 = null;
    this.lastTouchCoords2 = null;
  }
}

/**
 * Registers the WorkZone as a custom element with the tag name 'work-zone'.
 */
customElements.define('work-zone', WorkZone);
