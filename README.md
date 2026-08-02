# Netflix Remote

🌐 **[Leia em Português (pt-BR)](./README.pt-BR.md)**

A project that enables remote control of the Netflix web interface from a smartphone, through a **P2P (WebRTC)** connection. The phone accesses its own interface and, from there, sends navigation commands to the device displaying Netflix (such as a laptop connected to a TV), without the need for a mouse, keyboard, or physical remote.

## 🎯 How it works

The project is divided into two main parts:

- **Script injected into Netflix (`src/`)** — A TypeScript script, executed on the Netflix page itself, responsible for accessing the application's React component tree (via React Fiber introspection) to read and manipulate interface elements, such as content carousels (navigation between items, pages, card selection, etc.).
- **Web control interface (`web/`)** — A React application (Vite + Tailwind) that runs on the phone and acts as the remote control, with directional buttons and navigation equivalent to those of a TV remote.

Communication between the two devices is established via a **P2P (WebRTC) connection**, using the [PeerJS](https://peerjs.com/) library to manage the connection, without relying on an intermediary server for data traffic.

## 🗂️ Atual Project structure

```
src/           # Script that runs on the Netflix page (TypeScript, bundled with esbuild)
  components/  # Abstractions over Netflix UI elements (carousel, items)
  lib/         # Low-level utilities (React Fiber introspection, events)
  navigation/  # Navigation logic between carousels and items

web/           # Web-based remote control interface (React + Vite + Tailwind)
  src/
    components/  # UI components (header, remote control, cards)
    pages/       # Application pages (Auth, Browse, Watch)
```

## 🔒 Security and privacy

Security is a priority in the development of this project. The remote control's functionality **does not depend on collecting personal data or data from the user's Netflix account**. Communication between devices happens directly through a P2P (WebRTC) connection, without sensitive information being stored or transmitted to any owned servers.

## 🚧 Project status

This project is **still under development**. The foundations for reading/controlling the Netflix interface and the web-based remote control interface already exist, but full integration between the two sides (P2P connection + real-time commands) is still being built. Features, architecture, and documentation may change significantly as the project matures.

## 📎 Repository

[github.com/gabrielgamaalves/netflix-remote](https://github.com/gabrielgamaalves/netflix-remote)

## 📄 License

Distributed under the MIT License. See the [LICENSE](./LICENSE) file for more details.