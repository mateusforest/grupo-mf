'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Client } from '@/lib/types'
import { cn } from '@/lib/utils'

const statusMap = {
  active: { label: 'Ativo', color: 'bg-success/20 text-success' },
  trial: { label: 'Trial', color: 'bg-warning/20 text-warning' },
  overdue: { label: 'Inadimplente', color: 'bg-destructive/20 text-destructive' },
  cancelled: { label: 'Cancelado', color: 'bg-muted text-muted-foreground' },
}

export default function ClientesPage() {
  const clients: Client[] = []
  const products: Array<{ id: string; name: string }> = []
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase())
    const matchesProduct = !selectedProduct || client.product === selectedProduct
    const matchesStatus = !selectedStatus || client.status === selectedStatus
    return matchesSearch && matchesProduct && matchesStatus
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
        <p className="mt-1 text-muted-foreground">
          Gestão de clientes de todos os produtos do Grupo MF.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="size-4" />
                Produto
                {selectedProduct && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedProduct}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filtrar por produto</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={!selectedProduct}
                onCheckedChange={() => setSelectedProduct(null)}
              >
                Todos
              </DropdownMenuCheckboxItem>
              {products.map((product) => (
                <DropdownMenuCheckboxItem
                  key={product.id}
                  checked={selectedProduct === product.name}
                  onCheckedChange={() => setSelectedProduct(product.name)}
                >
                  {product.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="size-4" />
                Status
                {selectedStatus && (
                  <Badge variant="secondary" className="ml-1">
                    {statusMap[selectedStatus as keyof typeof statusMap].label}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={!selectedStatus}
                onCheckedChange={() => setSelectedStatus(null)}
              >
                Todos
              </DropdownMenuCheckboxItem>
              {Object.entries(statusMap).map(([key, value]) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={selectedStatus === key}
                  onCheckedChange={() => setSelectedStatus(key)}
                >
                  {value.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Desde</TableHead>
              <TableHead className="text-right">MRR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow
                  key={client.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedClient(client)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{client.product}</TableCell>
                  <TableCell>{client.plan}</TableCell>
                  <TableCell>
                    <Badge className={statusMap[client.status].color}>
                      {statusMap[client.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(client.createdAt)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(client.mrr)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedClient?.name}</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedClient.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Produto</p>
                  <p className="font-medium">{selectedClient.product}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plano</p>
                  <p className="font-medium">{selectedClient.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={cn('mt-1', statusMap[selectedClient.status].color)}>
                    {statusMap[selectedClient.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cliente desde</p>
                  <p className="font-medium">{formatDate(selectedClient.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">MRR</p>
                  <p className="font-medium">{formatCurrency(selectedClient.mrr)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
