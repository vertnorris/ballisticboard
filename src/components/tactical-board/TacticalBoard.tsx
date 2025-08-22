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
import { ZoomIn, ZoomOut, Maximize, Target, Users, Zap, Undo2, Redo2, RotateCcw, Save, Download, Loader2, Check, ChevronDown, Square, Circle, Type, Pen, Hand, Lightbulb } from 'lucide-react';

import { StrategyManager } from './StrategyManager';
import { GadgetCounter } from './GadgetCounter';
import { StrategyDrawingPanel } from './StrategyDrawingPanel';
import { ElementPropertiesPanel } from './ElementPropertiesPanel';
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
    setSelectedElements,
    addElement,
    updateElement,
    removeElement,
    clearElements,
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
    exporting: false,
    lastExported: false,
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
            handleSave();
            break;
          case 'e':
            e.preventDefault();
            handleExport();
            break;
          case 'Delete':
            e.preventDefault();
            if (confirm('Tem certeza que deseja limpar tudo?')) {
              reset();
            }
            break;
        }
      } else {
        switch (e.key) {
          case 'v':
            setSelectedTool('select');
            break;
          case 'p':
            setSelectedTool('player');
            break;
          case 'g':
            setSelectedTool('gadget');
            break;
          case 'r':
            setSelectedTool('rectangle');
            break;
          case 'c':
            setSelectedTool('circle');
            break;
          case 'l':
            setSelectedTool('line');
            break;
          case 't':
            setSelectedTool('text');
            break;
          case '+':
          case '=':
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

  const handleSave = async () => {
    setActionStatus(prev => ({ ...prev, saving: true, lastSaved: false }));
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setActionStatus(prev => ({ ...prev, saving: false, lastSaved: true }));
    setTimeout(() => {
      setActionStatus(prev => ({ ...prev, lastSaved: false }));
    }, 2000);
  };

  const handleExport = async () => {
    setActionStatus(prev => ({ ...prev, exporting: true, lastExported: false }));
    // Simulate export operation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setActionStatus(prev => ({ ...prev, exporting: false, lastExported: true }));
    setTimeout(() => {
      setActionStatus(prev => ({ ...prev, lastExported: false }));
    }, 2000);
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
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      BallisticBoard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Quadro Tático</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">


            {/* Toolbar - Reorganized in 2 lines */}
            <div className="bg-card border rounded-lg p-3 shadow-sm">
              {/* First Line: Tools */}
              <div className="flex items-center justify-between gap-4 mb-3">
                {/* Selection and Navigation */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === 'select' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setSelectedTool('select')}
                          className="h-8 w-8 p-0"
                        >
                          <Hand className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ferramenta de Seleção <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">V</kbd></p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="h-6 w-px bg-border" />

                  {/* Game Elements */}
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === 'player' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setSelectedTool('player')}
                          className="h-8 w-8 p-0"
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Adicionar Jogador <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">P</kbd></p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === 'gadget' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setSelectedTool('gadget')}
                          className="h-8 w-8 p-0"
                        >
                          <Zap className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Adicionar Gadget <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">G</kbd></p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="h-6 w-px bg-border" />

                  {/* Drawing Tools */}
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === 'rectangle' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setSelectedTool('rectangle')}
                          className="h-8 w-8 p-0"
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Área Retangular <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">R</kbd></p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === 'circle' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setSelectedTool('circle')}
                          className="h-8 w-8 p-0"
                        >
                          <Circle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Área Circular <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">C</kbd></p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === 'line' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setSelectedTool('line')}
                          className="h-8 w-8 p-0"
                        >
                          <Pen className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Linha de Movimento <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">L</kbd></p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === 'text' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setSelectedTool('text')}
                          className="h-8 w-8 p-0"
                        >
                          <Type className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Anotação de Texto <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">T</kbd></p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Second Line: Team Selection and Controls */}
              <div className="flex items-center justify-between gap-4">
                {/* Team Selection */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Time:</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant={selectedTeam === 'attack' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTeam('attack')}
                      className="h-7 px-3 text-xs"
                    >
                      Ataque
                    </Button>
                    <Button
                      variant={selectedTeam === 'defense' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTeam('defense')}
                      className="h-7 px-3 text-xs"
                    >
                      Defesa
                    </Button>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={undo}
                          disabled={historyIndex <= 0}
                          className="h-8 w-8 p-0"
                        >
                          <Undo2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Desfazer <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">Ctrl+Z</kbd></p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={redo}
                          disabled={historyIndex >= history.length - 1}
                          className="h-8 w-8 p-0"
                        >
                          <Redo2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refazer <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">Ctrl+Y</kbd></p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <div className="h-6 w-px bg-border" />
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Tem certeza que deseja limpar tudo?')) {
                              reset();
                            }
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Limpar Tudo <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">Ctrl+Del</kbd></p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="h-6 w-px bg-border" />
                  
                  {/* Zoom */}
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                          className="h-8 w-8 p-0"
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Diminuir Zoom <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">-</kbd></p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <span className="text-xs font-mono min-w-[3rem] text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                          className="h-8 w-8 p-0"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Aumentar Zoom <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">+</kbd></p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex gap-4">
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  {selectedMap ? (
                    <div 
                      className="border rounded-lg bg-background overflow-hidden shadow-sm"
                      style={{ 
                        width: canvasSize.width, 
                        height: canvasSize.height,
                        maxWidth: '100%',
                        maxHeight: '100%'
                      }}
                    >
                      <div className="relative w-full h-full">
                        <KonvaCanvas
                          width={canvasSize.width}
                          height={canvasSize.height}
                          currentMap={selectedMap}
                          elements={elements}
                          selectedTool={selectedTool}
                          selectedGadget={selectedGadget ? {
                            ...gadgets.find(g => g.id === selectedGadget)!,
                            cost: 0,
                            icon: gadgets.find(g => g.id === selectedGadget)?.image || ''
                          } : undefined}
                          selectedTeam={selectedTeam}
                          selectedElements={elements.filter(el => selectedElements.includes(el.id))}
                          zoom={zoom}
                          pan={pan}
                          setZoom={setZoom}
                          setPan={setPan}
                          setSelectedElements={(elements) => {
                            setSelectedElements(elements.map(el => el.id));
                          }}
                          onAddElement={addElement}
                          onUpdateElement={updateElement}
                          onRemoveElement={removeElement}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center min-h-[600px] bg-gradient-to-br from-background via-muted/20 to-background">
                      <div className="w-full max-w-2xl mx-6">
                        {/* Header Section */}
                        <div className="text-center mb-8 pt-12">

                          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Selecione um Mapa
                          </h1>
                          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                            Escolha o mapa onde você quer criar sua estratégia tática
                          </p>
                        </div>

                        {/* Map Selector Card */}
                        <Card className="mb-8 border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-all duration-300 shadow-xl bg-card/50 backdrop-blur-sm">
                          <CardContent className="p-8">
                            <div className="flex flex-col items-center space-y-6">
                              <div className="w-full max-w-sm">
                                <MapSelector />
                              </div>
                              
                              {/* Quick Stats */}
                              <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                                <div className="text-center p-3 rounded-lg bg-muted/30">
                                  <div className="text-2xl font-bold text-primary">5</div>
                                  <div className="text-xs text-muted-foreground">Mapas</div>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-muted/30">
                                  <div className="text-2xl font-bold text-green-500">∞</div>
                                  <div className="text-xs text-muted-foreground">Estratégias</div>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-muted/30">
                                  <div className="text-2xl font-bold text-blue-500">10+</div>
                                  <div className="text-xs text-muted-foreground">Ferramentas</div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Features Preview */}
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                          <Card className="border border-muted-foreground/10 bg-card/30 backdrop-blur-sm">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                  <Users className="w-4 h-4 text-blue-500" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-sm mb-1">Posicionamento de Jogadores</h3>
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    Posicione atacantes e defensores com cores personalizadas
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="border border-muted-foreground/10 bg-card/30 backdrop-blur-sm">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                                  <Zap className="w-4 h-4 text-yellow-500" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-sm mb-1">Gadgets Táticos</h3>
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    Adicione granadas, equipamentos e utilitários estratégicos
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Bottom Tip */}
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                            <Lightbulb className="w-4 h-4 text-primary" />
                            <span className="text-sm text-muted-foreground">
                              Após selecionar o mapa, você terá acesso a todas as ferramentas de planejamento
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <StrategyDrawingPanel />
              </div>

              {/* Right Sidebar */}
              <div className="w-80 flex flex-col gap-4">
                <ElementPropertiesPanel 
                  selectedElements={elements.filter(el => selectedElements.includes(el.id))}
                />
                <GadgetCounter />
                <StrategyManager />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} />}
    </TooltipProvider>
  );
};