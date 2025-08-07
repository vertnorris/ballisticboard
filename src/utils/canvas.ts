import { Position, DrawableElement } from '@/types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getDistance = (pos1: Position, pos2: Position): number => {
  return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
};

export const getAngle = (pos1: Position, pos2: Position): number => {
  return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x);
};

export const snapToGrid = (position: Position, gridSize: number = 10): Position => {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
};

export const isPointInBounds = (
  point: Position,
  bounds: { x: number; y: number; width: number; height: number }
): boolean => {
  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  );
};

export const getElementBounds = (element: DrawableElement) => {
  const size = getElementSize(element);
  return {
    x: element.position.x - size.width / 2,
    y: element.position.y - size.height / 2,
    width: size.width,
    height: size.height,
  };
};

export const getElementSize = (element: DrawableElement) => {
  switch (element.type) {
    case 'player':
      return { width: 30, height: 30 };
    case 'text':
      return { width: 100, height: 20 };
    case 'area':
      return element.data.size || { width: 100, height: 100 };
    case 'gadget':
      return { width: 20, height: 20 };
    default:
      return { width: 20, height: 20 };
  }
};

export const isElementSelected = (element: DrawableElement, selectedIds: string[]): boolean => {
  return selectedIds.includes(element.id);
};

export const getSelectionBounds = (elements: DrawableElement[]) => {
  if (elements.length === 0) return null;
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  elements.forEach(element => {
    const bounds = getElementBounds(element);
    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
    maxX = Math.max(maxX, bounds.x + bounds.width);
    maxY = Math.max(maxY, bounds.y + bounds.height);
  });
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

export const transformPosition = (
  position: Position,
  zoom: number,
  pan: Position
): Position => {
  return {
    x: (position.x - pan.x) * zoom,
    y: (position.y - pan.y) * zoom,
  };
};

export const inverseTransformPosition = (
  position: Position,
  zoom: number,
  pan: Position
): Position => {
  return {
    x: position.x / zoom + pan.x,
    y: position.y / zoom + pan.y,
  };
};

export const exportCanvasAsImage = (canvas: HTMLCanvasElement, format: 'png' | 'jpg' = 'png'): string => {
  return canvas.toDataURL(`image/${format}`);
};

export const downloadImage = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};