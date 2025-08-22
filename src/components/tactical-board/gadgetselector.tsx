import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { gadgets } from '@/data/gadgets';
import { useTacticalBoard } from '@/stores/tactical-board';
import { Zap } from 'lucide-react';

export function GadgetSelector() {
  const {
    selectedGadget,
    setSelectedGadget,
    getGadgetCount,
    getGadgetLimit,
    canAddGadget
  } = useTacticalBoard();

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-sm font-medium">Gadgets</h3>
      <div className="grid grid-cols-1 gap-2">
        {gadgets.map((gadget) => {
          const currentCount = getGadgetCount(gadget.id);
          const maxCount = getGadgetLimit(gadget.id);
          const isAtLimit = !canAddGadget(gadget.id);
          const isSelected = selectedGadget === gadget.id;

          return (
            <div key={gadget.id} className="flex items-center gap-2">
              <Button
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedGadget(gadget.id)}
                disabled={isAtLimit && !isSelected}
                className={`flex-1 flex items-center gap-2 text-xs ${
                  isAtLimit && !isSelected ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="truncate">{gadget.name}</span>
              </Button>
              <Badge
                variant={isAtLimit ? "destructive" : currentCount > 0 ? "secondary" : "outline"}
                className="text-xs min-w-[40px] justify-center"
              >
                {currentCount}/{maxCount}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}