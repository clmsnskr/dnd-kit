import {isHTMLElement, isWindow} from '@dnd-kit/utilities';

import type {Coordinates, ClientRect, LayoutRect, ViewRect} from '../../types';
import {getScrollableAncestors, getScrollOffsets} from '../scroll';
import {defaultCoordinates} from '../coordinates';

function getEdgeOffset(
  node: HTMLElement | null,
  parent: (Node & ParentNode) | null,
  offset = defaultCoordinates
): Coordinates {
  if (!node || !isHTMLElement(node)) {
    return offset;
  }

  const nodeOffset = {
    x: offset.x + node.offsetLeft,
    y: offset.y + node.offsetTop,
  };

  if (node.offsetParent === parent) {
    return nodeOffset;
  }

  return getEdgeOffset(node.offsetParent as HTMLElement, parent, nodeOffset);
}

export function getLayoutRect(element: HTMLElement): LayoutRect {
  const {offsetWidth: width, offsetHeight: height} = element;
  const {x: offsetLeft, y: offsetTop} = getEdgeOffset(element, null);

  return {
    width,
    height,
    offsetTop,
    offsetLeft,
  };
}

export function getViewportLayoutRect(element: HTMLElement): LayoutRect {
  const {width, height, top, left} = element.getBoundingClientRect();
  const scrollableAncestors = getScrollableAncestors(element);
  const scrollOffsets = getScrollOffsets(scrollableAncestors);

  return {
    width,
    height,
    offsetTop: top + scrollOffsets.y,
    offsetLeft: left + scrollOffsets.x,
  };
}

export function getBoundingClientRect(
  element: HTMLElement | typeof window
): ClientRect {
  if (isWindow(element)) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      width,
      height,
      offsetTop: 0,
      offsetLeft: 0,
    };
  }

  const {offsetTop, offsetLeft} = getLayoutRect(element);
  const {
    width,
    height,
    top,
    bottom,
    left,
    right,
  } = element.getBoundingClientRect();

  return {
    width,
    height,
    top,
    bottom,
    right,
    left,
    offsetTop,
    offsetLeft,
  };
}

export function getViewRect(element: HTMLElement): ViewRect {
  const {width, height, offsetTop, offsetLeft} = getLayoutRect(element);
  const scrollableAncestors = getScrollableAncestors(element);
  const scrollOffsets = getScrollOffsets(scrollableAncestors);

  const top = offsetTop - scrollOffsets.y;
  const left = offsetLeft - scrollOffsets.x;

  return {
    width,
    height,
    top,
    bottom: top + height,
    right: left + width,
    left,
    offsetTop,
    offsetLeft,
  };
}
