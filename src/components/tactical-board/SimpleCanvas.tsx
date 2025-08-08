'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTacticalBoard } from '@/stores/tactical-board';
import { useToast } from '@/components/ui/toast';
import { maps } from '@/data/maps';
import { gadgets } from '@/data/gadgets';
import { DrawableElement, TimedElement } from '@/types';
import { generateId, snapToGrid } from '@/utils/canvas';

// Helper function to get CSS variable values
const getCSSVariable = (variable: string): string => {
  if (typeof window !== 'undefined') {
    const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    if (value.includes(' ')) {
      // Convert HSL to hex for canvas
      const [h, s, l] = value.split(' ').map(v => parseFloat(v.replace('%', '')));
      return hslToHex(h, s, l);
    }
    return value;
  }
  // Fallback to foreground color for SSR
  return hslToHex(20, 14.3, 4.1);
};

// Convert HSL to Hex
const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

interface SimpleCanvasProps {
  width: number;
  height: number;
}

export const SimpleCanvas: React.FC<SimpleCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDraggingCallout, setIsDraggingCallout] = useState(false);
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToast } = useToast();
  
  const {
    selectedMap,
    zoom,
    pan,
    selectedTool,
    selectedTeam,
    selectedGadget,
    elements,
    selectedElements,
    timedElements,
    showCallouts,
    hiddenCallouts,
    editingCallout,
    calloutManagementMode,
    addElement,
    addTimedElement,
    selectElements,
    clearSelection,
    removeElements,
    updateCalloutPosition,
    setEditingCallout,
    getGadgetCount,
  } = useTacticalBoard();

  const currentMap = selectedMap;

  // Load map image when currentMap changes
  useEffect(() => {
    if (currentMap?.image) {
      const img = new Image();
      img.onload = () => {
        setMapImage(img);
        setImageLoaded(true);
      };
      img.onerror = (error) => {
        console.error('Failed to load map image:', currentMap.image, error);
        setMapImage(null);
        setImageLoaded(false);
      };
      img.src = currentMap.image;
    } else {
      setMapImage(null);
      setImageLoaded(false);
    }
  }, [currentMap]);

  // Draw function
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Save context
    ctx.save();
    
    // Apply zoom and pan
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x / zoom, pan.y / zoom);
    
    // Draw background
    if (mapImage && imageLoaded) {
      // Draw the map image as background
      ctx.drawImage(mapImage, 0, 0, 800, 600);
      
      // Add a semi-transparent overlay for better visibility of elements
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, 800, 600);
    } else {
      // Fallback background - using CSS variables
      ctx.fillStyle = getCSSVariable('--muted');
      ctx.fillRect(0, 0, 800, 600);
    }
    
    // Draw callouts (only if showCallouts is true and not hidden individually)
    if (currentMap && showCallouts) {
      ctx.font = 'bold 12px Arial';
      
      currentMap.callouts.forEach(callout => {
        // Skip if this callout is hidden
        if (hiddenCallouts.includes(callout.id)) return;
        
        const isEditing = editingCallout === callout.id;
        
        // Draw selection/editing background if editing
        if (isEditing) {
          const textMetrics = ctx.measureText(callout.name);
          const padding = 8;
          
          // Draw background rectangle
          ctx.fillStyle = getCSSVariable('--primary') + '20'; // 20% opacity
          ctx.strokeStyle = getCSSVariable('--primary');
          ctx.lineWidth = 2;
          
          const rectX = callout.position.x - padding;
          const rectY = callout.position.y - 16;
          const rectWidth = textMetrics.width + (padding * 2);
          const rectHeight = 20;
          
          ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
          ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
          
          // Draw drag handle
          ctx.beginPath();
          ctx.arc(callout.position.x - 20, callout.position.y - 6, 6, 0, 2 * Math.PI);
          ctx.fillStyle = getCSSVariable('--primary');
          ctx.fill();
          
          // Draw drag handle dots
          ctx.fillStyle = getCSSVariable('--background');
          ctx.beginPath();
          ctx.arc(callout.position.x - 22, callout.position.y - 6, 1, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(callout.position.x - 20, callout.position.y - 6, 1, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(callout.position.x - 18, callout.position.y - 6, 1, 0, 2 * Math.PI);
          ctx.fill();
        }
        
        // Draw text with outline for better visibility
        ctx.strokeStyle = getCSSVariable('--background');
        ctx.lineWidth = 3;
        ctx.strokeText(callout.name, callout.position.x, callout.position.y);
        
        // Highlight if editing
        ctx.fillStyle = isEditing ? getCSSVariable('--primary') : getCSSVariable('--foreground');
        ctx.fillText(callout.name, callout.position.x, callout.position.y);
      });
    }
    
    // Draw elements
    elements.forEach(element => {
      const isSelected = selectedElements.includes(element.id);
      const teamColor = element.team === 'attacker' ? getCSSVariable('--primary') : getCSSVariable('--destructive');
      
      switch (element.type) {
        case 'player':
          // Draw player circle with border
          ctx.beginPath();
          ctx.arc(element.position.x, element.position.y, 15, 0, 2 * Math.PI);
          ctx.fillStyle = teamColor;
          ctx.fill();
          
          // Always draw a border for better visibility
          ctx.strokeStyle = isSelected ? getCSSVariable('--background') : getCSSVariable('--foreground');
          ctx.lineWidth = isSelected ? 3 : 2;
          ctx.stroke();
          
          // Draw player name with outline
          ctx.font = 'bold 10px Arial';
          ctx.textAlign = 'center';
          
          const playerName = element.data?.name || 'Player';
          // Text outline
          ctx.strokeStyle = getCSSVariable('--background');
          ctx.lineWidth = 2;
          ctx.strokeText(playerName, element.position.x, element.position.y + 25);
          
          // Text fill
          ctx.fillStyle = getCSSVariable('--foreground');
          ctx.fillText(playerName, element.position.x, element.position.y + 25);
          break;
          
        case 'text':
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'left';
          
          const text = element.data?.text || 'Texto';
          
          // Text outline for better visibility
          ctx.strokeStyle = getCSSVariable('--background');
          ctx.lineWidth = 3;
          ctx.strokeText(text, element.position.x, element.position.y);
          
          // Text fill
          ctx.fillStyle = teamColor;
          ctx.fillText(text, element.position.x, element.position.y);
          
          if (isSelected) {
            const textWidth = ctx.measureText(text).width;
            ctx.strokeStyle = getCSSVariable('--background');
            ctx.lineWidth = 2;
            ctx.strokeRect(element.position.x - 2, element.position.y - 16, textWidth + 4, 20);
          }
          break;
          
        case 'gadget':
          const gadget = gadgets.find(g => g.id === element.data?.gadgetId);
          if (gadget) {
            // Try to load and draw gadget image
            const img = new Image();
            img.onload = () => {
              // Clear the area and redraw with image
              const size = 24;
              ctx.drawImage(img, element.position.x - size/2, element.position.y - size/2, size, size);
              
              // Draw selection border if selected
              if (isSelected) {
                ctx.strokeStyle = getCSSVariable('--primary');
                ctx.lineWidth = 2;
                ctx.strokeRect(element.position.x - size/2 - 2, element.position.y - size/2 - 2, size + 4, size + 4);
              }
              
              // Draw gadget name
              ctx.font = 'bold 8px Arial';
              ctx.textAlign = 'center';
              
              // Text outline
              ctx.strokeStyle = getCSSVariable('--background');
              ctx.lineWidth = 2;
              ctx.strokeText(gadget.name, element.position.x, element.position.y + 20);
              
              // Text fill
              ctx.fillStyle = getCSSVariable('--foreground');
              ctx.fillText(gadget.name, element.position.x, element.position.y + 20);
            };
            
            // Set image source - this will trigger onload
            img.src = gadget.image;
            
            // No fallback - only show if image loads successfully
            img.onerror = () => {
              // Do nothing - gadget won't be visible if image fails to load
            };
          }
          break;
      }
    });
    
    // Timed elements functionality removed - no circular borders for gadgets
    
    // Restore context
    ctx.restore();
  };

  // Get mouse position relative to canvas
  const getMousePosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    
    return { x, y };
  };

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const position = getMousePosition(e);

    if (selectedTool === 'select') {
      // Check if clicking on a callout that's being edited (only if management mode is active)
      if (currentMap && showCallouts && editingCallout && calloutManagementMode) {
        const editingCalloutData = currentMap.callouts.find(c => c.id === editingCallout);
        if (editingCalloutData && !hiddenCallouts.includes(editingCallout)) {
          const distance = Math.sqrt(
            Math.pow(editingCalloutData.position.x - position.x, 2) + 
            Math.pow(editingCalloutData.position.y - position.y, 2)
          );
          if (distance <= 30) {
            setIsDraggingCallout(true);
            return;
          }
        }
      }
    }
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingCallout && editingCallout) {
      const position = getMousePosition(e);
      updateCalloutPosition(editingCallout, position);
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDraggingCallout(false);
  };

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Don't handle click if we were dragging
    if (isDraggingCallout) {
      return;
    }

    const position = getMousePosition(e);

    if (selectedTool === 'select') {
      // If a callout is being edited and management mode is active, move it to the click position
      if (editingCallout && calloutManagementMode) {
        updateCalloutPosition(editingCallout, position);
        setEditingCallout(null); // Exit editing mode after positioning
        return;
      }
      
      // Check if clicking on a callout first (only if management mode is active)
      if (currentMap && showCallouts && calloutManagementMode) {
        const clickedCallout = currentMap.callouts.find(callout => {
          if (hiddenCallouts.includes(callout.id)) return false;
          const distance = Math.sqrt(
            Math.pow(callout.position.x - position.x, 2) + 
            Math.pow(callout.position.y - position.y, 2)
          );
          return distance <= 30; // 30px selection radius for callouts
        });
        
        if (clickedCallout) {
          // Toggle editing mode for this callout
          if (editingCallout === clickedCallout.id) {
            setEditingCallout(null);
          } else {
            setEditingCallout(clickedCallout.id);
          }
          return;
        }
      }
      
      // If not clicking on callout, handle element selection
      const clickedElement = elements.find(el => {
        const distance = Math.sqrt(
          Math.pow(el.position.x - position.x, 2) + 
          Math.pow(el.position.y - position.y, 2)
        );
        return distance <= 20; // 20px selection radius
      });

      if (clickedElement) {
        selectElements([clickedElement.id]);
      } else {
        clearSelection();
        setEditingCallout(null); // Clear callout editing when clicking elsewhere
      }
    } else if (selectedTool === 'player') {
      // Add player
      const newElement: DrawableElement = {
        id: generateId(),
        type: 'player',
        position: snapToGrid(position),
        team: selectedTeam,
        data: { name: `Player ${elements.filter(e => e.type === 'player').length + 1}` },
        zIndex: 1,
      };
      addElement(newElement);
    } else if (selectedTool === 'text') {
      // Add text
      const newElement: DrawableElement = {
        id: generateId(),
        type: 'text',
        position: snapToGrid(position),
        team: selectedTeam,
        data: { text: 'Texto' },
        zIndex: 1,
      };
      addElement(newElement);
    } else if (selectedTool === 'gadget' && selectedGadget) {
      // Add gadget
      const gadget = gadgets.find(g => g.id === selectedGadget);
      if (gadget) {
        const newElement: DrawableElement = {
          id: generateId(),
          type: 'gadget',
          position: snapToGrid(position),
          team: selectedTeam,
          data: { gadgetId: gadget.id },
          zIndex: 1,
        };
        
        // Try to add element (will check limits)
        const wasAdded = addElement(newElement);
        
        if (wasAdded) {
          // If gadget has duration, also add to timed elements
          if (gadget.duration && gadget.duration > 0) {
            const timedElement: TimedElement = {
              id: generateId(),
              type: 'gadget',
              position: snapToGrid(position),
              gadgetId: gadget.id,
              duration: gadget.duration,
              startTime: 0,
              active: false,
            };
            addTimedElement(timedElement);
          }
        } else {
          // Show limit message
          const currentCount = getGadgetCount(gadget.id);
          const maxCount = (gadget.id === 'smoke-grenade' || gadget.id === 'flashbang') ? 10 : 2;
          addToast(`Limite atingido para ${gadget.name}: ${currentCount}/${maxCount}`, 'warning');
        }
      }
    }
  };

  // Handle mouse wheel for zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    // Zoom functionality can be implemented here
  };

  // Redraw when state changes
  useEffect(() => {
    draw();
  }, [elements, selectedElements, timedElements, zoom, pan, currentMap, width, height, mapImage, imageLoaded]);

  // Get cursor style based on current state
  const getCursorStyle = () => {
    if (isDraggingCallout) return 'grabbing';
    if (selectedTool === 'select' && editingCallout && calloutManagementMode) return 'grab';
    return selectedTool === 'select' ? 'default' : 'crosshair';
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-background/50 to-background/80">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        className="rounded-lg border border-border/30 shadow-2xl shadow-primary/5 transition-all duration-300 hover:shadow-primary/10"
        style={{
          cursor: getCursorStyle()
        }}
      />
      
      {/* Canvas Info */}
      <div className="absolute top-4 left-4 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-md border border-border/50 text-foreground px-4 py-3 rounded-xl shadow-lg text-sm space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <span className="font-medium">Mapa: {currentMap?.name || 'Nenhum'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Ferramenta: {selectedTool}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            selectedTeam === 'attacker' ? 'bg-red-500' : 'bg-blue-500'
          }`}></div>
          <span>Time: {selectedTeam === 'attacker' ? 'Atacante' : 'Defensor'}</span>
        </div>
        {selectedGadget && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Gadget: {gadgets.find(g => g.id === selectedGadget)?.name}</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
        </div>
      </div>
    </div>
  );
};