# 🎯 Prompt para Desenvolvimento - Fortnite Ballistic Tactical Board

## 📋 Visão Geral do Projeto

Desenvolva uma aplicação web interativa de quadro tático para **Fortnite Ballistic**, similar ao csgoboard.com, mas adaptada especificamente para o novo modo 5v5 FPS do Fortnite. A aplicação deve permitir que jogadores e equipes criem, editem e compartilhem estratégias táticas de forma visual e intuitiva.

## 🎮 Contexto do Fortnite Ballistic

**Fortnite Ballistic** é um modo tático 5v5 em primeira pessoa, similar ao Counter-Strike, com as seguintes características:
- **Formato:** 5v5, melhor de 24 rounds (primeiro a 13 vence)
- **Objetivo:** Plantar/desarmar spike ou eliminar time adversário
- **Sistema de Créditos:** Compra de armas e gadgets entre rounds
- **Mapas Disponíveis:** Hammer Fall, Skyline 10, Storm Chaser Cove, K-Zone Commons, Cinderwatch

## 🛠️ Especificações Técnicas

### Stack Obrigatória
- **Frontend:** React/Next.js 14+ com TypeScript
- **Styling:** Tailwind CSS
- **Canvas/Drawing:** Konva.js ou Fabric.js
- **State Management:** Zustand
- **Icons:** Lucide React
- **Storage:** LocalStorage + IndexedDB para estratégias

### Estrutura de Pastas
```
/src
  /components
    /ui (botões, inputs, modals)
    /tactical-board (canvas, toolbar, elementos)
    /maps (componentes dos mapas)
  /hooks (custom hooks para drawing, storage)
  /stores (Zustand stores)
  /types (TypeScript interfaces)
  /utils (helpers, constants)
  /data (mapas, armas, callouts)
```

## 🎨 Features Core a Implementar

### 1. **Seletor de Mapas**
```typescript
interface Map {
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
```

**Mapas:** Hammer Fall, Skyline 10, Storm Chaser Cove, K-Zone Commons, Cinderwatch

### 2. **Sistema de Desenho Interativo**

#### Elementos Desenháveis:
- **Jogadores:** Ícones arrastáveis com cores de time (azul/vermelho)
- **Movimentos:** Linhas e setas direcionais
- **Callouts:** Texto posicionável
- **Áreas:** Círculos/retângulos para marcar zonas
- **Gadgets:** Ícones de granadas, utility, etc.

#### Toolbar Lateral:
```typescript
interface Tool {
  id: string;
  name: string;
  icon: string;
  cursor: string;
  config?: ToolConfig;
}

// Ferramentas: Select, Player, Movement, Text, Area, Gadget, Erase
```

### 3. **Sistema de Jogadores**
```typescript
interface Player {
  id: string;
  team: 'attacker' | 'defender';
  position: Position;
  role?: 'entry' | 'support' | 'igl' | 'lurker' | 'anchor';
  weapon?: Weapon;
  gadgets?: Gadget[];
}
```

### 4. **Armas e Gadgets do Ballistic**
```typescript
interface Weapon {
  id: string;
  name: string;
  type: 'rifle' | 'sniper' | 'shotgun' | 'smg' | 'pistol';
  cost: number;
  icon: string;
}

interface Gadget {
  id: string;
  name: string;
  type: 'grenade' | 'utility' | 'healing';
  cost: number;
  icon: string;
}
```

**Armas principais:** Burst Assault Rifle, Sovereign Sniper, Shotguns, SMGs
**Gadgets:** Fire Grenade, Overdrive, Utility grenades

### 5. **Sistema de Salvamento**
```typescript
interface Strategy {
  id: string;
  name: string;
  map: string;
  side: 'attacker' | 'defender';
  elements: DrawableElement[];
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}
```

## 🎯 Interface do Usuário

### Layout Principal
```
┌─────────────────────────────────────────┐
│ Header (Logo, Map Selector, Save/Load)  │
├─────────────────────────────────────────┤
│ ┌─────┐                               │ │
│ │     │                               │ │
│ │ T   │        MAPA PRINCIPAL         │ │
│ │ O   │        (Canvas Interativo)    │ │
│ │ O   │                               │ │
│ │ L   │                               │ │
│ │ S   │                               │ │
│ └─────┘                               │ │
├─────────────────────────────────────────┤
│ Bottom Panel (Timeline, Notes)          │
└─────────────────────────────────────────┘
```

