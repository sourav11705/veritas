"use client"
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ShieldCheck } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { cn } from '@/lib/utils'

// Dynamically import the wallet button to avoid hydration errors
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
)

export function Header() {
  const pathname = usePathname()
  const { connected } = useWallet()

  return (
    <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight text-white">Veritas</span>
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          <Link 
            href="/" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-white", 
              pathname === '/' ? "text-white" : "text-muted-foreground"
            )}
          >
            Dashboard
          </Link>
          <Link 
            href="/mesh" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-white", 
              pathname === '/mesh' ? "text-white" : "text-muted-foreground"
            )}
          >
            Mesh
          </Link>
          <Link 
            href="/proofs" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-white", 
              pathname === '/proofs' ? "text-white" : "text-muted-foreground"
            )}
          >
            Proofs
          </Link>
          {!connected && (
            <Link 
              href="/register" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-white", 
                pathname === '/register' ? "text-white" : "text-muted-foreground"
              )}
            >
              Register Agent
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !h-9 !px-4 !py-2 !rounded-md !text-sm !font-medium transition-colors" />
        </div>
      </div>
    </header>
  )
}
