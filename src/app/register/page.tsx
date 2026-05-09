"use client"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/store/useStore"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { SystemProgram, Transaction, PublicKey } from "@solana/web3.js"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react"

export default function RegisterAgent() {
  const { addAgent } = useStore()
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    maxSpend: '1.0',
    protocols: 'Jupiter, Orca',
    actions: 'swap, stake',
    riskLevel: 'moderate',
    stake: '0.1'
  })
  
  const [status, setStatus] = useState<'idle' | 'simulating' | 'success'>('idle')
  const [txSig, setTxSig] = useState('')
  const [policyHash, setPolicyHash] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!publicKey) {
      alert("Please connect your Phantom wallet first!")
      return
    }

    try {
      setStatus('simulating')
      
      // Simulate Policy Hash Generation
      const hashStr = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(formData)) as any)
      const hashArray = Array.from(new Uint8Array(hashStr))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      const mockPolicyHash = `0x${hashHex.substring(0, 32)}`
      setPolicyHash(mockPolicyHash)

      // Actual Solana Transaction for Demo (0.001 SOL to a burn/demo address)
      const demoAddress = new PublicKey("11111111111111111111111111111111")
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: demoAddress,
          lamports: 1000000 // 0.001 SOL
        })
      )
      
      const signature = await sendTransaction(tx, connection)
      setTxSig(signature)
      
      // Register in Zustand
      const newAgentId = `agent-${formData.name.toLowerCase().replace(/\s+/g, '-')}`
      addAgent({
        id: newAgentId,
        name: formData.name,
        walletAddress: publicKey.toString(),
        status: 'Active',
        staked: parseFloat(formData.stake),
        slashEvents: 0,
        policy: {
          maxSpendPerHour: parseFloat(formData.maxSpend),
          whitelistedProtocols: formData.protocols.split(',').map(s => s.trim()),
          allowedActions: formData.actions.split(',').map(s => s.trim()),
          riskLevel: formData.riskLevel
        },
        reputation: 100,
        capabilities: ['Custom Logic'],
        pricePerTask: 10
      })
      
      setStatus('success')
    } catch (err) {
      console.error(err)
      alert("Transaction failed or rejected.")
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Agent Registered!</h1>
            <p className="text-muted-foreground mb-8">Your AI agent's policy is now verified on-chain.</p>
            
            <div className="bg-black/40 rounded-lg p-4 mb-8 text-left border border-white/5 space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">Public Key</span>
                <div className="text-white font-mono text-sm break-all">{publicKey?.toString()}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Policy Hash (Commitment)</span>
                <div className="text-primary font-mono text-sm break-all">{policyHash}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Transaction Signature</span>
                <div className="text-white font-mono text-sm break-all">
                  <a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                    {txSig}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push('/')} variant="outline" className="border-white/10">Back to Dashboard</Button>
              <Button onClick={() => router.push(`/agent/${formData.name.toLowerCase().replace(/\s+/g, '-')}`)}>View Agent Details</Button>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Register AI Agent</h1>
          <p className="text-muted-foreground">Define your agent's policy and stake SOL to ensure compliance.</p>
        </div>

        <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Policy Configuration
              </CardTitle>
              <CardDescription>This policy will be hashed and committed to Solana.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Agent Name</label>
                <Input 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. Omega-Trader" 
                  className="bg-black/20 border-white/10 text-white" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Max Spend / Hour (SOL)</label>
                  <Input 
                    required 
                    type="number" 
                    step="0.1" 
                    value={formData.maxSpend} 
                    onChange={e => setFormData({...formData, maxSpend: e.target.value})} 
                    className="bg-black/20 border-white/10 text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Risk Level</label>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-black/20 px-3 py-1 text-sm shadow-sm transition-colors border-white/10 text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.riskLevel}
                    onChange={e => setFormData({...formData, riskLevel: e.target.value})}
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Whitelisted Protocols (comma separated)</label>
                <Input 
                  required 
                  value={formData.protocols} 
                  onChange={e => setFormData({...formData, protocols: e.target.value})} 
                  className="bg-black/20 border-white/10 text-white" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Allowed Actions (comma separated)</label>
                <Input 
                  required 
                  value={formData.actions} 
                  onChange={e => setFormData({...formData, actions: e.target.value})} 
                  className="bg-black/20 border-white/10 text-white" 
                />
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-white">Stake Amount (SOL)</label>
                  <span className="text-sm text-primary font-bold">{formData.stake} SOL</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="10" 
                  step="0.1" 
                  value={formData.stake}
                  onChange={e => setFormData({...formData, stake: e.target.value})}
                  className="w-full accent-primary"
                />
                <p className="text-xs text-muted-foreground mt-2">Minimum stake is 0.1 SOL. This will be slashed if the agent violates its policy.</p>
              </div>

            </CardContent>
            <CardFooter className="pt-4 pb-6 bg-white/5 border-t border-white/10">
              <Button type="submit" disabled={status === 'simulating' || !publicKey} className="w-full">
                {status === 'simulating' ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Committing to Chain...</>
                ) : !publicKey ? (
                  "Connect Wallet to Register"
                ) : (
                  "Register & Commit Policy"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </>
  )
}
