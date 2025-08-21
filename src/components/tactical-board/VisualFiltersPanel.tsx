"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw, Palette } from 'lucide-react';

interface VisualFiltersPanelProps {
  filters: {
    blur: number;
    brightness: number;
    contrast: number;
    saturation: number;
    hueRotate: number;
  };
  onFilterChange: (filterName: string, value: number) => void;
  onReset: () => void;
}

export const VisualFiltersPanel: React.FC<VisualFiltersPanelProps> = ({
  filters,
  onFilterChange,
  onReset
}) => {
  return (
    <Card className="w-80 bg-background/95 backdrop-blur-xl border shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Palette className="h-3 w-3 text-primary-foreground" />
            </div>
            <CardTitle className="text-sm font-semibold">Filtros Visuais</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-6 w-6 p-0"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Blur Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Desfoque</Label>
            <span className="text-xs text-muted-foreground">{filters.blur}px</span>
          </div>
          <Slider
            value={[filters.blur]}
            onValueChange={([value]) => onFilterChange('blur', value)}
            max={10}
            min={0}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Brightness Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Brilho</Label>
            <span className="text-xs text-muted-foreground">{filters.brightness}%</span>
          </div>
          <Slider
            value={[filters.brightness]}
            onValueChange={([value]) => onFilterChange('brightness', value)}
            max={200}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        {/* Contrast Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Contraste</Label>
            <span className="text-xs text-muted-foreground">{filters.contrast}%</span>
          </div>
          <Slider
            value={[filters.contrast]}
            onValueChange={([value]) => onFilterChange('contrast', value)}
            max={200}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        {/* Saturation Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Saturação</Label>
            <span className="text-xs text-muted-foreground">{filters.saturation}%</span>
          </div>
          <Slider
            value={[filters.saturation]}
            onValueChange={([value]) => onFilterChange('saturation', value)}
            max={200}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        {/* Hue Rotate Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Matiz</Label>
            <span className="text-xs text-muted-foreground">{filters.hueRotate}°</span>
          </div>
          <Slider
            value={[filters.hueRotate]}
            onValueChange={([value]) => onFilterChange('hueRotate', value)}
            max={360}
            min={0}
            step={5}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};