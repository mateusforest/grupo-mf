'use client'
import {
  COMPANY_AGENTS,
  DEPARTMENTS,
  type CompanyAgent,
  type CompanyTask,
} from '@/lib/company/catalog'

const point = (x: number, y: number, z = 0) =>
  `${(x - y) * 0.68},${(x + y) * 0.34 - z}`
const polygon = (x: number, y: number, w: number, h: number, z = 0) =>
  [
    point(x, y, z),
    point(x + w, y, z),
    point(x + w, y + h, z),
    point(x, y + h, z),
  ].join(' ')

export function OfficeMap({
  selected,
  onSelect,
  department,
  query,
  tasks,
}: {
  selected: string
  onSelect: (a: CompanyAgent) => void
  department: string
  query: string
  tasks: CompanyTask[]
}) {
  return (
    <svg
      viewBox="-740 -95 1480 870"
      role="group"
      aria-label="Escritório isométrico do Grupo MF com 50 agentes clicáveis"
      className="mf-office-svg"
    >
      <defs>
        <pattern
          id="office-grid"
          width="40"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 0 10 L 20 0 L 40 10 L 20 20 Z"
            fill="none"
            stroke="#ffffff"
            strokeOpacity=".025"
          />
        </pattern>
        <filter id="office-glow">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <linearGradient id="office-base" x2="1" y2="1">
          <stop stopColor="#192531" />
          <stop offset="1" stopColor="#101721" />
        </linearGradient>
      </defs>
      <rect
        x="-740"
        y="-95"
        width="1480"
        height="870"
        fill="url(#office-grid)"
      />
      <ellipse
        cx="0"
        cy="410"
        rx="660"
        ry="300"
        fill="#000"
        opacity=".28"
        filter="url(#office-glow)"
      />
      <polygon
        points={polygon(-16, -16, 1056, 1056, -13)}
        fill="#070d15"
        stroke="#344455"
      />
      <polygon
        points={polygon(-16, -16, 1056, 1056)}
        fill="url(#office-base)"
        stroke="#4f645a"
        strokeWidth="2"
      />
      <path
        d={`M${point(-16, 1040, 0)} L${point(1040, 1040, 0)} L${point(1040, -16, 0)}`}
        stroke="#d6b46d"
        strokeWidth="3"
        fill="none"
      />
      {DEPARTMENTS.map((dept, di) => {
        const x = (di % 4) * 256,
          y = Math.floor(di / 4) * 256
        const members = COMPANY_AGENTS.filter((a) => a.departmentId === dept.id)
        const dim = department !== 'all' && department !== dept.id
        return (
          <g key={dept.id} opacity={dim ? 0.24 : 1}>
            <polygon
              points={polygon(x + 8, y + 8, 236, 236)}
              fill="#1c2631"
              stroke={dept.color}
              strokeOpacity=".45"
            />
            <polygon
              points={[
                point(x + 8, y + 8),
                point(x + 244, y + 8),
                point(x + 244, y + 8, 26),
                point(x + 8, y + 8, 26),
              ].join(' ')}
              fill="#273342"
              stroke={dept.color}
              strokeOpacity=".3"
            />
            <polygon
              points={[
                point(x + 8, y + 8),
                point(x + 8, y + 244),
                point(x + 8, y + 244, 26),
                point(x + 8, y + 8, 26),
              ].join(' ')}
              fill="#222d39"
            />
            <path
              d={`M${point(x + 8, y + 244, 26)} L${point(x + 8, y + 8, 26)} L${point(x + 244, y + 8, 26)}`}
              stroke={dept.color}
              strokeOpacity=".85"
              fill="none"
              strokeWidth="2"
            />
            <g transform={`translate(${point(x + 125, y + 17, 45)})`}>
              <rect
                x="-68"
                y="-13"
                width="136"
                height="25"
                rx="5"
                fill="#101720"
                stroke={dept.color}
                strokeOpacity=".45"
              />
              <text
                textAnchor="middle"
                y="3"
                fill={dept.color}
                fontSize="11"
                fontWeight="600"
              >
                {dept.name} · {dept.count}
              </text>
            </g>
            {members.map((a, i) => {
              const ax = x + 52 + (i % 3) * 62,
                ay = y + 70 + Math.floor(i / 3) * 44
              const active = tasks.some(
                (t) => t.agent_id === a.id && t.status === 'running',
              )
              const reviewing = tasks.some(
                (t) => t.agent_id === a.id && t.status === 'review',
              )
              const match =
                !query ||
                `${a.id} ${a.role} ${a.scope}`
                  .toLocaleLowerCase()
                  .includes(query.toLocaleLowerCase())
              return (
                <g
                  key={a.id}
                  transform={`translate(${point(ax, ay)}) scale(1.35) translate(${point(-ax, -ay)})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${a.id}, ${a.role}, ${a.scope}`}
                  aria-pressed={selected === a.id}
                  onClick={() => onSelect(a)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelect(a)
                    }
                  }}
                  className="mf-desk"
                  opacity={match ? 1 : 0.15}
                >
                  <title>{`${a.id} · ${a.role} · ${a.scope}${active ? ' · Em execução' : reviewing ? ' · Entrega para revisar' : ''}`}</title>
                  <polygon
                    points={polygon(ax - 4, ay - 5, 30, 27)}
                    fill="transparent"
                    stroke={selected === a.id ? '#f5d88c' : 'transparent'}
                    strokeWidth="3"
                  />
                  <polygon
                    points={polygon(ax, ay, 25, 13, 7)}
                    fill={selected === a.id ? '#b5a77a' : '#697f8a'}
                    stroke="#9ab0b8"
                    strokeWidth=".5"
                  />
                  <path
                    d={`M${point(ax, ay + 13, 7)} L${point(ax, ay + 13)} M${point(ax + 25, ay + 13, 7)} L${point(ax + 25, ay + 13)}`}
                    stroke="#44525e"
                    strokeWidth="2"
                  />
                  <g transform={`translate(${point(ax + 12, ay + 2, 15)})`}>
                    <rect
                      x="-7"
                      y="-7"
                      width="14"
                      height="9"
                      rx="1"
                      fill="#0b1520"
                      stroke={active ? '#6af6ba' : dept.color}
                      strokeWidth="1"
                    />
                    <path
                      d="M-4,-3h7M-4,-1h4"
                      stroke={dept.color}
                      opacity=".8"
                      strokeWidth=".8"
                    />
                    {active && (
                      <circle
                        className="mf-working-dot"
                        cx="5"
                        cy="-6"
                        r="2.5"
                        fill="#6af6ba"
                      />
                    )}
                  </g>
                  <g transform={`translate(${point(ax + 13, ay + 20, 8)})`}>
                    <ellipse cy="6" rx="5" ry="3" fill="#0c1119" />
                    <rect
                      x="-4"
                      y="-1"
                      width="8"
                      height="8"
                      rx="3"
                      fill={dept.color}
                    />
                    <circle
                      cy="-4"
                      r="3.8"
                      fill={
                        ['#e6c2a5', '#bb9273', '#8d6955', '#caa787'][
                          a.number % 4
                        ]
                      }
                    />
                    {reviewing && (
                      <circle cx="7" cy="-7" r="3" fill="#f2c866" />
                    )}
                  </g>
                </g>
              )
            })}
            <g transform={`translate(${point(x + 224, y + 224)})`}>
              <ellipse rx="8" ry="4" fill="#111c20" />
              <path d="M0 0v-15" stroke="#47634d" strokeWidth="3" />
              <ellipse cy="-15" rx="8" ry="10" fill="#416d59" />
              <ellipse cx="-4" cy="-20" rx="5" ry="7" fill="#58866b" />
            </g>
          </g>
        )
      })}
      <g transform="translate(0,735)">
        <text
          textAnchor="middle"
          fill="#d6b46d"
          letterSpacing="9"
          fontSize="18"
          fontWeight="600"
        >
          GRUPO MF
        </text>
        <text
          textAnchor="middle"
          y="24"
          fill="#77848e"
          letterSpacing="3"
          fontSize="9"
        >
          SEDE DIGITAL · 50 AGENTES · 16 SETORES
        </text>
      </g>
    </svg>
  )
}
