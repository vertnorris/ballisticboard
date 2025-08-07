'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTacticalBoard } from '@/stores/tactical-board';
import { maps } from '@/data/maps';
import { weapons, gadgets } from '@/data/weapons';
import { DrawableElement, Position } from '@/types';
import { generateId, snapToGrid } from '@/utils/canvas';

interface ClientMapCanvasProps {
  width: number;
  height: number;
}

export const ClientMapCanvas: React.FC<ClientMapCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isKonvaLoaded, setIsKonvaLoaded] = useState(false);
  const [Konva, setKonva] = useState<any>(null);
  const [Stage, setStage] = useState<any>(null);
  const [Layer, setLayer] = useState<any>(null);
  const [Image, setImage] = useState<any>(null);
  const [Circle, setCircle] = useState<any>(null);
  const [Line, setLine] = useState<any>(null);
  const [Text, setText] = useState<any>(null);
  const [Rect, setRect] = useState<any>(null);
  
  const {
    selectedMap,
    zoom,
    pan,
    selectedTool,
    selectedTeam,
    elements,
    selectedElements,
    setZoom,
    setPan,
    addElement,
    updateElement,
    removeElements,
    selectElements,
  } = useTacticalBoard();

  // Dynamically load Konva and react-konva
  useEffect(() => {
    const loadKonva = async () => {
      try {
        const konvaModule = await import('konva');
        const reactKonvaModule = await import('react-konva');
        
        setKonva(konvaModule.default);
        setStage(reactKonvaModule.Stage);
        setLayer(reactKonvaModule.Layer);
        setImage(reactKonvaModule.Image);
        setCircle(reactKonvaModule.Circle);
        setLine(reactKonvaModule.Line);
        setText(reactKonvaModule.Text);
        setRect(reactKonvaModule.Rect);
        setIsKonvaLoaded(true);
      } catch (error) {
        console.error('Failed to load Konva:', error);
      }
    };

    loadKonva();
  }, []);

  const currentMap = selectedMap ? maps.find(m => m.id === selectedMap.id) : null;

  const handleStageClick = (e: any) => {
    if (!isKonvaLoaded || !Konva) return;
    
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const position = {
      x: (pointerPosition.x - pan.x) / zoom,
      y: (pointerPosition.y - pan.y) / zoom,
    };

    if (selectedTool === 'select') {
      // Handle selection
      const clickedElement = elements.find(el => {
        const bounds = getElementBounds(el);
        return position.x >= bounds.x && position.x <= bounds.x + bounds.width &&
               position.y >= bounds.y && position.y <= bounds.y + bounds.height;
      });

      if (clickedElement) {
        selectElements([clickedElement.id]);
      } else {
        selectElements([]);
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
    }
  };

  const getElementBounds = (element: DrawableElement) => {
    switch (element.type) {
      case 'player':
        return { x: element.position.x - 15, y: element.position.y - 15, width: 30, height: 30 };
      case 'text':
        return { x: element.position.x, y: element.position.y, width: 100, height: 20 };
      default:
        return { x: element.position.x, y: element.position.y, width: 20, height: 20 };
    }
  };

  const renderElement = (element: DrawableElement) => {
    const isSelected = selectedElements.includes(element.id);
    const teamColor = element.team === 'attacker' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))';

    switch (element.type) {
      case 'player':
        return (
          <Circle
            key={element.id}
            x={element.position.x}
            y={element.position.y}
            radius={15}
            fill={teamColor}
            stroke={isSelected ? 'hsl(var(--background))' : teamColor}
            strokeWidth={isSelected ? 3 : 1}
            draggable
            onDragEnd={(e: any) => {
              const newPosition = { x: e.target.x(), y: e.target.y() };
              updateElement(element.id, { position: snapToGrid(newPosition) });
            }}
          />
        );
      case 'text':
        return (
          <Text
            key={element.id}
            x={element.position.x}
            y={element.position.y}
            text={element.data?.text || 'Texto'}
            fontSize={14}
            fill={teamColor}
            stroke={isSelected ? 'hsl(var(--background))' : 'transparent'}
            strokeWidth={isSelected ? 1 : 0}
            draggable
            onDragEnd={(e: any) => {
              const newPosition = { x: e.target.x(), y: e.target.y() };
              updateElement(element.id, { position: snapToGrid(newPosition) });
            }}
          />
        );
      default:
        return null;
    }
  };

  if (!isKonvaLoaded || !Stage || !Layer) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fortnite-blue mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Carregando canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Stage
        width={width}
        height={height}
        scaleX={zoom}
        scaleY={zoom}
        x={pan.x}
        y={pan.y}
        onClick={handleStageClick}
        onWheel={(e: any) => {
          e.evt.preventDefault();
          const scaleBy = 1.1;
          const stage = e.target.getStage();
          const oldScale = stage.scaleX();
          const pointer = stage.getPointerPosition();

          const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
          
          setZoom(Math.max(0.1, Math.min(3, newScale)));
        }}
        draggable
        onDragEnd={(e: any) => {
          setPan({ x: e.target.x(), y: e.target.y() });
        }}
      >
        <Layer>
          {/* Map Background */}
          {currentMap && (
            <Rect
              x={0}
              y={0}
              width={800}
              height={600}
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth={2}
            />
          )}
          
          {/* Grid */}
          {Array.from({ length: 40 }, (_, i) => (
            <Line
              key={`grid-v-${i}`}
              points={[i * 20, 0, i * 20, 600]}
              stroke="hsl(var(--border))"
              strokeWidth={0.5}
              opacity={0.3}
            />
          ))}
          {Array.from({ length: 30 }, (_, i) => (
            <Line
              key={`grid-h-${i}`}
              points={[0, i * 20, 800, i * 20]}
              stroke="hsl(var(--border))"
              strokeWidth={0.5}
              opacity={0.3}
            />
          ))}
          
          {/* Callouts */}
          {currentMap?.callouts.map((callout) => (
            <Text
              key={callout.id}
              x={callout.position.x}
              y={callout.position.y}
              text={callout.name}
              fontSize={12}
              fill="hsl(var(--foreground))"
              opacity={0.7}
            />
          ))}
          
          {/* Elements */}
          {elements.map(renderElement)}
        </Layer>
      </Stage>
    </div>
  );
};