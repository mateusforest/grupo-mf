export interface ProductCapability {
  title: string
  description: string
}
export interface PublicProduct {
  id: string
  name: string
  category: string
  logo: string
  description: string
  headline: string
  introduction: string
  audience: string
  capabilities: ProductCapability[]
  externalUrl?: string
}

export const publicProducts: PublicProduct[] = [
  {
    id: 'cos',
    name: 'COS',
    category: 'Inteligência operacional',
    logo: '/logos/cos.png',
    description:
      'Sistema Operacional Conversacional que executa, integra e simplifica operações.',
    headline: 'Menos complexidade. Mais espaço para fazer.',
    introduction:
      'O COS parte de uma ideia simples: a tecnologia deve facilitar o trabalho. Um sistema operacional conversacional para aproximar pessoas, informações e operações.',
    audience:
      'Equipes e negócios que buscam uma forma mais simples de lidar com suas operações.',
    capabilities: [
      {
        title: 'Conversar',
        description:
          'Uma abordagem conversacional para tornar a interação com a tecnologia mais natural.',
      },
      {
        title: 'Conectar',
        description:
          'Integração como princípio para aproximar as diferentes partes de uma operação.',
      },
      {
        title: 'Simplificar',
        description:
          'Foco nos fluxos de trabalho e nos problemas que realmente precisam ser resolvidos.',
      },
    ],
  },
  {
    id: 'travelpro',
    name: 'TravelPro',
    category: 'Gestão de turismo',
    logo: '/logos/travelpro.png',
    description:
      'Sistema Operacional com IA para agências de viagens e turismo.',
    headline: 'Mais inteligência para quem conecta destinos.',
    introduction:
      'O TravelPro leva a visão de um sistema operacional com inteligência artificial para o universo das agências de viagens. Tecnologia pensada a partir da rotina de quem trabalha com turismo.',
    audience: 'Agências de viagens e profissionais do turismo.',
    capabilities: [
      {
        title: 'Operação',
        description:
          'Uma proposta orientada aos desafios de organização e gestão das agências.',
      },
      {
        title: 'Inteligência',
        description:
          'IA aplicada ao contexto do turismo, aproximando tecnologia e conhecimento do negócio.',
      },
      {
        title: 'Experiência',
        description:
          'Simplicidade para que a equipe possa dedicar atenção ao que importa: cada viagem.',
      },
    ],
  },
  {
    id: 'travelmatch',
    name: 'TravelMatch',
    category: 'Conexões inteligentes',
    logo: '/logos/travelmatch.png',
    description:
      'Marketplace inteligente que conecta viajantes e agências com precisão.',
    headline: 'A viagem certa começa com uma boa conexão.',
    introduction:
      'O TravelMatch aproxima quem quer viajar de quem pode ajudar a construir essa experiência. Um marketplace pensado para criar conexões mais relevantes entre viajantes e agências.',
    audience:
      'Viajantes em busca de possibilidades e agências que querem alcançar novos públicos.',
    capabilities: [
      {
        title: 'Descobrir',
        description:
          'Um ponto de encontro entre interesses de viagem e o conhecimento das agências.',
      },
      {
        title: 'Conectar',
        description:
          'Relevância como ponto de partida para aproximar as duas pontas do mercado.',
      },
      {
        title: 'Criar possibilidades',
        description:
          'Tecnologia a serviço de novas oportunidades para quem viaja e quem trabalha com turismo.',
      },
    ],
  },
  {
    id: 'vuei',
    name: 'VUEI',
    category: 'Experiência de viagem',
    logo: '/logos/vuei.png',
    description:
      'Toda a viagem em um único link. Organize, compartilhe e viva melhor.',
    headline: 'Sua viagem. Um link. Tudo mais simples.',
    introduction:
      'O VUEI organiza a experiência de viagem em um único lugar. Uma forma simples de reunir o que importa e compartilhar os planos com quem vai fazer parte deles.',
    audience:
      'Pessoas que querem organizar e compartilhar suas viagens com mais clareza.',
    capabilities: [
      {
        title: 'Organizar',
        description:
          'Uma visão mais clara da viagem, com as informações reunidas em um só lugar.',
      },
      {
        title: 'Compartilhar',
        description:
          'Um único link para aproximar as pessoas dos planos da viagem.',
      },
      {
        title: 'Viver',
        description:
          'Menos informações dispersas. Mais atenção à experiência de estar em outro lugar.',
      },
    ],
  },
  {
    id: 'eme',
    name: 'EME',
    category: 'Tecnologia imobiliária',
    logo: '/logos/eme.png',
    description:
      'Sistema Operacional do corretor de imóveis moderno e inteligente.',
    headline: 'Uma nova forma de pensar a operação imobiliária.',
    introduction:
      'O EME aproxima tecnologia e mercado imobiliário. Um sistema operacional pensado para o profissional que precisa conectar sua rotina, seus relacionamentos e sua operação.',
    audience: 'Corretores de imóveis e profissionais do mercado imobiliário.',
    capabilities: [
      {
        title: 'Organização',
        description:
          'Tecnologia orientada à rotina e aos desafios de quem trabalha com imóveis.',
      },
      {
        title: 'Conexão',
        description:
          'Uma visão integrada do trabalho, dos relacionamentos e das oportunidades.',
      },
      {
        title: 'Evolução',
        description:
          'Simplicidade e inteligência como base para uma operação mais moderna.',
      },
    ],
  },
  {
    id: 'eme-spatial',
    name: 'EME Spatial',
    category: 'Experiências imersivas em 3D',
    logo: '/logos/eme-spatial.webp',
    description:
      'Espaços que viram experiências. Explore e apresente projetos em 3D pelo navegador.',
    headline: 'Seu projeto. Uma nova perspectiva.',
    introduction:
      'Criado pelo Grupo MF, o EME Spatial transforma ideias, plantas e modelos em experiências imersivas em 3D. Uma nova maneira de explorar ambientes e apresentar projetos antes de existirem.',
    audience:
      'Profissionais e empresas que desejam apresentar espaços, projetos arquitetônicos e possibilidades de forma imersiva.',
    externalUrl: 'https://www.emespatial.com/',
    capabilities: [
      {
        title: 'Percorrer espaços',
        description:
          'Explore interiores e exteriores e descubra o projeto por diferentes perspectivas.',
      },
      {
        title: 'Visualizar escolhas',
        description:
          'Experimente materiais, mobiliário e cenários de luz, conforme o escopo de cada experiência.',
      },
      {
        title: 'Apresentar por um link',
        description:
          'Compartilhe a experiência pelo navegador e aproxime seus clientes do projeto.',
      },
    ],
  },
]

export const selectProject = {
  id: 'eme-select',
  name: 'EME Select',
  logo: '/logos/eme-select.webp',
  website: 'https://www.emeselect.com/',
  description:
    'Uma empresa imobiliária independente. Uma presença digital construída em parceria com o Grupo MF.',
  work: [
    {
      title: 'Identidade visual',
      description:
        'Construção da linguagem visual da marca e de sua presença no ambiente digital.',
    },
    {
      title: 'Tecnologia e site',
      description:
        'Desenvolvimento da estrutura tecnológica e do site que apresenta a empresa e seu portfólio de imóveis.',
    },
    {
      title: 'Operação digital',
      description:
        'Estruturação da experiência e da operação digital em conjunto com a empresa parceira.',
    },
  ],
}

export function productHref(id: string) {
  return '/ecossistema/' + id
}
export const selectProjectHref = '/projetos/eme-select'
