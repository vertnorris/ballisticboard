"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { DrawableElement } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { 
  Trash2, 
  Edit3, 
  Move, 
  RotateCw, 
  Lightbulb, 
  Settings, 
  List, 
  Users, 
  Zap, 
  Square, 
  Circle, 
  Type, 
  Pen,
  Eye,
  EyeOff,
  Save,
  FolderOpen,
  ChevronDown,
  PenTool,
  MoreHorizontal
} from 'lucide-react';
import { useTacticalBoard } from '@/stores/tactical-board';
import { useToast } from '@/hooks/use-toast';
import { gadgets } from '@/data/gadgets';

interface UnifiedTabbedPanelProps {
  selectedElements: DrawableElement[];
}

const getElementIcon = (type: string) => {
  switch (type) {
    case 'player': return Users;
    case 'gadget': return Zap;
    case 'rectangle': return Square;
    case 'circle': return Circle;
    case 'text': return Type;
    case 'line': return Pen;
    default: return Edit3;
  }
};

const getElementTypeLabel = (type: string) => {
  switch (type) {
    case 'player': return 'Jogador';
    case 'gadget': return 'Gadget';
    case 'rectangle': return 'Retângulo';
    case 'circle': return 'Círculo';
    case 'text': return 'Texto';
    case 'line': return 'Linha';
    default: return type;
  }
};

interface StrategyStyle {
  id: string;
  name: string;
  color: string;
  strokeWidth: number;
  dashPattern?: number[];
  icon: React.ComponentType<any>;
}

const strategyStyles: StrategyStyle[] = [
  {
    id: 'solid',
    name: 'Linha Sólida',
    color: 'var(--chart-3)',
    strokeWidth: 3,
    icon: Pen,
  },
  {
    id: 'dashed',
    name: 'Linha Tracejada',
    color: 'var(--chart-2)',
    strokeWidth: 3,
    dashPattern: [10, 5],
    icon: MoreHorizontal,
  },
  {
    id: 'route',
    name: 'Rota Principal',
    color: 'var(--destructive)',
    strokeWidth: 4,
    icon: Zap,
  },
  {
    id: 'alternative',
    name: 'Rota Alternativa',
    color: 'var(--chart-4)',
    strokeWidth: 2,
    dashPattern: [5, 5],
    icon: PenTool,
  },
];

