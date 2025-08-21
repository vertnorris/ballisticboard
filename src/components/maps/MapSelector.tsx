"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTacticalBoard } from '@/stores/tactical-board';
import { maps } from '@/data/maps';
import Image from 'next/image';

export const MapSelector: React.FC = () => {
  const { selectedMap, setSelectedMap } = useTacticalBoard();

  const handleMapChange = (mapId: string) => {
    const map = maps.find(m => m.id === mapId);
    if (map) {
      setSelectedMap(map);
    }
  };

  return (
    <Select
      value={selectedMap?.id || ''}
      onValueChange={handleMapChange}
    >
      <SelectTrigger className="w-[200px] h-9 bg-background/80 border rounded-lg shadow-sm hover:bg-background transition-colors">
        <SelectValue placeholder="Selecione um mapa" className="text-foreground">
          {selectedMap && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-5 rounded-md overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={selectedMap.thumbnail}
                  alt={selectedMap.name}
                  width={32}
                  height={20}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium truncate">{selectedMap.name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
        <SelectContent className="bg-background/95 backdrop-blur-xl border rounded-xl shadow-xl min-w-[280px]">
          {maps.map((map) => (
            <SelectItem 
              key={map.id} 
              value={map.id}
              className="hover:bg-accent rounded-lg m-1 cursor-pointer p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={map.thumbnail}
                    alt={map.name}
                    width={64}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">{map.name}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
    </Select>
  );
};