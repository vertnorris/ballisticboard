# Ballistic Board Integration with FortniteSZ

## Overview
This document outlines the plan to integrate the Ballistic Board tactical planning tool with the FortniteSZ website (https://fortnitesz.online/). The integration involves adapting the sidebar to match FortniteSZ's design and making the tactical board an internal page within the FortniteSZ website structure.

## Current Application Analysis

### Structure
- Next.js 14 application with TypeScript
- Uses Tailwind CSS for styling with a custom dark theme
- Implements shadcn/ui components with a sidebar-based navigation
- Features a tactical board with map selection, tools, and strategy planning capabilities

### Key Components
1. **AppSidebar** - Main navigation sidebar with tools, gadgets, and team selection
2. **TacticalBoard** - Main canvas area with map selection and strategy tools
3. **KonvaCanvas** - Interactive canvas for drawing strategies
4. **StrategyManager** - Save/load functionality for strategies

## Integration Plan

### 1. Sidebar Adaptation
The current sidebar needs to be adapted to match FortniteSZ's branding while maintaining functionality.

#### Current Sidebar Features:
- Logo header with Ballistic Board branding
- Tools section (Select, Player, Movement, Strategy, Text, Area, Erase)
- Gadgets section with counters
- Teams selection (Attacker/Defender)
- Settings footer

#### Adaptation Strategy:
- Retain core functionality but adjust visual styling
- Use FortniteSZ color scheme (#0078F2 blue as primary)
- Adjust typography to match FortniteSZ branding
- Maintain collapsible behavior for mobile responsiveness
- Keep all tactical planning tools accessible

### 2. Routing Structure
Create a new routing structure that makes the tactical board an internal page.

#### Proposed Structure:
```
/src/app/
├── layout.tsx (Main FortniteSZ layout)
├── page.tsx (FortniteSZ homepage)
├── tactical-board/
│   ├── layout.tsx (Tactical board specific layout)
│   └── page.tsx (Tactical board page)
└── [...other FortniteSZ pages]
```

### 3. Design Adaptation

#### Color Scheme:
- Primary: #0078F2 (Fortnite blue)
- Secondary: Complementary colors from Tailwind config
- Background: Dark theme to match current Ballistic Board styling
- Accents: Use Fortnite-themed colors for interactive elements

#### Typography:
- Maintain current font stack (Chivo, Alegreya, Menlo)
- Adjust sizing to match FortniteSZ hierarchy
- Ensure readability for tactical information

#### Components:
- Adapt sidebar styling to match FortniteSZ navigation
- Keep tactical board tools prominent and accessible
- Ensure gadgets and team selection are clearly visible

### 4. Implementation Steps

#### Step 1: Create FortniteSZ Layout
- Create a new root layout that matches FortniteSZ design
- Implement header with FortniteSZ branding
- Add navigation that includes link to tactical board

#### Step 2: Adapt Sidebar Component
- Modify AppSidebar to use FortniteSZ color scheme
- Adjust spacing and sizing for better integration
- Maintain all functionality while improving visual integration

#### Step 3: Create Tactical Board Page
- Move current TacticalBoard implementation to /tactical-board/page.tsx
- Create layout that properly integrates with FortniteSZ navigation
- Ensure canvas area is properly sized and responsive

#### Step 4: Update Styling
- Adjust Tailwind configuration to include FortniteSZ colors
- Modify global CSS to match FortniteSZ branding
- Ensure dark theme is maintained for tactical work

#### Step 5: Testing
- Test responsive behavior on different screen sizes
- Verify all tactical board functionality works correctly
- Ensure smooth navigation between FortniteSZ and tactical board

### 5. Technical Considerations

#### Performance:
- Maintain lazy loading for maps and gadgets
- Optimize canvas rendering for smooth performance
- Ensure minimal impact on FortniteSZ site performance

#### Compatibility:
- Ensure compatibility with FortniteSZ's existing CSS
- Avoid conflicts with FortniteSZ JavaScript
- Maintain accessibility standards

#### Responsive Design:
- Ensure sidebar collapses appropriately on mobile
- Maintain canvas usability on all screen sizes
- Preserve tactical board functionality on touch devices

## File Structure Changes

### New Files to Create:
1. `/src/app/tactical-board/layout.tsx` - Layout for tactical board pages
2. `/src/app/tactical-board/page.tsx` - Main tactical board page
3. `/src/components/fortnitesz-sidebar.tsx` - Adapted sidebar component

### Files to Modify:
1. `/src/app/layout.tsx` - Update to FortniteSZ layout
2. `/src/components/app-sidebar.tsx` - Adapt styling for FortniteSZ
3. `/tailwind.config.js` - Add FortniteSZ color scheme
4. `/src/app/globals.css` - Update styling to match FortniteSZ

## Conclusion

This integration plan will allow the Ballistic Board to become a seamless part of the FortniteSZ website while maintaining all its tactical planning functionality. The sidebar will be adapted to match FortniteSZ's branding, and the tactical board will become an internal page that fits naturally within the FortniteSZ navigation structure.

The implementation will preserve all existing functionality while improving visual integration with the FortniteSZ brand.