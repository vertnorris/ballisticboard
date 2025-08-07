import { create } from 'zustand';
import { Map, DrawableElement, Strategy, Tool, ToolType, TeamType, TimedElement } from '@/types';
import { maps } from '@/data/maps';
import { gadgets } from '@/data/gadgets';

// Interface para dados persistidos
interface PersistedCalloutData {
  [mapId: string]: {
    [calloutId: string]: { x: number; y: number };
  };
}

interface TacticalBoardState {
  // Map state
  selectedMap: Map | null;
  
  // Canvas state
  canvasSize: { width: number; height: number };
  zoom: number;
  pan: { x: number; y: number };
  showCallouts: boolean;
  hiddenCallouts: string[]; // IDs dos callouts ocultos
  editingCallout: string | null; // ID do callout sendo editado
  calloutManagementMode: boolean; // Modo de gerenciamento de callouts ativo
  
  // Persistência de callouts customizados
  customCalloutPositions: PersistedCalloutData;
  
  // Tools state
  selectedTool: ToolType;
  selectedTeam: TeamType;
  selectedGadget: string | null;
  
  // Elements state
  elements: DrawableElement[];
  selectedElements: string[];
  timedElements: TimedElement[];
  
  // History state
  history: DrawableElement[][];
  historyIndex: number;
  
  // Strategy state
  currentStrategy: Strategy | null;
  savedStrategies: Strategy[];
  
  // Actions
  setSelectedMap: (map: Map) => void;
  getMapWithCustomCallouts: (mapId: string) => Map | null;
  setCanvasSize: (size: { width: number; height: number }) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  toggleCallouts: () => void;
  toggleCalloutVisibility: (calloutId: string) => void;
  updateCalloutPosition: (calloutId: string, position: { x: number; y: number }) => void;
  setEditingCallout: (calloutId: string | null) => void;
  toggleCalloutManagementMode: () => void;
  setSelectedTool: (tool: ToolType) => void;
  setSelectedTeam: (team: TeamType) => void;
  setSelectedGadget: (gadgetId: string | null) => void;
  
  addElement: (element: DrawableElement) => void;
  updateElement: (id: string, updates: Partial<DrawableElement>) => void;
  removeElement: (id: string) => void;
  removeElements: (ids: string[]) => void;
  
  addTimedElement: (element: TimedElement) => void;
  updateTimedElement: (id: string, updates: Partial<TimedElement>) => void;
  removeTimedElement: (id: string) => void;
  activateTimedElement: (id: string, customDuration?: number) => void;
  deactivateTimedElement: (id: string) => void;
  
  selectElement: (id: string) => void;
  selectElements: (ids: string[]) => void;
  clearSelection: () => void;
  
  undo: () => void;
  redo: () => void;
  
  saveStrategy: (name: string, tags?: string[]) => void;
  loadStrategy: (strategy: Strategy) => void;
  deleteStrategy: (id: string) => void;
  
  reset: () => void;
  
  // Persistência manual
  loadCustomCalloutPositions: () => void;
  saveCustomCalloutPositions: () => void;
}

// Funções de persistência
const loadCalloutPositionsFromStorage = (): PersistedCalloutData => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem('ballistic-board-callouts');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveCalloutPositionsToStorage = (positions: PersistedCalloutData) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ballistic-board-callouts', JSON.stringify(positions));
  } catch (error) {
    console.error('Failed to save callout positions:', error);
  }
};

const initialState = {
  selectedMap: maps[0],
  canvasSize: { width: 1000, height: 600 },
  zoom: 1,
  pan: { x: 0, y: 0 },
  showCallouts: true,
  hiddenCallouts: [],
  editingCallout: null,
  calloutManagementMode: false,
  customCalloutPositions: loadCalloutPositionsFromStorage(),
  selectedTool: 'select' as ToolType,
  selectedTeam: 'attacker' as TeamType,
  selectedGadget: null,
  elements: [],
  selectedElements: [],
  timedElements: [],
  history: [[]],
  historyIndex: 0,
  currentStrategy: null,
  savedStrategies: [],
};

