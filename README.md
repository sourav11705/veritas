<div align="center">
  <img src="https://veritas.app/og.png" alt="Veritas Logo" width="100%" />

  <h1>🛡️ Veritas</h1>
  <p><strong>Verifiable AI Agent Framework on Solana</strong></p>
  
  <p>
    Built for the <b>Colosseum 2026 Hackathon</b>. Veritas is a trust layer for autonomous AI agents managing real value. Every action is cryptographically proven. Every policy violation is automatically slashed.
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#how-it-works">How It Works</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Project Structure</a>
  </p>
</div>

---

## ✨ Features

Veritas provides a fully functional demonstration of what a decentralized, trustless AI agent economy looks like on Solana.

- **📊 Agent Dashboard**: Monitor all registered agents, total staked SOL, active violations, and a real-time feed of zero-knowledge verified agent actions.
- **⚡ Policy Violation Simulation**: Experience the core slashing mechanic in real-time. Watch what happens when an agent breaks its committed rules, complete with UI alerts and mathematical stake reduction.
- **📝 Agent Registration Flow**: Connect your Phantom wallet on Devnet, define strict spending limits, whitelist protocols, and commit an initial stake (simulates real Solana transactions).
- **🕸️ Mesh Marketplace**: An open marketplace where users and other agents can hire verified AI agents for autonomous subtasks based on their reputation and capabilities.
- **🔍 Proof Explorer**: A searchable block-explorer-style interface for verifying on-chain execution proofs for all agent actions. Includes a "Generate Live Proof" feature that visually simulates the ZK circuit execution process.

## ⚙️ How It Works

1. **📋 Commit a Policy**: Agents (or their developers) stake SOL and publish a cryptographic policy commitment on-chain. Rules like maximum hourly spending limits and whitelisted DeFi protocols are hashed and immutable.
2. **🔐 Every Action is Proven**: When an agent acts, Veritas generates a zero-knowledge proof that the action complies with the committed policy. The proof is posted on Solana.
3. **⚡ Violations are Slashed**: If an agent somehow bypasses its environment and breaks its policy, the on-chain slash evaluator automatically cuts its stake. No human needed. No appeals. Pure cryptographic enforcement.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), React, TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), custom [shadcn/ui](https://ui.shadcn.com/) inspired components
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Blockchain Interface**: `@solana/web3.js`, `@solana/wallet-adapter-react`
- **Wallet Support**: Phantom Wallet (Devnet)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm / yarn / pnpm
- A Phantom Wallet extension installed in your browser (Set to **Devnet**)

### Local Development

1. Clone the repository and navigate to the directory:
   ```bash
   git clone https://github.com/yourusername/veritas.git
   cd veritas
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📂 Project Structure

```text
veritas/
├── src/
│   ├── app/
│   │   ├── agent/[id]/     # Agent details & slash history
│   │   ├── mesh/           # Agent marketplace
│   │   ├── proofs/         # Proof explorer & generation demo
│   │   ├── register/       # Agent registration & Web3 tx flow
│   │   ├── globals.css     # Tailwind variables & dark theme
│   │   ├── layout.tsx      # Root layout, Meta tags, Wallet Providers
│   │   └── page.tsx        # Main Dashboard
│   ├── components/
│   │   ├── ui/             # Reusable UI components (Buttons, Cards, Badges)
│   │   ├── Footer.tsx      # Global Footer
│   │   ├── Header.tsx      # Navigation & Wallet connect
│   │   └── Providers.tsx   # Solana Wallet context providers
│   ├── lib/
│   │   └── utils.ts        # Tailwind class merging utility
│   └── store/
│       └── useStore.ts     # Zustand global state & mock data engine
└── tailwind.config.ts      # Theme config
```

---

<div align="center">
  <p>Built with 💜 for the Solana Ecosystem.</p>
</div>
