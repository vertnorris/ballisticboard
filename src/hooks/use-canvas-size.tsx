'use client';

import { useState, useEffect } from 'react';

interface CanvasSize {
  width: number;
  height: number;
}

export const useCanvasSize = () => {
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ width: 800, height: 600 });

  useEffect(() => {
    const calculateCanvasSize = (): CanvasSize => {
      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate sidebar width dynamically
      const sidebar = document.querySelector('[data-sidebar]');
      const sidebarWidth = sidebar ? sidebar.getBoundingClientRect().width : 280;
      
      // Define UI element heights and paddings
      const headerHeight = 64;
      const toolbarHeight = 60;
      const mapSelectorHeight = 60;
      const padding = 32; // Total horizontal and vertical padding
      
      // Calculate available space
      const availableWidth = viewportWidth - sidebarWidth - padding;
      const availableHeight = viewportHeight - headerHeight - toolbarHeight - mapSelectorHeight - padding;
      
      // Define minimum and maximum dimensions
      const minWidth = 600;
      const minHeight = 400;
      const maxWidth = 1920;
      const maxHeight = 1080;
      
      // Calculate final dimensions
      const width = Math.min(Math.max(availableWidth, minWidth), maxWidth);
      const height = Math.min(Math.max(availableHeight, minHeight), maxHeight);
      
      return { width, height };
    };

    const handleResize = () => {
      const newSize = calculateCanvasSize();
      setCanvasSize(newSize);
    };

    // Initial calculation with delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      handleResize();
    }, 100);

    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return canvasSize;
};