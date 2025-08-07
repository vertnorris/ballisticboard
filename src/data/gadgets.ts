export interface GadgetItem {
  id: string;
  name: string;
  type: 'grenade' | 'utility' | 'healing' | 'tactical';
  image: string;
  description: string;
  duration?: number; // duração padrão em segundos
  customizable: boolean; // se permite tempo customizável
}

export const gadgets: GadgetItem[] = [
  {
    id: 'bubble-shield',
    name: 'Bubble Shield',
    type: 'utility',
    image: '/itens/Bubble_Shield_29_-_Item_-_Ballistic.webp',
    description: 'Escudo protetor temporário',
    duration: 15,
    customizable: true
  },
  {
    id: 'fire-grenade',
    name: 'Fire Grenade',
    type: 'grenade',
    image: '/itens/Fire_Grenade_-_Item_-_Ballistic.webp',
    description: 'Granada incendiária que causa dano por área',
    duration: 8,
    customizable: true
  },
  {
    id: 'flashbang',
    name: 'Flashbang',
    type: 'tactical',
    image: '/itens/Flashbang_-_Item_-_Ballistic.webp',
    description: 'Granada que cega e ensurdece inimigos',
    duration: 3,
    customizable: false
  },
  {
    id: 'frag-grenade',
    name: 'Frag Grenade',
    type: 'grenade',
    image: '/itens/Frag_Grenade_-_Item_-_Ballistic.webp',
    description: 'Granada explosiva com dano em área',
    duration: 0,
    customizable: false
  },
  {
    id: 'impulse-grenade',
    name: 'Impulse Grenade',
    type: 'utility',
    image: '/itens/Impulse_Grenade_29_-_Item_-_Ballistic.webp',
    description: 'Granada que empurra jogadores e objetos',
    duration: 0,
    customizable: false
  },
  {
    id: 'med-mist-smoke',
    name: 'Med-Mist Smoke Grenade',
    type: 'healing',
    image: '/itens/Med-Mist_Smoke_Grenade_-_Item_-_Ballistic.webp',
    description: 'Fumaça que cura aliados na área',
    duration: 12,
    customizable: true
  },
  {
    id: 'overdrive',
    name: 'Overdrive',
    type: 'utility',
    image: '/itens/Overdrive_-_Item_-_Ballistic.webp',
    description: 'Aumenta velocidade de movimento e recarga',
    duration: 10,
    customizable: true
  },
  {
    id: 'proximity-mine',
    name: 'Proximity Mine',
    type: 'tactical',
    image: '/itens/Proximity_Mine_-_Item_-_Ballistic.webp',
    description: 'Mina que explode quando inimigos se aproximam',
    duration: 60,
    customizable: true
  },
  {
    id: 'recon-grenade',
    name: 'Recon Grenade',
    type: 'tactical',
    image: '/itens/Recon_Grenade_-_Item_-_Ballistic.webp',
    description: 'Revela inimigos em uma área',
    duration: 8,
    customizable: true
  },
  {
    id: 'smoke-grenade',
    name: 'Smoke Grenade',
    type: 'utility',
    image: '/itens/Smoke_Grenade_-_Item_-_Ballistic.webp',
    description: 'Cria uma cortina de fumaça para cobertura',
    duration: 15,
    customizable: true
  }
];

export const getGadgetById = (id: string): GadgetItem | undefined => {
  return gadgets.find(gadget => gadget.id === id);
};

export const getGadgetsByType = (type: GadgetItem['type']): GadgetItem[] => {
  return gadgets.filter(gadget => gadget.type === type);
};