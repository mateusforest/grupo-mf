'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, Bell, Menu, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { COSModal } from '@/components/cos-modal'
import { MobileSidebar } from '@/components/mobile-sidebar'

const notifications = [
  { id: 1, title: 'Nova assinatura', description: 'TechCorp Brasil - COS Enterprise', time: '5 min' },
  { id: 2, title: 'Consumo elevado', description: 'VUEI atingiu 90% do limite', time: '15 min' },
  { id: 3, title: 'Falha de pagamento', description: 'Marketing Pro - EME', time: '1h' },
]

export function Header({ userEmail }: { userEmail?: string | null }) {
  const router = useRouter()
  const [cosModalOpen, setCosModalOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)

  async function handleLogout() {
    setLogoutLoading(true)

    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } finally {
      setLogoutLoading(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:px-6">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <MobileSidebar onNavigate={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos, clientes, métricas..."
              className="h-9 rounded-lg border-border bg-muted/60 pl-9 text-sm shadow-none transition-colors focus-visible:bg-card focus-visible:ring-0"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-card px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            onClick={() => setCosModalOpen(true)}
            size="sm"
            className="hidden h-9 gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-medium text-primary-foreground shadow-sm hover:bg-primary/90 sm:flex"
          >
            <Sparkles className="size-3.5" />
            <span>Abrir no COS</span>
          </Button>
          <Button
            onClick={() => setCosModalOpen(true)}
            size="icon"
            className="size-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 sm:hidden"
          >
            <Sparkles className="size-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative size-9 text-muted-foreground hover:text-foreground">
                <Bell className="size-[18px]" />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" />
                <span className="sr-only">Notificações</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{notification.description}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-sm font-medium">
                Ver todas as notificações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-0.5 size-9 rounded-full">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-primary text-[11px] font-semibold text-primary-foreground">
                    MF
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>MF Control Center</span>
                  <span className="font-normal text-muted-foreground">
                    {userEmail ?? 'Usuário autenticado'}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                disabled={logoutLoading}
                onClick={handleLogout}
              >
                {logoutLoading ? 'Saindo...' : 'Sair'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <COSModal open={cosModalOpen} onOpenChange={setCosModalOpen} />
    </>
  )
}
