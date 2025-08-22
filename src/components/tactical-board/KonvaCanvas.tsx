'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DrawableElement, Gadget, TeamType, Map, GadgetType } from '@/types';
import { useTacticalBoard } from '@/stores/tactical-board';
import { getGadgetById } from '@/data/gadgets';

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
            ctx.fill();
            break;
            
          case 'rectangle':
            const width = element.width || 20;
            const height = element.height || 20;
            ctx.fillRect(
              element.x - width / 2,
              element.y - height / 2,
              width,
              height
            );
            break;
            
          case 'line':
            if (element.points && element.points.length >= 4) {
              ctx.beginPath();
              ctx.moveTo(element.points[0], element.points[1]);
              for (let i = 2; i < element.points.length; i += 2) {
                ctx.lineTo(element.points[i], element.points[i + 1]);
              }
              ctx.stroke();
            }
            break;
            
          case 'text':
            ctx.font = '16px Arial';
            ctx.fillText(element.data?.text || 'Text', element.x, element.y);
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
              break;
              
            case 'player':
            case 'gadget':
              ctx.beginPath();
              ctx.arc(element.x, element.y, 20, 0, 2 * Math.PI);
              ctx.stroke();
              break;
              
            case 'text':
              ctx.strokeRect(
                element.x - 5,
                element.y - 20,
                100,
                25
              );
              break;
          }
          
          ctx.restore();
        }
        
        ctx.restore();
      });
    }
    
    // Restore context state
    ctx.restore();
  }, [elements, mapImage, zoom, pan]);

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
      // Add text element
      const newText: DrawableElement = {
        id: `text-${Date.now()}`,
        type: 'text',
        x: worldX,
        y: worldY,
        data: { text: 'Novo Texto' },
        color: '#000000'
      };
      addElement(newText);
    } else if (selectedTool === 'circle') {
      // Add circle element
      const newCircle: DrawableElement = {
        id: `circle-${Date.now()}`,
        type: 'circle',
        x: worldX,
        y: worldY,
        radius: 30,
        color: selectedTeam === 'attacker' ? '#ff4444' : '#4444ff',
        strokeWidth: 2
      };
      addElement(newCircle);
    } else if (selectedTool === 'line') {
      // Add line element
      const newLine: DrawableElement = {
        id: `line-${Date.now()}`,
        type: 'line',
        x: worldX,
        y: worldY,
        points: [worldX, worldY, worldX + 50, worldY],
        color: selectedTeam === 'attacker' ? '#ff4444' : '#4444ff',
        strokeWidth: 3
      };
      addElement(newLine);
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
        strokeWidth: 2
      };
      addElement(newRectangle);
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
    
    // Handle element dragging
     if (isDragging && draggedElement) {
       const worldX = (x - pan.x) / zoom;
       const worldY = (y - pan.y) / zoom;
       
       const newX = worldX - dragOffset.x;
       const newY = worldY - dragOffset.y;
       
       // Update element position
       updateElement(draggedElement.id, { x: newX, y: newY });
     }
     
     // Update cursor based on hover state
     if (selectedTool === 'select' && !isDragging && !isPanning) {
       const worldX = (x - pan.x) / zoom;
       const worldY = (y - pan.y) / zoom;
       const hoveredElement = findElementAt(worldX, worldY);
       
       if (hoveredElement && selectedElements.some(el => el.id === hoveredElement.id)) {
         setCursorStyle('move');
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
  }, [isPanning, lastPanPoint, pan, setPan, isDragging, draggedElement, dragOffset, zoom, updateElement, selectedTool, findElementAt, selectedElements]);
  
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setLastPanPoint(null);
    setIsDragging(false);
    setDraggedElement(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);



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
    </div>
  );
};