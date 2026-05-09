"use client"
import { Header } from "@/components/Header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/useStore"
import { Search, ShieldCheck, AlertTriangle, Zap, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function ProofExplorer() {
  const { proofs, addProof } = useStore()
  const [search, setSearch] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [genStep, setGenStep] = useState(0)

  const filteredProofs = proofs.filter(p => 
    p.proofHash.toLowerCase().includes(search.toLowerCase()) || 
    p.agentId.toLowerCase().includes(search.toLowerCase())
  )

  const generateLiveProof = () => {
    if (isGenerating) return
    setIsGenerating(true)
    setGenStep(1) // Step 1

    setTimeout(() => {
      setGenStep(2) // Step 2
    }, 500)

    setTimeout(() => {
      setGenStep(3) // Step 3
    }, 1500)

    setTimeout(() => {
      setGenStep(4) // Step 4
    }, 2500)

    setTimeout(() => {
      setGenStep(5) // Step 5
      
      // Add the actual proof to store
      addProof({
        proofHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        agentId: "Alpha-7",
        actionType: "Swap 10 USDC → SOL",
        policyRule: "Max Spend < 1 SOL",
        timestamp: new Date().toISOString(),
        passed: true,
        isNew: true
      })

      setTimeout(() => {
        setIsGenerating(false)
        setGenStep(0)
      }, 2000)
    }, 3000)
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Proof Explorer</h1>
            <p className="text-muted-foreground">Verify on-chain execution proofs for all agent actions.</p>
          </div>
          
          <Button 
            onClick={generateLiveProof}
            disabled={isGenerating}
            className="bg-primary hover:bg-primary/90 text-white font-medium gap-2 min-w-[220px]"
          >
            <Zap className="w-4 h-4" />
            Generate Live Proof
          </Button>
        </div>

        {/* Live Proof Generation UI */}
        {isGenerating && (
          <Card className="bg-black/60 border-primary/30 mb-8 animate-in slide-in-from-top-2">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex items-center gap-3">
                    {genStep === 1 && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                    {genStep > 1 && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    <span className={cn("text-sm", genStep >= 1 ? "text-white" : "text-muted-foreground")}>Receiving agent action...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {genStep < 2 && <div className="w-5 h-5 rounded-full border border-white/10" />}
                    {genStep === 2 && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                    {genStep > 2 && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    <span className={cn("text-sm", genStep >= 2 ? "text-white" : "text-muted-foreground")}>Checking against policy...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {genStep < 3 && <div className="w-5 h-5 rounded-full border border-white/10" />}
                    {genStep === 3 && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                    {genStep > 3 && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    <span className={cn("text-sm", genStep >= 3 ? "text-white" : "text-muted-foreground")}>Generating proof...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {genStep < 4 && <div className="w-5 h-5 rounded-full border border-white/10" />}
                    {genStep === 4 && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                    {genStep > 4 && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    <span className={cn("text-sm", genStep >= 4 ? "text-white" : "text-muted-foreground")}>Submitting to Solana...</span>
                  </div>
                  {genStep === 5 && (
                    <div className="flex items-center gap-3 animate-in fade-in zoom-in">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                      <span className="text-lg font-bold text-green-500">✅ Proof verified!</span>
                    </div>
                  )}
                </div>
                
                {/* Mock Computation Console */}
                <div className="flex-1 w-full bg-black rounded-md border border-white/10 p-4 font-mono text-xs text-muted-foreground h-[160px] overflow-hidden flex flex-col justify-end">
                  <div className="space-y-1">
                    {genStep >= 1 && <div className="text-blue-400">&gt; INIT action='Swap 10 USDC'</div>}
                    {genStep >= 2 && <div className="text-green-400">&gt; CHECK policy='Max Spend &lt; 1 SOL' ... PASS</div>}
                    {genStep >= 3 && (
                      <div className="text-purple-400 animate-pulse">
                        &gt; COMPUTE hash...<br/>
                        [0100110] 0x8a7b... processing ZK circuit...<br/>
                        [1011001] verifying constraints...
                      </div>
                    )}
                    {genStep >= 4 && <div className="text-orange-400">&gt; TX built. Sending to Devnet...</div>}
                    {genStep >= 5 && <div className="text-green-500 font-bold">&gt; SUCCESS. Proof stored.</div>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by proof hash or agent name..." 
            className="pl-10 bg-black/40 border-white/10 text-white w-full max-w-md focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card className="bg-black/40 border-white/10 backdrop-blur-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10">
                <TableHead className="text-white">Proof Hash</TableHead>
                <TableHead className="text-white">Agent</TableHead>
                <TableHead className="text-white">Action Verified</TableHead>
                <TableHead className="text-white">Policy Rule</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProofs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No proofs found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProofs.map((proof, i) => (
                  <TableRow 
                    key={`${proof.proofHash}-${i}`} 
                    className={cn(
                      "border-white/5 transition-all duration-1000",
                      proof.isNew ? "bg-green-500/10 border-l-4 border-l-green-500" : "border-l-4 border-l-transparent hover:bg-white/5"
                    )}
                  >
                    <TableCell className="font-mono text-primary text-sm">
                      {proof.proofHash}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/agent/${proof.agentId.toLowerCase().replace(/\s+/g, '-')}`} className="text-white hover:underline">
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
                        <Badge variant="destructive" className="gap-1.5">
                          <AlertTriangle className="w-3 h-3" />
                          Failed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm whitespace-nowrap">
                      {formatDistanceToNow(new Date(proof.timestamp), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </>
  )
}
