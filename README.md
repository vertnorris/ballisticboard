# Ballistic Board 🎯

Uma aplicação web moderna para planejamento tático do jogo Ballistic, construída com Next.js 14, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

- **Mapas Interativos**: Visualize todos os mapas oficiais do Ballistic
- **Planejamento Tático**: Posicione jogadores, gadgets e crie estratégias
- **Gerenciamento de Callouts**: Customize posições de callouts nos mapas
- **Sistema de Gadgets**: Adicione e posicione gadgets com suas imagens reais
- **Estratégias Salvas**: Salve e carregue suas táticas favoritas
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- **Modo Escuro/Claro**: Interface adaptável às suas preferências

## 🛠️ Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Gerenciamento de Estado**: Zustand
- **Canvas**: HTML5 Canvas API
- **Deploy**: Vercel (recomendado)

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/ballisticboard.git
cd ballisticboard
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🎮 Como Usar

### Seleção de Mapas
1. Use o seletor de mapas na sidebar para escolher o mapa desejado
2. Todos os mapas oficiais do Ballistic estão disponíveis

### Planejamento Tático
1. **Jogadores**: Selecione a ferramenta "Player" e clique no mapa para adicionar jogadores
2. **Gadgets**: Escolha um gadget na sidebar e clique no mapa para posicioná-lo
3. **Texto**: Use a ferramenta "Text" para adicionar anotações
4. **Seleção**: Use a ferramenta "Select" para mover e editar elementos

### Gerenciamento de Callouts
1. Clique no botão "Manage" para entrar no modo de edição de callouts
2. Arraste os callouts para reposicioná-los conforme necessário
3. As posições customizadas são salvas automaticamente

### Estratégias
1. **Salvar**: Use o botão "Save Strategy" para salvar sua tática atual
2. **Carregar**: Selecione uma estratégia salva no dropdown para carregá-la
3. **Deletar**: Use o botão de lixeira para remover estratégias não utilizadas

## 🗂️ Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
├── components/
│   ├── tactical-board/     # Componentes do board tático
│   ├── ui/                 # Componentes UI (shadcn/ui)
│   └── maps/               # Componentes relacionados a mapas
├── data/                   # Dados estáticos (mapas, gadgets, armas)
├── stores/                 # Gerenciamento de estado (Zustand)
├── types/                  # Definições de tipos TypeScript
├── utils/                  # Utilitários e helpers
└── hooks/                  # Custom hooks React
```

## 🎨 Mapas Disponíveis

- **Hammer Fall**: Mapa clássico com múltiplos níveis
- **Skyline 10**: Ambiente urbano com longas distâncias
- **Storm Chaser Cove**: Mapa costeiro com áreas abertas
- **K-Zone Commons**: Ambiente industrial compacto
- **Cinderwatch**: Mapa noturno com múltiplas rotas

## 🔧 Gadgets Suportados

- **Fire Grenade**: Granada incendiária
- **Flashbang**: Granada de luz
- **Frag Grenade**: Granada de fragmentação
- **Smoke Grenade**: Granada de fumaça
- **Bubble Shield**: Escudo protetor
- **Impulse Grenade**: Granada de impulso
- **Med-Mist Smoke**: Fumaça curativa
- **Overdrive**: Potencializador de velocidade
- **Proximity Mine**: Mina de proximidade
- **Recon Grenade**: Granada de reconhecimento

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente (se necessário)
3. Deploy automático a cada push na branch main

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎯 Roadmap

- [ ] Integração com banco de dados (Supabase)
- [ ] Sistema de autenticação
- [ ] Colaboração em tempo real
- [ ] Exportação de estratégias como imagem
- [ ] Sistema de equipes/organizações
- [ ] Análise de estratégias
- [ ] Mobile app (React Native)

## 📞 Suporte

Se você encontrar algum problema ou tiver sugestões, por favor:

1. Verifique as [Issues existentes](https://github.com/seu-usuario/ballisticboard/issues)
2. Crie uma nova issue se necessário
3. Entre em contato através do [Discord/Email]

---

**Desenvolvido com ❤️ para a comunidade Ballistic**