"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Save, FolderOpen, Trash2, ChevronDown } from 'lucide-react';
import { useTacticalBoard } from '@/stores/tactical-board';
import { useToast } from '@/hooks/use-toast';

export const StrategyManager: React.FC = () => {
  const {
    currentStrategy,
    savedStrategies,
    elements,
    saveStrategy,
    loadStrategy,
    deleteStrategy,
  } = useTacticalBoard();
  
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [strategyName, setStrategyName] = useState('');
  const [tags, setTags] = useState('');
  
  const handleSaveStrategy = () => {
    if (!strategyName.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, insira um nome para a estratégia.',
        variant: 'destructive',
      });
      return;
    }
    
    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    saveStrategy({
      name: strategyName.trim(),
      tags: tagArray,
      elements,
      createdAt: new Date().toISOString()
    });
    
    toast({
      title: 'Estratégia salva',
      description: `A estratégia "${strategyName}" foi salva com sucesso.`,
    });
    
    setStrategyName('');
    setTags('');
    setIsDialogOpen(false);
  };
  
  const handleLoadStrategy = (strategy: any) => {
    loadStrategy(strategy);
    toast({
      title: 'Estratégia carregada',
      description: `A estratégia "${strategy.name}" foi carregada.`,
    });
  };
  
  const handleDeleteStrategy = (strategyId: string, strategyName: string) => {
    deleteStrategy(strategyId);
    toast({
      title: 'Estratégia excluída',
      description: `A estratégia "${strategyName}" foi excluída.`,
    });
  };
  
  return (
    <div className="flex items-center gap-2">
      {/* Save Strategy Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
              >
                <Save className="h-3 w-3 mr-1" />
                Salvar
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Salvar estratégia atual</p>
          </TooltipContent>
        </Tooltip>
        
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Salvar Estratégia</DialogTitle>
            <DialogDescription>
              Salve a estratégia atual com um nome e tags opcionais.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
                className="col-span-3"
                placeholder="Nome da estratégia"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="col-span-3"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleSaveStrategy}>
              Salvar Estratégia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Load Strategy Dropdown */}
      {savedStrategies.length > 0 && (
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-xs"
                >
                  <FolderOpen className="h-3 w-3 mr-1" />
                  Carregar
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Carregar estratégia salva</p>
            </TooltipContent>
          </Tooltip>
          
          <DropdownMenuContent align="start" className="w-64">
            {savedStrategies.map((strategy) => (
              <DropdownMenuItem
                key={strategy.id}
                className="flex items-center justify-between p-2"
                onSelect={(e) => e.preventDefault()}
              >
                <div className="flex-1 cursor-pointer" onClick={() => handleLoadStrategy(strategy)}>
                  <div className="font-medium text-sm">{strategy.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(strategy.createdAt).toLocaleDateString()}
                    {strategy.tags && strategy.tags.length > 0 && (
                      <span className="ml-2">
                        {strategy.tags.map(tag => `#${tag}`).join(' ')}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteStrategy(strategy.id, strategy.name);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {/* Current Strategy Indicator */}
      {currentStrategy && (
        <div className="text-xs text-muted-foreground">
          Atual: <span className="font-medium">{currentStrategy.name}</span>
        </div>
      )}
    </div>
  );
};