### Cores e Tema
- **Primary:** Azul Fortnite (#0078F2)
- **Secondary:** Roxo Fortnite (#8B5CF6)
- **Success:** Verde (#10B981)
- **Warning:** Laranja (#F59E0B)
- **Teams:** Azul (#3B82F6) vs Vermelho (#EF4444)

## 📱 Funcionalidades Essenciais

### 1. **Canvas Interativo**
- Zoom in/out (mouse wheel + botões)
- Pan (arrastar com botão direito)
- Grid opcional para alinhamento
- Snap to grid
- Múltiplas layers (fundo, elementos, UI)

### 2. **Drag & Drop**
- Jogadores arrastáveis
- Redimensionamento de áreas
- Rotação de elementos
- Copy/paste de elementos

### 3. **Undo/Redo**
- Histórico de ações
- Ctrl+Z / Ctrl+Y
- Máximo 50 ações no histórico

### 4. **Export/Import**
- Salvar como PNG/JPG
- Salvar como PDF
- Copiar para clipboard
- Importar estratégias JSON

### 5. **Mobile Responsivo**
- Touch gestures (pinch to zoom, tap, drag)
- Layout adaptativo
- Toolbar colapsável

## 🚀 Funcionalidades Avançadas (Opcional)

### 1. **Sistema de Templates**
- Templates pré-definidos por mapa
- Setups padrão (anti-eco, force-buy, etc.)
- Community templates

### 2. **Simulação de Timing**
- Timeline de execução
- Marcadores temporais
- Sincronização de movimentos

### 3. **Calculadora de Créditos**
- Controle de economia do time
- Sugestões de buy/save
- Histórico de rounds

### 4. **Sharing & Collaboration**
- Links compartilháveis
- QR codes para mobile
- Export para Discord/social media

## 📦 Estrutura de Componentes

### Core Components
```typescript
// TacticalBoard.tsx - Componente principal
// MapCanvas.tsx - Canvas com Konva
// Toolbar.tsx - Ferramentas laterais
// PlayerElement.tsx - Jogador no mapa
// MovementLine.tsx - Linha de movimento
// GadgetIcon.tsx - Ícone de gadget
// CalloutText.tsx - Texto no mapa
```

### UI Components
```typescript
// MapSelector.tsx - Dropdown de mapas
// SaveDialog.tsx - Modal para salvar
// ExportOptions.tsx - Opções de export
// StrategyList.tsx - Lista de estratégias salvas
```

## 🔧 Implementação por Fases

### Fase 1 - MVP (2-3 semanas)
- [x] Setup do projeto Next.js + Tailwind
- [ ] Componente básico de canvas
- [ ] Seletor de mapas (1-2 mapas)
- [ ] Posicionamento básico de jogadores
- [ ] Linhas de movimento simples
- [ ] Save/Load local

### Fase 2 - Core Features (2-3 semanas)
- [ ] Todos os 5 mapas
- [ ] Sistema completo de gadgets
- [ ] Undo/Redo
- [ ] Export para imagem
- [ ] Mobile responsive

### Fase 3 - Advanced (2-4 semanas)
- [ ] Timeline de execução
- [ ] Templates e presets
- [ ] Calculadora de créditos
- [ ] Sharing system

## 🎯 Critérios de Sucesso

1. **Performance:** Canvas roda smooth a 60fps
2. **Usabilidade:** Interface intuitiva, sem tutorial necessário
3. **Compatibilidade:** Funciona em Chrome, Firefox, Safari, Mobile
4. **Precisão:** Mapas proporcionalmente corretos
5. **Funcionalidade:** Todas as features core implementadas

## 📝 Notas Importantes

- **Assets:** Use ícones do Lucide React, evite assets do jogo por copyright
- **Responsividade:** Priorize mobile-first design
- **Performance:** Otimize rendering do canvas para muitos elementos
- **Acessibilidade:** Suporte a keyboard navigation e screen readers
- **Browser Support:** Chrome 90+, Firefox 90+, Safari 14+

---

**Objetivo Final:** Criar a ferramenta definitiva para planejamento tático no Fortnite Ballistic, superando ferramentas existentes em usabilidade e features específicas do jogo.