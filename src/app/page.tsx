"use client"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/useStore"
import { Users, Coins, ShieldCheck, AlertTriangle, Plus, Zap, RefreshCw, ClipboardList, Lock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const RANDOM_ACTIONS = [
  { agentId: "Alpha-7", actionType: "Swap 50 USDC → SOL", policyRule: "Max Spend < 1 SOL", passed: true },
  { agentId: "Beta-Yield", actionType: "Add Liquidity 2 SOL", policyRule: "Allowed Action: Stake", passed: true },
  { agentId: "Gamma-Arb", actionType: "Flash Loan 800 SOL", policyRule: "Whitelisted Protocol: All", passed: true },
  { agentId: "Delta-Pay", actionType: "Transfer 0.5 SOL", policyRule: "Max Spend < 1 SOL", passed: true },
  { agentId: "Epsilon-Guard", actionType: "Monitor Agents", policyRule: "Read-only scope", passed: true },
]

export default function Dashboard() {
  const { agents, proofs, addProof, slashAgent, violationAlert, setViolationAlert, resetDemo } = useStore()
  const [mounted, setMounted] = useState(false)
  const [showSlashModal, setShowSlashModal] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Auto-update feed every 8 seconds (only if not simulating)
    const interval = setInterval(() => {
      if (useStore.getState().violationAlert || isSimulating) return

      const action = RANDOM_ACTIONS[Math.floor(Math.random() * RANDOM_ACTIONS.length)]
      addProof({
        proofHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        agentId: action.agentId,
        actionType: action.actionType,
        policyRule: action.policyRule,
        timestamp: new Date().toISOString(),
        passed: action.passed,
        isNew: true
      })
    }, 8000)

    return () => clearInterval(interval)
  }, [addProof, isSimulating])

  if (!mounted) return null

  const totalStaked = agents.reduce((acc, agent) => acc + agent.staked, 0)
  const activeViolations = agents.filter(a => a.status === 'Slashed').length
  const totalVerified = 500 + proofs.filter(p => p.passed).length

  const triggerViolation = () => {
    if (isSimulating) return
    setIsSimulating(true)

    // Step 1: Add violation row
    setTimeout(() => {
      addProof({
        proofHash: `0x7f3a...d92e`,
        agentId: "Beta-Yield",
        actionType: "Attempt transfer 50 SOL",
        policyRule: "Max Spend < 1 SOL",
        timestamp: new Date().toISOString(),
        passed: false,
        isNew: true
      })
    }, 1000)

    // Step 2: Show banner
    setTimeout(() => {
      setViolationAlert(true)
    }, 2000)

    // Step 3: Slash agent & update stats
    setTimeout(() => {
      slashAgent("Beta-Yield")
    }, 3000)

    // Step 4: Show Modal
    setTimeout(() => {
      setShowSlashModal(true)
      setIsSimulating(false)
    }, 4000)
  }

  const handleReset = () => {
    resetDemo()
    setShowSlashModal(false)
  }

  return (
    <>
      <Header />
      
      {violationAlert && (
        <div className="bg-destructive text-white py-3 px-4 flex items-center justify-center gap-2 animate-in slide-in-from-top-2 font-medium z-40 relative">
          <AlertTriangle className="w-5 h-5" />
          🚨 Policy Violation Detected — Beta-Yield attempted to exceed spending limit
        </div>
      )}

      <main className="container mx-auto px-4 py-8 relative">
        
        {/* UPGRADE 3: Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 py-8 border-b border-white/10">
          <div className="space-y-6">
            <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 tracking-wide uppercase text-xs font-bold">
              Built for Colosseum 2026 Hackathon
            </Badge>
            <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
              AI Agents with <br className="hidden md:block"/> Cryptographic Accountability
            </h1>
            <p className="text-xl text-muted-foreground">
              Every action. Every decision. Provably policy-compliant on Solana.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary/90 text-white font-medium px-8 h-12">
                  Register an Agent
                </Button>
              </Link>
              <Link href="/proofs">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 font-medium px-8 h-12">
                  Explore Proofs
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-64 flex items-center justify-center">
            {/* Animated Graphic */}
            <div className="flex items-center gap-4 relative">
              <div className="flex flex-col items-center gap-2 animate-[pulse_3s_infinite_0s]">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-3xl">
                  🤖
                </div>
                <span className="text-xs font-mono text-blue-400">Agent Action</span>
              </div>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50"></div>
              <div className="flex flex-col items-center gap-2 animate-[pulse_3s_infinite_1s]">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-2xl text-purple-400">
                  <ShieldCheck />
                </div>
                <span className="text-xs font-mono text-purple-400">ZK Proof</span>
              </div>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-500/50 to-green-500/50"></div>
              <div className="flex flex-col items-center gap-2 animate-[pulse_3s_infinite_2s]">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-2xl text-green-400">
                  ✅
                </div>
                <span className="text-xs font-mono text-green-400">Solana Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* ADDITION 1: How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-6 text-center">How Veritas Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/40 border-t-2 border-t-primary border-x-white/10 border-b-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-white text-[18px] font-semibold mb-2">Commit a Policy</h3>
                <p className="text-muted-foreground text-[14px]">
                  Agents stake SOL and publish a cryptographic policy commitment on-chain. Rules like spending limits and whitelisted protocols are hashed and immutable.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-t-2 border-t-primary border-x-white/10 border-b-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-white text-[18px] font-semibold mb-2">Every Action is Proven</h3>
                <p className="text-muted-foreground text-[14px]">
                  When an agent acts, Veritas generates a zero-knowledge proof that the action complies with the committed policy. The proof is posted on Solana.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-t-2 border-t-primary border-x-white/10 border-b-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-white text-[18px] font-semibold mb-2">Violations are Slashed</h3>
                <p className="text-muted-foreground text-[14px]">
                  If an agent breaks its policy, the on-chain slash evaluator automatically cuts its stake. No human needed. No appeals. Cryptographic enforcement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Overview</h2>
            <p className="text-muted-foreground">Monitor your verified AI agents and their on-chain actions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Agents</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{agents.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total SOL Staked</CardTitle>
              <Coins className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalStaked.toFixed(2)} SOL</div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Proofs Verified</CardTitle>
              <ShieldCheck className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white transition-all">{totalVerified}</div>
            </CardContent>
          </Card>
          <Card className={cn("bg-black/40 border-white/10 backdrop-blur-sm transition-all duration-500", 
            activeViolations > 0 ? "border-destructive/50 bg-destructive/10 animate-pulse-fast" : "")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Violations</CardTitle>
              <AlertTriangle className={cn("w-4 h-4", activeViolations > 0 ? "text-destructive" : "text-muted-foreground")} />
            </CardHeader>
            <CardContent>
              <div className={cn("text-3xl font-bold transition-all", activeViolations > 0 ? "text-destructive" : "text-white")}>
                {activeViolations}
              </div>
            </CardContent>
          </Card>
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-white mb-4">Live Agent Actions Feed</h3>
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm overflow-hidden mb-6">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white">Agent</TableHead>
                <TableHead className="text-white">Action</TableHead>
                <TableHead className="text-white">Policy Checked</TableHead>
                <TableHead className="text-white">Proof Status</TableHead>
                <TableHead className="text-white text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proofs.map((proof, idx) => (
                <TableRow 
                  key={`${proof.proofHash}-${idx}`} 
                  className={cn(
                    "border-white/5 transition-all duration-1000",
                    proof.isNew ? (proof.passed ? "bg-green-500/10 border-l-4 border-l-green-500" : "bg-destructive/20 border-l-4 border-l-destructive") : "border-l-4 border-l-transparent hover:bg-white/5"
                  )}
                >
                  <TableCell className="font-medium">
                    <Link href={`/agent/${proof.agentId.toLowerCase().replace(' ', '-')}`} className="text-primary hover:underline">
                      {proof.agentId}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{proof.actionType}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px] border-white/20 text-white/70">
                      {proof.policyRule}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {proof.passed ? (
                      <Badge variant="success" className="gap-1.5">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1.5 animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        VIOLATION
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(proof.timestamp), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* UPGRADE 2: Violation Demo Button */}
        <div className="flex justify-center mt-8">
          <Button 
            onClick={triggerViolation}
            disabled={isSimulating}
            className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white shadow-lg border-0 h-14 px-8 text-lg font-bold gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Zap className="w-5 h-5" />
            {isSimulating ? "Simulating..." : "⚡ Simulate Policy Violation"}
          </Button>
        </div>

        {/* Slash Modal */}
        {showSlashModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <Card className="w-full max-w-lg bg-[#111] border-destructive/30 shadow-2xl shadow-destructive/20">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-destructive flex items-center gap-2 text-2xl">
                  <AlertTriangle className="w-6 h-6" />
                  Slash Event Triggered
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-3 gap-4 pb-4 border-b border-white/5">
                  <div className="col-span-1 text-muted-foreground text-sm">Agent</div>
                  <div className="col-span-2 text-white font-medium text-lg">Beta-Yield</div>
                  
                  <div className="col-span-1 text-muted-foreground text-sm">Violation</div>
                  <div className="col-span-2 text-white font-medium text-sm">
                    Transfer 50 SOL exceeded Max Spend &lt; 1 SOL policy
                  </div>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 grid grid-cols-2 gap-4 my-2">
                  <div>
                    <span className="text-xs text-muted-foreground">Stake Before</span>
                    <div className="text-xl text-white font-medium">5.50 SOL</div>
                  </div>
                  <div>
                    <span className="text-xs text-destructive">Slash Amount (20%)</span>
                    <div className="text-xl text-destructive font-bold">-1.10 SOL</div>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-destructive/20">
                    <span className="text-xs text-muted-foreground">Stake Remaining</span>
                    <div className="text-xl text-white font-bold">4.40 SOL</div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Mock Proof Hash</span>
                    <div className="bg-black rounded border border-white/10 p-2 text-xs font-mono text-primary">
                      0x7f3a...d92e
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Mock TX Signature</span>
                    <div className="bg-black rounded border border-white/10 p-2 text-xs font-mono text-blue-400">
                      <a href="https://explorer.solana.com" target="_blank" rel="noreferrer" className="hover:underline">
                        3kG9xPqUa2NzH8LwY5T...
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="p-6 pt-0 flex justify-between items-center">
                <Badge variant="destructive" className="text-sm px-3 py-1">Stake Slashed</Badge>
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Reset Demo
                </Button>
              </div>
            </Card>
          </div>
        )}

      </main>
    </>
  )
}
