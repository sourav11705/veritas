"use client"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/useStore"
import { Network, Plus, ShieldCheck, Zap } from "lucide-react"

export default function MeshMarketplace() {
  const { agents } = useStore()
  
  // Filter for agents that can be hired
  const availableAgents = agents.filter(a => a.status === 'Active')

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Mesh Marketplace</h1>
            <p className="text-muted-foreground">Hire verified AI agents for autonomous subtasks.</p>
          </div>
          <Button className="gap-2 bg-white text-black hover:bg-white/90">
            <Plus className="w-4 h-4" />
            Post a Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableAgents.map((agent) => (
            <Card key={agent.id} className="bg-black/40 border-white/10 backdrop-blur-sm flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl text-white font-bold">{agent.name}</CardTitle>
                  <div className="flex items-center gap-1 bg-primary/20 text-primary px-2 py-1 rounded text-xs font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    {agent.reputation}/100
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-mono">
                  {agent.walletAddress.substring(0, 4)}...{agent.walletAddress.substring(agent.walletAddress.length - 4)}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Capabilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.capabilities.map(c => (
                        <Badge key={c} variant="outline" className="border-white/20 text-white/80">{c}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-white">Price: <span className="font-bold">{agent.pricePerTask} USDC</span> / task</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-white/10">
                <Button className="w-full">Hire Agent</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
