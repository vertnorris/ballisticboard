import { Weapon, Gadget } from '@/types';

export const weapons: Weapon[] = [
  // Rifles
  {
    id: 'burst-assault-rifle',
    name: 'Burst Assault Rifle',
    type: 'rifle',
    cost: 2900,
    icon: 'rifle'
  },
  {
    id: 'auto-assault-rifle',
    name: 'Auto Assault Rifle',
    type: 'rifle',
    cost: 2700,
    icon: 'rifle'
  },
  
  // Snipers
  {
    id: 'sovereign-sniper',
    name: 'Sovereign Sniper',
    type: 'sniper',
    cost: 4700,
    icon: 'crosshair'
  },
  {
    id: 'hunting-rifle',
    name: 'Hunting Rifle',
    type: 'sniper',
    cost: 3500,
    icon: 'crosshair'
  },
  
  // SMGs
  {
    id: 'combat-smg',
    name: 'Combat SMG',
    type: 'smg',
    cost: 1500,
    icon: 'zap'
  },
  {
    id: 'rapid-fire-smg',
    name: 'Rapid Fire SMG',
    type: 'smg',
    cost: 1200,
    icon: 'zap'
  },
  
  // Shotguns
  {
    id: 'auto-shotgun',
    name: 'Auto Shotgun',
    type: 'shotgun',
    cost: 1800,
    icon: 'target'
  },
  {
    id: 'tactical-shotgun',
    name: 'Tactical Shotgun',
    type: 'shotgun',
    cost: 1600,
    icon: 'target'
  },
  
  // Pistols
  {
    id: 'hand-cannon',
    name: 'Hand Cannon',
    type: 'pistol',
    cost: 800,
    icon: 'gun'
  },
  {
    id: 'pistol',
    name: 'Pistol',
    type: 'pistol',
    cost: 500,
    icon: 'gun'
  }
];

export const gadgets: Gadget[] = [
  // Grenades
  {
    id: 'fire-grenade',
    name: 'Fire Grenade',
    type: 'grenade',
    cost: 600,
    icon: 'flame'
  },
  {
    id: 'frag-grenade',
    name: 'Frag Grenade',
    type: 'grenade',
    cost: 400,
    icon: 'bomb'
  },
  {
    id: 'smoke-grenade',
    name: 'Smoke Grenade',
    type: 'utility',
    cost: 300,
    icon: 'cloud'
  },
  
  // Utility
  {
    id: 'overdrive',
    name: 'Overdrive',
    type: 'utility',
    cost: 800,
    icon: 'zap'
  },
  {
    id: 'impulse-grenade',
    name: 'Impulse Grenade',
    type: 'utility',
    cost: 500,
    icon: 'move'
  },
  {
    id: 'shield-bubble',
    name: 'Shield Bubble',
    type: 'utility',
    cost: 700,
    icon: 'shield'
  },
  
  // Healing
  {
    id: 'med-kit',
    name: 'Med Kit',
    type: 'healing',
    cost: 400,
    icon: 'heart'
  },
  {
    id: 'bandages',
    name: 'Bandages',
    type: 'healing',
    cost: 200,
    icon: 'bandage'
  }
];