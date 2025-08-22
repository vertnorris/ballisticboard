"use client";

import React, { useState } from 'react';
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
  EyeOff
} from 'lucide-react';
import { useTacticalBoard } from '@/stores/tactical-board';
import { gadgets } from '@/data/gadgets';

interface TabbedPanelProps {
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

export const TabbedPanel: React.FC<TabbedPanelProps> = ({
  selectedElements,
}) => {
  const { 
    elements, 
    updateElement, 
    removeElement, 
    removeElements, 
    selectElements,
    clearSelection 
  } = useTacticalBoard();
  
  const [activeTab, setActiveTab] = useState('elements');

  const handleUpdateProperty = (elementId: string, property: string, value: any) => {
    updateElement(elementId, { [property]: value });
  };

  const handleElementClick = (elementId: string) => {
    selectElements([elementId]);
    setActiveTab('properties');
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
          <div className="grid grid-cols-2 gap-2">
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
          </div>

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
            <div className="grid grid-cols-2 gap-2">
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
            </div>
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

    const groupedElements = elements.reduce((acc, element) => {
      const type = element.type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(element);
      return acc;
    }, {} as Record<string, DrawableElement[]>);

    return (
      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {Object.entries(groupedElements).map(([type, typeElements]) => (
            <div key={type}>
              <div className="flex items-center gap-2 mb-2">
                {React.createElement(getElementIcon(type), { className: "w-4 h-4 text-muted-foreground" })}
                <span className="text-sm font-medium">{getElementTypeLabel(type)}</span>
                <Badge variant="secondary" className="text-xs">{typeElements.length}</Badge>
              </div>
              
              <div className="space-y-1 ml-6">
                {typeElements.map((element) => {
                  const isSelected = selectedElements.some(sel => sel.id === element.id);
                  const gadget = element.type === 'gadget' ? gadgets.find(g => g.id === element.gadgetId) : null;
                  
                  return (
                    <div
                      key={element.id}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleElementClick(element.id)}
                    >
                      {element.type === 'gadget' && gadget && (
                        <div className="w-6 h-6 rounded overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={gadget.image}
                            alt={gadget.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">
                          {element.type === 'gadget' && gadget ? gadget.name : 
                           element.type === 'text' ? (element.text || 'Texto vazio') :
                           element.type === 'player' ? `Jogador ${element.id.slice(-4)}` :
                           `${getElementTypeLabel(element.type)} ${element.id.slice(-4)}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {element.team === 'attacker' ? 'Atacante' : 
                           element.team === 'defender' ? 'Defensor' : 'Neutro'} • 
                          ({Math.round(element.x)}, {Math.round(element.y)})
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
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
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Card className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <CardHeader className="pb-3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="elements" className="text-xs">
              <List className="w-3 h-3 mr-1" />
              Elementos ({elements.length})
            </TabsTrigger>
            <TabsTrigger value="properties" className="text-xs">
              <Settings className="w-3 h-3 mr-1" />
              Propriedades
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
        </CardContent>
      </Tabs>
    </Card>
  );
};