'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Produtos', href: '/#produtos' },
  { label: 'MF Labs', href: '/mf-labs' },
  { label: 'O grupo', href: '/#sobre' },
  { label: 'Investidores', href: '/investidores' },
  { label: 'Carreiras', href: '/carreiras' },
  { label: 'Parceiros', href: '/parceiros' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  function closeMenu() {
    setOpen(false)
    toggle.current?.focus()
  }
  return (
    <header
      className="mf-site-header"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) closeMenu()
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpen(false)
      }}
    >
      <a className="mf-skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <div className="mf-container mf-header-inner">
        <a href="/" className="mf-brand" aria-label="Grupo MF — início">
          <Image src="/mf-logo.png" alt="" width={38} height={38} />
          <span>
            grupo mf<span className="mf-brand-dot">.</span>
          </span>
        </a>
        <nav className="mf-desktop-nav" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mf-header-actions">
          <a href="/login" className="mf-control-link">
            Control Center <ArrowUpRight size={15} />
          </a>
          <button
            ref={toggle}
            className="mf-menu-toggle"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="mf-mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <nav
        id="mf-mobile-nav"
        className="mf-mobile-nav"
        aria-label="Navegação móvel"
        hidden={!open}
      >
        {navLinks.map((link) => (
          <a key={link.label} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
            <ArrowUpRight size={17} />
          </a>
        ))}
      </nav>
    </header>
  )
}
