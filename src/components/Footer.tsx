import { ShieldCheck, Github } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black mt-auto py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <span className="text-sm text-muted-foreground font-medium">
            Built for Colosseum Hackathon 2026 · Powered by Solana
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-muted-foreground hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </Link>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium h-9 px-4 text-sm">
            View Pitch Deck
          </Button>
        </div>
      </div>
    </footer>
  )
}
