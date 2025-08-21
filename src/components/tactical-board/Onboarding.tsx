"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ChevronRight, ChevronLeft, Users, Zap, Type, Target, Move, Hand, Lightbulb } from 'lucide-react';

interface OnboardingProps {
  onClose: () => void;
}

const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Ballistic Board',
    description: 'Sua ferramenta para criar estratégias táticas no Fortnite Ballistic',
    icon: Target,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          O Ballistic Board permite criar, visualizar e compartilhar estratégias táticas para o modo Ballistic do Fortnite.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Posicionar jogadores</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-sm">Adicionar gadgets</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Type className="w-5 h-5 text-green-500" />
            <span className="text-sm">Inserir anotações</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Move className="w-5 h-5 text-purple-500" />
            <span className="text-sm">Desenhar movimentos</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'map-selection',
    title: 'Seleção de Mapa',
    description: 'Primeiro, escolha o mapa onde deseja criar sua estratégia',
    icon: Target,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Use o dropdown no topo da tela para selecionar um dos mapas disponíveis do Ballistic.
        </p>
        <div className="p-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md"></div>
            <div>
              <div className="font-medium">Hammer Fall</div>
              <div className="text-xs text-muted-foreground">Exemplo de mapa</div>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Cada mapa possui callouts e pontos de spawn pré-definidos para facilitar o planejamento.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'tools',
    title: 'Ferramentas Disponíveis',
    description: 'Conheça as ferramentas para criar suas estratégias',
    icon: Hand,
    content: (
      <div className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Adicionar Jogadores</div>
              <div className="text-xs text-muted-foreground">Posicione atacantes e defensores no mapa</div>
            </div>
            <Badge variant="secondary">Ativo</Badge>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg opacity-60">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Adicionar Gadgets</div>
              <div className="text-xs text-muted-foreground">Posicione equipamentos táticos</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg opacity-60">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Type className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Adicionar Texto</div>
              <div className="text-xs text-muted-foreground">Insira anotações e estratégias</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
          <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Clique em uma ferramenta para ativá-la, depois clique no mapa para adicionar elementos.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'interaction',
    title: 'Interação e Edição',
    description: 'Como interagir com os elementos no mapa',
    icon: Move,
    content: (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="font-medium mb-2">Seleção e Movimento</div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Clique em um elemento para selecioná-lo</li>
              <li>• Arraste elementos selecionados para movê-los</li>
              <li>• Use Ctrl+clique para seleção múltipla</li>
            </ul>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="font-medium mb-2">Painel de Propriedades</div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Edite cores, tamanhos e outras propriedades</li>
              <li>• Duplique ou exclua elementos selecionados</li>
              <li>• Ajuste configurações específicas de cada tipo</li>
            </ul>
          </div>
        </div>
        
        <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
          <Lightbulb className="w-4 h-4 text-green-500 mt-0.5" />
          <p className="text-sm text-green-700 dark:text-green-300">
            Use a ferramenta de Pan (mão) para navegar pelo mapa sem adicionar elementos.
          </p>
        </div>
      </div>
    )
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="min-h-[300px]">
            {step.content}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-1">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-6"
              >
                Pular Tutorial
              </Button>
              
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="px-4"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
              )}
              
              {currentStep < onboardingSteps.length - 1 ? (
                <Button onClick={nextStep} className="px-4">
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={onClose} className="px-6">
                  Começar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};