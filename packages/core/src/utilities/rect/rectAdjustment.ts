import type {Coordinates, ClientRect} from '../../types';

export function createRectAdjustmentFn(modifier: number) {
  return function adjustClientRect(
    clientRect: ClientRect,
    ...adjustments: Coordinates[]
  ): ClientRect {
    return adjustments.reduce<ClientRect>(
      (acc, adjustment) => ({
        ...acc,
        top: acc.top + modifier * adjustment.y,
        bottom: acc.bottom + modifier * adjustment.y,
        left: acc.left + modifier * adjustment.x,
        right: acc.right + modifier * adjustment.x,
        offsetLeft: acc.offsetLeft + modifier * adjustment.x,
        offsetTop: acc.offsetTop + modifier * adjustment.y,
      }),
      {
        top: clientRect.top,
        left: clientRect.left,
        right: clientRect.right,
        bottom: clientRect.bottom,
        width: clientRect.width,
        height: clientRect.height,
        offsetTop: clientRect.offsetTop,
        offsetLeft: clientRect.offsetLeft,
      }
    );
  };
}

export const getAdjustedRect = createRectAdjustmentFn(1);
