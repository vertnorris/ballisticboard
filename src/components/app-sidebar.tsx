"use client"

import * as React from "react"
import Image from "next/image"
import {
  ChevronUp,
  User,
  Users,
  Shield,
  Undo2,
  Redo2,
  RotateCcw,
  Save,
  Download,
  Hand,
  Move,
  Zap,
  Square,
  Circle,
  Pen,
  Type,
  Settings,
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
  { id: 'select', name: 'Ferramenta de Seleção', icon: Hand, shortcut: 'V' },
  { id: 'pan', name: 'Navegação', icon: Move, shortcut: 'H' },
  { id: 'player', name: 'Jogador', icon: Users, shortcut: 'P' },
  { id: 'gadget', name: 'Gadget', icon: Zap, shortcut: 'G' },
  { id: 'rectangle', name: 'Área Retangular', icon: Square, shortcut: 'R' },
  { id: 'circle', name: 'Área Circular', icon: Circle, shortcut: 'C' },
  { id: 'line', name: 'Linha de Movimento', icon: Pen, shortcut: 'L' },
  { id: 'text', name: 'Anotação de Texto', icon: Type, shortcut: 'T' },
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
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="w-8 h-8 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 flex items-center justify-center">
            <Image
              src="/logosz.svg"
              alt="Ballistic Board Logo"
              width={32}
              height={32}
              className="object-contain w-8 h-8 group-data-[collapsible=icon]:!w-10 group-data-[collapsible=icon]:!h-10"
              style={{
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="text-sm font-bold text-foreground">
              Ballistic Board
            </h2>
            <p className="text-xs text-muted-foreground">Tactical Planner</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Ferramentas */}
        <SidebarGroup className="py-1">
          <SidebarGroupLabel className="text-xs px-2 py-1">Ferramentas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <SidebarMenuItem key={tool.id}>
                    <SidebarMenuButton
                      onClick={() => handleToolSelect(tool.id)}
                      isActive={selectedTool === tool.id}
                      tooltip={`${tool.name} (${tool.shortcut})`}
                      className="h-8 px-2"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="text-sm">{tool.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-1" />

        {/* Gadgets */}
        <SidebarGroup className="py-1">
          <SidebarGroupLabel className="text-xs px-2 py-1">Gadgets</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
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
                      className={`h-8 px-2 ${isAtLimit && !isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="w-3.5 h-3.5 relative">
                        <Image
                          src={gadget.image}
                          alt={gadget.name}
                          width={14}
                          height={14}
                          className="object-contain"
                        />
                      </div>
                      <span className="group-data-[collapsible=icon]:hidden flex-1 text-sm">{gadget.name}</span>
                      <span className={`group-data-[collapsible=icon]:hidden text-xs px-1 py-0.5 rounded ${
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

        <Separator className="my-1" />

        {/* Times & Ações */}
        <SidebarGroup className="py-1">
          <SidebarGroupLabel className="text-xs px-2 py-1">Times</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {teams.map((team) => (
                <SidebarMenuItem key={team.id}>
                  <SidebarMenuButton
                    onClick={() => handleTeamSelect(team.id)}
                    isActive={selectedTeam === team.id}
                    tooltip={team.name}
                    className="h-8 px-2"
                  >
                    <div className={`w-3.5 h-3.5 rounded-full ${team.color}`} />
                    <span className="text-sm">{team.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-1" />

        {/* Ações */}
        <SidebarGroup className="py-1">
          <SidebarGroupLabel className="text-xs px-2 py-1">Ações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {actions.map((action) => {
                const Icon = action.icon
                return (
                  <SidebarMenuItem key={action.id}>
                    <SidebarMenuButton
                      onClick={() => handleAction(action.id)}
                      tooltip={action.shortcut ? `${action.name} (${action.shortcut})` : action.name}
                      className="h-8 px-2"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="text-sm">{action.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


      </SidebarContent>

      <SidebarFooter className="py-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Configurações" className="h-8 px-2">
              <Settings className="h-3.5 w-3.5" />
              <span className="text-sm">Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}