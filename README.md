# 🎯 Ballistic Board - Fortnite Tactical Planner

Uma aplicação web interativa de quadro tático para **Fortnite Ballistic**, o novo modo 5v5 FPS do Fortnite. Permite que jogadores e equipes criem, editem e compartilhem estratégias táticas de forma visual e intuitiva.

## 🎮 Sobre o Fortnite Ballistic

**Fortnite Ballistic** é um modo tático 5v5 em primeira pessoa, similar ao Counter-Strike:
- **Formato:** 5v5, melhor de 24 rounds (primeiro a 13 vence)
- **Objetivo:** Plantar/desarmar spike ou eliminar time adversário
- **Sistema de Créditos:** Compra de armas e gadgets entre rounds
- **Mapas:** Hammer Fall, Skyline 10, Storm Chaser Cove, K-Zone Commons, Cinderwatch

## ✨ Funcionalidades

### 🗺️ Mapas Interativos
- Todos os 5 mapas oficiais do Ballistic
- Callouts e pontos estratégicos marcados
- Visualização clara dos sites de spike e spawns

### 🎨 Ferramentas de Desenho
- **Jogadores:** Posicione jogadores dos times atacante (azul) e defensor (vermelho)
- **Movimentos:** Desenhe linhas e setas direcionais
- **Texto:** Adicione callouts e anotações
- **Áreas:** Marque zonas importantes com retângulos
- **Gadgets:** Posicione granadas e utilitários
- **Seleção:** Selecione, mova e edite elementos

### 💾 Sistema de Salvamento
- Salve estratégias localmente
- Carregue estratégias salvas
- Histórico de undo/redo (até 50 ações)
- Export para PNG/JPG

### 🎯 Interface Intuitiva
- Toolbar lateral com todas as ferramentas
- Seletor de mapas no header
- Controles de zoom e pan
- Atalhos de teclado
- Design responsivo para desktop e mobile

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm, yarn, pnpm ou bun

### Passos

1. **Clone o repositório**
```bash
git clone <repository-url>
cd ballisticboard
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

3. **Execute o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

4. **Abra no navegador**
```
http://localhost:3000
```

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 14 + React + TypeScript
- **Styling:** Tailwind CSS
- **Canvas:** Konva.js + React-Konva
- **State Management:** Zustand
- **Icons:** Lucide React
- **Storage:** LocalStorage + IndexedDB

## 🎮 Como Usar

### Básico
1. **Selecione um mapa** no dropdown do header
2. **Escolha uma ferramenta** na toolbar lateral
3. **Selecione o time** (atacante/azul ou defensor/vermelho)
4. **Clique no canvas** para adicionar elementos
5. **Use a roda do mouse** para zoom
6. **Arraste elementos** para reposicioná-los

### Atalhos de Teclado
- `V` - Ferramenta de seleção
- `P` - Adicionar jogador
- `M` - Desenhar movimento
- `T` - Adicionar texto
- `A` - Criar área
- `G` - Adicionar gadget
- `E` - Ferramenta de apagar
- `Ctrl+Z` - Desfazer
- `Ctrl+Y` - Refazer
- `Delete` - Remover elementos selecionados

### Dicas
- **Snap to Grid:** Elementos se alinham automaticamente à grade
- **Seleção Múltipla:** Clique em elementos enquanto segura Ctrl
- **Zoom Preciso:** Use os botões + e - no header
- **Reset View:** Clique no botão de maximizar para resetar zoom e posição

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- **Desktop:** Experiência completa com mouse e teclado
- **Tablet:** Touch gestures para zoom e pan
- **Mobile:** Interface adaptada para telas menores

## 🎯 Roadmap

### Fase 1 - MVP ✅
- [x] Setup do projeto Next.js + Tailwind
- [x] Canvas básico com Konva
- [x] Seletor de mapas
- [x] Ferramentas básicas de desenho
- [x] Sistema de save/load local

### Fase 2 - Core Features 🚧
- [ ] Todos os 5 mapas com imagens
- [ ] Sistema completo de gadgets e armas
- [ ] Export para imagem
- [ ] Mobile responsive completo

### Fase 3 - Advanced 📋
- [ ] Timeline de execução
- [ ] Templates e presets
- [ ] Calculadora de créditos
- [ ] Sistema de compartilhamento
- [ ] Colaboração em tempo real

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## ⚠️ Disclaimer

Este projeto é uma ferramenta de terceiros não oficial para Fortnite. Não é afiliado, endossado ou patrocinado pela Epic Games. Fortnite é uma marca registrada da Epic Games, Inc.

---

**Objetivo:** Criar a ferramenta definitiva para planejamento tático no Fortnite Ballistic! 🎯