'use client';

import React, { useState, useEffect } from 'react';
import { useTacticalBoard } from '@/stores/tactical-board';
import { gadgets } from '@/data/gadgets';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, X, RotateCcw, Timer, Clock } from 'lucide-react';
import { TimedElement } from '@/types';
import Image from 'next/image';

interface TimerItemProps {
  element: TimedElement;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onRemove: (id: string) => void;
}

function TimerItem({ element, onActivate, onDeactivate, onRemove }: TimerItemProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const gadget = gadgets.find(g => g.id === element.gadgetId);
  
  useEffect(() => {
    if (!element.active || !element.startTime || !element.duration) {
      setTimeLeft(0);
      setProgress(0);
      return;
    }
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - element.startTime) / 1000;
      const remaining = Math.max(0, element.duration - elapsed);
      const progressValue = ((element.duration - remaining) / element.duration) * 100;
      
      setTimeLeft(Math.ceil(remaining));
      setProgress(progressValue);
      
      if (remaining <= 0) {
        onDeactivate(element.id);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [element.active, element.startTime, element.duration, element.id, onDeactivate]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };
  
  if (!gadget) return null;
  
  return (
    <div className="group relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 space-y-3 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:border-primary/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
            <Image 
              src={gadget.image} 
              alt={gadget.name}
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{gadget.name}</span>
            <span className="text-xs text-muted-foreground">{gadget.type}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(element.id)}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {element.active ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {formatTime(timeLeft)} restante
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeactivate(element.id)}
              className="h-8 w-8 p-0 hover:bg-orange-500/10 hover:text-orange-500 rounded-lg transition-all duration-200"
            >
              <Pause className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="h-3 bg-muted/50" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0s</span>
              <span>{element.duration}s</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs bg-secondary/50 text-secondary-foreground border border-secondary/20">
            <Clock className="w-3 h-3 mr-1" />
            {element.duration}s configurado
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onActivate(element.id)}
            className="h-8 w-8 p-0 hover:bg-emerald-500/10 hover:text-emerald-500 rounded-lg transition-all duration-200"
          >
            <Play className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function TimerPanel() {
  const { 
    timedElements, 
    activateTimedElement, 
    deactivateTimedElement, 
    removeTimedElement 
  } = useTacticalBoard();
  
  const activeElements = timedElements.filter(el => el.active);
  const inactiveElements = timedElements.filter(el => !el.active);
  
  const handleClearAll = () => {
    timedElements.forEach(element => {
      removeTimedElement(element.id);
    });
  };
  
  if (timedElements.length === 0) {
    return (
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6">
        <div className="text-center text-muted-foreground">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Timer className="w-8 h-8 text-primary/60" />
          </div>
          <p className="text-sm font-medium mb-1">Nenhum gadget com timer ativo</p>
          <p className="text-xs text-muted-foreground/70">Adicione gadgets no mapa para gerenciar seus timers</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Timer className="w-4 h-4 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            Timers Ativos
          </h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          className="text-xs border-border/50 hover:border-destructive/50 hover:text-destructive hover:bg-destructive/5 transition-all duration-200"
        >
          <X className="w-3 h-3 mr-1" />
          Limpar Todos
        </Button>
      </div>
      
      {activeElements.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Em Execução</h4>
            <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              {activeElements.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {activeElements.map(element => (
              <TimerItem
                key={element.id}
                element={element}
                onActivate={activateTimedElement}
                onDeactivate={deactivateTimedElement}
                onRemove={removeTimedElement}
              />
            ))}
          </div>
        </div>
      )}
      
      {inactiveElements.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
            <h4 className="text-sm font-semibold text-muted-foreground">Aguardando</h4>
            <Badge variant="secondary" className="text-xs bg-secondary/50 text-secondary-foreground border-secondary/20">
              {inactiveElements.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {inactiveElements.map(element => (
              <TimerItem
                key={element.id}
                element={element}
                onActivate={activateTimedElement}
                onDeactivate={deactivateTimedElement}
                onRemove={removeTimedElement}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}