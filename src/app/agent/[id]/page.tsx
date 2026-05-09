"use client"
import { Header } from "@/components/Header"
import { useStore } from "@/store/useStore"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShieldCheck, AlertTriangle, ShieldAlert, Coins, ExternalLink, Activity, ArrowLeft, History } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function AgentDetail() {
  const { id } = useParams()
  const router = useRouter()
  const { agents, proofs, slashAgent } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Find agent by id, or by name if the id is just the name (for proofs)
  const agent = agents.find(a => a.id === id || a.name.toLowerCase().replace(/\s+/g, '-') === id)
  
  if (!agent) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Agent not found</h1>
          <Button onClick={() => router.push('/')}>Return to Dashboard</Button>
        </div>
      </>
    )
  }

  const agentProofs = proofs.filter(p => p.agentId === agent.name)

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">{agent.name}</h1>
                {agent.status === 'Active' && <Badge variant="success">Active</Badge>}
                {agent.status === 'Slashed' && <Badge variant="destructive" className="animate-pulse">Slashed</Badge>}
                {agent.status === 'Suspended' && <Badge variant="warning">Suspended</Badge>}
              </div>
              <p className="text-muted-foreground font-mono text-sm flex items-center gap-2">
                {agent.walletAddress}
                <a href={`https://explorer.solana.com/address/${agent.walletAddress}?cluster=devnet`} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80">
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
        </div>

        {agent.status === 'Slashed' && (
          <div className="mb-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <ShieldAlert className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <h3 className="text-destructive font-medium">Policy Violation Detected</h3>
              <p className="text-destructive/80 text-sm mt-1">This agent has violated its committed policy. Its stake has been slashed by 20%.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Committed Policy
                </CardTitle>
                <CardDescription>On-chain rules this agent must follow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Max Spend Per Hour</span>
                    <div className="text-white font-medium">{agent.policy.maxSpendPerHour} SOL</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Risk Level</span>
                    <div className="text-white font-medium capitalize">{agent.policy.riskLevel}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Allowed Actions</span>
                    <div className="flex flex-wrap gap-1">
                      {agent.policy.allowedActions.map(a => (
                        <Badge key={a} variant="outline" className="text-xs border-white/20 capitalize">{a}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Whitelisted Protocols</span>
                    <div className="flex flex-wrap gap-1">
                      {agent.policy.whitelistedProtocols.map(p => (
                        <Badge key={p} variant="outline" className="text-xs border-white/20">{p}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Recent Actions & Proofs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {agentProofs.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4">No recent actions found for this agent.</p>
                ) : (
                  <div className="space-y-4">
                    {agentProofs.map((proof, i) => (
                      <div key={`${proof.proofHash}-${i}`} className={cn(
                        "flex items-center justify-between p-3 rounded-md border transition-all",
                        proof.isNew ? (proof.passed ? "bg-green-500/10 border-green-500/30" : "bg-destructive/20 border-destructive/30") : "bg-white/5 border-white/5"
                      )}>
                        <div>
                          <div className="text-sm font-medium text-white">{proof.actionType}</div>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <span className="font-mono">{proof.proofHash.substring(0, 10)}...</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(proof.timestamp), { addSuffix: true })}</span>
                          </div>
                        </div>
                        {proof.passed ? (
                          <Badge variant="success" className="gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Failed
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-primary" />
                  Stake Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Current Stake</div>
                  <div className="text-3xl font-bold text-white flex items-baseline gap-2">
                    {agent.staked.toFixed(2)} <span className="text-lg font-normal text-muted-foreground">SOL</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Slash Events</span>
                    <span className="text-white font-medium">{agent.slashEvents}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Reputation Score</span>
                    <span className="text-white font-medium">{agent.reputation}/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* UPGRADE 5: Agent Detail page polish for Slash History */}
            <Card className={cn("bg-black/40 backdrop-blur-sm", agent.name === 'Beta-Yield' ? 'border-destructive/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-green-500/30')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <History className="w-5 h-5" />
                  Slash History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {agent.name === 'Beta-Yield' ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-destructive">Policy Violation</span>
                        <span className="text-xs text-muted-foreground">3 days ago</span>
                      </div>
                      <p className="text-xs text-white/80 mb-3">Exceeded hourly spend limit</p>
                      <div className="flex justify-between text-xs border-t border-destructive/20 pt-2">
                        <span className="text-muted-foreground">Stake slashed</span>
                        <span className="text-destructive font-bold">-1.10 SOL</span>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-muted-foreground">Remaining stake</span>
                        <span className="text-white font-medium">4.40 SOL</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-500">No slash events — fully compliant</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
