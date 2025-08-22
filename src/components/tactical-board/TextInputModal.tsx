"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TextInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (text: string) => void;
  initialText?: string;
  title?: string;
}

export function TextInputModal({
  isOpen,
  onClose,
  onConfirm,
  initialText = '',
  title = 'Adicionar Texto'
}: TextInputModalProps) {
  const [text, setText] = useState(initialText);

  const handleConfirm = () => {
    if (text.trim()) {
      onConfirm(text.trim());
      setText('');
      onClose();
    }
  };

  const handleCancel = () => {
    setText(initialText);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Digite o texto que deseja adicionar ao mapa. Use Shift+Enter para quebrar linha.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="text-input">Texto</Label>
            <Textarea
              id="text-input"
              placeholder="Digite seu texto aqui..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[100px] resize-none"
              autoFocus
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!text.trim()}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}