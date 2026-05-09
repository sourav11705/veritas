import { create } from 'zustand'

export interface Agent {
  id: string
  name: string
  walletAddress: string
  status: 'Active' | 'Slashed' | 'Suspended'
  staked: number
  slashEvents: number
  policy: {
    maxSpendPerHour: number
    whitelistedProtocols: string[]
    allowedActions: string[]
    riskLevel: string
  }
  reputation: number
  capabilities: string[]
  pricePerTask: number
}

export interface Proof {
  proofHash: string
  agentId: string
  actionType: string
  policyRule: string
  timestamp: string
  passed: boolean
  isNew?: boolean // Flag for new row animation
}

export interface MeshTask {
  id: string
  description: string
  budget: number
  status: 'Open' | 'In Progress' | 'Completed'
  agentId?: string
}

interface AppState {
  agents: Agent[]
  proofs: Proof[]
  tasks: MeshTask[]
  violationAlert: boolean
  addAgent: (agent: Agent) => void
  addProof: (proof: Proof) => void
  slashAgent: (agentId: string) => void
  setViolationAlert: (val: boolean) => void
  resetDemo: () => void
}

const initialAgents: Agent[] = [
  {
    id: 'agent-alpha-7',
    name: 'Alpha-7',
    walletAddress: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    status: 'Active',
    staked: 5.0,
    slashEvents: 0,
    policy: {
      maxSpendPerHour: 1.0,
      whitelistedProtocols: ['Jupiter', 'Orca'],
      allowedActions: ['swap'],
      riskLevel: 'conservative'
    },
    reputation: 98,
    capabilities: ['DeFi Trading', 'Conservative Yield'],
    pricePerTask: 10
  },
  {
    id: 'agent-beta-yield',
    name: 'Beta-Yield',
    walletAddress: '7u29t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    status: 'Active',
    staked: 5.5,
    slashEvents: 0,
    policy: {
      maxSpendPerHour: 1.0,
      whitelistedProtocols: ['Raydium', 'Meteora'],
      allowedActions: ['stake', 'swap'],
      riskLevel: 'moderate'
    },
    reputation: 85,
    capabilities: ['Liquidity Provision', 'Yield Farming'],
    pricePerTask: 25
  },
  {
    id: 'agent-gamma-arb',
    name: 'Gamma-Arb',
    walletAddress: '9X98t1WpEZ73CNmQviecrnyiWrnqRhWNLz',
    status: 'Active',
    staked: 10.0,
    slashEvents: 0,
    policy: {
      maxSpendPerHour: 20.0,
      whitelistedProtocols: ['All'],
      allowedActions: ['all'],
      riskLevel: 'aggressive'
    },
    reputation: 92,
    capabilities: ['High-Frequency Arbitrage', 'Flash Loans'],
    pricePerTask: 50
  },
  {
    id: 'agent-delta-pay',
    name: 'Delta-Pay',
    walletAddress: '2A98t1WpEZ73CNmQviecrnyiWrnqRhWNLa',
    status: 'Active',
    staked: 2.0,
    slashEvents: 0,
    policy: {
      maxSpendPerHour: 100.0,
      whitelistedProtocols: ['USDC', 'USDT'],
      allowedActions: ['transfer'],
      riskLevel: 'conservative'
    },
    reputation: 99,
    capabilities: ['Payment Routing', 'Escrow Management'],
    pricePerTask: 5
  },
  {
    id: 'agent-epsilon-guard',
    name: 'Epsilon-Guard',
    walletAddress: '5B98t1WpEZ73CNmQviecrnyiWrnqRhWNLb',
    status: 'Active',
    staked: 8.0,
    slashEvents: 0,
    policy: {
      maxSpendPerHour: 0.1,
      whitelistedProtocols: ['None'],
      allowedActions: ['monitor'],
      riskLevel: 'conservative'
    },
    reputation: 100,
    capabilities: ['Risk Monitoring', 'Policy Verification'],
    pricePerTask: 100
  }
]

const initialProofs: Proof[] = [
  {
    proofHash: '0x8f3c...9b2a',
    agentId: 'Alpha-7',
    actionType: 'Swap 100 USDC -> SOL',
    policyRule: 'Max Spend < 1 SOL',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    passed: true
  },
  {
    proofHash: '0x1a2b...4c5d',
    agentId: 'Beta-Yield',
    actionType: 'Stake 5 SOL',
    policyRule: 'Allowed Action: Stake',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    passed: true
  },
  {
    proofHash: '0x9d8e...7f6a',
    agentId: 'Gamma-Arb',
    actionType: 'Flash Loan 1000 SOL',
    policyRule: 'Whitelisted Protocol: All',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    passed: true
  }
]

export const useStore = create<AppState>((set) => ({
  agents: [...initialAgents],
  proofs: [...initialProofs],
  tasks: [],
  violationAlert: false,
  addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
  addProof: (proof) => set((state) => ({ 
    proofs: [proof, ...state.proofs.map(p => ({ ...p, isNew: false }))].slice(0, 10) 
  })),
  slashAgent: (agentId) => set((state) => ({
    agents: state.agents.map(a => 
      a.id === agentId || a.name === agentId
        ? { ...a, status: 'Slashed', staked: Number((a.staked - 1.1).toFixed(2)), slashEvents: a.slashEvents + 1 }
        : a
    )
  })),
  setViolationAlert: (val) => set({ violationAlert: val }),
  resetDemo: () => set({ 
    agents: [...initialAgents], 
    proofs: [...initialProofs],
    violationAlert: false
  })
}))
