export interface Position {
  x: number;
  y: number;
}

export interface Callout {
  id: string;
  name: string;
  position: Position;
  description?: string;
}

export interface Map {
  id: string;
  name: string;
  image: string;
  callouts: Callout[];
  spikeSites: Position[];
  spawns: {
    attacker: Position[];
    defender: Position[];
  };
}

export interface Weapon {
  id: string;
  name: string;
  type: 'rifle' | 'sniper' | 'shotgun' | 'smg' | 'pistol';
  cost: number;
  icon: string;
}

export interface Gadget {
  id: string;
  name: string;
  type: 'grenade' | 'utility' | 'healing';
  cost: number;
  icon: string;
}

export interface GadgetElement {
  id: string;
  gadgetId: string;
  position: Position;
  duration?: number;
  customDuration?: number;
  startTime?: number;
  active: boolean;
}

export interface Player {
  id: string;
  team: 'attacker' | 'defender';
  position: Position;
  role?: 'entry' | 'support' | 'igl' | 'lurker' | 'anchor';
  weapon?: Weapon;
  gadgets?: Gadget[];
}

export interface DrawableElement {
  id: string;
  type: 'player' | 'movement' | 'text' | 'area' | 'gadget';
  position: Position;
  data: any;
  zIndex: number;
  team?: TeamType;
}

export interface TimedElement {
  id: string;
  type: 'gadget';
  position: Position;
  gadgetId: string;
  duration: number;
  startTime: number;
  active: boolean;
}

export interface Strategy {
  id: string;
  name: string;
  map: string;
  side: 'attacker' | 'defender';
  elements: DrawableElement[];
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  cursor: string;
  config?: ToolConfig;
}

export interface ToolConfig {
  color?: string;
  size?: number;
  strokeWidth?: number;
  [key: string]: any;
}

export type TeamType = 'attacker' | 'defender';
export type ToolType = 'select' | 'player' | 'movement' | 'text' | 'area' | 'gadget' | 'erase';