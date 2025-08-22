'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DrawableElement, Gadget, TeamType, Map, GadgetType, Position } from '@/types';
import { useTacticalBoard } from '@/stores/tactical-board';
import { getGadgetById } from '@/data/gadgets';
import { TextInputModal } from './TextInputModal';

// Helper function to get CSS color values
const getCSSColor = (variable: string): string => {
  if (typeof window !== 'undefined') {
    const value = getComputedStyle(document.documentElement).getPropertyValue(variable);
    return value.trim() || '#000000';
  }
  return '#000000';
};

interface KonvaCanvasProps {
  width: number;
  height: number;
  currentMap?: Map;
  elements: DrawableElement[];
  selectedTool: string;
  selectedGadget?: Gadget;
  selectedTeam: TeamType;
  selectedElements: DrawableElement[];
  zoom: number;
  pan: { x: number; y: number };
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  setSelectedElements: (elements: DrawableElement[]) => void;
}

export const KonvaCanvas: React.FC<KonvaCanvasProps> = ({
  width,
  height,
  currentMap,
  elements,
  selectedTool,
  selectedGadget,
  selectedTeam,
  selectedElements,
  zoom,
  pan,
  setZoom,
  setPan,
  setSelectedElements,
}) => {
  const { addElement, updateElement } = useTacticalBoard();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);
  const [gadgetImages, setGadgetImages] = useState<Record<string, HTMLImageElement>>({});
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState<DrawableElement | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorStyle, setCursorStyle] = useState<string>('crosshair');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [isResizing, setIsResizing] = useState(false);
  const [resizingElement, setResizingElement] = useState<DrawableElement | null>(null);
  const [resizeStartPos, setResizeStartPos] = useState<Position>({ x: 0, y: 0 });
  const [isResizingSelected, setIsResizingSelected] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<{ width?: number; height?: number; radius?: number }>({});
  
  // Text modal states
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);

  // Load map image
  useEffect(() => {
    if (!currentMap?.image) {
      setMapImage(null);
      return;
    }

    const img = new Image();
    img.onload = () => setMapImage(img);
    img.onerror = () => setMapImage(null);
    img.src = currentMap.image;
  }, [currentMap?.image]);

  // Load gadget images
  useEffect(() => {
    const loadGadgetImages = async () => {
      const newGadgetImages: Record<string, HTMLImageElement> = {};
      
      // Get unique gadget IDs from elements
      const gadgetIds = Array.from(new Set(
        elements
          .filter(el => el.type === 'gadget' && el.gadgetId)
          .map(el => el.gadgetId!)
      ));
      
      // Load images for each gadget
      for (const gadgetId of gadgetIds) {
        const gadget = getGadgetById(gadgetId);
        if (gadget && gadget.image) {
          try {
            const img = new Image();
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = () => reject();
              img.src = gadget.image;
            });
            newGadgetImages[gadgetId] = img;
          } catch (error) {
            console.warn(`Failed to load gadget image for ${gadgetId}:`, error);
          }
        }
      }
      
      setGadgetImages(newGadgetImages);
    };
    
    loadGadgetImages();
  }, [elements]);

  // Handle wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate world coordinates before zoom
    const worldX = (mouseX - pan.x) / zoom;
    const worldY = (mouseY - pan.y) / zoom;
    
    // Calculate new zoom
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, zoom * zoomFactor));
    
    // Calculate new pan to keep mouse position fixed
    const newPan = {
      x: mouseX - worldX * newZoom,
      y: mouseY - worldY * newZoom
    };
    
    setZoom(newZoom);
    setPan(newPan);
  }, [zoom, pan, setZoom, setPan]);

  // Calculate map dimensions for proper aspect ratio
  const getMapDimensions = () => {
    if (!mapImage) return { width: 0, height: 0, x: 0, y: 0 };

    const availableWidth = width;
    const availableHeight = height;

    const aspectRatio = mapImage.width / mapImage.height;

    let mapWidth, mapHeight;
    if (availableWidth / availableHeight > aspectRatio) {
      mapHeight = availableHeight;
      mapWidth = mapHeight * aspectRatio;
    } else {
      mapWidth = availableWidth;
      mapHeight = mapWidth / aspectRatio;
    }

    // Center the map in the canvas
    const x = (availableWidth - mapWidth) / 2;
    const y = (availableHeight - mapHeight) / 2;

    return {
      width: mapWidth,
      height: mapHeight,
      x,
      y
    };
  };



  // Find element at coordinates
  const findElementAt = useCallback((x: number, y: number): DrawableElement | null => {
    if (!elements || !Array.isArray(elements)) return null;
    
    // Search in reverse order to find topmost element
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (!element || typeof element.x !== 'number' || typeof element.y !== 'number') {
        continue;
      }
      
      const distance = Math.sqrt(
        Math.pow(x - element.x, 2) + Math.pow(y - element.y, 2)
      );
      
      // Check if click is within element bounds
      switch (element.type) {
        case 'circle':
          if (distance <= (element.radius || 10)) return element;
          break;
        case 'rectangle':
          const halfWidth = (element.width || 20) / 2;
          const halfHeight = (element.height || 20) / 2;
          if (Math.abs(x - element.x) <= halfWidth && 
              Math.abs(y - element.y) <= halfHeight) {
            return element;
          }
          break;
        case 'gadget':
        case 'player':
          if (distance <= 15) return element; // Default click radius
          break;
      }
    }
    
    return null;
  }, [elements]);

  // Helper function to detect resize handle clicks
  const findResizeHandle = useCallback((x: number, y: number, element: DrawableElement): string | null => {
    if (!selectedElements.some(sel => sel.id === element.id)) return null;
    
    if (element.type === 'circle') {
      const radius = element.radius || 10;
      const handleSize = 6;
      
      // Check each handle
      if (Math.abs(x - (element.x + radius)) < handleSize && Math.abs(y - element.y) < handleSize) return 'right';
      if (Math.abs(x - (element.x - radius)) < handleSize && Math.abs(y - element.y) < handleSize) return 'left';
      if (Math.abs(x - element.x) < handleSize && Math.abs(y - (element.y + radius)) < handleSize) return 'bottom';
      if (Math.abs(x - element.x) < handleSize && Math.abs(y - (element.y - radius)) < handleSize) return 'top';
    } else if (element.type === 'rectangle') {
      const w = element.width || 20;
      const h = element.height || 20;
      const handleSize = 6;
      
      // Check corner handles
      if (Math.abs(x - (element.x - w/2)) < handleSize && Math.abs(y - (element.y - h/2)) < handleSize) return 'top-left';
      if (Math.abs(x - (element.x + w/2)) < handleSize && Math.abs(y - (element.y - h/2)) < handleSize) return 'top-right';
      if (Math.abs(x - (element.x - w/2)) < handleSize && Math.abs(y - (element.y + h/2)) < handleSize) return 'bottom-left';
      if (Math.abs(x - (element.x + w/2)) < handleSize && Math.abs(y - (element.y + h/2)) < handleSize) return 'bottom-right';
      
      // Check side handles
      if (Math.abs(x - element.x) < handleSize && Math.abs(y - (element.y - h/2)) < handleSize) return 'top';
      if (Math.abs(x - element.x) < handleSize && Math.abs(y - (element.y + h/2)) < handleSize) return 'bottom';
      if (Math.abs(x - (element.x - w/2)) < handleSize && Math.abs(y - element.y) < handleSize) return 'left';
      if (Math.abs(x - (element.x + w/2)) < handleSize && Math.abs(y - element.y) < handleSize) return 'right';
    }
    
    return null;
  }, [selectedElements]);

  // Draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context state
    ctx.save();
    
    // Apply zoom and pan transformations
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);
    
    // Draw map image
    if (mapImage) {
      const mapDimensions = getMapDimensions();
      ctx.drawImage(
        mapImage, 
        mapDimensions.x, 
        mapDimensions.y, 
        mapDimensions.width, 
        mapDimensions.height
      );
    }
    
    // Draw elements
    if (elements && elements.length > 0) {
      elements.forEach((element) => {
        if (!element || typeof element.x !== 'number' || typeof element.y !== 'number') {
          return;
        }
        
        ctx.save();
        
        // Set element color
        const color = element.color || '#ff0000';
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = element.strokeWidth || 2;
        
        switch (element.type) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(element.x, element.y, element.radius || 10, 0, 2 * Math.PI);
            
            // Fill with transparent team color
            const circleTeamColor = element.team === 'attacker' ? 'rgba(255, 68, 68, 0.3)' : 'rgba(68, 68, 255, 0.3)';
            ctx.fillStyle = circleTeamColor;
            ctx.fill();
            
            // Draw border with solid team color
            ctx.strokeStyle = element.team === 'attacker' ? '#ff4444' : '#4444ff';
            ctx.lineWidth = 2;
            ctx.stroke();
            break;
            
          case 'rectangle':
            const width = element.width || 20;
            const height = element.height || 20;
            
            // Fill with transparent team color
            const rectTeamColor = element.team === 'attacker' ? 'rgba(255, 68, 68, 0.3)' : 'rgba(68, 68, 255, 0.3)';
            ctx.fillStyle = rectTeamColor;
            ctx.fillRect(
              element.x - width / 2,
              element.y - height / 2,
              width,
              height
            );
            
            // Draw border with solid team color
            ctx.strokeStyle = element.team === 'attacker' ? '#ff4444' : '#4444ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(
              element.x - width / 2,
              element.y - height / 2,
              width,
              height
            );
            break;
            
          case 'line':
            if (element.points && element.points.length >= 4) {
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              ctx.beginPath();
              ctx.moveTo(element.points[0], element.points[1]);
              for (let i = 2; i < element.points.length; i += 2) {
                ctx.lineTo(element.points[i], element.points[i + 1]);
              }
              ctx.stroke();
            }
            break;
            
          case 'text':
            const fontSize = element.data?.fontSize || 14;
            const fontWeight = element.data?.fontWeight || 'normal';
            const fontStyle = element.data?.fontStyle || 'normal';
            const textContent = element.data?.text || 'Text';
            
            // Set font with all properties
            ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px Arial`;
            ctx.fillStyle = element.color || '#000000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Handle multi-line text
            const lines = textContent.split('\n');
            const lineHeight = fontSize * 1.2;
            const totalHeight = lines.length * lineHeight;
            const startY = element.y - (totalHeight / 2) + (lineHeight / 2);
            
            lines.forEach((line: string, index: number) => {
              const y = startY + (index * lineHeight);
              ctx.fillText(line, element.x, y);
            });
            break;
            
          case 'player':
            // Draw player as a circle with team color
            const teamColor = element.team === 'attacker' ? '#ff0000' : '#0000ff';
            ctx.fillStyle = teamColor;
            ctx.beginPath();
            ctx.arc(element.x, element.y, 15, 0, 2 * Math.PI);
            ctx.fill();
            break;
            
          case 'gadget':
            // Draw gadget with icon and colored border
            const gadget = element.gadgetId ? getGadgetById(element.gadgetId) : null;
            const gadgetImage = element.gadgetId ? gadgetImages[element.gadgetId] : null;
            
            // Draw circular border based on team
            const borderColor = element.team === 'attacker' ? '#ff4444' : '#4444ff';
            const radius = 18;
            
            // Draw border circle
            ctx.save();
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(element.x, element.y, radius, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Draw background circle
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.beginPath();
            ctx.arc(element.x, element.y, radius - 2, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw gadget icon if available
            if (gadgetImage) {
              const iconSize = 24;
              ctx.save();
              ctx.beginPath();
              ctx.arc(element.x, element.y, radius - 3, 0, 2 * Math.PI);
              ctx.clip();
              
              ctx.drawImage(
                gadgetImage,
                element.x - iconSize / 2,
                element.y - iconSize / 2,
                iconSize,
                iconSize
              );
              ctx.restore();
            } else {
              // Fallback: draw a small colored square if image not loaded
              ctx.fillStyle = borderColor;
              ctx.fillRect(
                element.x - 8,
                element.y - 8,
                16,
                16
              );
            }
            
            ctx.restore();
            break;
        }
        
        // Draw selection highlight if element is selected
        const isSelected = selectedElements.some(sel => sel.id === element.id);
        if (isSelected) {
          ctx.save();
          ctx.strokeStyle = '#00ff00'; // Green selection color
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]); // Dashed line
          
          switch (element.type) {
            case 'circle':
              ctx.beginPath();
              ctx.arc(element.x, element.y, (element.radius || 10) + 5, 0, 2 * Math.PI);
              ctx.stroke();
              
              // Draw resize handles for circles
              ctx.setLineDash([]);
              ctx.fillStyle = '#00ff00';
              const radius = element.radius || 10;
              ctx.fillRect(element.x + radius - 3, element.y - 3, 6, 6); // Right handle
              ctx.fillRect(element.x - radius - 3, element.y - 3, 6, 6); // Left handle
              ctx.fillRect(element.x - 3, element.y + radius - 3, 6, 6); // Bottom handle
              ctx.fillRect(element.x - 3, element.y - radius - 3, 6, 6); // Top handle
              break;
              
            case 'rectangle':
              const width = element.width || 20;
              const height = element.height || 20;
              ctx.strokeRect(
                element.x - width / 2 - 5,
                element.y - height / 2 - 5,
                width + 10,
                height + 10
              );
              
              // Draw resize handles for rectangles
              ctx.setLineDash([]);
              ctx.fillStyle = '#00ff00';
              const w = element.width || 20;
              const h = element.height || 20;
              // Corner handles
              ctx.fillRect(element.x - w/2 - 3, element.y - h/2 - 3, 6, 6); // Top-left
              ctx.fillRect(element.x + w/2 - 3, element.y - h/2 - 3, 6, 6); // Top-right
              ctx.fillRect(element.x - w/2 - 3, element.y + h/2 - 3, 6, 6); // Bottom-left
              ctx.fillRect(element.x + w/2 - 3, element.y + h/2 - 3, 6, 6); // Bottom-right
              // Side handles
              ctx.fillRect(element.x - 3, element.y - h/2 - 3, 6, 6); // Top
              ctx.fillRect(element.x - 3, element.y + h/2 - 3, 6, 6); // Bottom
              ctx.fillRect(element.x - w/2 - 3, element.y - 3, 6, 6); // Left
              ctx.fillRect(element.x + w/2 - 3, element.y - 3, 6, 6); // Right
              break;
              
            case 'player':
            case 'gadget':
              ctx.beginPath();
              ctx.arc(element.x, element.y, 20, 0, 2 * Math.PI);
              ctx.stroke();
              break;
              
            case 'text':
              const textFontSize = element.data?.fontSize || 14;
              const textContent = element.data?.text || 'Text';
              const textLines = textContent.split('\n');
              const textLineHeight = textFontSize * 1.2;
              const textTotalHeight = textLines.length * textLineHeight;
              
              // Calculate text width (approximate)
              ctx.font = `${element.data?.fontStyle || 'normal'} ${element.data?.fontWeight || 'normal'} ${textFontSize}px Arial`;
              const maxLineWidth = Math.max(...textLines.map((line: string) => ctx.measureText(line).width));
              
              // Draw selection rectangle around text
              const padding = 5;
              ctx.strokeRect(
                element.x - maxLineWidth/2 - padding,
                element.y - textTotalHeight/2 - padding,
                maxLineWidth + padding * 2,
                textTotalHeight + padding * 2
              );
              
              // Draw resize handles for text
              ctx.setLineDash([]);
              ctx.fillStyle = '#00ff00';
              const textWidth = maxLineWidth + padding * 2;
              const textHeight = textTotalHeight + padding * 2;
              // Corner handles
              ctx.fillRect(element.x - textWidth/2 - 3, element.y - textHeight/2 - 3, 6, 6); // Top-left
              ctx.fillRect(element.x + textWidth/2 - 3, element.y - textHeight/2 - 3, 6, 6); // Top-right
              ctx.fillRect(element.x - textWidth/2 - 3, element.y + textHeight/2 - 3, 6, 6); // Bottom-left
              ctx.fillRect(element.x + textWidth/2 - 3, element.y + textHeight/2 - 3, 6, 6); // Bottom-right
              break;
          }
          
          ctx.restore();
        }
        
        ctx.restore();
      });
    }
    
    // Draw current path being drawn
    if (isDrawing && currentPath.length >= 4) {
      ctx.save();
      ctx.strokeStyle = selectedTeam === 'attacker' ? '#ff4444' : '#4444ff';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(currentPath[0], currentPath[1]);
      for (let i = 2; i < currentPath.length; i += 2) {
        ctx.lineTo(currentPath[i], currentPath[i + 1]);
      }
      ctx.stroke();
      ctx.restore();
    }
    
    // Draw element being resized
    if (isResizing && resizingElement) {
      ctx.save();
      
      if (resizingElement.type === 'circle') {
        ctx.beginPath();
        ctx.arc(resizingElement.x, resizingElement.y, resizingElement.radius || 10, 0, 2 * Math.PI);
        
        const circleTeamColor = resizingElement.team === 'attacker' ? 'rgba(255, 68, 68, 0.3)' : 'rgba(68, 68, 255, 0.3)';
        ctx.fillStyle = circleTeamColor;
        ctx.fill();
        
        ctx.strokeStyle = resizingElement.team === 'attacker' ? '#ff4444' : '#4444ff';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (resizingElement.type === 'rectangle') {
        const width = resizingElement.width || 20;
        const height = resizingElement.height || 20;
        
        const rectTeamColor = resizingElement.team === 'attacker' ? 'rgba(255, 68, 68, 0.3)' : 'rgba(68, 68, 255, 0.3)';
        ctx.fillStyle = rectTeamColor;
        ctx.fillRect(
          resizingElement.x - width / 2,
          resizingElement.y - height / 2,
          width,
          height
        );
        
        ctx.strokeStyle = resizingElement.team === 'attacker' ? '#ff4444' : '#4444ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          resizingElement.x - width / 2,
          resizingElement.y - height / 2,
          width,
          height
        );
      }
      
      ctx.restore();
    }
    
    // Restore context state
    ctx.restore();
  }, [elements, mapImage, zoom, pan, isDrawing, currentPath, selectedTeam, isResizing, resizingElement]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate world coordinates
    const worldX = (x - pan.x) / zoom;
    const worldY = (y - pan.y) / zoom;
    
    if (selectedTool === 'pan' || e.button === 1) {
      e.preventDefault(); // Prevent default middle mouse behavior
      setIsPanning(true);
      setLastPanPoint({ x, y });
    } else if (selectedTool === 'select') {
      // Handle element selection and dragging
      const clickedElement = findElementAt(worldX, worldY);
      if (clickedElement) {
        // Check if clicking on a resize handle first
        const handle = findResizeHandle(worldX, worldY, clickedElement);
        
        if (handle && (clickedElement.type === 'circle' || clickedElement.type === 'rectangle')) {
          // Start resizing
          setIsResizingSelected(true);
          setResizeHandle(handle);
          setResizeStartPos({ x: worldX, y: worldY });
          setOriginalSize({
            width: clickedElement.width,
            height: clickedElement.height,
            radius: clickedElement.radius
          });
          setSelectedElements([clickedElement]);
        } else {
          // Normal selection/dragging
          if (e.ctrlKey || e.metaKey) {
            // Multi-select
            if (selectedElements.some((sel: DrawableElement) => sel.id === clickedElement.id)) {
              setSelectedElements(selectedElements.filter((sel: DrawableElement) => sel.id !== clickedElement.id));
            } else {
              setSelectedElements([...selectedElements, clickedElement]);
            }
          } else {
            // Check if clicked element is already selected
            const isAlreadySelected = selectedElements.some(el => el.id === clickedElement.id);
            
            if (isAlreadySelected) {
              // Start dragging the selected element
              setIsDragging(true);
              setDraggedElement(clickedElement);
              setDragOffset({
                x: worldX - clickedElement.x,
                y: worldY - clickedElement.y
              });
            } else {
              // Select the clicked element
              setSelectedElements([clickedElement]);
            }
          }
        }
      } else {
        setSelectedElements([]);
      }
    } else if (selectedTool === 'player') {
      // Add player element
      const newPlayer: DrawableElement = {
        id: `player-${Date.now()}`,
        type: 'player',
        x: worldX,
        y: worldY,
        team: selectedTeam,
        color: selectedTeam === 'attacker' ? '#ff0000' : '#0000ff'
      };
      addElement(newPlayer);
    } else if (selectedTool === 'text') {
      // Open text modal
      setTextPosition({ x: worldX, y: worldY });
      setIsTextModalOpen(true);
    } else if (selectedTool === 'circle') {
      // Add circle element
      const newCircle: DrawableElement = {
        id: `circle-${Date.now()}`,
        type: 'circle',
        x: worldX,
        y: worldY,
        radius: 30,
        color: selectedTeam === 'attacker' ? '#ff4444' : '#4444ff',
        strokeWidth: 2,
        team: selectedTeam
      };
      setResizingElement(newCircle);
      setResizeStartPos({ x: worldX, y: worldY });
      setIsResizing(true);
    } else if (selectedTool === 'line') {
      // Start drawing free line
      setIsDrawing(true);
      setCurrentPath([worldX, worldY]);
    } else if (selectedTool === 'rectangle') {
      // Add rectangle element
      const newRectangle: DrawableElement = {
        id: `rectangle-${Date.now()}`,
        type: 'rectangle',
        x: worldX,
        y: worldY,
        width: 60,
        height: 40,
        color: selectedTeam === 'attacker' ? '#ff4444' : '#4444ff',
        strokeWidth: 2,
        team: selectedTeam
      };
      setResizingElement(newRectangle);
      setResizeStartPos({ x: worldX, y: worldY });
      setIsResizing(true);
    } else if (selectedGadget) {
      // Add gadget element
      const newGadget: DrawableElement = {
        id: `gadget-${Date.now()}`,
        type: 'gadget',
        x: worldX,
        y: worldY,
        gadgetId: selectedGadget.id,
        team: selectedTeam,
        color: selectedTeam === 'attacker' ? '#ff0000' : '#0000ff'
      };
      addElement(newGadget);
    }
  }, [selectedTool, zoom, pan, findElementAt, setSelectedElements, selectedElements, selectedTeam, selectedGadget, addElement]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Handle panning
    if (isPanning && lastPanPoint) {
      const deltaX = x - lastPanPoint.x;
      const deltaY = y - lastPanPoint.y;
      
      setPan({
        x: pan.x + deltaX,
        y: pan.y + deltaY
      });
      
      setLastPanPoint({ x, y });
    }
    
    // Handle area resizing during creation
    if (isResizing && resizingElement) {
      const worldX = (x - pan.x) / zoom;
      const worldY = (y - pan.y) / zoom;
      const deltaX = Math.abs(worldX - resizeStartPos.x);
      const deltaY = Math.abs(worldY - resizeStartPos.y);
      
      if (resizingElement.type === 'circle') {
        const radius = Math.max(10, Math.sqrt(deltaX * deltaX + deltaY * deltaY));
        setResizingElement(prev => prev ? { ...prev, radius } : null);
      } else if (resizingElement.type === 'rectangle') {
        const width = Math.max(20, deltaX * 2);
        const height = Math.max(20, deltaY * 2);
        setResizingElement(prev => prev ? { ...prev, width, height } : null);
      }
    }
    
    // Handle resizing selected element
    if (isResizingSelected && selectedElements.length === 1 && resizeHandle) {
      const worldX = (x - pan.x) / zoom;
      const worldY = (y - pan.y) / zoom;
      const element = selectedElements[0];
      
      if (element.type === 'circle') {
        const distance = Math.sqrt(
          Math.pow(worldX - element.x, 2) + Math.pow(worldY - element.y, 2)
        );
        const newRadius = Math.max(5, distance);
        updateElement(element.id, { radius: newRadius });
      } else if (element.type === 'rectangle') {
        const deltaX = worldX - resizeStartPos.x;
        const deltaY = worldY - resizeStartPos.y;
        
        let newWidth = originalSize.width || 20;
        let newHeight = originalSize.height || 20;
        
        switch (resizeHandle) {
          case 'top-left':
            newWidth = Math.max(10, (originalSize.width || 20) - deltaX * 2);
            newHeight = Math.max(10, (originalSize.height || 20) - deltaY * 2);
            break;
          case 'top-right':
            newWidth = Math.max(10, (originalSize.width || 20) + deltaX * 2);
            newHeight = Math.max(10, (originalSize.height || 20) - deltaY * 2);
            break;
          case 'bottom-left':
            newWidth = Math.max(10, (originalSize.width || 20) - deltaX * 2);
            newHeight = Math.max(10, (originalSize.height || 20) + deltaY * 2);
            break;
          case 'bottom-right':
            newWidth = Math.max(10, (originalSize.width || 20) + deltaX * 2);
            newHeight = Math.max(10, (originalSize.height || 20) + deltaY * 2);
            break;
          case 'top':
            newHeight = Math.max(10, (originalSize.height || 20) - deltaY * 2);
            break;
          case 'bottom':
            newHeight = Math.max(10, (originalSize.height || 20) + deltaY * 2);
            break;
          case 'left':
            newWidth = Math.max(10, (originalSize.width || 20) - deltaX * 2);
            break;
          case 'right':
            newWidth = Math.max(10, (originalSize.width || 20) + deltaX * 2);
            break;
        }
        
        updateElement(element.id, { width: newWidth, height: newHeight });
      }
    }
    
    // Handle element dragging
     if (isDragging && draggedElement) {
       const worldX = (x - pan.x) / zoom;
       const worldY = (y - pan.y) / zoom;
       
       const newX = worldX - dragOffset.x;
       const newY = worldY - dragOffset.y;
       
       // Update element position
       updateElement(draggedElement.id, { x: newX, y: newY });
     }
     
     // Handle free line drawing
     if (isDrawing && selectedTool === 'line') {
       const worldX = (x - pan.x) / zoom;
       const worldY = (y - pan.y) / zoom;
       
       setCurrentPath(prev => [...prev, worldX, worldY]);
     }
     
     // Update cursor based on hover state
     if (selectedTool === 'select' && !isDragging && !isPanning && !isResizingSelected) {
       const worldX = (x - pan.x) / zoom;
       const worldY = (y - pan.y) / zoom;
       const hoveredElement = findElementAt(worldX, worldY);
       
       if (hoveredElement && selectedElements.some(el => el.id === hoveredElement.id)) {
         // Check if hovering over resize handle
         const handle = findResizeHandle(worldX, worldY, hoveredElement);
         if (handle) {
           // Set resize cursor based on handle position
           switch (handle) {
             case 'top-left':
             case 'bottom-right':
               setCursorStyle('nw-resize');
               break;
             case 'top-right':
             case 'bottom-left':
               setCursorStyle('ne-resize');
               break;
             case 'top':
             case 'bottom':
               setCursorStyle('n-resize');
               break;
             case 'left':
             case 'right':
               setCursorStyle('e-resize');
               break;
             default:
               setCursorStyle('move');
           }
         } else {
           setCursorStyle('move');
         }
       } else if (hoveredElement) {
         setCursorStyle('pointer');
       } else {
         setCursorStyle('crosshair');
       }
     } else if (selectedTool === 'pan' || isPanning) {
       setCursorStyle(isPanning ? 'grabbing' : 'grab');
     } else {
       setCursorStyle('crosshair');
     }
  }, [isPanning, lastPanPoint, pan, setPan, isResizing, resizingElement, resizeStartPos, isDragging, draggedElement, dragOffset, zoom, updateElement, selectedTool, findElementAt, selectedElements, isResizingSelected, resizeHandle, originalSize, findResizeHandle]);
  
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setLastPanPoint(null);
    setIsDragging(false);
    setDraggedElement(null);
    setDragOffset({ x: 0, y: 0 });
    
    // Finish resizing selected element
    if (isResizingSelected) {
      setIsResizingSelected(false);
      setResizeHandle(null);
      setOriginalSize({});
    }
    
    // Finish drawing free line
    if (isDrawing && selectedTool === 'line' && currentPath.length >= 4) {
      const newLine: DrawableElement = {
        id: `line-${Date.now()}`,
        type: 'line',
        x: currentPath[0],
        y: currentPath[1],
        points: currentPath,
        color: selectedTeam === 'attacker' ? '#ff4444' : '#4444ff',
        strokeWidth: 3
      };
      addElement(newLine);
    }
    
    // Finish area resizing and add element
    if (isResizing && resizingElement) {
      addElement(resizingElement);
      setIsResizing(false);
      setResizingElement(null);
    }
    
    setIsDrawing(false);
    setCurrentPath([]);
  }, [isDrawing, selectedTool, currentPath, selectedTeam, isResizing, resizingElement, addElement, isResizingSelected]);



  // Update drawing when dependencies change
  useEffect(() => {
    draw();
  }, [draw]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = width;
      canvas.height = height;
      // Don't call draw() here as it will be called by the draw useEffect
    };

    resizeCanvas();
  }, [width, height]);

  // Setup wheel event listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Prevent context menu and handle auxiliary clicks
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const handleAuxClick = useCallback((e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault(); // Prevent middle mouse default behavior
    }
  }, []);

  // Handle text creation
  const handleTextCreate = useCallback((text: string) => {
    if (textPosition) {
      const newText: DrawableElement = {
        id: `text-${Date.now()}`,
        type: 'text',
        x: textPosition.x,
        y: textPosition.y,
        data: { text },
        color: '#000000'
      };
      addElement(newText);
    }
    setIsTextModalOpen(false);
    setTextPosition(null);
  }, [textPosition, addElement]);

  const handleTextCancel = useCallback(() => {
    setIsTextModalOpen(false);
    setTextPosition(null);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ cursor: cursorStyle }}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
        onAuxClick={handleAuxClick}
      />
      
      <TextInputModal
         isOpen={isTextModalOpen}
         onConfirm={handleTextCreate}
         onClose={handleTextCancel}
       />
    </div>
  );
};