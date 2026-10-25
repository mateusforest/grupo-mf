export type ContactPageKey = 'investidores' | 'carreiras' | 'parceiros'
export interface ContactFieldOption {
  label: string
  value: string
}
export interface ContactFieldConfig {
  id: string
  label: string
  type: 'text' | 'email' | 'url' | 'textarea' | 'select'
  placeholder: string
  optional?: boolean
  options?: ContactFieldOption[]
}
export interface ContactPageConfig {
  key: ContactPageKey
  label: string
  heroTitle: string
  heroAccent: string
  heroDescription: string
  heroHighlight: string
  institutionTitle: string
  institutionDescription: string
  principles: { title: string; description: string }[]
  formTitle: string
  formDescription: string
  formFields: ContactFieldConfig[]
  finalCtaTitle: string
  finalCtaAccent: string
  finalCtaDescription: string
  finalCtaLabel: string
  finalCtaHref: string
}
const name: ContactFieldConfig = {
  id: 'name',
  label: 'Seu nome',
  type: 'text',
  placeholder: 'Como podemos chamar você?',
}
const email: ContactFieldConfig = {
  id: 'email',
  label: 'E-mail',
  type: 'email',
  placeholder: 'voce@empresa.com',
  optional: true,
}

export const PUBLIC_CONTACT_PAGES: Record<ContactPageKey, ContactPageConfig> = {
  investidores: {
    key: 'investidores',
    label: 'Investidores',
    heroTitle: 'Visão de longo prazo.',
    heroAccent: 'Construção em conjunto.',
    heroDescription:
      'Conectamos tecnologia, produto e execução. Buscamos parceiros que compartilhem a vontade de construir empresas relevantes, com consistência e propósito.',
    heroHighlight:
      'Boas empresas começam com uma visão. Crescem com as conexões certas.',
    institutionTitle: 'Mais do que capital. Uma visão em comum.',
    institutionDescription:
      'Queremos conversar com pessoas e organizações que se interessam pelo que estamos construindo e pelo caminho que podemos percorrer juntos.',
    principles: [
      {
        title: 'Tecnologia aplicada',
        description:
          'Produtos de software, inteligência artificial e experiências digitais que partem de problemas reais.',
      },
      {
        title: 'Construção consistente',
        description:
          'Pesquisa, validação e desenvolvimento como partes do mesmo processo.',
      },
      {
        title: 'Relações de longo prazo',
        description:
          'Proximidade, clareza e complementaridade para pensar os próximos passos do grupo.',
      },
    ],
    formTitle: 'Vamos iniciar uma conversa.',
    formDescription: 'Conte um pouco sobre você e seu interesse no Grupo MF.',
    formFields: [
      name,
      email,
      {
        id: 'firm',
        label: 'Empresa ou fundo',
        type: 'text',
        placeholder: 'Onde você atua?',
        optional: true,
      },
      {
        id: 'interest',
        label: 'Seu interesse',
        type: 'select',
        placeholder: 'Selecione uma opção',
        options: [
          { label: 'Conhecer o grupo', value: 'conhecer' },
          { label: 'Conversar sobre investimento', value: 'investimento' },
          { label: 'Explorar uma conexão estratégica', value: 'estrategia' },
        ],
      },
      {
        id: 'message',
        label: 'O que podemos construir juntos?',
        type: 'textarea',
        placeholder: 'Compartilhe sua visão, seus interesses ou uma pergunta.',
      },
    ],
    finalCtaTitle: 'Conheça o que',
    finalCtaAccent: 'estamos construindo.',
    finalCtaDescription:
      'Diferentes produtos. Uma mesma vontade de transformar problemas em possibilidades.',
    finalCtaLabel: 'Explore nossos produtos',
    finalCtaHref: '/#produtos',
  },
  carreiras: {
    key: 'carreiras',
    label: 'Carreiras',
    heroTitle: 'Gente curiosa.',
    heroAccent: 'Ideias que ganham forma.',
    heroDescription:
      'Gostamos de quem faz perguntas, aprende no caminho e transforma complexidade em experiências simples. Se esse é o seu jeito de trabalhar, queremos conhecer você.',
    heroHighlight: 'O próximo produto começa com pessoas que gostam de criar.',
    institutionTitle: 'Espaço para pensar. Autonomia para fazer.',
    institutionDescription:
      'Construímos com proximidade entre estratégia, design e tecnologia. Conhecer pessoas é o primeiro passo para novas oportunidades.',
    principles: [
      {
        title: 'Curiosidade',
        description:
          'Entender o problema, experimentar possibilidades e continuar aprendendo.',
      },
      {
        title: 'Responsabilidade',
        description:
          'Ter iniciativa, cuidar dos detalhes e acompanhar o impacto do próprio trabalho.',
      },
      {
        title: 'Colaboração',
        description:
          'Compartilhar contexto, ouvir outras perspectivas e construir em conjunto.',
      },
    ],
    formTitle: 'Mostre o que move você.',
    formDescription:
      'Apresente seu perfil e os tipos de problema que você gosta de resolver.',
    formFields: [
      name,
      email,
      {
        id: 'area',
        label: 'Área de interesse',
        type: 'select',
        placeholder: 'Selecione uma área',
        options: [
          { label: 'Produto', value: 'produto' },
          { label: 'Engenharia', value: 'engenharia' },
          { label: 'Design', value: 'design' },
          { label: 'Operações', value: 'operacoes' },
          { label: 'Comercial', value: 'comercial' },
          { label: 'Outra área', value: 'outra' },
        ],
      },
      {
        id: 'portfolio',
        label: 'LinkedIn ou portfólio',
        type: 'url',
        placeholder: 'https://',
        optional: true,
      },
      {
        id: 'message',
        label: 'Conte um pouco sobre você',
        type: 'textarea',
        placeholder: 'O que você gosta de criar? Como gostaria de contribuir?',
      },
    ],
    finalCtaTitle: 'Conheça nosso',
    finalCtaAccent: 'jeito de criar.',
    finalCtaDescription:
      'Do problema à ideia. Da ideia ao produto. Descubra como pensamos a inovação no MF Labs.',
    finalCtaLabel: 'Explore o MF Labs',
    finalCtaHref: '/#mf-labs',
  },
  parceiros: {
    key: 'parceiros',
    label: 'Parceiros',
    heroTitle: 'Competências que se somam.',
    heroAccent: 'Possibilidades que crescem.',
    heroDescription:
      'Conectamos nossa experiência em design, tecnologia e produtos a empresas e pessoas com quem podemos construir algo relevante.',
    heroHighlight: 'Uma boa parceria começa com um objetivo em comum.',
    institutionTitle: 'Boas conexões se tornam bons projetos.',
    institutionDescription:
      'Acreditamos em colaborações com propósito claro, competências complementares e participação próxima ao longo do caminho.',
    principles: [
      {
        title: 'Design e identidade',
        description:
          'Marcas e experiências que comunicam com clareza o que cada negócio tem de especial.',
      },
      {
        title: 'Produto e tecnologia',
        description:
          'Sites, sistemas e experiências digitais pensados a partir de necessidades reais.',
      },
      {
        title: 'Operação e evolução',
        description:
          'Uma visão que conecta a presença digital à forma como o negócio funciona.',
      },
    ],
    formTitle: 'Sua próxima parceria começa aqui.',
    formDescription:
      'Compartilhe o contexto da sua empresa e a ideia que gostaria de explorar.',
    formFields: [
      name,
      email,
      {
        id: 'company',
        label: 'Empresa',
        type: 'text',
        placeholder: 'Nome da sua empresa',
        optional: true,
      },
      {
        id: 'partnershipType',
        label: 'O que você busca?',
        type: 'select',
        placeholder: 'Selecione uma opção',
        options: [
          { label: 'Design e identidade', value: 'design' },
          { label: 'Produto e tecnologia', value: 'tecnologia' },
          { label: 'Operação digital', value: 'operacao' },
          { label: 'Outra colaboração', value: 'outra' },
        ],
      },
      {
        id: 'website',
        label: 'Site da empresa',
        type: 'url',
        placeholder: 'https://',
        optional: true,
      },
      {
        id: 'message',
        label: 'Conte sua ideia',
        type: 'textarea',
        placeholder: 'Qual desafio podemos explorar juntos?',
      },
    ],
    finalCtaTitle: 'Uma parceria.',
    finalCtaAccent: 'Uma nova perspectiva.',
    finalCtaDescription:
      'Conheça nossa colaboração na identidade, tecnologia e operação digital da EME Select.',
    finalCtaLabel: 'Conheça o projeto EME Select',
    finalCtaHref: '/projetos/eme-select',
  },
}
