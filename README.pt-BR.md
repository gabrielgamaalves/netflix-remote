# Netflix Remote

🌐 **[Read this in English](./README.md)**

Projeto que permite o controle remoto da interface web da Netflix a partir de um celular, por meio de uma conexão **P2P (WebRTC)**. O celular acessa uma interface própria e, a partir dela, envia comandos de navegação para o dispositivo onde a Netflix está sendo exibida (como um notebook conectado à TV), sem a necessidade de mouse, teclado ou controle físico.

## 🎯 Como funciona

O projeto é dividido em duas partes principais:

- **Script injetado na Netflix (`src/`)** — Script em TypeScript, executado na própria página da Netflix, responsável por acessar a árvore de componentes React da aplicação (via introspecção do React Fiber) para ler e manipular elementos da interface, como os carrosséis de conteúdo (navegação entre itens, páginas, seleção de cards, etc.).
- **Interface web de controle (`web/`)** — Aplicação React (Vite + Tailwind) que roda no celular e funciona como controle remoto, com botões direcionais e navegação equivalentes às de um controle de TV.

A comunicação entre os dois dispositivos é estabelecida via **conexão P2P (WebRTC)**, utilizando a biblioteca [PeerJS](https://peerjs.com/) para o gerenciamento da conexão, sem depender de um servidor intermediário para o tráfego de dados.

## 🗂️ Estrutura do projeto

```
src/           # Script que roda na página da Netflix (TypeScript, bundlado com esbuild)
  components/  # Abstrações sobre elementos da UI da Netflix (carrossel, itens)
  lib/         # Utilitários de baixo nível (introspecção de React Fiber, eventos)
  navigation/  # Lógica de navegação entre carrosséis e itens

web/           # Interface web de controle remoto (React + Vite + Tailwind)
  src/
    components/  # Componentes de UI (header, controle remoto, cards)
    pages/       # Páginas da aplicação (Auth, Browse, Watch)
```

## 🔒 Segurança e privacidade

A segurança é uma prioridade no desenvolvimento deste projeto. O funcionamento do controle remoto **não depende da coleta de dados pessoais nem de dados da conta Netflix do usuário**. A comunicação entre os dispositivos ocorre diretamente via conexão P2P (WebRTC), sem que informações sensíveis sejam armazenadas ou transmitidas para servidores próprios.

## 🚧 Status do projeto

Este projeto **ainda está em construção**. Já existem as bases da leitura/controle da interface da Netflix e da interface web de controle remoto, mas a integração completa entre os dois lados (conexão P2P + comandos em tempo real) ainda está em desenvolvimento. Funcionalidades, arquitetura e documentação podem mudar significativamente até o projeto amadurecer.

## 📎 Repositório

[github.com/gabrielgamaalves/netflix-remote](https://github.com/gabrielgamaalves/netflix-remote)

## 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.