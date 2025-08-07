import React from 'react';
import { Eye, EyeOff, Edit3, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTacticalBoard } from '@/stores/tactical-board';

interface CalloutPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalloutPanel: React.FC<CalloutPanelProps> = ({ isOpen, onClose }) => {
  const {
    selectedMap,
    showCallouts,
    hiddenCallouts,
    editingCallout,
    toggleCallouts,
    toggleCalloutVisibility,
    setEditingCallout,
  } = useTacticalBoard();

  if (!isOpen || !selectedMap) return null;

  return (
    <Card className="w-80 h-fit max-h-[calc(100vh-2rem)] overflow-hidden border-l-0 rounded-l-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Gerenciar Callouts
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{selectedMap.name}</Badge>
          <Button
            variant={showCallouts ? "default" : "outline"}
            size="sm"
            onClick={toggleCallouts}
            className="ml-auto"
          >
            {showCallouts ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {showCallouts ? 'Ocultar Todos' : 'Mostrar Todos'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {selectedMap.callouts.map((callout) => {
          const isHidden = hiddenCallouts.includes(callout.id);
          const isEditing = editingCallout === callout.id;
          
          return (
            <div
              key={callout.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                isEditing 
                  ? 'border-primary bg-primary/5' 
                  : isHidden 
                  ? 'border-muted bg-muted/30 opacity-60'
                  : 'border-border bg-card hover:bg-accent/50'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">{callout.name}</h4>
                  {isEditing && (
                    <Badge variant="secondary" className="text-xs">
                      Editando
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Posição: {Math.round(callout.position.x)}, {Math.round(callout.position.y)}
                </p>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingCallout(isEditing ? null : callout.id)}
                  className={`h-8 w-8 p-0 ${
                    isEditing ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCalloutVisibility(callout.id)}
                  className={`h-8 w-8 p-0 ${
                    isHidden ? 'text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  {isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          );
        })}
        
        {selectedMap.callouts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum callout disponível neste mapa</p>
          </div>
        )}
      </CardContent>
      
      <div className="p-4 border-t bg-muted/30">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Clique no ícone de olho para ocultar/mostrar callouts</p>
          <p>• Clique no ícone de edição para ativar o modo de edição</p>
          <p>• Arraste o callout diretamente no mapa para reposicioná-lo</p>
          <p>• Clique no callout novamente para sair do modo de edição</p>
        </div>
      </div>
    </Card>
  );
};

export default CalloutPanel;