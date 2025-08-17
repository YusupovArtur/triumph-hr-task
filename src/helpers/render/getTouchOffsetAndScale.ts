import { getTouchCoords } from '../vectors/getTouchCoords';
import { abs } from '../vectors/abs';
import { getVector } from '../vectors/getVector';
import { dot } from '../vectors/dot';
import { multiply } from '../vectors/multiply';
import { clamp } from '../clamp';
import { getSVGOffset } from './getSVGOffset';
import { Coords } from '../../types/Coords';
import { SVG_CONFIG } from '../../config';

export const getTouchOffsetAndScale = (
  SVGRect: DOMRect,
  event: TouchEvent,
  offset: Coords,
  scale: number,
  touch: Coords | null,
  touch1: Coords | null,
  touch2: Coords | null,
): { offset: Coords; scale: number } | null => {
  event.preventDefault();
  event.stopPropagation();

  if (event.touches.length === 1 && touch !== null) {
    const touchVector = getVector(touch, getTouchCoords(event.touches[0]));
    const newOffset = getSVGOffset(SVGRect, offset.x, offset.y, scale, touchVector.x, touchVector.y);
    return { offset: newOffset, scale: scale };
  }

  if (event.touches.length === 2 && touch1 !== null && touch2 !== null) {
    const touchVector1 = getVector(touch1, getTouchCoords(event.touches[0]));
    const touchVector2 = getVector(touch2, getTouchCoords(event.touches[1]));

    const touchesDist = abs(getVector(getTouchCoords(event.touches[0]), getTouchCoords(event.touches[1])));
    const touchesDistVector1 = getVector(getTouchCoords(event.touches[0]), getTouchCoords(event.touches[1]));
    const touchesDistVector2 = getVector(getTouchCoords(event.touches[1]), getTouchCoords(event.touches[0]));

    const scrollDist1 = dot(touchVector1, touchesDistVector1) / touchesDist;
    const scrollDist2 = dot(touchVector2, touchesDistVector2) / touchesDist;

    const scrollVector1 = multiply(scrollDist1 / touchesDist, touchVector1);
    const scrollVector2 = multiply(scrollDist2 / touchesDist, touchVector2);

    const moveVector: Coords = {
      x: (touchVector1.x - scrollVector1.x) / 2 + (touchVector2.x - scrollVector2.x) / 2,
      y: (touchVector1.y - scrollVector1.y) / 2 + (touchVector2.y - scrollVector2.y) / 2,
    };

    const dScale = (touchesDist - scrollDist1 - scrollDist2) / touchesDist;
    const newScale = clamp(scale / dScale, SVG_CONFIG.minScale, 1);

    const newOffset = getSVGOffset(SVGRect, offset.x, offset.y, scale, moveVector.x, moveVector.y);

    return { offset: newOffset, scale: newScale };
  }

  return null;
};
