'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Users,
  Sparkles,
  Activity,
  Bell,
  Beaker,
  UsersRound,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SheetTitle } from '@/components/ui/sheet'

const navigation = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Produtos', href: '/produtos', icon: Package },
  { name: 'Financeiro', href: '/financeiro', icon: DollarSign },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'IA', href: '/ia', icon: Sparkles },
  { name: 'Monitoramento', href: '/monitoramento', icon: Activity },
  { name: 'Alertas', href: '/alertas', icon: Bell },
  { name: 'MF Labs', href: '/labs', icon: Beaker },
  { name: 'Equipe', href: '/equipe', icon: UsersRound },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
]

interface MobileSidebarProps {
  onNavigate?: () => void
}

export function MobileSidebar({ onNavigate }: MobileSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5">
        <Image
          src="/grupo-mf-logo.png"
          alt="Grupo MF"
          width={32}
          height={32}
          className="size-8 shrink-0 object-contain"
        />
        <SheetTitle className="text-sm font-semibold tracking-tight text-foreground">
          Control Center
        </SheetTitle>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <div className="flex flex-col gap-0.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'size-[18px] shrink-0',
                    isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            MF
          </div>
          <div className="flex-1 truncate">
            <p className="truncate text-[13px] font-medium leading-tight">Marcus Ferreira</p>
            <p className="truncate text-xs text-muted-foreground">Founder</p>
          </div>
        </div>
      </div>
    </div>
  )
}