export const useTacticalBoard = create<TacticalBoardState>((set, get) => ({
  ...initialState,
  
  setSelectedMap: (map) => {
    const state = get();
    const mapWithCustomCallouts = state.getMapWithCustomCallouts(map.id);
    set({ selectedMap: mapWithCustomCallouts || map });
  },
  
  getMapWithCustomCallouts: (mapId) => {
    const state = get();
    const baseMap = maps.find(m => m.id === mapId);
    if (!baseMap) return null;
    
    const customPositions = state.customCalloutPositions[mapId];
    if (!customPositions) return baseMap;
    
    return {
      ...baseMap,
      callouts: baseMap.callouts.map(callout => ({
        ...callout,
        position: customPositions[callout.id] || callout.position
      }))
    };
  },
  
  setCanvasSize: (size) => set({ canvasSize: size }),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(3, zoom)) }),
  setPan: (pan) => set({ pan }),
  toggleCallouts: () => set((state) => ({ showCallouts: !state.showCallouts })),
  
  toggleCalloutVisibility: (calloutId) => set((state) => ({
    hiddenCallouts: state.hiddenCallouts.includes(calloutId)
      ? state.hiddenCallouts.filter(id => id !== calloutId)
      : [...state.hiddenCallouts, calloutId]
  })),
  
  updateCalloutPosition: (calloutId, position) => set((state) => {
    if (!state.selectedMap) return state;
    
    const mapId = state.selectedMap.id;
    
    // Atualizar posições customizadas
    const updatedCustomPositions = {
      ...state.customCalloutPositions,
      [mapId]: {
        ...state.customCalloutPositions[mapId],
        [calloutId]: position
      }
    };
    
    // Salvar no localStorage
    saveCalloutPositionsToStorage(updatedCustomPositions);
    
    // Atualizar o mapa atual
    const updatedMap = {
      ...state.selectedMap,
      callouts: state.selectedMap.callouts.map(callout =>
        callout.id === calloutId ? { ...callout, position } : callout
      )
    };
    
    return { 
      selectedMap: updatedMap,
      customCalloutPositions: updatedCustomPositions
    };
  }),
  
  setEditingCallout: (calloutId) => set({ editingCallout: calloutId }),
  toggleCalloutManagementMode: () => set((state) => ({ calloutManagementMode: !state.calloutManagementMode })),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setSelectedTeam: (team) => set({ selectedTeam: team }),
  setSelectedGadget: (gadgetId) => set({ selectedGadget: gadgetId }),
  
  addElement: (element) => {
    const { elements, history, historyIndex } = get();
    const newElements = [...elements, element];
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    
    set({
      elements: newElements,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },
  
  updateElement: (id, updates) => {
    const { elements, history, historyIndex } = get();
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    
    set({
      elements: newElements,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },
  
  removeElement: (id) => {
    const { elements, history, historyIndex, selectedElements } = get();
    const newElements = elements.filter(el => el.id !== id);
    const newSelectedElements = selectedElements.filter(elId => elId !== id);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    
    set({
      elements: newElements,
      selectedElements: newSelectedElements,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },
  
  removeElements: (ids) => {
    const { elements, history, historyIndex, selectedElements } = get();
    const newElements = elements.filter(el => !ids.includes(el.id));
    const newSelectedElements = selectedElements.filter(elId => !ids.includes(elId));
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    
    set({
      elements: newElements,
      selectedElements: newSelectedElements,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },
  
  selectElement: (id) => set({ selectedElements: [id] }),
  selectElements: (ids) => set({ selectedElements: ids }),
  clearSelection: () => set({ selectedElements: [] }),
  
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        elements: history[newIndex],
        historyIndex: newIndex,
        selectedElements: [],
      });
    }
  },
  
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        elements: history[newIndex],
        historyIndex: newIndex,
        selectedElements: [],
      });
    }
  },
  
  saveStrategy: (name, tags = []) => {
    const { selectedMap, elements, savedStrategies, selectedTeam } = get();
    if (!selectedMap) return;
    
    const strategy: Strategy = {
      id: Date.now().toString(),
      name,
      map: selectedMap.id,
      side: selectedTeam,
      elements: [...elements],
      createdAt: new Date(),
      updatedAt: new Date(),
      tags,
    };
    
    const newStrategies = [...savedStrategies, strategy];
    set({ 
      savedStrategies: newStrategies,
      currentStrategy: strategy 
    });
    
    // Save to localStorage
    localStorage.setItem('ballistic-strategies', JSON.stringify(newStrategies));
  },
  
  loadStrategy: (strategy) => {
    const map = maps.find(m => m.id === strategy.map);
    if (!map) return;
    
    set({
      selectedMap: map,
      elements: [...strategy.elements],
      selectedTeam: strategy.side,
      currentStrategy: strategy,
      selectedElements: [],
      history: [strategy.elements],
      historyIndex: 0,
    });
  },
  
  deleteStrategy: (id) => {
    const { savedStrategies } = get();
    const newStrategies = savedStrategies.filter(s => s.id !== id);
    set({ savedStrategies: newStrategies });
    localStorage.setItem('ballistic-strategies', JSON.stringify(newStrategies));
  },
  
  addTimedElement: (element) => {
    const { timedElements } = get();
    const newTimedElements = [...timedElements, element];
    set({ timedElements: newTimedElements });
  },
  
  updateTimedElement: (id, updates) => {
    const { timedElements } = get();
    const newTimedElements = timedElements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    set({ timedElements: newTimedElements });
  },
  
  removeTimedElement: (id) => {
    const { timedElements } = get();
    const newTimedElements = timedElements.filter(el => el.id !== id);
    set({ timedElements: newTimedElements });
  },
  
  activateTimedElement: (id, customDuration) => {
    const { timedElements } = get();
    const element = timedElements.find(el => el.id === id);
    if (!element) return;
    
    const gadget = gadgets.find(g => g.id === element.gadgetId);
    if (!gadget) return;
    
    const duration = customDuration || gadget.duration || 0;
    const startTime = Date.now();
    
    const newTimedElements = timedElements.map(el => 
      el.id === id ? { ...el, active: true, startTime, duration } : el
    );
    set({ timedElements: newTimedElements });
  },
  
  deactivateTimedElement: (id) => {
    const { timedElements } = get();
    const newTimedElements = timedElements.map(el => 
      el.id === id ? { ...el, active: false, startTime: 0 } : el
    );
    set({ timedElements: newTimedElements });
  },

  reset: () => {
    set({
      elements: [],
      selectedElements: [],
      timedElements: [],
      history: [[]],
      historyIndex: 0,
      currentStrategy: null,
    });
  },
  
  loadCustomCalloutPositions: () => {
    const positions = loadCalloutPositionsFromStorage();
    set({ customCalloutPositions: positions });
  },
  
  saveCustomCalloutPositions: () => {
    const { customCalloutPositions } = get();
    saveCalloutPositionsToStorage(customCalloutPositions);
  },
}));

// Load saved strategies on initialization
if (typeof window !== 'undefined') {
  const savedStrategies = localStorage.getItem('ballistic-strategies');
  if (savedStrategies) {
    try {
      const strategies = JSON.parse(savedStrategies);
      useTacticalBoard.setState({ savedStrategies: strategies });
    } catch (error) {
      console.error('Failed to load saved strategies:', error);
    }
  }
}