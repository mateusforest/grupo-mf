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
  badge: string
  heroTitle: string
  heroDescription: string
  heroHighlight: string
  institutionTitle: string
  institutionDescription: string
  institutionPoints: string[]
  proofTitle: string
  proofItems: string[]
  formTitle: string
  formDescription: string
  formFields: ContactFieldConfig[]
  submitLabel: string
  successMessage: string
  finalCtaTitle: string
  finalCtaDescription: string
  finalCtaLabel: string
  finalCtaHref: string
}

export const PUBLIC_CONTACT_PAGES: Record<ContactPageKey, ContactPageConfig> = {
  investidores: {
    key: 'investidores',
    badge: 'Investor Relations',
    heroTitle: 'Construa o próximo ciclo de empresas de software com o Grupo MF.',
    heroDescription:
      'Abrimos espaço para conversas com investidores que buscam teses de longo prazo, tecnologia aplicada e execução disciplinada.',
    heroHighlight: 'Capital inteligente para crescimento consistente.',
    institutionTitle: 'Como pensamos a relação com investidores',
    institutionDescription:
      'Buscamos parceiros estratégicos com visão de ecossistema, sensibilidade operacional e interesse real em construir valor junto com os fundadores.',
    institutionPoints: [
      'Tese centrada em software, IA aplicada e ativos digitais com potencial de recorrência.',
      'Ritmo de construção orientado por eficiência, clareza estratégica e validação contínua.',
      'Estrutura preparada para futuras camadas de reporting, pipeline e acompanhamento.',
    ],
    proofTitle: 'O que você encontra nessa frente',
    proofItems: [
      'Produtos em operação e novas frentes em evolução.',
      'Visão de ecossistema com sinergia entre software, IA e inovação aplicada.',
      'Base pronta para futuras integrações de deal flow, materiais e acompanhamento.',
    ],
    formTitle: 'Inicie uma conversa com o time de investimentos',
    formDescription:
      'Use dados mockados por enquanto. A estrutura já deixa o formulário preparado para integração futura com CRM, backend e workflow interno.',
    formFields: [
      { id: 'name', label: 'Nome', type: 'text', placeholder: 'Seu nome completo' },
      { id: 'email', label: 'E-mail', type: 'email', placeholder: 'voce@empresa.com' },
      { id: 'firm', label: 'Fundo ou empresa', type: 'text', placeholder: 'Nome do fundo, family office ou holding' },
      {
        id: 'ticket',
        label: 'Faixa de interesse',
        type: 'select',
        placeholder: 'Selecione',
        options: [
          { label: 'Até R$ 500 mil', value: 'ate-500k' },
          { label: 'R$ 500 mil a R$ 2 milhões', value: '500k-2m' },
          { label: 'Acima de R$ 2 milhões', value: 'acima-2m' },
        ],
      },
      {
        id: 'thesis',
        label: 'Tese ou foco estratégico',
        type: 'textarea',
        placeholder: 'Conte como você investe, quais mercados busca e o que considera um bom encaixe.',
      },
    ],
    submitLabel: 'Enviar interesse',
    successMessage:
      'Interesse registrado com sucesso. Nosso time poderá retornar quando essa frente evoluir para backend.',
    finalCtaTitle: 'Vamos explorar uma tese em comum?',
    finalCtaDescription:
      'Se sua visão combina capital, tecnologia e construção de longo prazo, esse é um bom ponto de partida.',
    finalCtaLabel: 'Acessar Control Center',
    finalCtaHref: '/login',
  },
  carreiras: {
    key: 'carreiras',
    badge: 'Careers',
    heroTitle: 'Venha construir produtos ambiciosos em um time pequeno e extremamente focado.',
    heroDescription:
      'Estamos interessados em pessoas que gostem de criar, aprender rápido e transformar complexidade em experiências simples.',
    heroHighlight: 'Tecnologia, autonomia e impacto real.',
    institutionTitle: 'Como pensamos carreira no Grupo MF',
    institutionDescription:
      'Preferimos times compactos, densidade técnica e pessoas que queiram participar da construção de algo relevante desde cedo.',
    institutionPoints: [
      'Ambiente com proximidade entre estratégia, produto e execução.',
      'Espaço para protagonismo, responsabilidade e evolução acelerada.',
      'Estrutura já pronta para futuras integrações com vagas, processos seletivos e acompanhamento.',
    ],
    proofTitle: 'O que valorizamos',
    proofItems: [
      'Clareza de pensamento, velocidade de aprendizado e senso de dono.',
      'Capacidade de transformar problemas difusos em entregas concretas.',
      'Interesse genuíno por software, IA, negócios e excelência operacional.',
    ],
    formTitle: 'Mostre seu perfil',
    formDescription:
      'Por enquanto, o formulário usa dados mockados. A estrutura já está pronta para conectar recrutamento, ATS e fluxos internos depois.',
    formFields: [
      { id: 'name', label: 'Nome', type: 'text', placeholder: 'Seu nome completo' },
      { id: 'email', label: 'E-mail', type: 'email', placeholder: 'voce@email.com' },
      {
        id: 'area',
        label: 'Área de interesse',
        type: 'select',
        placeholder: 'Selecione',
        options: [
          { label: 'Produto', value: 'produto' },
          { label: 'Engenharia', value: 'engenharia' },
          { label: 'Design', value: 'design' },
          { label: 'Operações', value: 'operacoes' },
          { label: 'Comercial', value: 'comercial' },
        ],
      },
      { id: 'portfolio', label: 'LinkedIn ou portfólio', type: 'url', placeholder: 'https://linkedin.com/in/seu-perfil' },
      {
        id: 'stage',
        label: 'Momento de carreira',
        type: 'select',
        placeholder: 'Selecione',
        options: [
          { label: 'Júnior', value: 'junior' },
          { label: 'Pleno', value: 'pleno' },
          { label: 'Sênior', value: 'senior' },
          { label: 'Liderança', value: 'lideranca' },
        ],
      },
      {
        id: 'message',
        label: 'Por que o Grupo MF?',
        type: 'textarea',
        placeholder: 'Conte o que te atrai, o tipo de problema que gosta de resolver e como quer contribuir.',
      },
    ],
    submitLabel: 'Enviar perfil',
    successMessage:
      'Perfil registrado com sucesso. Quando essa frente estiver integrada ao backend, o time poderá avançar o contato.',
    finalCtaTitle: 'Quer construir produtos com mais intensidade?',
    finalCtaDescription:
      'Se você gosta de contexto, responsabilidade e impacto, esse é um ótimo lugar para iniciar a conversa.',
    finalCtaLabel: 'Conhecer o MF Labs',
    finalCtaHref: '/mf-labs',
  },
  parceiros: {
    key: 'parceiros',
    badge: 'Partnerships',
    heroTitle: 'Parcerias certas aceleram execução, ampliam alcance e criam novas possibilidades.',
    heroDescription:
      'Estamos abertos a conexões com empresas, especialistas e operadores que possam fortalecer produtos, distribuição ou novas iniciativas.',
    heroHighlight: 'Colaboração estratégica para gerar resultados concretos.',
    institutionTitle: 'Como enxergamos parcerias',
    institutionDescription:
      'Gostamos de parcerias com clareza de objetivo, complementaridade real e capacidade de execução conjunta.',
    institutionPoints: [
      'Parcerias de produto, tecnologia, distribuição e operação.',
      'Modelos desenhados para gerar valor bilateral e evolução contínua.',
      'Estrutura pronta para futuras integrações com CRM, pipeline e histórico de relacionamento.',
    ],
    proofTitle: 'Onde costumamos enxergar sinergia',
    proofItems: [
      'Distribuição e aquisição de clientes para produtos do ecossistema.',
      'Integrações tecnológicas e alianças operacionais.',
      'Canais, especialistas e empresas com visão de longo prazo.',
    ],
    formTitle: 'Apresente sua proposta de parceria',
    formDescription:
      'A captura é mockada por enquanto, mas a estrutura já está pronta para evoluir para backend, CRM e workflows internos.',
    formFields: [
      { id: 'name', label: 'Nome', type: 'text', placeholder: 'Seu nome completo' },
      { id: 'email', label: 'E-mail', type: 'email', placeholder: 'voce@empresa.com' },
      { id: 'company', label: 'Empresa', type: 'text', placeholder: 'Nome da empresa ou operação' },
      {
        id: 'partnershipType',
        label: 'Tipo de parceria',
        type: 'select',
        placeholder: 'Selecione',
        options: [
          { label: 'Tecnologia', value: 'tecnologia' },
          { label: 'Distribuição', value: 'distribuicao' },
          { label: 'Operação', value: 'operacao' },
          { label: 'Co-branding', value: 'co-branding' },
        ],
      },
      { id: 'website', label: 'Site ou material público', type: 'url', placeholder: 'https://suaempresa.com' },
      {
        id: 'message',
        label: 'Contexto da parceria',
        type: 'textarea',
        placeholder: 'Explique a proposta, os ganhos esperados e por que existe encaixe com o Grupo MF.',
      },
    ],
    submitLabel: 'Enviar proposta',
    successMessage:
      'Proposta registrada com sucesso. A base está pronta para futuras integrações de relacionamento e triagem.',
    finalCtaTitle: 'Existe uma frente que podemos construir juntos?',
    finalCtaDescription:
      'Se sua proposta conecta tecnologia, distribuição ou operação com alto potencial de alavancagem, vale iniciar a conversa.',
    finalCtaLabel: 'Voltar para a landing',
    finalCtaHref: '/',
  },
}
