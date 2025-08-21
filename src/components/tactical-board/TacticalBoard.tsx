"use client";

import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { MapSelector } from '@/components/maps/MapSelector';
import { useTacticalBoard } from '@/stores/tactical-board';
import { useCanvasSize } from '@/hooks/use-canvas-size';
import { TacticalElement } from '@/types/tactical';
import { Lightbulb } from 'lucide-react';
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
import { ZoomIn, ZoomOut, Maximize, Target, Users, Zap, Undo2, Redo2, RotateCcw, Save, Download, Loader2, Check, Minimize2, Maximize2, ChevronDown } from 'lucide-react';
// import { GadgetSelector } from './GadgetSelector';
import { StrategyManager } from './StrategyManager';
import { GadgetCounter } from './GadgetCounter';
import { StrategyDrawingPanel } from './StrategyDrawingPanel';
import { ElementPropertiesPanel } from './ElementPropertiesPanel';
import { gadgets } from '@/data/gadgets';

import { Onboarding } from './Onboarding';
import { KonvaCanvas } from './KonvaCanvas';

export const TacticalBoard: React.FC = () => {
  const canvasSize = useCanvasSize();
  
  const {
    selectedMap,
    setSelectedMap,
    selectedTool,
    setSelectedTool,
    selectedTeam,
    setSelectedTeam,
    selectedGadget,
    setSelectedGadget,
    elements,
    selectedElements,
    zoom,
    setZoom,
    pan,
    setPan,
    selectElements,
    clearSelection,
    reset,
    undo,
    redo,
    showOnboarding,
    setShowOnboarding,
    getGadgetCount,
    getGadgetLimit,
  } = useTacticalBoard();

  const [actionStatus, setActionStatus] = useState<{
    saving?: boolean
    exporting?: boolean
    lastSaved?: Date
    lastExported?: Date
    showStatus?: boolean
  }>({})
  const [isCompactMode, setIsCompactMode] = useState(false);

  // Auto-hide status indicator after 3 seconds
  useEffect(() => {
    if (actionStatus.lastSaved || actionStatus.lastExported) {
      setActionStatus(prev => ({ ...prev, showStatus: true }))
      
      const timer = setTimeout(() => {
        setActionStatus(prev => ({ ...prev, showStatus: false }))
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [actionStatus.lastSaved, actionStatus.lastExported]);

  // Canvas size is now handled by the useCanvasSize hook

  const handleZoomIn = () => {
    setZoom(zoom * 1.2);
  };

  const handleZoomOut = () => {
    setZoom(zoom / 1.2);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleSave = async () => {
    setActionStatus(prev => ({ ...prev, saving: true }))
    
    try {
      const data = {
        elements,
        zoom,
        pan,
        selectedMap: selectedMap?.id || 'default'
      }
      localStorage.setItem('tactical-board-data', JSON.stringify(data))
      
      // Simular um pequeno delay para mostrar o feedback
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setActionStatus(prev => ({ 
        ...prev, 
        saving: false, 
        lastSaved: new Date() 
      }))
      
      console.log('Board saved!')
    } catch (error) {
      setActionStatus(prev => ({ ...prev, saving: false }))
      console.error('Error saving board:', error)
    }
  }

  const handleExport = async () => {
    setActionStatus(prev => ({ ...prev, exporting: true }))
    
    try {
      // Simular um pequeno delay para mostrar o feedback
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // TODO: Implement actual canvas export functionality
      const link = document.createElement('a')
      link.download = 'tactical-board.png'
      // link.href = canvas.toDataURL()
      // link.click()
      
      setActionStatus(prev => ({ 
        ...prev, 
        exporting: false, 
        lastExported: new Date() 
      }))
      
      console.log('Board exported!')
    } catch (error) {
      setActionStatus(prev => ({ ...prev, exporting: false }))
      console.error('Error exporting board:', error)
    }
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className={`flex shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ${isCompactMode ? 'h-12' : 'h-16'}`}>
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              {!isCompactMode && (
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
              )}
              {isCompactMode && (
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold">Tactical Board</h1>
                </div>
              )}
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Map Selection */}
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
              {/* Header Principal */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-background to-muted/20">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <MapSelector />
                    <div className="h-6 w-px bg-border/60" />
                    <div>
                      <h1 className="text-xl font-bold tracking-tight">Tactical Board</h1>
                      <p className="text-sm text-muted-foreground">Planeje suas estratégias táticas</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StrategyManager />
                  <div className="h-6 w-px bg-border/60" />
                  
                  {/* Status Indicator */}
                  {actionStatus.showStatus && (actionStatus.lastSaved || actionStatus.lastExported) && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800 animate-in fade-in-0 slide-in-from-right-2 duration-300">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                        {actionStatus.lastSaved && actionStatus.lastExported ? (
                          actionStatus.lastSaved > actionStatus.lastExported ? 'Salvo' : 'Exportado'
                        ) : actionStatus.lastSaved ? (
                          'Salvo'
                        ) : (
                          'Exportado'
                        )}
                      </span>
                    </div>
                  )}
                  
                  <div className="h-6 w-px bg-border/60" />
                  
                  {/* Compact Mode Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => setIsCompactMode(!isCompactMode)}
                         className={`p-0 transition-all duration-200 ${isCompactMode ? 'h-6 w-6' : 'h-8 w-8'}`}
                       >
                         {isCompactMode ? <Maximize2 className={`transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} /> : <Minimize2 className={`transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isCompactMode ? 'Modo Normal' : 'Modo Compacto'}</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <div className="h-6 w-px bg-border/60" />
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Elementos: {elements.length}</span>
                  </div>
                </div>
              </div>
              
              {/* Toolbar */}
              <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${isCompactMode ? 'p-1 gap-1 lg:gap-2' : 'p-4 gap-4 lg:gap-0'}`}>
                <div className={`flex flex-wrap items-center transition-all duration-200 ${isCompactMode ? 'gap-1 lg:gap-2' : 'gap-2 lg:gap-4'}`}>
                  {/* Grupo 1: Ferramentas de Seleção */}
                  <div className="flex flex-col gap-1">
                    {!isCompactMode && <span className="text-xs font-medium text-muted-foreground px-2 hidden sm:block">Ferramentas</span>}
                    <div className={`flex items-center gap-1 bg-muted/80 rounded-lg border transition-all duration-200 ${isCompactMode ? 'p-0.5' : 'p-1'}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                             variant={selectedTool === 'select' ? 'default' : 'ghost'}
                             size="sm"
                             onClick={() => setSelectedTool('select')}
                             className={`p-0 transition-all duration-200 ${isCompactMode ? 'h-6 w-6' : 'h-8 w-8'}`}
                           >
                             <Target className={`transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Selecionar <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">V</kbd></p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                             variant={selectedTool === 'target' ? 'default' : 'ghost'}
                             size="sm"
                             onClick={() => setSelectedTool('target')}
                             className={`p-0 transition-all duration-200 ${isCompactMode ? 'h-6 w-6' : 'h-8 w-8'}`}
                           >
                             <Users className={`transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Adicionar Jogador <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">P</kbd></p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant={selectedTool === 'gadget' ? 'default' : 'ghost'}
                                size="sm"
                                className={`p-0 transition-all duration-200 ${isCompactMode ? 'h-6 w-6' : 'h-8 w-8'}`}
                              >
                                <Zap className={`transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                              </Button>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Selecionar Gadget <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">G</kbd></p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <DropdownMenuContent align="start" className="w-64">
                          <DropdownMenuLabel>Selecionar Gadget</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {gadgets.map((gadget) => {
                             const isSelected = selectedGadget === gadget.id;
                             const currentCount = getGadgetCount(gadget.id);
                             const maxCount = getGadgetLimit(gadget.id);
                             const isAtLimit = currentCount >= maxCount;
                             
                             return (
                               <DropdownMenuItem
                                 key={gadget.id}
                                 className={`flex items-center gap-3 p-3 cursor-pointer ${
                                   isSelected ? 'bg-accent' : ''
                                 } ${isAtLimit ? 'opacity-50' : ''}`}
                                 onSelect={() => {
                                   setSelectedTool('gadget');
                                   setSelectedGadget(gadget.id);
                                 }}
                                 disabled={isAtLimit}
                               >
                                 <div className="w-8 h-8 rounded border bg-muted flex items-center justify-center overflow-hidden">
                                   <img
                                     src={gadget.image}
                                     alt={gadget.name}
                                     className="w-full h-full object-cover"
                                   />
                                 </div>
                                 <div className="flex-1">
                                   <div className="font-medium text-sm">{gadget.name}</div>
                                   <div className="text-xs text-muted-foreground">{gadget.description}</div>
                                 </div>
                                 <div className={`text-xs px-2 py-1 rounded ${
                                   isAtLimit ? 'bg-destructive text-destructive-foreground' :
                                   currentCount > 0 ? 'bg-secondary text-secondary-foreground' :
                                   'bg-muted text-muted-foreground'
                                 }`}>
                                   {currentCount}/{maxCount}
                                 </div>
                               </DropdownMenuItem>
                             );
                           })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                             variant={selectedTool === 'element' ? 'default' : 'ghost'}
                             size="sm"
                             onClick={() => setSelectedTool('element')}
                             className={`p-0 transition-all duration-200 ${isCompactMode ? 'h-6 w-6' : 'h-8 w-8'}`}
                           >
                             <Lightbulb className={`transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Adicionar Elemento <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">E</kbd></p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {selectedTool === 'gadget' && selectedGadget && (
                        <div className="ml-2 pl-2 border-l">
                          <GadgetCounter />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Separador */}
                  <div className="h-12 w-px bg-border/60 hidden lg:block" />
                  
                  {/* Grupo 2: Seleção de Time */}
                  <div className="flex flex-col gap-1">
                    {!isCompactMode && <span className="text-xs font-medium text-muted-foreground px-2 hidden sm:block">Time</span>}
                    <div className={`flex items-center gap-1 bg-muted/80 rounded-lg border transition-all duration-200 ${isCompactMode ? 'p-0.5' : 'p-1'}`}>
                      <Button
                        variant={selectedTeam === 'attacker' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setSelectedTeam('attacker')}
                        className={`text-xs font-medium transition-all ${isCompactMode ? 'h-6 px-2' : 'h-8 px-2 sm:px-3'}`}
                      >
                        <span className="sm:hidden">🔴</span>
                        <span className="hidden sm:inline">🔴 Ataque</span>
                      </Button>
                      <Button
                        variant={selectedTeam === 'defender' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setSelectedTeam('defender')}
                        className={`text-xs font-medium transition-all ${isCompactMode ? 'h-6 px-2' : 'h-8 px-2 sm:px-3'}`}
                      >
                        <span className="sm:hidden">🔵</span>
                        <span className="hidden sm:inline">🔵 Defesa</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className={`flex flex-wrap items-center justify-end lg:justify-start transition-all duration-200 ${isCompactMode ? 'gap-1 lg:gap-2' : 'gap-2 lg:gap-4'}`}>
                  {/* Grupo 3: Controles de Ação */}
                  <div className="flex flex-col gap-1">
                    {!isCompactMode && <span className="text-xs font-medium text-muted-foreground px-2 hidden sm:block">Ações</span>}
                    <div className="flex items-center gap-1 bg-muted/80 rounded-lg p-1 border">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={undo}
                            className={`p-0 transition-all duration-200 ${isCompactMode ? 'h-6 w-6' : 'h-8 w-8'}`}
                          >
                            <Undo2 className={`transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
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
                            className={`p-0 transition-all duration-200 ${isCompactMode ? 'h-6 w-6' : 'h-8 w-8'}`}
                          >
                            <Redo2 className={`transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Refazer <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">Ctrl+Y</kbd></p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={reset}
                            className={`p-0 transition-all duration-200 ${isCompactMode ? 'h-6 w-6' : 'h-8 w-8'}`}
                          >
                            <RotateCcw className={`transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Limpar Tudo <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">Ctrl+R</kbd></p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSave}
                            disabled={actionStatus.saving}
                            className={`p-0 transition-all duration-200 ${isCompactMode ? 'h-6 w-6' : 'h-8 w-8'}`}
                          >
                            {actionStatus.saving ? (
                              <Loader2 className={`animate-spin transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                            ) : actionStatus.lastSaved ? (
                              <Check className={`text-green-500 transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                            ) : (
                              <Save className={`transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Salvar <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">Ctrl+S</kbd></p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleExport}
                            disabled={actionStatus.exporting}
                            className={`p-0 transition-all duration-200 ${isCompactMode ? 'h-6 w-6' : 'h-8 w-8'}`}
                          >
                            {actionStatus.exporting ? (
                              <Loader2 className={`animate-spin transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                            ) : actionStatus.lastExported ? (
                              <Check className={`text-green-500 transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                            ) : (
                              <Download className={`transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Exportar <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">Ctrl+E</kbd></p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Separador */}
                  <div className="h-12 w-px bg-border/60 hidden lg:block" />

                  {/* Grupo 4: Controles de Zoom */}
                  <div className="flex flex-col gap-1">
                    {!isCompactMode && <span className="text-xs font-medium text-muted-foreground px-2 hidden sm:block">Visualização</span>}
                    <div className="flex items-center gap-1 bg-muted/80 rounded-lg p-1 border">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleZoomOut}
                            className={`p-0 transition-all duration-200 ${isCompactMode ? 'h-6 w-6' : 'h-8 w-8'}`}
                          >
                            <ZoomOut className={`transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Diminuir Zoom <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">-</kbd></p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <div className="px-2 sm:px-3 py-1 text-sm font-mono bg-background/50 rounded border min-w-[50px] sm:min-w-[60px] text-center">
                        <span className="sm:hidden">{Math.round(zoom * 100)}</span>
                        <span className="hidden sm:inline">{Math.round(zoom * 100)}%</span>
                      </div>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleZoomIn}
                            className={`p-0 transition-all duration-200 ${isCompactMode ? 'h-6 w-6' : 'h-8 w-8'}`}
                          >
                            <ZoomIn className={`transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Aumentar Zoom <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">+</kbd></p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetView}
                            className={`p-0 transition-all duration-200 ${isCompactMode ? 'h-6 w-6' : 'h-8 w-8'}`}
                          >
                            <Maximize className={`transition-all duration-200 ${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ajustar à Tela <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">0</kbd></p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Canvas and Properties Area */}
              <div className="p-4 relative flex-1 flex gap-4">
                {/* Canvas Area */}
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
                              const elementIds = elements.map(el => el.id);
                              if (elementIds.length > 0) {
                                selectElements(elementIds);
                              } else {
                                clearSelection();
                              }
                            }}
                          />

                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <Card className="w-full max-w-lg mx-4">
                          <CardContent className="p-8">
                            <div className="text-center mb-6">
                              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <Target className="w-8 h-8 text-primary" />
                              </div>
                              <h2 className="text-2xl font-semibold mb-2">Selecione um Mapa</h2>
                              <p className="text-muted-foreground">
                                Escolha o mapa onde você quer criar sua estratégia tática
                              </p>
                            </div>

                            <div className="mb-6 flex justify-center">
                              <MapSelector />
                            </div>

                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">
                                <Lightbulb className="inline w-4 h-4 mr-1" /> Após selecionar o mapa, você poderá adicionar jogadores, gadgets e anotações
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* Strategy Drawing Panel */}
                  <StrategyDrawingPanel />
                </div>

                {/* Properties Panel */}
                <div className="w-80 flex flex-col gap-4">
                  <ElementPropertiesPanel 
                    selectedElements={elements.filter(el => selectedElements.includes(el.id))}
                  />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      
      {showOnboarding && (
        <Onboarding onClose={() => setShowOnboarding(false)} />
      )}
    </TooltipProvider>
  );
};