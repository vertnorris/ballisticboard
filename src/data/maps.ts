import { Map } from '@/types';

export const maps: Map[] = [
  {
    id: 'hammer-fall',
    name: 'Hammer Fall',
    image: '/maps/Hammer_Fall_29_-_Map_-_Ballistic.webp',
    callouts: [
      { id: 'a-site', name: 'A Site', position: { x: 200, y: 150 } },
      { id: 'b-site', name: 'B Site', position: { x: 600, y: 400 } },
      { id: 'attack-respawn', name: 'Attackers Spawn', position: { x: 125, y: 500 } },
      { id: 'def-respawn', name: 'Defenders Spawn', position: { x: 775, y: 50 } }
    ],
    spikeSites: [
      { x: 200, y: 150 }, // A Site
      { x: 600, y: 400 }  // B Site
    ],
    spawns: {
      attacker: [
        { x: 50, y: 500 },
        { x: 100, y: 500 },
        { x: 150, y: 500 },
        { x: 200, y: 500 },
        { x: 250, y: 500 }
      ],
      defender: [
        { x: 700, y: 50 },
        { x: 750, y: 50 },
        { x: 800, y: 50 },
        { x: 850, y: 50 },
        { x: 900, y: 50 }
      ]
    }
  },
  {
    id: 'skyline-10',
    name: 'Skyline 10',
    image: '/maps/Skyline_10_-_Map_-_Ballistic.webp',
    callouts: [
      { id: 'a-site', name: 'A Site', position: { x: 180, y: 120 } },
      { id: 'b-site', name: 'B Site', position: { x: 620, y: 380 } },
      { id: 'attack-respawn', name: 'Attackers Spawn', position: { x: 130, y: 480 } },
      { id: 'def-respawn', name: 'Defenders Spawn', position: { x: 820, y: 30 } }
    ],
    spikeSites: [
      { x: 180, y: 120 },
      { x: 620, y: 380 }
    ],
    spawns: {
      attacker: [
        { x: 30, y: 480 },
        { x: 80, y: 480 },
        { x: 130, y: 480 },
        { x: 180, y: 480 },
        { x: 230, y: 480 }
      ],
      defender: [
        { x: 720, y: 30 },
        { x: 770, y: 30 },
        { x: 820, y: 30 },
        { x: 870, y: 30 },
        { x: 920, y: 30 }
      ]
    }
  },
  {
    id: 'storm-chaser-cove',
    name: 'Storm Chaser Cove',
    image: '/maps/Storm_Chaser_Cove_29_-_Map_-_Ballistic.webp',
    callouts: [
      { id: 'a-site', name: 'A Site', position: { x: 220, y: 140 } },
      { id: 'b-site', name: 'B Site', position: { x: 580, y: 420 } },
      { id: 'attack-respawn', name: 'Attackers Spawn', position: { x: 140, y: 460 } },
      { id: 'def-respawn', name: 'Defenders Spawn', position: { x: 840, y: 40 } }
    ],
    spikeSites: [
      { x: 220, y: 140 },
      { x: 580, y: 420 }
    ],
    spawns: {
      attacker: [
        { x: 40, y: 460 },
        { x: 90, y: 460 },
        { x: 140, y: 460 },
        { x: 190, y: 460 },
        { x: 240, y: 460 }
      ],
      defender: [
        { x: 740, y: 40 },
        { x: 790, y: 40 },
        { x: 840, y: 40 },
        { x: 890, y: 40 },
        { x: 940, y: 40 }
      ]
    }
  },
  {
    id: 'k-zone-commons',
    name: 'K-Zone Commons',
    image: '/maps/K-Zone_Commons_-_Map_-_Ballistic.webp',
    callouts: [
      { id: 'a-site', name: 'A Site', position: { x: 190, y: 130 } },
      { id: 'b-site', name: 'B Site', position: { x: 610, y: 390 } },
      { id: 'attack-respawn', name: 'Attackers Spawn', position: { x: 160, y: 490 } },
      { id: 'def-respawn', name: 'Defenders Spawn', position: { x: 810, y: 60 } }
    ],
    spikeSites: [
      { x: 190, y: 130 },
      { x: 610, y: 390 }
    ],
    spawns: {
      attacker: [
        { x: 60, y: 490 },
        { x: 110, y: 490 },
        { x: 160, y: 490 },
        { x: 210, y: 490 },
        { x: 260, y: 490 }
      ],
      defender: [
        { x: 710, y: 60 },
        { x: 760, y: 60 },
        { x: 810, y: 60 },
        { x: 860, y: 60 },
        { x: 910, y: 60 }
      ]
    }
  },
  {
    id: 'cinderwatch',
    name: 'Cinderwatch',
    image: '/maps/Cinderwatch_-_Map_-_Ballistic.webp',
    callouts: [
      { id: 'a-site', name: 'A Site', position: { x: 210, y: 160 } },
      { id: 'b-site', name: 'B Site', position: { x: 590, y: 410 } },
      { id: 'attack-respawn', name: 'Attackers Spawn', position: { x: 170, y: 470 } },
      { id: 'def-respawn', name: 'Defenders Spawn', position: { x: 830, y: 70 } }
    ],
    spikeSites: [
      { x: 210, y: 160 },
      { x: 590, y: 410 }
    ],
    spawns: {
      attacker: [
        { x: 70, y: 470 },
        { x: 120, y: 470 },
        { x: 170, y: 470 },
        { x: 220, y: 470 },
        { x: 270, y: 470 }
      ],
      defender: [
        { x: 730, y: 70 },
        { x: 780, y: 70 },
        { x: 830, y: 70 },
        { x: 880, y: 70 },
        { x: 930, y: 70 }
      ]
    }
  }
];