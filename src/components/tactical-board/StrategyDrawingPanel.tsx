import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTacticalBoard } from '@/stores/tactical-board';
import { PenTool, Minus, MoreHorizontal, Zap } from 'lucide-react';

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
    icon: Minus,
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

export function StrategyDrawingPanel() {
  const { selectedTool } = useTacticalBoard();
  const [selectedStyle, setSelectedStyle] = React.useState<string>('solid');

  if (selectedTool !== 'strategy') return null;

  const currentStyle = strategyStyles.find(s => s.id === selectedStyle) || strategyStyles[0];

  return (
    <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg z-10">
      <div className="flex items-center gap-2 mb-3">
        <PenTool className="h-4 w-4" />
        <span className="text-sm font-medium">Estilos de Estratégia</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        {strategyStyles.map((style) => {
          const Icon = style.icon;
          return (
            <Button
              key={style.id}
              variant={selectedStyle === style.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStyle(style.id)}
              className="flex items-center gap-2 text-xs h-8"
            >
              <Icon className="h-3 w-3" />
              <span className="truncate">{style.name}</span>
            </Button>
          );
        })}
      </div>
      
      <Separator className="my-2" />
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Estilo atual:</span>
        <Badge 
          variant="secondary" 
          className="text-xs"
          style={{ backgroundColor: `${currentStyle.color}20`, color: currentStyle.color }}
        >
          {currentStyle.name}
        </Badge>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        <div>Espessura: {currentStyle.strokeWidth}px</div>
        {currentStyle.dashPattern && (
          <div>Padrão: Tracejado</div>
        )}
      </div>
    </div>
  );
}
