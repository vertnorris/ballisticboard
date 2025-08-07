"use client";

import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { DynamicMapCanvas } from './DynamicMapCanvas';
import { MapSelector } from '@/components/maps/MapSelector';
import { TimerPanel } from './TimerPanel';

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
import { ZoomIn, ZoomOut, Maximize, Timer, Target, Layers } from 'lucide-react';
import { useTacticalBoard } from '@/stores/tactical-board';

export const TacticalBoard: React.FC = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 600 });
  const [showTimers, setShowTimers] = useState(false);
  const { zoom, setZoom, setPan, selectedMap, calloutManagementMode, toggleCalloutManagementMode } = useTacticalBoard();

  useEffect(() => {
    const updateCanvasSize = () => {
      const toolbar = 64; // Toolbar width
      const header = 80; // Header height
      const padding = 32; // Padding
      
      const width = window.innerWidth - toolbar - padding;
      const height = window.innerHeight - header - padding;
      
      setCanvasSize({ width, height });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Modern Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                <BreadcrumbPage>{selectedMap?.name || 'Selecione um Mapa'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="ml-auto flex items-center gap-3">
            {/* Map Selector */}
            <div className="hidden md:block">
              <MapSelector />
            </div>
            
            {/* Panel Toggles */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle
                    pressed={showTimers}
                    onPressedChange={setShowTimers}
                    size="sm"
                    className="h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    <Timer className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Timers</span>
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Alternar painel de timers</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle
                    pressed={calloutManagementMode}
                    onPressedChange={toggleCalloutManagementMode}
                    size="sm"
                    className="h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    <Layers className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Gerenciar</span>
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ativar modo de gerenciamento de callouts</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Zoom Controls */}
            <TooltipProvider>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleZoomOut}
                      className="h-8 w-8 p-0"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Diminuir zoom</p>
                  </TooltipContent>
                </Tooltip>
                
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground min-w-[50px] text-center">
                  {Math.round(zoom * 100)}%
                </div>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleZoomIn}
                      className="h-8 w-8 p-0"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Aumentar zoom</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetView}
                      className="h-8 w-8 p-0"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Resetar visualização</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 relative">
          {/* Canvas Area */}
          <div className="flex-1 relative bg-muted/30 rounded-xl border">
            <div className="absolute inset-4 bg-background rounded-lg shadow-sm border overflow-hidden">
              <DynamicMapCanvas width={canvasSize.width} height={canvasSize.height} />
            </div>
            
            {/* Timer Panel */}
            {showTimers && (
              <div className="absolute top-6 right-6 w-80 bg-background/95 backdrop-blur-xl border rounded-xl shadow-xl z-20 animate-in slide-in-from-right-5">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-warning flex items-center justify-center">
                        <Timer className="h-3 w-3 text-warning-foreground" />
                      </div>
                      <h3 className="font-semibold">Timers Ativos</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTimers(false)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <TimerPanel />
                </div>
              </div>
            )}
            

          </div>
        </div>

        {/* Modern Status Bar */}
        <footer className="border-t px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="h-5 text-xs bg-success/10 text-success border-success/20">
                <div className="w-1.5 h-1.5 rounded-full bg-success mr-1" />
                Canvas Ativo
              </Badge>
              <Badge variant="outline" className="h-5 text-xs">
                {canvasSize.width}×{canvasSize.height}
              </Badge>
              <Badge variant="outline" className="h-5 text-xs">
                {Math.round(zoom * 100)}%
              </Badge>
              {showTimers && (
                <Badge variant="outline" className="h-5 text-xs bg-warning/10 text-warning border-warning/20">
                  <Timer className="w-3 h-3 mr-1" />
                  Timers
                </Badge>
              )}
              <span className="hidden lg:inline">Dicas: Roda do mouse para zoom • Botão direito para mover</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="hidden md:inline">Atalhos: V•P•M•T•A•G•E</span>
              <Badge variant="outline" className="h-5 text-xs">
                <Layers className="h-3 w-3 mr-1" />
                Elementos: 0
              </Badge>
              <Badge variant="outline" className="h-5 text-xs bg-primary/10 text-primary border-primary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mr-1" />
                Online
              </Badge>
            </div>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
};