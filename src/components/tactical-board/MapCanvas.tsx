"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Circle, Line, Text, Rect } from 'react-konva';
import { useTacticalBoard } from '@/stores/tactical-board';
import { DrawableElement, Position } from '@/types';
import { generateId, snapToGrid, inverseTransformPosition } from '@/utils/canvas';
import useImage from 'use-image';

interface MapCanvasProps {
  width: number;
  height: number;
}

const PlayerElement: React.FC<{
  element: DrawableElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (newPos: Position) => void;
}> = ({ element, isSelected, onSelect, onDragEnd }) => {
  const team = element.data.team || 'attacker';
  const color = team === 'attacker' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))';
  
  return (
    <Circle
      x={element.position.x}
      y={element.position.y}
      radius={15}
      fill={color}
      stroke={isSelected ? 'hsl(var(--background))' : color}
      strokeWidth={isSelected ? 3 : 1}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onDragEnd({ x: e.target.x(), y: e.target.y() });
      }}
    />
  );
};

const MovementLine: React.FC<{
  element: DrawableElement;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ element, isSelected, onSelect }) => {
  const { start, end } = element.data;
  const team = element.data.team || 'attacker';
  const color = team === 'attacker' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))';
  
  return (
    <Line
      points={[start.x, start.y, end.x, end.y]}
      stroke={color}
      strokeWidth={isSelected ? 4 : 2}
      lineCap="round"
      onClick={onSelect}
      onTap={onSelect}
    />
  );
};

const TextElement: React.FC<{
  element: DrawableElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (newPos: Position) => void;
}> = ({ element, isSelected, onSelect, onDragEnd }) => {
  return (
    <Text
      x={element.position.x}
      y={element.position.y}
      text={element.data.text || 'Texto'}
      fontSize={14}
      fill={isSelected ? 'hsl(var(--background))' : 'hsl(var(--foreground))'}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onDragEnd({ x: e.target.x(), y: e.target.y() });
      }}
    />
  );
};

const AreaElement: React.FC<{
  element: DrawableElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (newPos: Position) => void;
}> = ({ element, isSelected, onSelect, onDragEnd }) => {
  const { width = 100, height = 100 } = element.data.size || {};
  const team = element.data.team || 'attacker';
  const color = team === 'attacker' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))';
  
  return (
    <Rect
      x={element.position.x - width / 2}
      y={element.position.y - height / 2}
      width={width}
      height={height}
      fill={`${color}20`}
      stroke={color}
      strokeWidth={isSelected ? 3 : 1}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onDragEnd({ x: e.target.x() + width / 2, y: e.target.y() + height / 2 });
      }}
    />
  );
};

const GadgetElement: React.FC<{
  element: DrawableElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (newPos: Position) => void;
}> = ({ element, isSelected, onSelect, onDragEnd }) => {
  const gadgetType = element.data.gadgetType || 'grenade';
  const color = gadgetType === 'grenade' ? 'hsl(var(--warning))' : 'hsl(var(--success))';
  
  return (
    <Circle
      x={element.position.x}
      y={element.position.y}
      radius={10}
      fill={color}
      stroke={isSelected ? 'hsl(var(--background))' : color}
      strokeWidth={isSelected ? 2 : 1}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onDragEnd({ x: e.target.x(), y: e.target.y() });
      }}
    />
  );
};

const MapBackground: React.FC<{ mapImage?: string }> = ({ mapImage }) => {
  const [image] = useImage(mapImage || '/maps/placeholder.jpg');
  
  if (!image) return null;
  
  return (
    <KonvaImage
      image={image}
      width={1000}
      height={600}
      opacity={0.8}
    />
  );
};

