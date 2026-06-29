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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

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

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col border-r border-sidebar-border bg-sidebar lg:w-60">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-4 lg:px-5">
        <Image
          src="/grupo-mf-logo.png"
          alt="Grupo MF"
          width={32}
          height={32}
          className="size-8 shrink-0 object-contain"
        />
        <span className="hidden text-sm font-semibold tracking-tight text-foreground lg:block">
          Control Center
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-2 lg:px-3">
        <div className="flex flex-col gap-0.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'size-[18px] shrink-0 transition-colors',
                        isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    <span className="hidden lg:block">{item.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="lg:hidden">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-3">
        <div className="hidden items-center gap-2.5 rounded-lg px-2 py-2 lg:flex">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            MF
          </div>
          <div className="flex-1 truncate">
            <p className="truncate text-[13px] font-medium leading-tight">Marcus Ferreira</p>
            <p className="truncate text-xs text-muted-foreground">Founder</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
