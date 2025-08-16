import { AXES_CONFIG } from '../config';

/**
 * Redraws the axes and labels on the provided SVG group.
 * @param svg - The SVG element where the axes are drawn
 * @param axesGroup - The SVG group element to contain the axes
 * @param scale - The current zoom scale for adjusting line thickness and text size
 */
export function redrawAxes(svg: SVGSVGElement, axesGroup: SVGGElement, scale: number) {
  // очищаем группу
  while (axesGroup.firstChild) {
    axesGroup.removeChild(axesGroup.firstChild);
  }

  const viewBox = svg.viewBox.baseVal;
  const rect = svg.getBoundingClientRect();
  const minX = viewBox.x;
  const minY = viewBox.y;
  const maxX = minX + viewBox.width;
  const maxY = minY + viewBox.height;

  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', minX.toString());
  xAxis.setAttribute('y1', maxY.toString());
  xAxis.setAttribute('x2', maxX.toString());
  xAxis.setAttribute('y2', maxY.toString());
  xAxis.setAttribute('stroke', 'black');
  xAxis.setAttribute('stroke-width', (2 * AXES_CONFIG.strokeWidth * scale).toString());

  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', minX.toString());
  yAxis.setAttribute('y1', minY.toString());
  yAxis.setAttribute('x2', minX.toString());
  yAxis.setAttribute('y2', maxY.toString());
  yAxis.setAttribute('stroke', 'black');
  yAxis.setAttribute('stroke-width', (2 * AXES_CONFIG.strokeWidth * scale).toString());

  for (let x = Math.ceil(minX / AXES_CONFIG.step) * AXES_CONFIG.step; x <= maxX; x += AXES_CONFIG.step) {
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tick.setAttribute('x1', x.toString());
    tick.setAttribute('y1', maxY.toString());
    tick.setAttribute('x2', x.toString());
    tick.setAttribute('y2', (maxY - AXES_CONFIG.markLength * scale).toString());
    tick.setAttribute('stroke', AXES_CONFIG.strokeColor);
    tick.setAttribute('stroke-width', (AXES_CONFIG.strokeWidth * scale).toString());

    const grid = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    grid.setAttribute('x1', x.toString());
    grid.setAttribute('y1', maxY.toString());
    grid.setAttribute('x2', x.toString());
    grid.setAttribute('y2', minY.toString());
    grid.setAttribute('stroke', AXES_CONFIG.gridColor);
    grid.setAttribute('stroke-width', (AXES_CONFIG.gridWidth * scale).toString());

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x ? x.toString() : (minX + AXES_CONFIG.labelMargin * scale).toString());
    label.setAttribute('y', (maxY - AXES_CONFIG.labelMargin * scale).toString());
    label.setAttribute('font-size', (AXES_CONFIG.fontSize * scale).toString());
    label.setAttribute('style', 'user-select: none;');
    label.textContent = x.toString();

    axesGroup.appendChild(label);
    axesGroup.appendChild(tick);
    axesGroup.appendChild(grid);
  }

  const maxYReversed = rect.height - minY;
  const minYReversed = rect.height - maxY;

  for (let y = Math.ceil(minYReversed / AXES_CONFIG.step) * AXES_CONFIG.step; y <= maxYReversed; y += AXES_CONFIG.step) {
    const yReversed = rect.height - y;
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tick.setAttribute('x1', minX.toString());
    tick.setAttribute('y1', yReversed.toString());
    tick.setAttribute('x2', (minX + AXES_CONFIG.markLength * scale).toString());
    tick.setAttribute('y2', yReversed.toString());
    tick.setAttribute('stroke', AXES_CONFIG.strokeColor);
    tick.setAttribute('stroke-width', (AXES_CONFIG.strokeWidth * scale).toString());

    const grid = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    grid.setAttribute('x1', minX.toString());
    grid.setAttribute('y1', yReversed.toString());
    grid.setAttribute('x2', maxX.toString());
    grid.setAttribute('y2', yReversed.toString());
    grid.setAttribute('stroke', AXES_CONFIG.gridColor);
    grid.setAttribute('stroke-width', (AXES_CONFIG.gridWidth * scale).toString());

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', (minX + AXES_CONFIG.labelMargin * scale).toString());
    label.setAttribute('y', y ? yReversed.toString() : (maxY - AXES_CONFIG.labelMargin * scale).toString());
    label.setAttribute('font-size', (AXES_CONFIG.fontSize * scale).toString());
    label.setAttribute('style', 'user-select: none;');
    label.textContent = y.toString();

    axesGroup.appendChild(label);
    axesGroup.appendChild(tick);
    axesGroup.appendChild(grid);
  }

  axesGroup.appendChild(xAxis);
  axesGroup.appendChild(yAxis);
}