export const UnifiedTabbedPanel: React.FC<UnifiedTabbedPanelProps> = React.memo(({
  selectedElements,
}) => {
  const { 
    elements, 
    updateElement, 
    removeElement, 
    removeElements, 
    selectElements,
    clearSelection,
    currentStrategy,
    savedStrategies,
    saveStrategy,
    loadStrategy,
    deleteStrategy,
    selectedLineStyle,
    setSelectedLineStyle
  } = useTacticalBoard();
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('elements');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [strategyName, setStrategyName] = useState('');
  const [tags, setTags] = useState('');

  const handleUpdateProperty = useCallback((elementId: string, property: string, value: any) => {
    updateElement(elementId, { [property]: value });
  }, [updateElement]);

  const handleElementClick = useCallback((elementId: string) => {
    selectElements([elementId]);
    setActiveTab('properties');
  }, [selectElements]);

  const handleSaveStrategy = useCallback(() => {
    if (!strategyName.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, insira um nome para a estratégia.',
        variant: 'destructive',
      });
      return;
    }

    const strategy = {
      name: strategyName.trim(),
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      elements: elements,
      createdAt: new Date().toISOString(),
    };

    saveStrategy(strategy);
    setIsDialogOpen(false);
    setStrategyName('');
    setTags('');
    
    toast({
      title: 'Estratégia salva',
      description: `A estratégia "${strategy.name}" foi salva com sucesso.`,
    });
  }, [strategyName, tags, elements, saveStrategy, toast]);

  const handleLoadStrategy = useCallback((strategy: any) => {
    loadStrategy(strategy);
    toast({
      title: 'Estratégia carregada',
      description: `A estratégia "${strategy.name}" foi carregada.`,
    });
  }, [loadStrategy, toast]);

  const handleDeleteStrategy = useCallback((strategyId: string, strategyName: string) => {
    deleteStrategy(strategyId);
    toast({
      title: 'Estratégia excluída',
      description: `A estratégia "${strategyName}" foi excluída.`,
    });
  }, [deleteStrategy, toast]);

  const renderStrategyTab = () => {
    return (
      <div className="space-y-4">
        {/* Strategy Manager */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Gerenciar Estratégias</h4>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex-1 h-8 text-xs">
                  <Save className="h-3 w-3 mr-1" />
                  Salvar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Salvar Estratégia</DialogTitle>
                  <DialogDescription>
                    Salve sua estratégia atual para usar posteriormente.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strategy-name">Nome da Estratégia</Label>
                    <Input
                      id="strategy-name"
                      value={strategyName}
                      onChange={(e) => setStrategyName(e.target.value)}
                      placeholder="Ex: Ataque Site A"
                    />
                  </div>
                  <div>
                    <Label htmlFor="strategy-tags">Tags (opcional)</Label>
                    <Input
                      id="strategy-tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Ex: ataque, site-a, rush"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveStrategy}>
                    Salvar Estratégia
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                  <FolderOpen className="h-3 w-3 mr-1" />
                  Carregar
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {savedStrategies.length === 0 ? (
                  <div className="p-3 text-center text-muted-foreground text-sm">
                    Nenhuma estratégia salva
                  </div>
                ) : (
                  savedStrategies.map((strategy) => (
                    <DropdownMenuItem
                      key={strategy.id}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex-1 min-w-0" onClick={() => handleLoadStrategy(strategy)}>
                        <div className="font-medium text-sm truncate">{strategy.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(strategy.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStrategy(strategy.id, strategy.name);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Separator />

        {/* Drawing Styles */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Estilos de Desenho</h4>
          <div className="grid grid-cols-2 gap-2">
            {strategyStyles.map((style) => {
              const Icon = style.icon;
              const isSelected = selectedLineStyle === style.id;
              
              return (
                <Tooltip key={style.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      className="h-12 flex-col gap-1 text-xs"
                      onClick={() => setSelectedLineStyle(style.id)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{style.name}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <div className="font-medium">{style.name}</div>
                      <div className="text-muted-foreground">
                        Espessura: {style.strokeWidth}px
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderPropertiesTab = () => {
    if (selectedElements.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-6">
          <Edit3 className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium mb-2">Nenhum elemento selecionado</p>
          <p className="text-xs leading-relaxed">
            Clique em um elemento no canvas ou na lista para ver e editar suas propriedades
          </p>
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <Lightbulb className="inline w-4 h-4 mr-1" /> <strong>Dica:</strong> Use Ctrl+clique para seleção múltipla
            </p>
          </div>
        </div>
      );
    }

    if (selectedElements.length === 1) {
      const element = selectedElements[0];
      
      return (
        <div className="space-y-4">
          {/* Element Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              {React.createElement(getElementIcon(element.type), { className: "w-4 h-4 text-primary" })}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{getElementTypeLabel(element.type)}</div>
              <div className="text-xs text-muted-foreground">ID: {element.id}</div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {element.team === 'attacker' ? 'Atacante' : element.team === 'defender' ? 'Defensor' : 'Neutro'}
            </Badge>
          </div>

          {/* Position */}
          <fieldset className="grid grid-cols-2 gap-2">
            <legend className="sr-only">Posição do elemento</legend>
            <div>
              <Label htmlFor="x" className="text-xs">Posição X</Label>
              <Input
                id="x"
                type="number"
                value={Math.round(element.x)}
                onChange={(e) => handleUpdateProperty(element.id, 'x', parseInt(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="y" className="text-xs">Posição Y</Label>
              <Input
                id="y"
                type="number"
                value={Math.round(element.y)}
                onChange={(e) => handleUpdateProperty(element.id, 'y', parseInt(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
          </fieldset>

          {/* Color */}
          <div>
            <Label htmlFor="color" className="text-xs">Cor</Label>
            <Input
              id="color"
              type="color"
              value={element.color || '#ff0000'}
              onChange={(e) => handleUpdateProperty(element.id, 'color', e.target.value)}
              className="h-8 w-full"
            />
          </div>

          {/* Team for players and gadgets */}
          {(element.type === 'player' || element.type === 'gadget') && (
            <div>
              <Label className="text-xs">Time</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={element.team === 'attacker' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleUpdateProperty(element.id, 'team', 'attacker')}
                  className="flex-1 h-8 text-xs"
                >
                  Atacante
                </Button>
                <Button
                  variant={element.team === 'defender' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleUpdateProperty(element.id, 'team', 'defender')}
                  className="flex-1 h-8 text-xs"
                >
                  Defensor
                </Button>
              </div>
            </div>
          )}

          {/* Text content for text elements */}
          {element.type === 'text' && (
            <div className="space-y-2">
              <Label htmlFor="text-content" className="text-xs">Texto</Label>
              <Textarea
                id="text-content"
                value={element.text || ''}
                onChange={(e) => handleUpdateProperty(element.id, 'text', e.target.value)}
                className="min-h-[60px] text-xs"
                placeholder="Digite o texto..."
              />
            </div>
          )}

          {/* Size for shapes */}
          {(element.type === 'rectangle' || element.type === 'circle') && (
            <fieldset className="grid grid-cols-2 gap-2">
              <legend className="sr-only">Dimensões do elemento</legend>
              <div>
                <Label htmlFor="width" className="text-xs">Largura</Label>
                <Input
                  id="width"
                  type="number"
                  value={Math.round(element.width || 0)}
                  onChange={(e) => handleUpdateProperty(element.id, 'width', parseInt(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-xs">Altura</Label>
                <Input
                  id="height"
                  type="number"
                  value={Math.round(element.height || 0)}
                  onChange={(e) => handleUpdateProperty(element.id, 'height', parseInt(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
            </fieldset>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeElement(element.id)}
              className="flex-1 h-8 text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Excluir
            </Button>
          </div>
        </div>
      );
    }

    // Multiple elements selected
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Elementos selecionados: {selectedElements.length}</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {selectedElements.map((element) => (
              <li key={element.id} className="text-xs">
                {getElementTypeLabel(element.type)} - {element.id}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearSelection}
            className="w-full h-8 text-xs"
          >
            Limpar Seleção
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeElements(selectedElements.map(el => el.id))}
            className="w-full h-8 text-xs"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Excluir Selecionados
          </Button>
        </div>
      </div>
    );
  };

  const groupedElements = useMemo(() => 
    elements.reduce((acc, element) => {
      const type = element.type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(element);
      return acc;
    }, {} as Record<string, DrawableElement[]>)
  , [elements]);

  const renderElementsList = () => {
    if (elements.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-6">
          <List className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium mb-2">Nenhum elemento criado</p>
          <p className="text-xs leading-relaxed">
            Use as ferramentas da barra superior para adicionar elementos ao mapa
          </p>
        </div>
      );
    }

    return (
      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {Object.entries(groupedElements).map(([type, typeElements]) => {
            const Icon = getElementIcon(type);
            return (
              <section key={type}>
                <header className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{getElementTypeLabel(type)}</span>
                  <Badge variant="secondary" className="text-xs">{typeElements.length}</Badge>
                </header>
                
                <ul className="space-y-1 ml-6">
                  {typeElements.map((element) => {
                    const isSelected = selectedElements.some(sel => sel.id === element.id);
                    const gadget = element.type === 'gadget' ? gadgets.find(g => g.id === element.gadgetId) : null;
                    
                    return (
                      <li
                        key={element.id}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleElementClick(element.id)}
                      >
                        {element.type === 'gadget' && gadget && (
                          <img
                            src={gadget.image}
                            alt={gadget.name}
                            className="w-6 h-6 rounded object-cover bg-muted flex-shrink-0"
                          />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            {element.type === 'gadget' && gadget ? gadget.name : 
                             element.type === 'text' ? (element.text || 'Texto vazio') :
                             element.type === 'player' ? `Jogador ${element.id.slice(-4)}` :
                             `${getElementTypeLabel(element.type)} ${element.id.slice(-4)}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {element.team === 'attacker' ? 'Atacante' : 
                             element.team === 'defender' ? 'Defensor' : 'Neutro'} • 
                            ({Math.round(element.x)}, {Math.round(element.y)})
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeElement(element.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Card className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <CardHeader className="pb-3">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="elements" className="text-xs">
              <List className="w-3 h-3 mr-1" />
              Elementos ({elements.length})
            </TabsTrigger>
            <TabsTrigger value="properties" className="text-xs">
              <Settings className="w-3 h-3 mr-1" />
              Propriedades
            </TabsTrigger>
            <TabsTrigger value="strategy" className="text-xs">
              <Save className="w-3 h-3 mr-1" />
              Estratégia
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="pt-0">
          <TabsContent value="elements" className="mt-0">
            {renderElementsList()}
          </TabsContent>
          
          <TabsContent value="properties" className="mt-0">
            {renderPropertiesTab()}
          </TabsContent>
          
          <TabsContent value="strategy" className="mt-0">
            {renderStrategyTab()}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
});

UnifiedTabbedPanel.displayName = 'UnifiedTabbedPanel';