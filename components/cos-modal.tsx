'use client'

import { useState } from 'react'
import { Send, Sparkles, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const suggestions = [
  'Qual foi o faturamento deste mês?',
  'Qual produto mais cresceu?',
  'Quanto gastamos com OpenAI?',
  'Mostre clientes inadimplentes.',
  'Qual o MRR atual do COS?',
  'Quantos clientes novos em maio?',
]

interface COSModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function COSModal({ open, onOpenChange }: COSModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o COS, seu assistente do MF Control Center. Como posso ajudar você hoje?',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'qual foi o faturamento deste mês?': 'O faturamento do mês atual é de R$ 179.350,00, com crescimento de 8,2% em relação ao mês anterior.',
        'qual produto mais cresceu?': 'O VUEI teve o maior crescimento com 45,6%, seguido pelo TravelMatch com 32,8%.',
        'quanto gastamos com openai?': 'O gasto total com OpenAI este mês foi de R$ 13.980,00, distribuído entre todos os produtos do grupo.',
        'mostre clientes inadimplentes.': 'Atualmente temos 1 cliente inadimplente: Marketing Pro (EME) com MRR de R$ 320,00.',
        'qual o mrr atual do cos?': 'O MRR atual do COS é de R$ 73.250,00, representando 40,8% do MRR total do grupo.',
        'quantos clientes novos em maio?': 'Em maio tivemos 28 novos clientes, distribuídos entre COS (12), TravelPro (8), VUEI (5) e EME (3).',
      }

      const normalizedInput = message.toLowerCase().trim()
      const response = responses[normalizedInput] || 
        'Entendi sua pergunta. Baseado nos dados do sistema, posso informar que o Grupo MF está com performance estável. Para informações mais específicas, tente perguntar sobre faturamento, produtos, clientes ou custos.'

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[600px] max-w-2xl flex-col gap-0 p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            COS Assistant
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' && 'flex-row-reverse'
                )}
              >
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full',
                    message.role === 'assistant' ? 'bg-primary' : 'bg-accent'
                  )}
                >
                  {message.role === 'assistant' ? (
                    <Sparkles className="size-4 text-primary-foreground" />
                  ) : (
                    <User className="size-4 text-accent-foreground" />
                  )}
                </div>
                <div
                  className={cn(
                    'rounded-2xl px-4 py-3 text-sm',
                    message.role === 'assistant'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-primary text-primary-foreground'
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary">
                  <Sparkles className="size-4 text-primary-foreground" />
                </div>
                <div className="rounded-2xl bg-secondary px-4 py-3">
                  <div className="flex gap-1">
                    <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                    <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                    <span className="size-2 animate-bounce rounded-full bg-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="mt-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Sugestões
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground transition-colors hover:bg-accent"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-border p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend(input)
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte algo sobre o Grupo MF..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="size-4" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
