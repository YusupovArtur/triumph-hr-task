import { clamp } from './clamp';

export const shiftIndexes = <T>(order: T[], index1: number, index2: number): T[] => {
  index1 = clamp(index1, 0, order.length - 1);
  index2 = clamp(index2, 0, order.length);

  if (index1 === index2) {
    return order;
  }

  const newOrder = [...order];
  const [moved] = newOrder.splice(index1, 1);

  // @ts-ignore
  newOrder.splice(index2, 0, moved);
  return newOrder;
};
