"use client"

import * as React from "react"
import Image from "next/image"
import {
  Target,
  MousePointer,
  Users,
  Move,
  Type,
  Square,
  Eraser,
  Undo2,
  Redo2,
  RotateCcw,
  Save,
  Download,
  Timer,
  Settings,
  PenTool,
  Hand,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useTacticalBoard } from "@/stores/tactical-board"
import { gadgets } from "@/data/gadgets"

const tools = [
  { id: 'select', name: 'Selecionar', icon: MousePointer, shortcut: 'V' },
  { id: 'pan', name: 'Pan', icon: Hand, shortcut: 'H' },
  { id: 'player', name: 'Jogador', icon: Users, shortcut: 'P' },
  { id: 'movement', name: 'Movimento', icon: Move, shortcut: 'M' },
  { id: 'strategy', name: 'Estratégia', icon: PenTool, shortcut: 'S' },
  { id: 'text', name: 'Texto', icon: Type, shortcut: 'T' },
  { id: 'area', name: 'Área', icon: Square, shortcut: 'A' },
  { id: 'erase', name: 'Apagar', icon: Eraser, shortcut: 'E' },
]

const teams = [
  { id: 'attacker', name: 'Atacante', color: 'bg-primary' },
  { id: 'defender', name: 'Defensor', color: 'bg-destructive' },
]

const actions = [
  { id: 'undo', name: 'Desfazer', icon: Undo2, shortcut: 'Ctrl+Z' },
  { id: 'redo', name: 'Refazer', icon: Redo2, shortcut: 'Ctrl+Y' },
  { id: 'reset', name: 'Limpar', icon: RotateCcw },
  { id: 'save', name: 'Salvar', icon: Save, shortcut: 'Ctrl+S' },
  { id: 'export', name: 'Exportar', icon: Download },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    selectedTool,
    setSelectedTool,
    selectedTeam,
    setSelectedTeam,
    selectedGadget,
    setSelectedGadget,
    getGadgetCount,
    getGadgetLimit,
    canAddGadget,
    undo,
    redo,
    reset,
  } = useTacticalBoard()

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId as any)
  }

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId as 'attacker' | 'defender')
  }

  const handleGadgetSelect = (gadgetId: string) => {
    setSelectedGadget(gadgetId)
    setSelectedTool('gadget')
  }

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'undo':
        undo()
        break
      case 'redo':
        redo()
        break
      case 'reset':
        reset()
        break
      case 'save':
        // TODO: Implementar funcionalidade de salvar
        console.log('Salvar estratégia')
        break
      case 'export':
        // TODO: Implementar funcionalidade de exportar
        console.log('Exportar board')
        break
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-12 h-12 flex items-center justify-center">
            <Image
              src="/logosz.svg"
              alt="Ballistic Board Logo"
              width={45}
              height={45}
              className="object-contain"
            />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="text-lg font-bold text-foreground">
              Ballistic Board
            </h2>
            <p className="text-xs text-muted-foreground">Tactical Planner</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Ferramentas */}
        <SidebarGroup>
          <SidebarGroupLabel>Ferramentas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <SidebarMenuItem key={tool.id}>
                    <SidebarMenuButton
                      onClick={() => handleToolSelect(tool.id)}
                      isActive={selectedTool === tool.id}
                      tooltip={`${tool.name} (${tool.shortcut})`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tool.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Gadgets */}
        <SidebarGroup>
          <SidebarGroupLabel>Gadgets</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gadgets.map((gadget) => {
                const currentCount = getGadgetCount(gadget.id);
                const maxCount = getGadgetLimit(gadget.id);
                const isAtLimit = !canAddGadget(gadget.id);
                const isActive = selectedGadget === gadget.id && selectedTool === 'gadget';

                return (
                  <SidebarMenuItem key={gadget.id}>
                    <SidebarMenuButton
                      onClick={() => handleGadgetSelect(gadget.id)}
                      isActive={isActive}
                      disabled={isAtLimit && !isActive}
                      tooltip={`${gadget.name} (${gadget.duration}s) - ${currentCount}/${maxCount}`}
                      className={isAtLimit && !isActive ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      <div className="w-4 h-4 relative">
                        <Image
                          src={gadget.image}
                          alt={gadget.name}
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                      </div>
                      <span className="group-data-[collapsible=icon]:hidden flex-1">{gadget.name}</span>
                      <span className={`group-data-[collapsible=icon]:hidden text-xs px-1.5 py-0.5 rounded ${
                        isAtLimit ? 'bg-destructive text-destructive-foreground' :
                        currentCount > 0 ? 'bg-secondary text-secondary-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {currentCount}/{maxCount}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Times */}
        <SidebarGroup>
          <SidebarGroupLabel>Times</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {teams.map((team) => (
                <SidebarMenuItem key={team.id}>
                  <SidebarMenuButton
                    onClick={() => handleTeamSelect(team.id)}
                    isActive={selectedTeam === team.id}
                    tooltip={team.name}
                  >
                    <div className={`w-4 h-4 rounded-full ${team.color}`} />
                    <span>{team.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Configurações">
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}