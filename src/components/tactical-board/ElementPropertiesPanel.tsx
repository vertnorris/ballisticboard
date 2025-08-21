import React from 'react';
import { DrawableElement } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Trash2, Edit3, Move, RotateCw, Lightbulb } from 'lucide-react';
import { useTacticalBoard } from '@/stores/tactical-board';

interface ElementPropertiesPanelProps {
  selectedElements: DrawableElement[];
}

export const ElementPropertiesPanel: React.FC<ElementPropertiesPanelProps> = ({
  selectedElements,
}) => {
  const { updateElement, removeElement, removeElements } = useTacticalBoard();

  if (selectedElements.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Propriedades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-6">
            <Edit3 className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium mb-2">Nenhum elemento selecionado</p>
            <p className="text-xs leading-relaxed">
              Clique em um elemento no canvas ou use a ferramenta de seleção para ver e editar suas propriedades
            </p>
          </div>
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <Lightbulb className="inline w-4 h-4 mr-1" /> <strong>Dica:</strong> Use Ctrl+clique para selecionar múltiplos elementos
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedElements.length === 1) {
    const element = selectedElements[0];
    
    const handleUpdateProperty = (property: string, value: any) => {
      updateElement(element.id, { [property]: value });
    };

    const handleUpdateData = (dataProperty: string, value: any) => {
      const newData = { ...element.data, [dataProperty]: value };
      updateElement(element.id, { data: newData });
    };

    const handleDelete = () => {
      removeElement(element.id);
    };

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Propriedades do Elemento</span>
            <Badge variant="outline" className="text-xs">
              {element.type}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Properties */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="x-pos" className="text-xs">Posição X</Label>
                <Input
                  id="x-pos"
                  type="number"
                  value={Math.round(element.x)}
                  onChange={(e) => handleUpdateProperty('x', parseFloat(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="y-pos" className="text-xs">Posição Y</Label>
                <Input
                  id="y-pos"
                  type="number"
                  value={Math.round(element.y)}
                  onChange={(e) => handleUpdateProperty('y', parseFloat(e.target.value))}
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
                onChange={(e) => handleUpdateProperty('color', e.target.value)}
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
                    onClick={() => handleUpdateProperty('team', 'attacker')}
                    className="flex-1 h-8 text-xs"
                  >
                    Atacante
                  </Button>
                  <Button
                    variant={element.team === 'defender' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleUpdateProperty('team', 'defender')}
                    className="flex-1 h-8 text-xs"
                  >
                    Defensor
                  </Button>
                </div>
              </div>
            )}

            {/* Text content for text elements */}
            {element.type === 'text' && (
              <div>
                <Label htmlFor="text-content" className="text-xs">Texto</Label>
                <Input
                  id="text-content"
                  value={element.data?.text || ''}
                  onChange={(e) => handleUpdateData('text', e.target.value)}
                  className="h-8 text-xs"
                  placeholder="Digite o texto..."
                />
              </div>
            )}

            {/* Dimensions for shapes */}
            {(element.type === 'rectangle' || element.type === 'circle') && (
              <div className="grid grid-cols-2 gap-2">
                {element.type === 'rectangle' && (
                  <>
                    <div>
                      <Label htmlFor="width" className="text-xs">Largura</Label>
                      <Input
                        id="width"
                        type="number"
                        value={element.width || 20}
                        onChange={(e) => handleUpdateProperty('width', parseFloat(e.target.value))}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height" className="text-xs">Altura</Label>
                      <Input
                        id="height"
                        type="number"
                        value={element.height || 20}
                        onChange={(e) => handleUpdateProperty('height', parseFloat(e.target.value))}
                        className="h-8 text-xs"
                      />
                    </div>
                  </>
                )}
                {element.type === 'circle' && (
                  <div className="col-span-2">
                    <Label htmlFor="radius" className="text-xs">Raio</Label>
                    <Input
                      id="radius"
                      type="number"
                      value={element.radius || 10}
                      onChange={(e) => handleUpdateProperty('radius', parseFloat(e.target.value))}
                      className="h-8 text-xs"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="w-full h-8 text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Excluir Elemento
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Multiple elements selected
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Múltiplos Elementos</span>
          <Badge variant="outline" className="text-xs">
            {selectedElements.length} selecionados
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Elementos selecionados:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {selectedElements.map((element) => (
              <li key={element.id} className="text-xs">
                {element.type} - {element.id}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div className="space-y-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeElements(selectedElements.map(el => el.id))}
            className="w-full h-8 text-xs"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Excluir Todos ({selectedElements.length})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};