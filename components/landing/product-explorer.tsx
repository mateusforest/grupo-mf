'use client'

import Image from 'next/image'
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { portfolioProducts, productHref } from '@/lib/public-products'
import styles from './product-explorer.module.css'

const themes = [
  { color: '#b96321', soft: '#f3e6d6', line: '#e7b787' },
  { color: '#b86e22', soft: '#f6ecda', line: '#e9c696' },
  { color: '#137c9e', soft: '#e0edf1', line: '#99cad9' },
  { color: '#377c47', soft: '#e4eddf', line: '#a7cba0' },
  { color: '#126e55', soft: '#dfece5', line: '#90bda9' },
]

function ProductDrawing({
  spatial,
  estate,
}: {
  spatial: boolean
  estate: boolean
}) {
  return (
    <svg
      className={styles.drawing}
      viewBox="0 0 500 460"
      fill="none"
      aria-hidden="true"
    >
      {spatial || estate ? (
        <>
          <path d="M70 310 250 410 430 310 250 210Z M70 310V150L250 50 430 150V310 M250 50V210 M250 410V250 M70 150 250 250 430 150" />
          <path
            d="M115 335V175L295 75 M160 360V200L340 100 M205 385V225L385 125 M115 125 295 225V385 M160 100 340 200V360 M205 75 385 175V335"
            className={styles.minorLines}
          />
          {estate && (
            <path d="M70 250 250 350 430 250 M70 200 250 300 430 200" />
          )}
        </>
      ) : (
        <>
          <path d="M-20 330C110 330 100 80 250 80S350 330 520 130 M-20 360C150 360 100 110 250 110S350 360 520 160 M-20 390C150 390 100 140 250 140S350 390 520 190" />
          <path
            d="M30 120C150 50 370 70 450 220S380 430 200 390 0 260 30 120Z"
            className={styles.minorLines}
          />
          <circle cx="128" cy="232" r="6" />
          <circle cx="357" cy="205" r="6" />
          <circle cx="250" cy="80" r="4" />
        </>
      )}
    </svg>
  )
}

export function ProductExplorer() {
  const [selected, setSelected] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const theme = themes[selected]
  useEffect(() => {
    const tab = tabs.current[selected]
    const list = tab?.parentElement
    if (!tab || !list) return
    const observer = new ResizeObserver(() => {
      if (window.matchMedia('(max-width: 760px)').matches) {
        list.scrollTo({
          left:
            tab.offsetLeft -
            list.offsetLeft -
            (list.clientWidth - tab.clientWidth) / 2,
          behavior: 'instant',
        })
      }
    })
    observer.observe(list)
    return () => observer.disconnect()
  }, [selected])
  function choose(index: number, focus = false) {
    setSelected(index)
    const tab = tabs.current[index]
    if (focus) tab?.focus({ preventScroll: true })
    const list = tab?.parentElement
    if (tab && list && window.matchMedia('(max-width: 760px)').matches) {
      list.scrollTo({
        left:
          tab.offsetLeft -
          list.offsetLeft -
          (list.clientWidth - tab.clientWidth) / 2,
        behavior: 'instant',
      })
    }
  }
  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
      next = (index + 1) % portfolioProducts.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (index + portfolioProducts.length - 1) % portfolioProducts.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = portfolioProducts.length - 1
    else return
    event.preventDefault()
    choose(next, true)
  }

  return (
    <div
      className={styles.explorer}
      style={
        {
          '--product-color': theme.color,
          '--product-soft': theme.soft,
          '--product-line': theme.line,
        } as CSSProperties
      }
    >
      <div className={styles.rail}>
        <p className={styles.railLabel}>Escolha uma possibilidade</p>
        <div
          role="tablist"
          aria-label="Produtos do Grupo MF"
          className={styles.tabs}
        >
          {portfolioProducts.map((item, index) => (
            <button
              key={item.id}
              ref={(el) => {
                tabs.current[index] = el
              }}
              type="button"
              role="tab"
              id={'tab-' + item.id}
              aria-controls={'panel-' + item.id}
              aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => choose(index)}
              onKeyDown={(event) => onKey(event, index)}
              className={styles.tab}
            >
              <Image src={item.logo} alt="" width={38} height={38} />
              <span>{item.name}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className={styles.railNote}>
          <span>05</span>
          <p>
            Produtos.
            <br />
            Novos caminhos.
          </p>
        </div>
      </div>
      {portfolioProducts.map((item, index) => (
        <section
          key={item.id}
          id={'panel-' + item.id}
          role="tabpanel"
          aria-labelledby={'tab-' + item.id}
          hidden={selected !== index}
          tabIndex={0}
          className={styles.panel}
        >
          {selected === index && (
            <>
              <div className={styles.visual} key={item.id}>
                <span className={styles.visualLabel}>Produto do Grupo MF</span>
                <span className={styles.number}>0{index + 1} / 05</span>
                <ProductDrawing
                  spatial={item.id === 'eme-spatial'}
                  estate={item.id === 'eme'}
                />
                <div className={styles.logo} data-product={item.id}>
                  <Image
                    src={item.logo}
                    alt={'Marca ' + item.name}
                    width={200}
                    height={200}
                    sizes="200px"
                  />
                </div>
                <div className={styles.concepts}>
                  {item.capabilities.map((capability) => (
                    <span key={capability.title}>{capability.title}</span>
                  ))}
                </div>
              </div>
              <div className={styles.content}>
                <p className={styles.category}>{item.category}</p>
                <h3>
                  {item.name}
                  <span>.</span>
                </h3>
                <p className={styles.headline}>{item.headline}</p>
                <p className={styles.description}>{item.description}</p>
                <a href={productHref(item.id)} className={styles.cta}>
                  Conheça o {item.name}
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </>
          )}
        </section>
      ))}
    </div>
  )
}
