import React from 'react';
import { useTacticalBoard } from '@/stores/tactical-board';
import { gadgets } from '@/data/gadgets';
import { Badge } from '@/components/ui/badge';

export const GadgetCounter: React.FC = () => {
  const { selectedGadget, getGadgetCount, getGadgetLimit, canAddGadget } = useTacticalBoard();

  if (!selectedGadget) return null;

  const gadget = gadgets.find(g => g.id === selectedGadget);
  if (!gadget) return null;

  const currentCount = getGadgetCount(selectedGadget);
  const maxCount = getGadgetLimit(selectedGadget);
  const isAtLimit = !canAddGadget(selectedGadget);

  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-card/50 rounded-lg border border-border/30">
      <span className="text-sm font-medium text-muted-foreground">
        {gadget.name}:
      </span>
      <Badge 
        variant={isAtLimit ? "destructive" : "secondary"}
        className="text-xs"
      >
        {currentCount}/{maxCount}
      </Badge>
      {isAtLimit && (
        <span className="text-xs text-destructive font-medium">
          Limite atingido
        </span>
      )}
    </div>
  );
};