export const MapCanvas: React.FC<MapCanvasProps> = ({ width, height }) => {
  const stageRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<Position | null>(null);
  
  const {
    selectedMap,
    elements,
    selectedElements,
    selectedTool,
    selectedTeam,
    zoom,
    pan,
    setZoom,
    setPan,
    addElement,
    updateElement,
    selectElement,
    selectElements,
    clearSelection,
    removeElements
  } = useTacticalBoard();

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.1, Math.min(3, newScale));
    
    setZoom(clampedScale);
    
    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };
    
    setPan(newPos);
  };

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      clearSelection();
    }
  };

  const handleStageMouseDown = (e: any) => {
    if (selectedTool === 'select') return;
    
    const pos = e.target.getStage().getPointerPosition();
    const worldPos = inverseTransformPosition(pos, zoom, pan);
    
    if (selectedTool === 'movement') {
      setIsDrawing(true);
      setDrawStart(worldPos);
    } else {
      createElement(worldPos);
    }
  };

  const handleStageMouseUp = (e: any) => {
    if (!isDrawing || selectedTool !== 'movement' || !drawStart) return;
    
    const pos = e.target.getStage().getPointerPosition();
    const worldPos = inverseTransformPosition(pos, zoom, pan);
    
    const element: DrawableElement = {
      id: generateId(),
      type: 'movement',
      position: { x: (drawStart.x + worldPos.x) / 2, y: (drawStart.y + worldPos.y) / 2 },
      data: {
        start: drawStart,
        end: worldPos,
        team: selectedTeam
      },
      zIndex: elements.length
    };
    
    addElement(element);
    setIsDrawing(false);
    setDrawStart(null);
  };

  const createElement = (position: Position) => {
    const snappedPos = snapToGrid(position);
    
    let element: DrawableElement;
    
    switch (selectedTool) {
      case 'player':
        element = {
          id: generateId(),
          type: 'player',
          position: snappedPos,
          data: { team: selectedTeam },
          zIndex: elements.length
        };
        break;
        
      case 'text':
        element = {
          id: generateId(),
          type: 'text',
          position: snappedPos,
          data: { text: 'Novo texto', team: selectedTeam },
          zIndex: elements.length
        };
        break;
        
      case 'area':
        element = {
          id: generateId(),
          type: 'area',
          position: snappedPos,
          data: { size: { width: 100, height: 100 }, team: selectedTeam },
          zIndex: elements.length
        };
        break;
        
      case 'gadget':
        element = {
          id: generateId(),
          type: 'gadget',
          position: snappedPos,
          data: { gadgetType: 'grenade', team: selectedTeam },
          zIndex: elements.length
        };
        break;
        
      default:
        return;
    }
    
    addElement(element);
  };

  const handleElementSelect = (elementId: string) => {
    selectElement(elementId);
  };

  const handleElementDragEnd = (elementId: string, newPos: Position) => {
    updateElement(elementId, { position: snapToGrid(newPos) });
  };

  const renderElement = (element: DrawableElement) => {
    const isSelected = selectedElements.includes(element.id);
    
    switch (element.type) {
      case 'player':
        return (
          <PlayerElement
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={() => handleElementSelect(element.id)}
            onDragEnd={(newPos) => handleElementDragEnd(element.id, newPos)}
          />
        );
        
      case 'movement':
        return (
          <MovementLine
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={() => handleElementSelect(element.id)}
          />
        );
        
      case 'text':
        return (
          <TextElement
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={() => handleElementSelect(element.id)}
            onDragEnd={(newPos) => handleElementDragEnd(element.id, newPos)}
          />
        );
        
      case 'area':
        return (
          <AreaElement
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={() => handleElementSelect(element.id)}
            onDragEnd={(newPos) => handleElementDragEnd(element.id, newPos)}
          />
        );
        
      case 'gadget':
        return (
          <GadgetElement
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={() => handleElementSelect(element.id)}
            onDragEnd={(newPos) => handleElementDragEnd(element.id, newPos)}
          />
        );
        
      default:
        return null;
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedElements.length > 0) {
        removeElements(selectedElements);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElements, removeElements]);

  return (
    <div className="flex-1 bg-muted/30 overflow-hidden">
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        scaleX={zoom}
        scaleY={zoom}
        x={pan.x}
        y={pan.y}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onMouseDown={handleStageMouseDown}
        onMouseUp={handleStageMouseUp}
      >
        <Layer>
          <MapBackground mapImage={selectedMap?.image} />
        </Layer>
        <Layer>
          {elements.map(renderElement)}
        </Layer>
      </Stage>
    </div>
  );
};