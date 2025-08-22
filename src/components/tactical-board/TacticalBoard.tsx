"use client";

import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { MapSelector } from '@/components/maps/MapSelector';
import { useTacticalBoard } from '@/stores/tactical-board';
import { useCanvasSize } from '@/hooks/use-canvas-size';
import { DrawableElement } from '@/types';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ZoomIn, ZoomOut, Maximize, Target, Users, Zap, Undo2, Redo2, RotateCcw, Save, Loader2, Check, ChevronDown, Square, Circle, Type, Pen, Hand, Lightbulb } from 'lucide-react';

import { StrategyManager } from './StrategyManager';
import { GadgetCounter } from './GadgetCounter';
import { StrategyDrawingPanel } from './StrategyDrawingPanel';
import { TabbedPanel } from './TabbedPanel';
import { gadgets } from '@/data/gadgets';

import { Onboarding } from './Onboarding';
import { KonvaCanvas } from './KonvaCanvas';

export const TacticalBoard: React.FC = () => {
  const {
    selectedMap,
    selectedTool,
    setSelectedTool,
    selectedTeam,
    setSelectedTeam,
    selectedGadget,
    setSelectedGadget,
    elements,
    selectedElements,
    addElement,
    updateElement,
    removeElement,
    removeElements,
    selectElements,
    clearSelection,
    undo,
    redo,
    historyIndex,
    history,
    reset,
    zoom,
    setZoom,
    pan,
    setPan,
    showOnboarding,
    setShowOnboarding,
  } = useTacticalBoard();

  const canvasSize = useCanvasSize();

  const [actionStatus, setActionStatus] = useState({
    saving: false,
    lastSaved: false,
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 's':
            e.preventDefault();
            // TODO: Implementar funcionalidade de salvamento
            console.log('Salvando estratégia...');
            break;

          case 'a':
            e.preventDefault();
            selectElements(elements.map(el => el.id));
            break;
          case 'Delete':
          case 'Backspace':
            e.preventDefault();
            if (selectedElements.length > 0) {
              removeElements(selectedElements);
            }
            break;
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElements.length > 0) {
          removeElements(selectedElements);
        }
      } else if (e.key === 'r' && confirm('Tem certeza que deseja limpar tudo?')) {
        reset();
        clearSelection();
      } else {
        switch (e.key) {
          case 'h':
          case 'v':
            setSelectedTool('select');
            break;
          case 'p':
            setSelectedTool('player');
            break;
          case 'g':
            setSelectedTool('gadget');
            break;
          case 't':
            setSelectedTool('text');
            break;
          case 'c':
            setSelectedTool('circle');
            break;
          case 'l':
            setSelectedTool('line');
            break;
          case 'r':
            setSelectedTool('rectangle');
            break;
          case 'Escape':
            clearSelection();
            break;
          case '=':
          case '+':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
          case '0':
            e.preventDefault();
            handleResetView();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, reset, setSelectedTool]);

  const handleResetBoard = () => {
    reset();
    clearSelection();
  };



  const handleZoomIn = () => setZoom(Math.min(3, zoom + 0.1));
  const handleZoomOut = () => setZoom(Math.max(0.1, zoom - 0.1));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-20 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between w-full px-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                          Ballistic Board
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Tactical Board</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                
                {/* Project Statistics */}
                <div className="hidden lg:flex items-center gap-3 ml-6">
                  <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium">
                      {elements.filter(el => el.type === 'player').length} Jogadores
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-xs font-medium">
                      {elements.filter(el => el.type === 'gadget').length} Gadgets
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-xs font-medium">
                      {elements.filter(el => ['rectangle', 'circle', 'line', 'text'].includes(el.type)).length} Desenhos
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Map Info */}
                <div className="flex items-center gap-3">
                  {selectedMap && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="w-6 h-4 rounded-sm bg-gradient-to-r from-primary/60 to-primary/40 border border-primary/30"></div>
                      <div className="text-xs">
                        <div className="font-medium text-primary">{selectedMap.name}</div>
                        <div className="text-muted-foreground">Mapa Selecionado</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Mapa:</span>
                    <MapSelector />
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Toolbar */}
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg p-3 shadow-sm mt-4">
              <div className="flex items-center justify-between gap-4">
                {/* Left Side - Main Tools */}
                <div className="flex items-center gap-3">
                  {/* Selection Tool */}
                  <div className="flex items-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === 'select' ? 'default' : 'ghost'}
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={() => setSelectedTool('select')}
                        >
                          <Hand className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-popover border shadow-md">
                        <div className="flex items-center gap-2">
                          <span>Seleção</span>
                          <kbd className="px-2 py-1 text-xs font-mono bg-blue-500/20 text-blue-600 border border-blue-500/30 rounded shadow-sm">V</kbd>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <Separator orientation="vertical" className="h-6" />

                  {/* Drawing Tools */}
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === 'rectangle' ? 'default' : 'ghost'}
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={() => setSelectedTool('rectangle')}
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-popover border shadow-md">
                        <div className="flex items-center gap-2">
                          <span>Retângulo</span>
                          <kbd className="px-2 py-1 text-xs font-mono bg-orange-500/20 text-orange-600 border border-orange-500/30 rounded shadow-sm">R</kbd>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === 'circle' ? 'default' : 'ghost'}
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={() => setSelectedTool('circle')}
                        >
                          <Circle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-popover border shadow-md">
                        <div className="flex items-center gap-2">
                          <span>Círculo</span>
                          <kbd className="px-2 py-1 text-xs font-mono bg-orange-500/20 text-orange-600 border border-orange-500/30 rounded shadow-sm">C</kbd>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === 'line' ? 'default' : 'ghost'}
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={() => setSelectedTool('line')}
                        >
                          <Pen className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-popover border shadow-md">
                        <div className="flex items-center gap-2">
                          <span>Linha</span>
                          <kbd className="px-2 py-1 text-xs font-mono bg-orange-500/20 text-orange-600 border border-orange-500/30 rounded shadow-sm">L</kbd>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === 'text' ? 'default' : 'ghost'}
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={() => setSelectedTool('text')}
                        >
                          <Type className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-popover border shadow-md">
                        <div className="flex items-center gap-2">
                          <span>Texto</span>
                          <kbd className="px-2 py-1 text-xs font-mono bg-orange-500/20 text-orange-600 border border-orange-500/30 rounded shadow-sm">T</kbd>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <Separator orientation="vertical" className="h-6" />

                  {/* Game Elements */}
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === 'player' ? 'default' : 'ghost'}
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={() => setSelectedTool('player')}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-popover border shadow-md">
                        <div className="flex items-center gap-2">
                          <span>Jogador</span>
                          <kbd className="px-2 py-1 text-xs font-mono bg-green-500/20 text-green-600 border border-green-500/30 rounded shadow-sm">P</kbd>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant={selectedTool === 'gadget' ? 'default' : 'ghost'}
                              size="sm"
                              className="h-9 w-9 p-0"
                              onClick={() => setSelectedTool('gadget')}
                            >
                              <Zap className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-popover border shadow-md">
                          <div className="flex items-center gap-2">
                            <span>Gadget</span>
                            <kbd className="px-2 py-1 text-xs font-mono bg-purple-500/20 text-purple-600 border border-purple-500/30 rounded shadow-sm">G</kbd>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="start" className="w-64">
                        <DropdownMenuLabel>Gadgets Disponíveis</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <ScrollArea className="h-64">
                          {gadgets.map((gadget) => (
                            <DropdownMenuItem
                              key={gadget.id}
                              className="flex items-center gap-3 p-3 cursor-pointer"
                              onClick={() => {
                                setSelectedGadget(gadget.id);
                                setSelectedTool('gadget');
                              }}
                            >
                              <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <img
                                  src={gadget.image}
                                  alt={gadget.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{gadget.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{gadget.description}</div>
                              </div>
                              {selectedGadget === gadget.id && (
                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </ScrollArea>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Separator orientation="vertical" className="h-6" />

                  {/* Team Selection */}
                  <div className="flex items-center gap-1 bg-muted/50 rounded-md p-1">
                    <Button
                      variant={selectedTeam === 'attacker' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-7 px-3 text-xs"
                      onClick={() => setSelectedTeam('attacker')}
                    >
                      <Target className="h-3 w-3 mr-1" />
                      Ataque
                    </Button>
                    <Button
                      variant={selectedTeam === 'defender' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-7 px-3 text-xs"
                      onClick={() => setSelectedTeam('defender')}
                    >
                      <Users className="h-3 w-3 mr-1" />
                      Defesa
                    </Button>
                  </div>
                </div>



                {/* Right Side - Actions & Controls */}
                <div className="flex items-center gap-3">
                  {/* History Actions */}
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={undo}
                          disabled={historyIndex <= 0}
                        >
                          <Undo2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-popover border shadow-md">
                        <div className="flex items-center gap-2">
                          <span>Desfazer</span>
                          <kbd className="px-2 py-1 text-xs font-mono bg-gray-500/20 text-gray-600 border border-gray-500/30 rounded shadow-sm">Ctrl+Z</kbd>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={redo}
                          disabled={historyIndex >= history.length - 1}
                        >
                          <Redo2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-popover border shadow-md">
                        <div className="flex items-center gap-2">
                          <span>Refazer</span>
                          <kbd className="px-2 py-1 text-xs font-mono bg-gray-500/20 text-gray-600 border border-gray-500/30 rounded shadow-sm">Ctrl+Y</kbd>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <Separator orientation="vertical" className="h-6" />

                  {/* File Actions */}


                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={handleZoomOut}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-popover border shadow-md">
                        <div className="flex items-center gap-2">
                          <span>Diminuir Zoom</span>
                          <kbd className="px-2 py-1 text-xs font-mono bg-gray-500/20 text-gray-600 border border-gray-500/30 rounded shadow-sm">Ctrl+-</kbd>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    
                    <div className="px-3 py-1 bg-muted/50 rounded text-xs font-mono min-w-[3.5rem] text-center">
                      {Math.round(zoom * 100)}%
                    </div>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={handleZoomIn}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-popover border shadow-md">
                        <div className="flex items-center gap-2">
                          <span>Aumentar Zoom</span>
                          <kbd className="px-2 py-1 text-xs font-mono bg-gray-500/20 text-gray-600 border border-gray-500/30 rounded shadow-sm">Ctrl++</kbd>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={handleResetView}
                        >
                          <Maximize className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-popover border shadow-md">
                        <div className="flex items-center gap-2">
                          <span>Ajustar à Tela</span>
                          <kbd className="px-2 py-1 text-xs font-mono bg-gray-500/20 text-gray-600 border border-gray-500/30 rounded shadow-sm">Ctrl+0</kbd>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 gap-4">
              <div className="flex-1 relative">
                {selectedMap ? (
                  <KonvaCanvas
                    currentMap={selectedMap}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    elements={elements}
                    selectedElements={elements.filter(el => selectedElements.includes(el.id))}
                    selectedTool={selectedTool}
                    selectedTeam={selectedTeam}
                    selectedGadget={selectedGadget ? {
                      ...gadgets.find(g => g.id === selectedGadget)!,
                      id: selectedGadget,
                      icon: gadgets.find(g => g.id === selectedGadget)?.image || '',
                      cost: 0
                    } : undefined}
                    zoom={zoom}
                    pan={pan}
                    setZoom={setZoom}
                    setPan={setPan}
                    setSelectedElements={(elements) => {
                      if (Array.isArray(elements)) {
                        selectElements(elements.map(el => el.id));
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25">
                    <div className="text-center space-y-6">
                      <div>
                        <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">Selecione um mapa</h3>
                        <p className="text-muted-foreground mb-4">Escolha um mapa para começar a criar suas estratégias.</p>
                      </div>
                      <div className="flex justify-center">
                        <MapSelector />
                      </div>
                    </div>
                  </div>
                )}
                
                <GadgetCounter />
              </div>

              <div className="w-80 space-y-4">
                <StrategyManager />
                <StrategyDrawingPanel />
                <TabbedPanel selectedElements={elements.filter(el => selectedElements.includes(el.id))} />
                
                {/* Reset Board Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full h-9 text-xs"
                      onClick={handleResetBoard}
                    >
                      <RotateCcw className="h-3 w-3 mr-2" />
                      Resetar Board
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-popover border shadow-md">
                    <div className="flex items-center gap-2">
                      <span>Limpar todos os elementos do board</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} />}
    </TooltipProvider>
  );
};