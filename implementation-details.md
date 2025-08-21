# Detailed Implementation Plan

## 1. Directory Structure Changes

### New directories to create:
```
/src/app/tactical-board/
```

### New files to create:
```
/src/app/tactical-board/layout.tsx
/src/app/tactical-board/page.tsx
/src/components/fortnitesz-sidebar.tsx
```

## 2. File Modifications

### Modify existing files:

1. **/src/app/layout.tsx** - Update to FortniteSZ layout
2. **/src/components/app-sidebar.tsx** - Adapt styling for FortniteSZ
3. **/tailwind.config.js** - Add FortniteSZ color scheme
4. **/src/app/globals.css** - Update styling to match FortniteSZ

## 3. Detailed Implementation Steps

### Step 1: Create FortniteSZ Layout

Create `/src/app/tactical-board/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ballistic Board - Fortnite Tactical Planner',
  description: 'Ferramenta de planejamento tático para Fortnite Ballistic 5v5',
  keywords: ['Fortnite', 'Ballistic', 'Tactical', 'Strategy', 'Planning', '5v5'],
  authors: [{ name: 'Ballistic Board Team' }],
};

export default function TacticalBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} dark`}>
        {children}
      </body>
    </html>
  );
}
```

### Step 2: Create Tactical Board Page

Move current implementation to `/src/app/tactical-board/page.tsx`:
```tsx
"use client";

import { TacticalBoard } from '@/components/tactical-board/TacticalBoard';

export default function TacticalBoardPage() {
  return (
    <main className="min-h-screen">
      <TacticalBoard />
    </main>
  );
}
```

### Step 3: Update Main Layout

Update `/src/app/layout.tsx` to match FortniteSZ design:
```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FortniteSZ - Estratégias e Dicas para Fortnite',
  description: 'Site especializado em estratégias, dicas e análises para Fortnite Battle Royale',
  keywords: ['Fortnite', 'Dicas', 'Estratégias', 'Battle Royale', 'FortniteSZ'],
  authors: [{ name: 'FortniteSZ Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} dark`}>
        {/* FortniteSZ Header */}
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0078F2] rounded"></div>
              <span className="text-xl font-bold">FortniteSZ</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-sm font-medium hover:underline underline-offset-4">Home</a>
              <a href="/tactical-board" className="text-sm font-medium hover:underline underline-offset-4">Tactical Board</a>
              <a href="#" className="text-sm font-medium hover:underline underline-offset-4">Dicas</a>
              <a href="#" className="text-sm font-medium hover:underline underline-offset-4">Mapas</a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
```

### Step 4: Update Main Page

Update `/src/app/page.tsx` to be the FortniteSZ homepage:
```tsx
export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <div className="container">
        <h1 className="text-3xl font-bold mb-4">Bem-vindo ao FortniteSZ</h1>
        <p className="mb-8">Seu site especializado em estratégias e dicas para Fortnite Battle Royale.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Tactical Board</h2>
            <p className="mb-4">Planeje suas estratégias táticas para partidas de Fortnite.</p>
            <a href="/tactical-board" className="text-[#0078F2] hover:underline">Acessar Board →</a>
          </div>
          
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Dicas e Estratégias</h2>
            <p className="mb-4">Melhore seu jogo com nossas dicas especializadas.</p>
            <a href="#" className="text-[#0078F2] hover:underline">Ver Dicas →</a>
          </div>
          
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Análise de Mapas</h2>
            <p className="mb-4">Conheça os melhores pontos do mapa atual.</p>
            <a href="#" className="text-[#0078F2] hover:underline">Ver Mapas →</a>
          </div>
        </div>
      </div>
    </main>
  );
}
```

### Step 5: Adapt Sidebar Component

Create `/src/components/fortnitesz-sidebar.tsx`:
```tsx
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
  Zap,
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
  { id: 'player', name: 'Jogador', icon: Users, shortcut: 'P' },
  { id: 'movement', name: 'Movimento', icon: Move, shortcut: 'M' },
  { id: 'strategy', name: 'Estratégia', icon: Zap, shortcut: 'S' },
  { id: 'text', name: 'Texto', icon: Type, shortcut: 'T' },
  { id: 'area', name: 'Área', icon: Square, shortcut: 'A' },
  { id: 'erase', name: 'Apagar', icon: Eraser, shortcut: 'E' },
]

const teams = [
  { id: 'attacker', name: 'Atacante', color: 'bg-[#0078F2]' },
  { id: 'defender', name: 'Defensor', color: 'bg-destructive' },
]

const actions = [
  { id: 'undo', name: 'Desfazer', icon: Undo2, shortcut: 'Ctrl+Z' },
  { id: 'redo', name: 'Refazer', icon: Redo2, shortcut: 'Ctrl+Y' },
  { id: 'reset', name: 'Limpar', icon: RotateCcw },
  { id: 'save', name: 'Salvar', icon: Save, shortcut: 'Ctrl+S' },
  { id: 'export', name: 'Exportar', icon: Download },
]

export function FortniteSZSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
              alt="FortniteSZ Logo"
              width={45}
              height={45}
              className="object-contain"
            />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="text-lg font-bold text-foreground">
              Tactical Board
            </h2>
            <p className="text-xs text-muted-foreground">FortniteSZ</p>
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
              <Save className="h-4 w-4" />
              <span>Salvar Estratégia</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}
```

### Step 6: Update Tactical Board Component

Update `/src/components/tactical-board/TacticalBoard.tsx` to use the new sidebar:
```tsx
// Change import from:
// import { AppSidebar } from '@/components/app-sidebar';

// To:
import { FortniteSZSidebar } from '@/components/fortnitesz-sidebar';
```

And update the component usage:
```tsx
// Change component from:
// <AppSidebar />

// To:
<FortniteSZSidebar />
```

### Step 7: Update Tailwind Configuration

Update `/tailwind.config.js` to include FortniteSZ colors:
```js
// In the colors section, update the fortnite colors:
fortnite: {
  primary: '#0078F2',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  team: {
    blue: '#0078F2',
    red: '#EF4444'
  }
}
```

### Step 8: Update Global Styles

Update `/src/app/globals.css` to include FortniteSZ styling:
```css
/* Add FortniteSZ specific styles */
.fortnitesz-primary {
  color: #0078F2;
}

.bg-fortnitesz-primary {
  background-color: #0078F2;
}

.border-fortnitesz {
  border-color: #0078F2;
}
```

## 4. Testing Plan

### Responsive Testing
- Test on mobile, tablet, and desktop viewports
- Verify sidebar collapses correctly on mobile
- Ensure canvas area is usable on all screen sizes

### Functionality Testing
- Verify all tactical board tools work correctly
- Test gadget placement and limits
- Verify team selection works
- Test save/load functionality

### Integration Testing
- Verify navigation between FortniteSZ and tactical board
- Test that FortniteSZ branding is consistent
- Ensure performance is acceptable

## 5. Deployment Considerations

### File Organization
- Ensure all new files are properly organized
- Verify imports are correct
- Check that all components are properly exported

### Performance Optimization
- Maintain lazy loading for maps and images
- Optimize canvas rendering
- Ensure minimal impact on site performance

## Conclusion

This implementation plan provides a detailed roadmap for integrating the Ballistic Board with the FortniteSZ website. The key changes involve:
1. Restructuring the routing to make the tactical board an internal page
2. Adapting the sidebar to match FortniteSZ branding
3. Maintaining all existing functionality while improving visual integration
4. Ensuring responsive design works across all devices