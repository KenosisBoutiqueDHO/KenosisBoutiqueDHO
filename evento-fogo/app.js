
/* Base única do Encontro Técnico — usada pelo sistema dos tablets e pelos cadernos impressos.
   Horários e textos de "conteudo" e "resultado" seguem a programação oficial (Nota Conceitual). */
(function (root) {
  const UFS = ['Acre', 'Amapá', 'Amazonas', 'Maranhão', 'Mato Grosso', 'Pará', 'Piauí', 'Rondônia', 'Roraima', 'Tocantins'];
  const DEST = ['INPE', 'SEMAS/PA', 'MMA', 'Ibama/Prevfogo', 'UNODC', 'Estados', 'Outra instituição'];

  // Grupos com as cores do fogo, mistos (estados e instituições). Todos os grupos trabalham todos os temas.
  // As cores se repetem quantas vezes forem necessárias; o material é o mesmo para qualquer número de grupos.
  const CORES = [
    { id: 'brasa', nome: 'Brasa', cor: '#B3261E', corNome: 'vermelho' },
    { id: 'chama', nome: 'Chama', cor: '#D9620F', corNome: 'laranja' },
    { id: 'labareda', nome: 'Labareda', cor: '#D69E00', corNome: 'amarelo' },
    { id: 'azul', nome: 'Chama Azul', cor: '#2459B0', corNome: 'azul' },
  ];
  const POR_COR = 1;
  // Grupos numerados de 1 a 10; as cores se repetem em ciclo. Os ids internos (mesa01…) são mantidos na base. Os materiais impressos usam só as CORES.
  const MESAS = 10;
  const GRUPOS = Array.from({ length: MESAS }, (_, i) => { const c = CORES[i % CORES.length]; const n = String(i + 1).padStart(2, '0');
    return { id: 'mesa' + n, nome: `Grupo ${i + 1} · ${c.nome}`, papel: `Grupo ${i + 1}`, cor: c.cor, corNome: c.corNome, base: c.id, mesa: String(i + 1), eixo: '' }; });
  const NG = GRUPOS.length;

  const OBJETIVO = 'Fazer um diagnóstico das capacidades, práticas, desafios e necessidades dos estados da Amazônia Legal na agenda do fogo, relacionando as demandas estaduais às competências e soluções das instituições participantes e construindo uma agenda regional de cooperação, aprimoramento de produtos, interoperabilidade de sistemas e capacitação.';
  const OBJ_ESP = [
    'Apresentar os resultados da missão técnica do INPE em Belém, com a SEMAS/PA, e os aprendizados para o levantamento regional.',
    'Conhecer como os estados estruturam seus Planos de Manejo Integrado do Fogo (PMIFs), salas de situação, fluxos de monitoramento e apoio à decisão.',
    'Mapear demandas de dados, produtos, sistemas, painéis, alertas, metodologias, interoperabilidade e capacitação.',
    'Identificar desafios comuns, particularidades territoriais e experiências que possam ser compartilhadas.',
    'Avaliar a aderência dos produtos e serviços disponíveis às necessidades apresentadas e registrar lacunas.',
    'Examinar requisitos e caminhos de interoperabilidade entre o SISFOGO e os sistemas estaduais, em convergência com a ADPF nº 743.',
    'Definir prioridades, responsáveis e próximos passos para uma agenda de cooperação técnica e institucional.',
  ];
  const GLOSSARIO = [
    ['PMIF', 'Plano de Manejo Integrado do Fogo: instrumento que organiza prevenção, uso autorizado e combate ao fogo em um território.'],
    ['Sala de situação', 'Estrutura que acompanha em tempo real focos, riscos e ocorrências para apoiar a decisão.'],
    ['Foco de calor', 'Ponto de temperatura elevada detectado por satélite; indica possível fogo ativo.'],
    ['Área queimada', 'Superfície afetada pelo fogo, mapeada após o evento, a partir de imagens de satélite.'],
    ['SISFOGO', 'Sistema Nacional de Informações sobre Fogo, previsto na Política Nacional de Manejo Integrado do Fogo.'],
    ['ADPF nº 743', 'Ação no Supremo Tribunal Federal que trata da resposta do poder público aos incêndios na Amazônia e no Pantanal.'],
    ['Interoperabilidade', 'Capacidade de sistemas diferentes trocarem dados de forma automática e padronizada.'],
    ['Brazil Data Cube', 'Plataforma do INPE com cubos de dados de imagens de satélite prontos para análise em nuvem.'],
  ];

  const DIAS = [
    { n: 1, data: '2026-11-16', rotulo: 'Dia 1 · 16/11', eixo: 'Como trabalhamos, quais desafios enfrentamos e quais demandas temos' },
    { n: 2, data: '2026-11-17', rotulo: 'Dia 2 · 17/11', eixo: 'O que já existe, o que pode ser integrado e quais lacunas permanecem' },
    { n: 3, data: '2026-11-18', rotulo: 'Dia 3 · 18/11', eixo: 'O que precisamos fazer juntos e como acompanhar' },
  ];

  // Campos reutilizados nas apresentações do Dia 2
  const conexao = (extra = []) => [
    { k: 'oferece', t: 'area', l: 'O que a solução oferece', h: 'Dados, produtos, serviços, painéis, alertas', rows: 3 },
    { k: 'atende', t: 'area', l: 'Demandas do Dia 1 que ela atende', h: 'Cite as demandas registradas pelo grupo ou pelos estados', rows: 2 },
    { k: 'condicao', t: 'area', l: 'Condição para os estados usarem', h: 'Acesso, capacitação, infraestrutura, acordo institucional', rows: 2 },
    { k: 'lacuna', t: 'area', l: 'Lacuna que permanece', rows: 2 },
    ...extra,
    { k: 'pergunta', t: 'area', l: 'Pergunta do grupo', h: 'Entregue também ao mediador, se houver momento de perguntas', rows: 1 },
  ];

  const ETAPAS = [
    // ---------------- DIA 1 ----------------
    { id: 'd1-credenciamento', dia: 1, ini: '08:30', fim: '09:00', sessao: 'Credenciamento e acolhimento', tipo: 'apoio', quem: 'Organização',
      conteudo: 'Recepção dos participantes e organização dos grupos de trabalho.', resultado: 'Participantes integrados e materiais distribuídos.',
      papel: 'O grupo se reúne no seu espaço e registra quem está presente.',
      passos: [{ min: 30, txt: 'Ao chegar, cada pessoa se junta ao grupo indicado no seu crachá. O líder do primeiro exercício registra a composição do grupo no tablet.' }],
      campos: [
        { k: 'lider', t: 'line', l: 'Líder do grupo neste primeiro exercício', h: 'O líder conduz a conversa e registra no celular. A liderança pode mudar a cada exercício.' },
        { k: 'estados', t: 'multi', l: 'Estados presentes no grupo', o: UFS },
        { k: 'instituicoes', t: 'area', l: 'Outras instituições presentes', h: 'Órgãos federais, defesa civil, bombeiros, justiça, pesquisa', rows: 3 },
        { k: 'pessoas', t: 'line', l: 'Número de pessoas no grupo' },
      ] },
    { id: 'd1-abertura', dia: 1, ini: '09:00', fim: '09:25', sessao: 'Abertura e alinhamento', tipo: 'plenaria', quem: 'INPE e UNODC',
      conteudo: 'Boas-vindas do INPE e UNODC; apresentação dos objetivos, do método e dos produtos esperados.', resultado: 'Escopo e resultados do encontro validados.',
      papel: 'Ouvir. Não há registro obrigatório nesta sessão.',
      passos: [{ min: 25, txt: 'Abertura institucional. O grupo acompanha; se quiser, anota dúvidas sobre o método.' }],
      campos: [{ k: 'notas', t: 'area', l: 'Anotações do grupo (opcional)', rows: 4 }] },
    { id: 'd1-belem', dia: 1, ini: '09:25', fim: '10:05', sessao: 'Da missão de Belém à agenda regional', tipo: 'plenaria', quem: 'SEMAS/PA e INPE',
      conteudo: 'Apresentação conjunta SEMAS–INPE dos resultados de setembro e do panorama obtido no levantamento prévio: estruturas, fluxos, demandas, soluções, lacunas e prioridades.',
      resultado: 'Aprendizados do diagnóstico-piloto e linha de base regional apresentados.',
      papel: 'Registrar, durante a apresentação, o que o grupo leva de Belém para o próprio território.',
      passos: [{ min: 40, txt: 'Ouvir: durante a apresentação, o líder anota o que o grupo destaca. Ler e entregar: no último minuto, o líder lê o registro em voz baixa para o grupo e entrega.' }],
      campos: [
        { k: 'pontos', t: 'area', l: 'Pontos-chave da apresentação', rows: 4 },
        { k: 'aprendizados', t: 'area', l: 'Aprendizados de Belém úteis para nossos estados', rows: 3 },
        { k: 'diferencas', t: 'area', l: 'O que é diferente na nossa realidade', rows: 2 },
        { k: 'pergunta', t: 'area', l: 'Pergunta do grupo', rows: 2 },
        { k: 'destinatario', t: 'choice', l: 'Destinatário da pergunta', o: DEST },
      ] },
    { id: 'd1-int1', dia: 1, ini: '10:05', fim: '10:20', sessao: 'Intervalo', tipo: 'pausa' },
    { id: 'd1-estados1', dia: 1, ini: '10:20', fim: '12:20', sessao: 'Estados · bloco 1', tipo: 'plenaria', quem: 'Cinco estados (15 min cada)',
      conteudo: 'Apresentações de cinco estados, com 15 minutos por estado, seguidas de diálogo orientado sobre PMIFs, dados, sistemas, monitoramento, fiscalização, interoperabilidade, desafios e prioridades.',
      resultado: 'Demandas do primeiro bloco registradas na matriz comum.',
      papel: 'Uma ficha por estado, preenchida enquanto ele apresenta.',
      passos: [
        { min: 75, txt: 'Ouvir: cinco apresentações de 15 minutos. O líder preenche um quadro por estado, na ordem em que apresentam.' },
        { min: 45, txt: 'Diálogo orientado. Termômetro de Convergência ao fim de cada estado (30 segundos, cartões verde, amarelo e vermelho), conduzido por quem media o grupo.' },
      ],
      campos: [{ k: 'estados', t: 'repeat', n: 5, item: 'Estado', f: [
        { k: 'uf', t: 'select', l: 'Estado', o: UFS },
        { k: 'destaques', t: 'area', l: 'Como trabalha', h: 'PMIF, sala de situação, dados e sistemas usados', rows: 3 },
        { k: 'desafio', t: 'area', l: 'Principal desafio', rows: 2 },
        { k: 'pratica', t: 'area', l: 'Prática que vale compartilhar', rows: 2 },
        { k: 'demanda', t: 'area', l: 'Demanda apresentada', rows: 2 },
        { k: 'semelhanca', t: 'choice', l: 'Em relação aos estados do nosso grupo', o: ['Realidade igual', 'Parecida', 'Diferente'] },
      ] }] },
    { id: 'd1-almoco', dia: 1, ini: '12:20', fim: '13:30', sessao: 'Almoço', tipo: 'pausa' },
    { id: 'd1-estados2', dia: 1, ini: '13:30', fim: '15:15', sessao: 'Estados · bloco 2', tipo: 'plenaria', quem: 'Quatro estados (15 min cada)',
      conteudo: 'Apresentações dos quatro estados restantes, com 15 minutos por estado, seguidas de diálogo comparativo e consolidação dos pontos comuns e específicos.',
      resultado: 'Diagnóstico comparativo dos estados concluído.',
      papel: 'Uma ficha por estado e, no diálogo, o que é comum e o que é específico.',
      passos: [
        { min: 60, txt: 'Ouvir: quatro apresentações de 15 minutos. O líder preenche um quadro por estado.' },
        { min: 45, txt: 'Diálogo comparativo, com o Termômetro ao fim de cada estado. O líder completa os pontos comuns e específicos, lê para o grupo e entrega.' },
      ],
      campos: [
        { k: 'estados', t: 'repeat', n: 4, item: 'Estado', f: [
          { k: 'uf', t: 'select', l: 'Estado', o: UFS },
          { k: 'destaques', t: 'area', l: 'Como trabalha', h: 'PMIF, sala de situação, dados e sistemas usados', rows: 3 },
          { k: 'desafio', t: 'area', l: 'Principal desafio', rows: 2 },
          { k: 'pratica', t: 'area', l: 'Prática que vale compartilhar', rows: 2 },
          { k: 'demanda', t: 'area', l: 'Demanda apresentada', rows: 2 },
          { k: 'semelhanca', t: 'choice', l: 'Em relação aos estados do nosso grupo', o: ['Realidade igual', 'Parecida', 'Diferente'] },
        ] },
        { k: 'comuns', t: 'area', l: 'Pontos comuns aos estados', rows: 2 },
        { k: 'especificos', t: 'area', l: 'Pontos específicos de cada território', rows: 2 },
      ] },
    { id: 'd1-int2', dia: 1, ini: '15:15', fim: '15:30', sessao: 'Intervalo', tipo: 'pausa' },
    { id: 'd1-grupos', dia: 1, ini: '15:30', fim: '16:35', sessao: 'Grupos temáticos', tipo: 'grupo', quem: 'Grupos de trabalho',
      conteudo: 'Mesas sobre dados e metodologias; sistemas e interoperabilidade; uso operacional e comunicação; capacitação e cooperação.',
      resultado: 'Desafios agrupados e demandas preliminarmente priorizadas.',
      papel: 'Todos os grupos passam pelos quatro temas. Cada pessoa fala a partir da realidade do seu estado ou instituição.',
      passos: [
        { min: 5, txt: 'Abrir: o grupo escolhe o líder deste exercício. O líder lê o que o exercício pede e os quatro temas.' },
        { min: 40, txt: 'Ouvir e registrar, 10 minutos por tema: dados e metodologias; sistemas e interoperabilidade; uso operacional e comunicação; capacitação e cooperação. Em cada tema, rodada rápida com o principal desafio de cada estado ou instituição; o líder registra o desafio e a demanda que o grupo escolher.' },
        { min: 15, txt: 'Conversar: o grupo marca a prioridade de cada demanda e escreve 2 perguntas para o Dia 2.' },
        { min: 5, txt: 'Ler e entregar: o líder lê o registro em voz alta, o grupo confirma, define o porta-voz e entrega.' },
      ],
      campos: [
        { k: 'demandas', t: 'repeat', n: 4, item: 'Tema', titles: ['Dados e metodologias', 'Sistemas e interoperabilidade', 'Uso operacional e comunicação', 'Capacitação e cooperação'], f: [
          { k: 'desafios', t: 'area', l: 'Desafios apontados pelos estados e instituições do grupo', rows: 2 },
          { k: 'problema', t: 'area', l: 'Demanda escolhida: problema ou necessidade', rows: 2 },
          { k: 'usuario', t: 'line', l: 'Usuário e finalidade', h: 'Quem usa e para quê' },
          { k: 'situacao', t: 'line', l: 'Situação atual' },
          { k: 'belem', t: 'line', l: 'Evidência ou aprendizado de Belém relacionado' },
          { k: 'competente', t: 'line', l: 'Produto ou instituição competente' },
          { k: 'lacuna', t: 'line', l: 'Lacuna' },
          { k: 'prioridade', t: 'choice', l: 'Prioridade', o: ['Alta', 'Média', 'Baixa'] },
        ] },
        { k: 'perguntas', t: 'repeat', n: 2, item: 'Pergunta para o Dia 2', compact: true, f: [
          { k: 'texto', t: 'area', l: 'Pergunta', rows: 2 },
          { k: 'destinatario', t: 'choice', l: 'Destinatário', o: DEST },
        ] },
        { k: 'portavoz', t: 'line', l: 'Porta-voz na síntese do dia' },
      ] },
    { id: 'd1-sintese', dia: 1, ini: '16:35', fim: '17:05', sessao: 'Síntese do dia', tipo: 'plenaria', quem: 'Porta-vozes dos grupos',
      conteudo: 'Consolidação dos resultados de Belém e das contribuições estaduais; formulação das questões a serem respondidas pelo INPE e pelas demais instituições.',
      resultado: 'Demanda regional qualificada para orientar o segundo dia.',
      papel: 'O porta-voz apresenta as 3 demandas e as 2 perguntas do grupo. O líder registra os ajustes pedidos pela plenária.',
      passos: [
        { min: 20, txt: 'Quatro porta-vozes, 5 minutos cada: 3 demandas prioritárias e 2 perguntas.' },
        { min: 10, txt: 'Formulação das questões para o INPE e demais instituições.' },
      ],
      campos: [{ k: 'ajustes', t: 'area', l: 'Ajustes e novas perguntas que surgiram na plenária', rows: 5 }] },

    // ---------------- DIA 2 ----------------
    { id: 'd2-retomada', dia: 2, ini: '09:00', fim: '09:10', sessao: 'Retomada', tipo: 'plenaria', quem: 'Organização',
      conteudo: 'Síntese das necessidades e perguntas produzidas no primeiro dia.', resultado: 'Agenda técnica do dia confirmada.',
      papel: 'Ouvir. As demandas do Dia 1 aparecem nas fichas de hoje.',
      passos: [{ min: 10, txt: 'Apresentação da síntese do Dia 1.' }], campos: [] },
    { id: 'd2-bdc', dia: 2, ini: '09:10', fim: '09:30', sessao: 'INPE · Brazil Data Cube', tipo: 'plenaria', quem: 'INPE',
      conteudo: 'Apresentação do ambiente de computação em nuvem do INPE, suas bases de dados, serviços e possibilidades de uso pelos estados.',
      resultado: 'Capacidades do Brazil Data Cube relacionadas às demandas regionais.',
      papel: 'Ligar o que é apresentado às demandas do Dia 1.',
      passos: [{ min: 20, txt: 'Ouvir e registrar: durante a apresentação, o líder preenche a ficha. No último minuto, lê para o grupo e entrega.' }], campos: conexao() },
    { id: 'd2-sala', dia: 2, ini: '09:30', fim: '09:50', sessao: 'INPE · Sala de Situação', tipo: 'plenaria', quem: 'INPE',
      conteudo: 'Apresentação da estrutura, dos fluxos, dos produtos e das possibilidades de apoio ao acompanhamento e à tomada de decisão.',
      resultado: 'Possibilidades de uso e cooperação identificadas.',
      papel: 'Ligar o que é apresentado às demandas do Dia 1.',
      passos: [{ min: 20, txt: 'Ouvir e registrar: durante a apresentação, o líder preenche a ficha. No último minuto, lê para o grupo e entrega.' }], campos: conexao() },
    { id: 'd2-biomas', dia: 2, ini: '09:50', fim: '10:10', sessao: 'INPE · Monitoramento dos Biomas', tipo: 'plenaria', quem: 'INPE (Cláudio Almeida)',
      conteudo: 'Apresentação sobre o monitoramento dos biomas brasileiros, incluindo produtos, metodologias e aplicações relevantes para os estados.',
      resultado: 'Produtos de monitoramento relacionados às necessidades estaduais.',
      papel: 'Ligar o que é apresentado às demandas do Dia 1.',
      passos: [{ min: 20, txt: 'Ouvir e registrar: durante a apresentação, o líder preenche a ficha. No último minuto, lê para o grupo e entrega.' }], campos: conexao() },
    { id: 'd2-queimadas', dia: 2, ini: '10:10', fim: '10:40', sessao: 'INPE · Programa Queimadas', tipo: 'plenaria', quem: 'INPE',
      conteudo: 'Apresentação dos dados, produtos, metodologias, sistemas e serviços do Programa Queimadas, com ênfase nas aplicações para monitoramento, prevenção, fiscalização e resposta.',
      resultado: 'Soluções do tema central do encontro analisadas à luz das demandas regionais.',
      papel: 'Ligar o que é apresentado às demandas do Dia 1.',
      passos: [{ min: 30, txt: 'Ouvir e registrar: durante a apresentação, o líder preenche a ficha. No último minuto, lê para o grupo e entrega.' }], campos: conexao() },
    { id: 'd2-int1', dia: 2, ini: '10:40', fim: '10:55', sessao: 'Intervalo', tipo: 'pausa' },
    { id: 'd2-sisfogo', dia: 2, ini: '10:55', fim: '12:30', sessao: 'SISFOGO e ADPF nº 743', tipo: 'plenaria', quem: 'MMA, Ibama/Prevfogo e áreas técnicas',
      conteudo: 'MMA, Ibama/Prevfogo e áreas técnicas apresentam finalidade, arquitetura, dados, requisitos, protocolos e caminhos de adesão ou interoperabilidade do SISFOGO com sistemas estaduais.',
      resultado: 'Requisitos, responsabilidades e caminhos de integração compreendidos; lacunas registradas.',
      nota: 'Na programação, esta sessão aparece em dois horários com o mesmo texto (10h55–11h15 e 11h15–12h30). O sistema trata como um bloco único até a confirmação da organização.',
      papel: 'Registrar requisitos de integração e o que falta para os estados aderirem.',
      passos: [{ min: 95, txt: 'Ouvir e registrar: durante a sessão, o líder registra requisitos, responsabilidades e lacunas. Ao final, lê para o grupo e entrega.' }],
      campos: [
        { k: 'requisitos', t: 'area', l: 'Requisitos e protocolos de integração apresentados', rows: 2 },
        { k: 'responsabilidades', t: 'area', l: 'Responsabilidades: quem faz o quê', rows: 2 },
        { k: 'situacao', t: 'area', l: 'Situação dos estados do grupo frente à adesão', rows: 2 },
        { k: 'lacuna', t: 'area', l: 'Lacunas de integração', rows: 2 },
        { k: 'pergunta', t: 'area', l: 'Pergunta do grupo', rows: 1 },
      ] },
    { id: 'd2-almoco', dia: 2, ini: '12:30', fim: '13:40', sessao: 'Almoço', tipo: 'pausa' },
    { id: 'd2-aplicacoes', dia: 2, ini: '13:40', fim: '15:10', sessao: 'Aplicações institucionais dos dados', tipo: 'plenaria', quem: 'Até cinco instituições convidadas',
      conteudo: 'Apresentações de até cinco instituições convidadas, com no mínimo 15 minutos cada, sobre usos da informação, necessidades de compartilhamento e resultados esperados; diálogo final para convergência.',
      resultado: 'Usos operacionais e institucionais conectados às soluções apresentadas.',
      papel: 'Um quadro por instituição: como usa a informação e o que precisa receber.',
      passos: [
        { min: 75, txt: 'Ouvir: até cinco apresentações de 15 minutos. O líder preenche um quadro por instituição.' },
        { min: 15, txt: 'Diálogo final para convergência.' },
      ],
      campos: [
        { k: 'inst', t: 'repeat', n: 5, item: 'Instituição', f: [
          { k: 'nome', t: 'line', l: 'Instituição' },
          { k: 'uso', t: 'area', l: 'Como usa a informação', rows: 2 },
          { k: 'necessidade', t: 'area', l: 'O que precisa receber dos estados ou do INPE', rows: 2 },
          { k: 'conexao', t: 'line', l: 'Solução da manhã que se conecta' },
        ] },
        { k: 'convergencia', t: 'area', l: 'Convergências do diálogo final', rows: 3 },
      ] },
    { id: 'd2-int2', dia: 2, ini: '15:10', fim: '15:25', sessao: 'Intervalo', tipo: 'pausa' },
    { id: 'd2-clinicas', dia: 2, ini: '15:25', fim: '16:35', sessao: 'Clínicas técnicas', tipo: 'grupo', quem: 'Grupos mistos',
      conteudo: 'Grupos mistos classificam as demandas: solução existente; ajuste ou desenvolvimento; integração com o SISFOGO; articulação institucional; ou capacitação.',
      resultado: 'Matriz demanda–solução–lacuna preenchida, com trilha de interoperabilidade.',
      papel: 'O grupo classifica as suas demandas do Dia 1, à luz do que foi apresentado no dia.',
      passos: [
        { min: 5, txt: 'Abrir: escolher o líder deste exercício. O líder apresenta as 5 categorias e as demandas do grupo.' },
        { min: 45, txt: 'Conversar: para cada demanda, o líder lê, o grupo decide a categoria e indica quem pode atender. Na dúvida, consultar o técnico do grupo.' },
        { min: 15, txt: 'Registrar: anotar a lacuna que permanece e, nas demandas de integração com o SISFOGO, o requisito.' },
        { min: 5, txt: 'Ler e entregar: o líder lê o registro em voz alta, o grupo confirma, define o porta-voz e entrega.' },
      ],
      campos: [
        { k: 'itens', t: 'clinica', n: 8, l: 'Classificação das demandas', o: ['Solução existente', 'Ajuste ou desenvolvimento', 'Integração com o SISFOGO', 'Articulação institucional', 'Capacitação'] },
        { k: 'portavoz', t: 'line', l: 'Porta-voz no painel de convergência' },
      ] },
    { id: 'd2-painel', dia: 2, ini: '16:35', fim: '17:15', sessao: 'Painel de convergência', tipo: 'plenaria', quem: 'Porta-vozes dos grupos',
      conteudo: 'Apresentação sintética dos grupos, identificação de demandas comuns, possibilidades de apoio e pontos ainda sem resposta.',
      resultado: 'Carteira preliminar de oportunidades e lacunas validada.',
      papel: 'O porta-voz apresenta a síntese da clínica. O líder registra o que a plenária indicar.',
      passos: [
        { min: 24, txt: 'Quatro porta-vozes, 6 minutos cada.' },
        { min: 16, txt: 'Identificação de demandas comuns, possibilidades de apoio e pontos ainda sem resposta.' },
      ],
      campos: [
        { k: 'comuns', t: 'area', l: 'Demandas comuns a mais de um grupo', rows: 3 },
        { k: 'apoio', t: 'area', l: 'Possibilidades de apoio citadas', rows: 3 },
        { k: 'semresposta', t: 'area', l: 'Pontos ainda sem resposta', rows: 3 },
      ] },

    // ---------------- DIA 3 ----------------
    { id: 'd3-sintese', dia: 3, ini: '09:00', fim: '09:30', sessao: 'Síntese executiva', tipo: 'plenaria', quem: 'Organização',
      conteudo: 'Apresentação da matriz consolidada dos dois primeiros dias.', resultado: 'Base comum para priorização.',
      papel: 'Conferir se as demandas do grupo estão corretas na matriz.',
      passos: [
        { min: 20, txt: 'Apresentação da matriz consolidada.' },
        { min: 10, txt: 'O grupo confere as próprias demandas e registra ajustes.' },
      ],
      campos: [
        { k: 'confere', t: 'choice', l: 'As demandas do grupo estão corretas na matriz?', o: ['Sim', 'Com ajustes'] },
        { k: 'ajustes', t: 'area', l: 'Ajustes', rows: 4 },
      ] },
    { id: 'd3-priorizacao', dia: 3, ini: '09:30', fim: '10:40', sessao: 'Priorização', tipo: 'grupo', quem: 'Grupos de trabalho',
      conteudo: 'Aplicação de critérios: relevância regional, urgência, impacto operacional, viabilidade, abrangência e dependências.',
      resultado: 'Demandas classificadas por prioridade e horizonte.',
      papel: 'O grupo dá nota de 1 a 3 a cada demanda, em cada critério, e define o horizonte.',
      passos: [
        { min: 5, txt: 'Abrir: escolher o líder deste exercício. O líder apresenta os 6 critérios e a escala de 1 a 3.' },
        { min: 50, txt: 'Conversar: para cada demanda, o líder lê um critério por vez e o grupo combina a nota. O líder soma o total.' },
        { min: 10, txt: 'Registrar: definir o horizonte de cada demanda (curto, médio ou longo prazo).' },
        { min: 5, txt: 'Ler e entregar: o líder lê as 3 demandas com maior pontuação, o grupo confirma e entrega.' },
      ],
      campos: [{ k: 'itens', t: 'priorizacao', n: 8, l: 'Pontuação das demandas',
        crit: ['Relevância regional', 'Urgência', 'Impacto operacional', 'Viabilidade', 'Abrangência', 'Dependências'],
        hz: ['Curto', 'Médio', 'Longo'] }] },
    { id: 'd3-int', dia: 3, ini: '10:40', fim: '11:00', sessao: 'Intervalo', tipo: 'pausa' },
    { id: 'd3-plano', dia: 3, ini: '11:00', fim: '12:30', sessao: 'Plano de seguimento', tipo: 'grupo', quem: 'Grupos de trabalho',
      conteudo: 'Definição de ações de curto, médio e longo prazo para dados, funcionalidades, capacitações, cooperação e interoperabilidade; indicação de responsáveis, parceiros, produtos e prazos.',
      resultado: 'Minuta do plano de seguimento, incluindo trilha SISFOGO/ADPF nº 743.',
      papel: 'Todos os grupos trabalham os cinco eixos: dados, funcionalidades, capacitações, cooperação e interoperabilidade (trilha SISFOGO/ADPF nº 743).',
      passos: [
        { min: 5, txt: 'Abrir: escolher o líder deste exercício. O líder lê as demandas priorizadas pelo grupo e os cinco eixos.' },
        { min: 60, txt: 'Conversar e registrar: ao menos uma ação por eixo, com o que fazer, horizonte, responsável, parceiros, produto e prazo indicativo.' },
        { min: 20, txt: 'Validação em plenária: cada grupo apresenta suas ações em 5 minutos.' },
        { min: 5, txt: 'Ler e entregar: registrar os ajustes da plenária, confirmar com o grupo e entregar.' },
      ],
      campos: [
        { k: 'acoes', t: 'repeat', n: 6, item: 'Ação', f: [
          { k: 'eixo', t: 'choice', l: 'Eixo', o: ['Dados', 'Funcionalidades', 'Capacitações', 'Cooperação', 'Interoperabilidade (SISFOGO/ADPF nº 743)'] },
          { k: 'acao', t: 'area', l: 'Ação', rows: 2 },
          { k: 'horizonte', t: 'choice', l: 'Horizonte', o: ['Curto', 'Médio', 'Longo'] },
          { k: 'responsavel', t: 'line', l: 'Responsável' },
          { k: 'parceiros', t: 'line', l: 'Parceiros' },
          { k: 'produto', t: 'line', l: 'Produto esperado' },
          { k: 'prazo', t: 'line', l: 'Prazo indicativo', w: 'short' },
        ] },
        { k: 'confirmar', t: 'area', l: 'Compromissos que dependem de confirmação institucional', rows: 3 },
      ] },
    { id: 'd3-encerramento', dia: 3, ini: '12:30', fim: '12:45', sessao: 'Encerramento', tipo: 'plenaria', quem: 'Organização',
      conteudo: 'Avaliação breve, compromissos imediatos e encerramento institucional.', resultado: 'Agenda de continuidade formalizada.',
      papel: 'O líder registra os compromissos do grupo. A avaliação é individual: cada participante responde a sua.',
      passos: [
        { min: 5, txt: 'Avaliação individual: cada participante responde a ficha impressa.' },
        { min: 5, txt: 'Compromissos imediatos do grupo, registrados pelo líder.' },
        { min: 5, txt: 'Encerramento institucional.' },
      ],
      campos: [
        { k: 'compromissos', t: 'area', l: 'Compromissos imediatos do grupo', rows: 3 },
        { k: 'sugestoes', t: 'area', l: 'Sugestões do grupo para a continuidade', rows: 3 },
      ],
      individual: { id: 'avaliacao', titulo: 'Avaliação individual do encontro', campos: [
        { k: 'aval', t: 'rating', l: 'Dê uma nota de 1 (muito baixo) a 5 (muito alto)', o: ['Os objetivos do encontro foram atingidos', 'O método favoreceu a participação', 'O tempo foi bem usado', 'Os resultados serão úteis no meu trabalho', 'A organização geral do encontro'] },
        { k: 'perfil', t: 'choice', l: 'Você representa', o: ['Estado', 'Órgão federal', 'Sistema de justiça', 'Defesa civil ou bombeiros', 'Pesquisa ou cooperação', 'Outro'] },
        { k: 'manter', t: 'area', l: 'O que devemos manter', rows: 2 },
        { k: 'melhorar', t: 'area', l: 'O que podemos melhorar', rows: 2 },
        { k: 'compromisso', t: 'area', l: 'Um compromisso que você leva do encontro', rows: 2 },
      ] } },
  ];


  // ---------- Versão simplificada: poucos campos, objetivos, no tempo da programação ----------
  const T4 = ['Dados e metodologias', 'Sistemas e interoperabilidade', 'Uso operacional e comunicação', 'Capacitação e cooperação'];
  const OVR = {
    'd1-credenciamento': { passos: [{ min: 30, txt: 'Cada pessoa se junta ao grupo indicado no seu crachá. O grupo escolhe o líder do primeiro exercício, que registra quem está presente.' }],
      campos: [{ k: 'lider', t: 'line', l: 'Líder do primeiro exercício', h: 'A liderança pode mudar a cada exercício' }, { k: 'estados', t: 'multi', l: 'Estados presentes no grupo', o: UFS }, { k: 'pessoas', t: 'line', l: 'Número de pessoas no grupo' }] },
    'd1-belem': { passos: [{ min: 40, txt: 'Ouvir a apresentação. O líder anota o que o grupo destaca e, no último minuto, lê para o grupo e entrega.' }],
      campos: [{ k: 'leva', t: 'area', l: 'O que levamos de Belém para os nossos estados', rows: 3 }, { k: 'diferente', t: 'area', l: 'O que é diferente na nossa realidade', rows: 3 }, { k: 'pergunta', t: 'area', l: 'Pergunta do grupo (indique para quem)', rows: 2 }] },
    'd1-estados1': { passos: [{ min: 75, txt: 'Ouvir as cinco apresentações. O líder preenche um quadro por estado.' }, { min: 45, txt: 'Diálogo orientado, com o Termômetro de Convergência ao fim de cada estado. O líder revisa e entrega.' }],
      campos: [{ k: 'estados', t: 'repeat', n: 5, item: 'Estado', f: [{ k: 'uf', t: 'select', l: 'Estado', o: UFS }, { k: 'destaque', t: 'area', l: 'Destaque (PMIF, sala de situação, dados, sistemas)', rows: 2 }, { k: 'desafio', t: 'area', l: 'Principal desafio', rows: 2 }, { k: 'demanda', t: 'line', l: 'Demanda apresentada' }] }] },
    'd1-estados2': { passos: [{ min: 60, txt: 'Ouvir as quatro apresentações. O líder preenche um quadro por estado.' }, { min: 45, txt: 'Diálogo comparativo, com o Termômetro ao fim de cada estado. O grupo combina o que é comum aos estados; o líder registra e entrega.' }],
      campos: [{ k: 'estados', t: 'repeat', n: 4, item: 'Estado', f: [{ k: 'uf', t: 'select', l: 'Estado', o: UFS }, { k: 'destaque', t: 'area', l: 'Destaque (PMIF, sala de situação, dados, sistemas)', rows: 2 }, { k: 'desafio', t: 'area', l: 'Principal desafio', rows: 2 }, { k: 'demanda', t: 'line', l: 'Demanda apresentada' }] }, { k: 'comuns', t: 'area', l: 'O que é comum aos estados', rows: 3 }] },
    'd1-grupos': { papel: 'Todos os grupos passam pelos quatro temas. Cada pessoa fala a partir da realidade do seu estado ou instituição.',
      passos: [{ min: 5, txt: 'Escolher o líder e ler o que o exercício pede.' }, { min: 48, txt: 'Quatro temas, 12 minutos cada: rodada de 1 minuto por pessoa (o líder marca o tempo) e, em seguida, o grupo escolhe uma demanda; o líder registra.' }, { min: 12, txt: 'Marcar a prioridade das demandas, escrever as perguntas para o Dia 2, ler em voz alta e entregar.' }],
      campos: [{ k: 'demandas', t: 'repeat', n: 4, item: 'Tema', titles: T4, f: [{ k: 'desafio', t: 'area', l: 'Principal desafio apontado pelo grupo', rows: 2 }, { k: 'problema', t: 'area', l: 'Demanda: o que precisamos', rows: 2 }, { k: 'prioridade', t: 'choice', l: 'Prioridade', o: ['Alta', 'Média', 'Baixa'] }] }, { k: 'pergunta', t: 'area', l: 'Perguntas para o Dia 2 (indique para quem)', rows: 3 }, { k: 'portavoz', t: 'line', l: 'Porta-voz na síntese do dia' }] },
    'd1-sintese': { campos: [{ k: 'ajustes', t: 'area', l: 'Ajustes e perguntas novas que surgiram na plenária', rows: 4 }] },
    'd2-sisfogo': { passos: [{ min: 95, txt: 'Ouvir a sessão. O líder registra o que os estados precisam fazer para se integrar e o que falta; no final, lê para o grupo e entrega.' }],
      campos: [{ k: 'precisa', t: 'area', l: 'O que os estados precisam fazer para se integrar ao SISFOGO', rows: 4 }, { k: 'falta', t: 'area', l: 'O que falta ou dificulta a integração', rows: 3 }, { k: 'pergunta', t: 'area', l: 'Pergunta do grupo', rows: 2 }] },
    'd2-aplicacoes': { passos: [{ min: 75, txt: 'Ouvir até cinco apresentações. O líder preenche um quadro por instituição.' }, { min: 15, txt: 'Diálogo final de convergência. O líder revisa e entrega.' }],
      campos: [{ k: 'inst', t: 'repeat', n: 5, item: 'Instituição', compact: true, f: [{ k: 'nome', t: 'line', l: 'Instituição' }, { k: 'uso', t: 'area', l: 'Como usa a informação e o que precisa receber', rows: 2 }] }] },
    'd2-clinicas': { passos: [{ min: 5, txt: 'Escolher o líder e ler as 5 categorias.' }, { min: 55, txt: 'Para cada demanda do grupo: o líder lê, o grupo decide a categoria e indica quem pode atender e o que ainda falta.' }, { min: 10, txt: 'Ler em voz alta, definir o porta-voz e entregar.' }] },
    'd2-painel': { campos: [{ k: 'comuns', t: 'area', l: 'Demandas comuns a mais de um grupo', rows: 3 }, { k: 'semresposta', t: 'area', l: 'O que ainda está sem resposta', rows: 3 }] },
    'd3-sintese': { passos: [{ min: 20, txt: 'Apresentação da matriz consolidada.' }, { min: 10, txt: 'O grupo confere as próprias demandas e registra ajustes.' }] },
    'd3-priorizacao': { passos: [{ min: 5, txt: 'Escolher o líder e ler os 6 critérios.' }, { min: 55, txt: 'Para cada demanda, o grupo combina uma nota de 1 a 3 em cada critério e o horizonte. O líder soma o total.' }, { min: 10, txt: 'Ler as 3 demandas mais pontuadas e entregar.' }] },
    'd3-plano': { papel: 'O grupo transforma as demandas priorizadas em ações pelo método 5W2H, uma ação por eixo.',
      passos: [{ min: 5, txt: 'Escolher o líder e ler o 5W2H.' }, { min: 60, txt: 'Uma ação por eixo, 12 minutos cada: o quê, por quê, quem, onde, quando, como e quanto.' }, { min: 20, txt: 'Validação em plenária: cada grupo apresenta em 5 minutos.' }, { min: 5, txt: 'Registrar os ajustes da plenária e entregar.' }],
      campos: [{ k: 'acoes', t: 'repeat', n: 5, item: 'Eixo', titles: ['Dados', 'Funcionalidades', 'Capacitações', 'Cooperação', 'Interoperabilidade (trilha SISFOGO/ADPF nº 743)'], f: [
        { k: 'oque', t: 'area', l: 'O quê (What): a ação', rows: 1 }, { k: 'porque', t: 'line', l: 'Por quê (Why): a demanda que resolve' }, { k: 'quem', t: 'line', l: 'Quem (Who): instituição responsável e parceiros' },
        { k: 'onde', t: 'line', l: 'Onde (Where): estados ou territórios' }, { k: 'quando', t: 'line', l: 'Quando (When): prazo indicativo' }, { k: 'como', t: 'line', l: 'Como (How): primeiros passos' }, { k: 'quanto', t: 'line', l: 'Quanto (How much): recursos ou fonte' }] }] },
    'd3-encerramento': { campos: [{ k: 'compromissos', t: 'area', l: 'Compromissos imediatos do grupo', rows: 3 }] },
  };
  ['d2-bdc', 'd2-sala', 'd2-biomas', 'd2-queimadas'].forEach(id => { OVR[id] = { passos: [{ min: ETAPAS.find(e => e.id === id).passos[0].min, txt: 'Ouvir a apresentação. O líder registra o que serve para os estados do grupo e o que falta; no último minuto, lê e entrega.' }],
    campos: [{ k: 'serve', t: 'area', l: 'O que serve para os nossos estados', rows: 3 }, { k: 'falta', t: 'area', l: 'O que ainda falta', rows: 2 }, { k: 'pergunta', t: 'area', l: 'Pergunta do grupo', rows: 1 }] }; });

  // ---------- Cronograma atualizado ----------
  const T5 = ['Dados e metodologias', 'Sistemas e interoperabilidade', 'Uso operacional', 'Cooperação institucional', 'Capacitação'];
  const CAT6 = ['Inexistente, a ser desenvolvida', 'Existente e suficiente', 'Existente, mas necessita de ajustes', 'Existente, mas dependente de integração com o SISFOGO', 'Existente, mas dependente de articulação institucional', 'Existente, mas necessita de capacitação'];
  Object.assign(OVR['d1-estados1'], { quem: 'Cinco estados (20 min cada)',
    conteudo: 'Apresentações de 5 estados (20 minutos por estado) + 20 minutos de perguntas e discussões.',
    passos: [{ min: 100, txt: 'Ouvir as cinco apresentações, 20 minutos cada. O líder preenche um quadro por estado. Termômetro de Convergência ao fim de cada estado (30 segundos).' }, { min: 20, txt: 'Perguntas e discussões. O líder revisa o registro e entrega.' }] });
  Object.assign(OVR['d1-estados2'], { ini: '13:30', fim: '15:10', quem: 'Quatro estados (20 min cada)',
    conteudo: 'Apresentações de 4 estados (20 minutos por estado) + 20 minutos de perguntas e discussões.',
    passos: [{ min: 80, txt: 'Ouvir as quatro apresentações, 20 minutos cada. O líder preenche um quadro por estado. Termômetro ao fim de cada estado.' }, { min: 20, txt: 'Perguntas e discussões. O grupo combina o que é comum aos estados; o líder registra e entrega.' }] });
  OVR['d1-estados2'].campos[0] = { ...OVR['d1-estados2'].campos[0], n: 5, h: 'O quinto quadro fica reservado para o Piauí ou outro estado, caso a programação inclua mais uma apresentação.' };
  OVR['d1-int2'] = { ini: '15:10', fim: '15:30' };
  Object.assign(OVR['d1-grupos'], { conteudo: 'Divisão em grupos para discutir os temas: dados e metodologias; sistemas e interoperabilidade; uso operacional; cooperação institucional; capacitação.',
    papel: 'Todos os grupos passam pelos cinco temas. Cada pessoa fala a partir da realidade do seu estado ou instituição.',
    passos: [{ min: 5, txt: 'Escolher o líder e ler o que o exercício pede.' }, { min: 50, txt: 'Cinco temas, 10 minutos cada: rodada com uma fala de até 1 minuto por estado ou instituição presente (o líder marca o tempo) e o grupo escolhe uma demanda; o líder registra.' }, { min: 10, txt: 'Marcar a prioridade das demandas, escrever as perguntas para o Dia 2, ler em voz alta e entregar.' }] });
  OVR['d1-grupos'].campos[0] = { ...OVR['d1-grupos'].campos[0], n: 5, titles: T5 };
  OVR['d1-sintese'] = { ...(OVR['d1-sintese'] || {}), conteudo: 'Consolidação das contribuições das apresentações; formulação das questões a serem respondidas pelo INPE e pelas demais instituições.' };
  OVR['d2-int1'] = { ini: '10:40', fim: '11:00' };
  Object.assign(OVR['d2-aplicacoes'], { ini: '11:00', fim: '12:30', quem: 'MMA, Ibama/Prevfogo e ICMBio (20 min cada)',
    conteudo: 'Apresentações do MMA, Ibama/Prevfogo e ICMBio (20 minutos cada) sobre usos da informação, necessidades de compartilhamento e resultados esperados + 30 minutos de diálogo final para convergência.',
    passos: [{ min: 60, txt: 'Ouvir as três apresentações, 20 minutos cada. O líder preenche um quadro por instituição.' }, { min: 30, txt: 'Diálogo final de convergência. O líder revisa e entrega.' }],
    campos: [{ k: 'inst', t: 'repeat', n: 3, item: 'Instituição', titles: ['MMA', 'Ibama/Prevfogo', 'ICMBio'], f: [{ k: 'uso', t: 'area', l: 'Como usa a informação e o que precisa receber dos estados', rows: 3 }] }] });
  Object.assign(OVR['d2-sisfogo'], { ini: '13:40', fim: '15:10', quem: 'MMA, ICMBio, Ibama/Prevfogo e áreas técnicas',
    conteudo: 'MMA, ICMBio, Ibama/Prevfogo e áreas técnicas apresentam finalidade, arquitetura, dados, requisitos, protocolos e caminhos de adesão ou interoperabilidade do SISFOGO com sistemas estaduais.',
    nota: 'Na programação, esta sessão aparece em dois blocos com o mesmo texto (13h40–14h25 e 14h25–15h10). O sistema trata como um exercício único.',
    passos: [{ min: 90, txt: 'Ouvir a sessão. O líder registra o que os estados precisam fazer para se integrar e o que falta; no final, lê para o grupo e entrega.' }] });
  Object.assign(OVR['d2-clinicas'], { conteudo: 'Grupos mistos identificam e classificam demandas entre: inexistente, a ser desenvolvida; existente e suficiente; existente, mas que necessita de ajustes; existente, mas dependente de integração com o SISFOGO; existente, mas dependente de articulação institucional; existente, mas necessita de capacitação.',
    passos: [{ min: 5, txt: 'Escolher o líder e ler as 6 categorias.' }, { min: 55, txt: 'Para cada demanda do grupo: o líder lê, o grupo decide a categoria e indica quem pode atender e o que ainda falta.' }, { min: 10, txt: 'Ler em voz alta, definir o porta-voz e entregar.' }] });
  OVR['d2-clinicas'].catOverride = CAT6;


  // ---------- Levantamento prévio (questionário respondido pelos estados) ----------
  const LINHAS = ['Focos de calor', 'Áreas queimadas', 'Prevenção', 'Manejo Integrado do Fogo', 'Queima prescrita ou controlada', 'Fiscalização', 'Educação ambiental', 'Planejamento territorial', 'Resposta e combate', 'Recuperação de áreas'];
  const DADOS12 = ['focos de calor em tempo real', 'áreas queimadas', 'cobertura e uso da terra', 'desmatamento', 'meteorologia e previsão', 'seca e indicadores climáticos', 'CAR', 'unidades de conservação', 'terras indígenas', 'assentamentos', 'infraestrutura e logística de resposta', 'histórico de incêndios'];
  // ---------- Profundidade técnica: perguntas orientadoras por tema e campos da matriz ----------
  const G5 = [
    ['Dos 12 conjuntos de dados do levantamento prévio (focos em tempo real, áreas queimadas, uso da terra, desmatamento, meteorologia, seca, CAR, UCs, TIs, assentamentos, logística, histórico), quais o estado usa e quais faltam?', 'Há séries históricas e metodologias padronizadas para comparar anos e municípios?', 'Que dado, se existisse amanhã, mudaria a decisão do estado?'],
    ['Que sistemas estaduais existem para o fogo e quem os mantém? No levantamento, a integração com sistemas federais foi marcada como sim, não ou parcial: por quê?', 'Eles trocam dados com sistemas federais (Programa Queimadas, SISFOGO)? Em que formato?', 'O que impede a integração: padrão de dados, API, infraestrutura ou acordo?'],
    ['Como o dado chega a quem decide e a quem está em campo (brigadas, fiscalização, defesa civil)?', 'Em quanto tempo o alerta vira ação?', 'Que painéis, alertas ou relatórios faltam na rotina operacional?'],
    ['Que acordos existem entre estado, órgãos federais, municípios e outras instituições?', 'Onde há sobreposição ou vazio de competências?', 'Que articulação destravaria uma demanda do grupo?'],
    ['Que competências faltam nas equipes (geoprocessamento, uso de plataformas, análise de dados)?', 'Quem precisa ser capacitado: técnicos, gestores ou equipes de campo?', 'Que formato funciona melhor: curso, mentoria, material de referência?'],
  ];
  OVR['d1-grupos'].campos[0] = { ...OVR['d1-grupos'].campos[0], guias: G5, f: [
    { k: 'desafio', t: 'area', l: 'Principal desafio apontado pelos estados e instituições do grupo', rows: 3 },
    { k: 'problema', t: 'area', l: 'Demanda: o que precisamos', rows: 2 },
    { k: 'usuario', t: 'line', l: 'Para quem e para quê', h: 'Quem usa e com que finalidade' },
    { k: 'competente', t: 'line', l: 'Quem pode atender', h: 'Instituição, produto ou sistema' },
    { k: 'prioridade', t: 'choice', l: 'Prioridade', o: ['Alta', 'Média', 'Baixa'] }] };
  const ESTADO_F = [{ k: 'uf', t: 'select', l: 'Estado', o: UFS },
    { k: 'programas', t: 'area', l: 'Programas e ações de gestão integrada do fogo: iniciativas, objetivos e instituições envolvidas', rows: 2 },
    { k: 'linhas', t: 'multi', l: 'Linhas de ação citadas na apresentação', o: LINHAS },
    { k: 'ferramentas', t: 'line', l: 'Ferramentas e sistemas mais usados (satélite, painéis, drones, aplicativos, sistemas estaduais e federais)' },
    { k: 'integracao', t: 'choice', l: 'Integração com sistemas federais e de outras instituições', o: ['Sim', 'Parcial', 'Não', 'Não informado'] },
    { k: 'desafio', t: 'area', l: 'Principal desafio, incluindo dificuldades de acesso, integração ou uso de dados', rows: 2 },
    { k: 'pratica', t: 'line', l: 'Prática que vale compartilhar' },
    { k: 'demanda', t: 'area', l: 'Demanda apresentada', rows: 2 }];
  OVR['d1-estados1'].campos[0].f = ESTADO_F; OVR['d1-estados2'].campos[0].f = ESTADO_F;
  OVR['d1-belem'].campos = [{ k: 'leva', t: 'area', l: 'O que levamos de Belém para os nossos estados', rows: 3 }, { k: 'lacunas', t: 'area', l: 'Lacunas e prioridades apontadas no levantamento que também são nossas', rows: 3 }, { k: 'diferente', t: 'area', l: 'O que é diferente na nossa realidade', rows: 2 }, { k: 'pergunta', t: 'area', l: 'Pergunta do grupo (indique para quem)', rows: 2 }];
  ['d2-bdc', 'd2-sala', 'd2-biomas', 'd2-queimadas'].forEach(id => { OVR[id].campos = [{ k: 'serve', t: 'area', l: 'O que serve para os nossos estados', rows: 3 }, { k: 'condicao', t: 'area', l: 'Condição para usarmos (acesso, capacitação, infraestrutura, acordo)', rows: 2 }, { k: 'falta', t: 'area', l: 'O que ainda falta', rows: 2 }, { k: 'pergunta', t: 'area', l: 'Pergunta do grupo', rows: 1 }]; });
  OVR['d2-sisfogo'].campos = [{ k: 'precisa', t: 'area', l: 'O que os estados precisam fazer para se integrar ao SISFOGO (dados, formato, protocolos)', rows: 4 }, { k: 'responsabilidades', t: 'area', l: 'Responsabilidades: o que é do estado e o que é federal', rows: 3 }, { k: 'falta', t: 'area', l: 'O que falta ou dificulta a integração', rows: 3 }, { k: 'pergunta', t: 'area', l: 'Pergunta do grupo', rows: 2 }];
  OVR['d2-aplicacoes'].campos = [{ k: 'inst', t: 'repeat', n: 3, item: 'Instituição', titles: ['MMA', 'Ibama/Prevfogo', 'ICMBio'], f: [{ k: 'uso', t: 'area', l: 'Como usa a informação sobre fogo', rows: 2 }, { k: 'precisa', t: 'area', l: 'O que precisa receber dos estados, com que frequência e formato', rows: 2 }, { k: 'conexao', t: 'line', l: 'Solução apresentada pela manhã que se conecta' }] }, { k: 'convergencia', t: 'area', l: 'Convergências do diálogo final', rows: 3 }];
  OVR['d2-painel'].campos = [{ k: 'comuns', t: 'area', l: 'Demandas comuns a mais de um grupo', rows: 3 }, { k: 'apoio', t: 'area', l: 'Possibilidades de apoio citadas pelas instituições', rows: 3 }, { k: 'semresposta', t: 'area', l: 'O que ainda está sem resposta', rows: 3 }];
  OVR['d3-encerramento'].campos = [{ k: 'compromissos', t: 'area', l: 'Compromissos imediatos do grupo', rows: 3 }, { k: 'continuidade', t: 'area', l: 'Sugestões para a continuidade da agenda', rows: 2 }];
  // ---------- Grupos com cores repetidas (2 por cor) ----------
  OVR['d1-credenciamento'].passos = [{ min: 30, txt: 'No credenciamento, cada pessoa recebe a indicação do seu grupo. A equipe distribui as pessoas para que cada grupo misture estados e instituições. O grupo escolhe o líder do primeiro exercício, que preenche a lista de participantes: nome e estado ou instituição de cada pessoa.' }];
  OVR['d1-credenciamento'].campos = [{ k: 'lider', t: 'line', l: 'Líder do primeiro exercício', h: 'A liderança pode mudar a cada exercício' }, { k: 'participantes', t: 'lista', n: 12, l: 'Participantes do grupo', h: 'Até 12 pessoas. O número de cada pessoa é usado para marcar a presença nos exercícios seguintes.' }];
  OVR['d1-credenciamento'].papel = 'O grupo se reúne no seu espaço e registra cada participante: nome e estado ou instituição.';
  OVR['d1-sintese'].papel = 'O porta-voz apresenta, em até 2 minutos, a demanda mais prioritária e 1 pergunta do grupo, sem repetir o que outro grupo já disse. O líder registra os ajustes e as perguntas novas.';
  OVR['d2-painel'].papel = 'O porta-voz apresenta, em até 3 minutos, a síntese da clínica do grupo. O líder registra o que a plenária indicar.';
  OVR['d1-sintese'].passos = [{ min: 16, txt: `Porta-vozes dos grupos, até 2 minutos cada, com o tempo dividido igualmente entre os grupos: a demanda mais prioritária do grupo e 1 pergunta para o Dia 2. O que outro grupo já disse não se repete: basta dizer "concordamos com o grupo tal" e acrescentar o que é novo.` }, { min: 14, txt: 'Formulação das questões para o INPE e demais instituições, conduzida pela organização. O líder registra os ajustes e as perguntas novas e entrega.' }];
  OVR['d2-painel'].passos = [{ min: 24, txt: `Porta-vozes dos grupos, até 3 minutos cada, com o tempo dividido igualmente entre os grupos: a síntese da clínica do grupo, sem repetir o que outro grupo já apresentou.` }, { min: 16, txt: 'Identificação de demandas comuns, possibilidades de apoio e pontos ainda sem resposta. O líder registra e entrega.' }];
  OVR['d3-plano'].passos = [{ min: 5, txt: 'Escolher o líder e ler o 5W2H.' }, { min: 60, txt: 'Uma ação por eixo, 12 minutos cada: o quê, por quê, quem, onde, quando, como e quanto.' }, { min: 16, txt: 'Validação em plenária: cada grupo apresenta suas ações em até 2 minutos, com o tempo dividido igualmente entre os grupos.' }, { min: 9, txt: 'Registrar os ajustes da plenária, ler para o grupo e entregar.' }];
  // ---------- Credenciamento: atividade da organização (UNODC), não é exercício ----------
  Object.assign(OVR['d1-credenciamento'], { campos: [], quem: 'Organização (UNODC)', papel: 'Credenciamento feito pela organização. Cada participante recebe a indicação do seu grupo.',
    passos: [{ min: 30, txt: 'Credenciamento conduzido pela organização. Cada participante recebe a indicação do seu grupo e se junta a ele.' }] });
  ETAPAS.forEach(e => Object.assign(e, OVR[e.id] || {}));
  ETAPAS.forEach(e => { if (e.catOverride) { e.campos = e.campos.map(f => f.t === 'clinica' ? { ...f, o: e.catOverride } : f); delete e.catOverride; } });
  const _m = (h) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };
  ETAPAS.sort((a, b) => a.dia - b.dia || _m(a.ini) - _m(b.ini));

  const TEMAS = {
    'd1-credenciamento': 'Composição dos grupos', 'd1-abertura': 'Objetivos, método e produtos', 'd1-belem': 'Linha de base regional',
    'd1-estados1': 'Diagnóstico dos estados', 'd1-estados2': 'Diagnóstico dos estados', 'd1-grupos': 'Demandas por tema', 'd1-sintese': 'Demanda regional qualificada',
    'd2-retomada': 'Agenda técnica do dia', 'd2-bdc': 'Soluções do INPE', 'd2-sala': 'Soluções do INPE', 'd2-biomas': 'Soluções do INPE', 'd2-queimadas': 'Soluções do INPE',
    'd2-sisfogo': 'Interoperabilidade', 'd2-aplicacoes': 'Usos institucionais dos dados', 'd2-clinicas': 'Matriz demanda–solução–lacuna', 'd2-painel': 'Carteira de oportunidades e lacunas',
    'd3-sintese': 'Matriz consolidada', 'd3-priorizacao': 'Prioridades e horizontes', 'd3-plano': 'Plano de seguimento', 'd3-encerramento': 'Avaliação e continuidade',
  };
  const OBSERVE = {
    'd1-credenciamento': ['Juntar-se ao grupo indicado no credenciamento', 'Escolher o líder do primeiro exercício', 'Preencher a lista com nome e estado ou instituição de cada pessoa'],
    'd1-belem': ['Como a SEMAS/PA organiza o fluxo do alerta à resposta', 'O que o levantamento prévio mostrou sobre iniciativas, ferramentas, integração de sistemas e dados prioritários', 'Que lacunas e dificuldades de acesso a dados o levantamento revelou'],
    'd1-estados1': ['PMIF: existe, está vigente, quem coordena', 'Sala de situação: estrutura, rotina e quem decide', 'O que a apresentação confirma ou acrescenta ao levantamento prévio do estado'],
    'd1-estados2': ['O que se repete entre os estados', 'O que é próprio de cada território (bioma, logística, estrutura)', 'Práticas que outros estados poderiam adotar'],
    'd1-grupos': ['Todos falam a partir da realidade do seu estado ou instituição', 'Uma demanda boa diz o que falta, para quem e para quê', 'Use as perguntas de cada tema para orientar a rodada'],
    'd1-sintese': ['Anotar o que outros grupos trouxeram de parecido', 'Registrar perguntas novas para o Dia 2'],
    'd2-bdc': ['Que bases e séries históricas estão disponíveis', 'O que o estado precisa ter para usar a plataforma', 'Qual demanda do Dia 1 pode ser atendida'],
    'd2-sala': ['Fluxos de acompanhamento e decisão', 'Como os estados podem se conectar ou receber apoio'],
    'd2-biomas': ['Produtos de monitoramento por bioma e sua periodicidade', 'Aplicações diretas para fiscalização e planejamento estadual'],
    'd2-queimadas': ['Focos, risco de fogo, área queimada: o que cada produto entrega', 'Aplicações em prevenção, fiscalização e resposta', 'O que ainda não atende os estados'],
    'd2-sisfogo': ['Que dados os estados precisam enviar e em que formato', 'Responsabilidades de cada esfera', 'Caminhos de adesão e prazos'],
    'd2-aplicacoes': ['Como cada instituição usa a informação sobre fogo', 'O que precisa receber, de quem e com que frequência'],
    'd2-clinicas': ['Cada demanda recebe uma única categoria, a que melhor descreve a situação hoje', 'Use o que foi apresentado pelo INPE, MMA, Ibama/Prevfogo e ICMBio como referência', 'Registre a lacuna mesmo quando a solução já existe'],
    'd2-painel': ['Demandas que aparecem em mais de um grupo', 'Apoios oferecidos pelas instituições', 'O que continua sem resposta'],
    'd3-sintese': ['Conferir se as demandas do grupo estão bem descritas', 'Apontar o que faltou ou ficou duplicado'],
    'd3-priorizacao': ['Relevância regional: quantos estados a demanda alcança · Urgência: o custo de esperar a próxima temporada de fogo', 'Impacto operacional: quanto muda a resposta em campo · Viabilidade: recursos e capacidade existentes', 'Abrangência: quantos usuários e instituições · Dependências: 3 = depende de poucos fatores externos'],
    'd3-plano': ['O quê: começa com verbo e gera um produto concreto', 'Quem: uma instituição responsável, não uma pessoa', 'Quando e quanto: prazo indicativo realista e fonte de recursos conhecida ou a buscar'],
    'd3-encerramento': ['Compromissos imediatos e quem os assume', 'Avaliação individual de cada participante'],
  };
  const PEDE = {
    'd1-credenciamento': ['Registrar quem compõe o grupo: nome e estado ou instituição de cada pessoa.', 'Lista de participantes (até 12) e líder'],
    'd1-belem': ['Anotar o que o grupo leva da experiência de Belém e o que é diferente na sua realidade.', '2 registros e 1 pergunta'],
    'd1-estados1': ['Para cada um dos 5 estados: um destaque, o principal desafio e a demanda.', '5 quadros de estado'],
    'd1-estados2': ['Para cada um dos 4 estados: o mesmo quadro. Depois, o que é comum aos estados. O quinto quadro fica reservado para o Piauí ou outro estado, se houver mais uma apresentação.', 'Quadros de estado e o que é comum'],
    'd1-grupos': ['Em cada um dos cinco temas, registrar o principal desafio e uma demanda do grupo.', '5 demandas (uma por tema) e as perguntas para o Dia 2'],
    'd1-sintese': ['Ouvir os outros grupos e anotar ajustes e perguntas novas.', 'Ajustes e perguntas para o Dia 2'],
    'd2-bdc': ['Registrar o que a solução apresentada serve para os estados do grupo e o que ainda falta.', 'O que serve, o que falta e 1 pergunta'],
    'd2-sala': ['Registrar o que a solução apresentada serve para os estados do grupo e o que ainda falta.', 'O que serve, o que falta e 1 pergunta'],
    'd2-biomas': ['Registrar o que a solução apresentada serve para os estados do grupo e o que ainda falta.', 'O que serve, o que falta e 1 pergunta'],
    'd2-queimadas': ['Registrar o que a solução apresentada serve para os estados do grupo e o que ainda falta.', 'O que serve, o que falta e 1 pergunta'],
    'd2-sisfogo': ['Registrar o que os estados precisam fazer para se integrar ao SISFOGO e o que falta.', 'O que fazer, o que falta e 1 pergunta'],
    'd2-aplicacoes': ['Registrar como cada instituição usa a informação e o que precisa receber.', 'Um quadro curto por instituição'],
    'd2-clinicas': ['Classificar cada demanda do grupo em uma das 6 categorias e indicar quem pode atender.', 'Matriz demanda–solução–lacuna do grupo'],
    'd2-painel': ['Ouvir os outros grupos e anotar o que é comum e o que segue sem resposta.', 'Demandas comuns e pontos sem resposta'],
    'd3-sintese': ['Conferir se as demandas do grupo estão corretas na matriz consolidada.', 'Confirmação ou ajustes'],
    'd3-priorizacao': ['Dar nota de 1 a 3 para cada demanda nos 6 critérios e definir o horizonte.', 'Demandas pontuadas e com horizonte'],
    'd3-plano': ['Montar uma ação por eixo no formato 5W2H: o quê, por quê, quem, onde, quando, como e quanto.', '5 ações em 5W2H, uma por eixo'],
    'd3-encerramento': ['Registrar os compromissos imediatos do grupo. A avaliação é individual.', 'Compromissos do grupo'],
  };
  const RITUAL = ['Ouvir: cada estado ou instituição presente fala uma vez, em até 1 minuto', 'Conversar: o grupo combina o que registrar', 'Registrar e entregar: o líder escreve, lê em voz alta e o grupo confirma'];
  // ================= Ajustes de 13/11: grupos por número, temas, clínicas, UNODC no Exercício 1, 5W2H =================
  const TEMAS5 = ['Dados e Metodologias', 'Sistemas e Interoperabilidade', 'Uso Operacional', 'Cooperação Institucional', 'Capacitação'];
  const TEMA_COR = ['#1F5E8C', '#2E7D5B', '#B5651D', '#6B3FA0', '#A23B2A'];
  const CLINICAS = [
    { nome: 'Inexistente, a ser desenvolvida', foco: 'Demandas para as quais ainda não existe solução.',
      produz: 'Para cada demanda: o que precisa ser desenvolvido, quem poderia desenvolver, requisitos mínimos e como a nova solução deverá se integrar ao SISFOGO.',
      extra: [{ k: 'desenvolver', t: 'area', l: 'O que precisa ser desenvolvido e requisitos mínimos', rows: 2 }, { k: 'quem', t: 'line', l: 'Quem poderia desenvolver' }] },
    { nome: 'Existente e suficiente', foco: 'Demandas já atendidas por soluções disponíveis.',
      produz: 'Para cada demanda: a solução que atende, quem a oferece, como os estados acessam e o que falta para o uso ser amplo (divulgação, acesso, rotina).',
      extra: [{ k: 'acesso', t: 'area', l: 'Como os estados acessam e o que falta para o uso ser amplo', rows: 2 }] },
    { nome: 'Existente, mas necessita de ajustes', foco: 'Soluções que existem, mas não atendem plenamente.',
      produz: 'Para cada demanda: a solução existente, o ajuste necessário, quem pode fazer o ajuste e o efeito esperado para os estados.',
      extra: [{ k: 'ajuste', t: 'area', l: 'Ajuste necessário e efeito esperado', rows: 2 }, { k: 'quem', t: 'line', l: 'Quem pode fazer o ajuste' }] },
    { nome: 'Existente, mas dependente de integração com o SISFOGO', foco: 'Soluções que só atendem plenamente se integradas ao SISFOGO.',
      produz: 'Para cada demanda: o sistema ou dado envolvido, o requisito de integração (dados, formato, protocolo), o que cabe ao estado e o que cabe à esfera federal, e o passo seguinte da trilha SISFOGO/ADPF nº 743.',
      extra: [{ k: 'requisito', t: 'area', l: 'Requisito de integração: dados, formato e protocolo', rows: 2 }, { k: 'responsabilidade', t: 'line', l: 'O que cabe ao estado e o que cabe à esfera federal' }] },
    { nome: 'Existente, mas dependente de articulação institucional', foco: 'Soluções que dependem de acordo ou coordenação entre instituições.',
      produz: 'Para cada demanda: as instituições envolvidas, o instrumento necessário (acordo, termo de cooperação, norma) e quem lidera a articulação.',
      extra: [{ k: 'instituicoes', t: 'line', l: 'Instituições envolvidas' }, { k: 'instrumento', t: 'line', l: 'Instrumento necessário e quem lidera a articulação' }] },
    { nome: 'Existente, mas necessita de capacitação', foco: 'Soluções que existem, mas não são usadas por falta de capacitação.',
      produz: 'Para cada demanda: quem precisa ser capacitado, em qual competência, em que formato e quem pode capacitar.',
      extra: [{ k: 'publico', t: 'line', l: 'Quem precisa ser capacitado e em qual competência' }, { k: 'formato', t: 'line', l: 'Formato e quem pode capacitar' }] },
  ];
  const NGR = 10;
  GRUPOS.length = 0;
  for (let i = 0; i < NGR; i++) {
    const n = i + 1, tm = (i % 5) + 1, cl = (i % 6) + 1;
    GRUPOS.push({ id: 'mesa' + String(n).padStart(2, '0'), num: n, papel: `Grupo ${n}`, nome: `Grupo ${n} · ${TEMAS5[tm - 1]}`, tema: tm, temaNome: TEMAS5[tm - 1],
      clinica: cl, clinicaNome: CLINICAS[cl - 1].nome, cor: TEMA_COR[tm - 1], corNome: '', base: '', mesa: String(n), eixo: TEMAS5[tm - 1] });
  }
  const GUNODC = { id: 'unodc', num: 0, papel: 'UNODC', nome: 'UNODC, INPE e SEMAS/PA', tema: null, temaNome: '', cor: '#0B4F7C', corNome: '', base: '', mesa: '', eixo: '' };
  const temaTxt = (g) => g && g.tema ? `Tema ${g.tema} · ${g.temaNome}` : 'Tema do grupo';
  const P = (id) => ETAPAS.find(e => e.id === id);

  // Dia 1 · Estados bloco 1: registrado pela UNODC com INPE e SEMAS/PA
  Object.assign(P('d1-estados1'), { resp: 'unodc', papel: 'Exercício registrado pela UNODC, com o INPE e a SEMAS/PA, durante as apresentações. Os grupos acompanham as apresentações e o Termômetro de Convergência.',
    passos: [{ min: 100, txt: 'Apresentações de 5 estados, 20 minutos cada. A UNODC, com o INPE e a SEMAS/PA, preenche um quadro por estado. Termômetro de Convergência ao fim de cada estado (cartões verde, amarelo e vermelho).' }, { min: 20, txt: 'Perguntas e discussões. A UNODC registra os pontos principais e envia.' }] });
  P('d1-estados1').campos = [P('d1-estados1').campos[0], { k: 'discussao', t: 'area', l: 'Perguntas e discussões: pontos principais', rows: 4 }];
  // Dia 1 · Dinâmica do barbante (13h30–13h45) e bloco 2 dos Estados (13h45–15h10)
  ETAPAS.push({ id: 'd1-barbante', dia: 1, ini: '13:30', fim: '13:45', sessao: 'Dinâmica do barbante colorido', tipo: 'plenaria', quem: 'Facilitação',
    conteudo: 'Dinâmica de grupo com barbantes coloridos para evidenciar as conexões entre participantes, estados e instituições.',
    resultado: 'Conexões entre participantes, estados e instituições evidenciadas.', papel: 'Participar da dinâmica conduzida pela facilitação. Não há registro nesta sessão.',
    passos: [{ min: 15, txt: 'Dinâmica do barbante colorido, conduzida pela facilitação.' }], campos: [] });
  Object.assign(P('d1-estados2'), { ini: '13:45', fim: '15:10', conteudo: 'Apresentações de 4 estados (20 minutos por estado) + 5 minutos de perguntas e discussões.',
    papel: 'Cada grupo registra as apresentações do bloco 2 a partir do seu tema.',
    passos: [{ min: 80, txt: 'Ouvir as quatro apresentações, 20 minutos cada. O líder preenche um quadro por estado. Termômetro ao fim de cada estado.' }, { min: 5, txt: 'Perguntas e discussões. O líder revisa o registro e entrega.' }] });
  // Dia 1 · Grupos temáticos: cada grupo discute o seu tema
  const gt = P('d1-grupos');
  Object.assign(gt, { conteudo: 'Divisão em grupos para discutir os temas: Dados e Metodologias; Sistemas e Interoperabilidade; Uso Operacional; Cooperação Institucional; Capacitação.',
    papel: 'Cada grupo discute o seu tema. Com 10 grupos, cada tema tem dois grupos, e as respostas dos dois compõem a base do mesmo tema.',
    passos: [{ min: 5, txt: 'Escolher o líder e ler as perguntas do tema do grupo.' }, { min: 45, txt: 'Rodada com uma fala de até 1 minuto por estado ou instituição presente, orientada pelas perguntas do tema. O grupo escolhe até 3 demandas e o líder registra.' }, { min: 15, txt: 'Marcar a prioridade das demandas, escrever as perguntas para o Dia 2, ler em voz alta e entregar.' }] });
  const demF = gt.campos[0].f; const gtResto = gt.campos.filter(f => f.k !== 'demandas');
  gt.camposDe = (g) => [
    { k: 'tema', t: 'guia', l: temaTxt(g), h: 'Perguntas para orientar a rodada', o: g && g.tema ? G5[g.tema - 1] : ['Use as perguntas do tema do grupo.'] },
    { k: 'demandas', t: 'repeat', n: 3, item: 'Demanda', f: demF },
    ...gtResto];
  // Dia 2 · Apresentações: BIG/BDC, Biomas-BR, Queimadas, Sala de Situação e UFMG (18 min cada)
  const apr = [['d2-bdc', 'INPE · BIG/BDC (Brazil Data Cube)', 'INPE'], ['d2-biomas', 'INPE · Biomas-BR', 'INPE'], ['d2-queimadas', 'INPE · Programa Queimadas', 'INPE'], ['d2-sala', 'INPE · Sala de Situação', 'INPE'], ['d2-ufmg', 'UFMG', 'UFMG']];
  if (!P('d2-ufmg')) ETAPAS.push({ ...P('d2-sala'), id: 'd2-ufmg', campos: P('d2-sala').campos.map(f => ({ ...f })), conteudo: 'Apresentação da UFMG sobre soluções, produtos e pesquisas aplicáveis ao monitoramento e à gestão do fogo pelos estados.', resultado: 'Contribuições da UFMG relacionadas às demandas regionais.' });
  apr.forEach(([id, s, q], i) => { const ini = 9 * 60 + 10 + i * 18, fim = ini + 18, f = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    Object.assign(P(id), { sessao: s, quem: q, ini: f(ini), fim: f(fim), passos: [{ min: 18, txt: 'Ouvir a apresentação. O líder registra o que serve para os estados e o que falta; no último minuto, lê e entrega.' }] }); });
  // Dia 2 · Clínicas técnicas: 6 clínicas
  const ct = P('d2-clinicas');
  Object.assign(ct, { quem: 'Grupos por clínica (6 clínicas)',
    papel: 'Cada grupo trabalha uma clínica. Com até 10 grupos, as clínicas 1 a 4 podem ter dois grupos. A base é o levantamento prévio dos estados e as demandas dos Dias 1 e 2.',
    passos: [{ min: 5, txt: 'Escolher o líder e ler o foco da clínica e o que ela deve produzir.' }, { min: 55, txt: 'Para cada demanda da clínica: o grupo descreve a demanda, a solução relacionada, quem pode atender, a lacuna e a trilha de interoperabilidade. O líder registra.' }, { min: 10, txt: 'Ler em voz alta, definir o porta-voz e entregar.' }] });
  const CLIN_BASE = [{ k: 'demanda', t: 'area', l: 'Demanda', rows: 2 }, { k: 'origem', t: 'line', l: 'Estados ou instituições que apresentaram' }, { k: 'solucao', t: 'line', l: 'Solução, produto ou sistema relacionado' }, { k: 'competente', t: 'line', l: 'Quem pode atender' }, { k: 'lacuna', t: 'line', l: 'Lacuna que permanece' }];
  const TRILHA = { k: 'trilha', t: 'line', l: 'Trilha de interoperabilidade (SISFOGO/ADPF nº 743)', h: 'Como a demanda se conecta ao SISFOGO' };
  ct.camposDe = (g) => { const c = g && g.clinica ? CLINICAS[g.clinica - 1] : null; return [
    { k: 'clinica', t: 'guia', l: c ? `Clínica ${g.clinica} · ${c.nome}` : 'Clínica do grupo', h: c ? c.foco : 'As seis clínicas: ' + CLINICAS.map((x, i) => `${i + 1}. ${x.nome}`).join('; '), o: c ? ['O que a clínica produz: ' + c.produz, 'Base: respostas do levantamento prévio (formulário) e demandas registradas nos Dias 1 e 2.', 'Resultado: matriz demanda–solução–lacuna preenchida, com trilha de interoperabilidade.'] : ['Base: respostas do levantamento prévio (formulário) e demandas registradas nos Dias 1 e 2.'] },
    { k: 'itens', t: 'repeat', n: 4, item: 'Demanda', f: [...CLIN_BASE, ...(c ? c.extra : []), TRILHA] },
    { k: 'portavoz', t: 'line', l: 'Porta-voz no painel de convergência' }]; };
  ct.campos = ct.camposDe(null);
  // Dia 3 · Priorização em 5W2H
  const W5 = [{ k: 'oque', t: 'area', l: 'O quê (What): a ação', rows: 2 }, { k: 'porque', t: 'line', l: 'Por quê (Why): a demanda que resolve' }, { k: 'quem', t: 'line', l: 'Quem (Who): instituição responsável e parceiros' },
    { k: 'onde', t: 'line', l: 'Onde (Where): estados ou territórios' }, { k: 'quando', t: 'line', l: 'Quando (When): prazo indicativo' }, { k: 'como', t: 'line', l: 'Como (How): primeiros passos' }, { k: 'quanto', t: 'line', l: 'Quanto (How much): recursos ou fonte' }];
  const CRIT = ['Relevância regional', 'Urgência', 'Impacto operacional', 'Viabilidade', 'Abrangência', 'Dependências'];
  const pz = P('d3-priorizacao');
  Object.assign(pz, { papel: 'O grupo aplica os critérios às demandas do seu tema e organiza as prioritárias pelo método 5W2H.',
    passos: [{ min: 5, txt: 'Escolher o líder, ler os 6 critérios e o 5W2H.' }, { min: 50, txt: 'Escolher até 3 demandas prioritárias do tema, aplicar os critérios, definir prioridade e horizonte e responder o 5W2H de cada uma.' }, { min: 15, txt: 'Anotações gerais e considerações finais. Ler em voz alta e entregar.' }] });
  pz.camposDe = (g) => [
    { k: 'tema', t: 'guia', l: temaTxt(g), h: 'Critérios de priorização', o: ['Relevância regional: quantos estados a demanda alcança · Urgência: o custo de esperar a próxima temporada de fogo', 'Impacto operacional: quanto muda a resposta em campo · Viabilidade: recursos e capacidade existentes', 'Abrangência: quantos usuários e instituições · Dependências: fatores externos de que a demanda depende'] },
    { k: 'itens', t: 'repeat', n: 3, item: 'Demanda priorizada', f: [{ k: 'demanda', t: 'area', l: 'Demanda', rows: 1 }, { k: 'criterios', t: 'multi', l: 'Critérios que a demanda atende com força', o: CRIT },
      { k: 'prioridade', t: 'choice', l: 'Prioridade', o: ['Alta', 'Média', 'Baixa'] }, { k: 'horizonte', t: 'choice', l: 'Horizonte', o: ['Curto', 'Médio', 'Longo'] }, ...W5] },
    { k: 'anotacoes', t: 'area', l: 'Anotações gerais', rows: 6 }];
  pz.campos = pz.camposDe(null);
  // Dia 3 · Plano de seguimento em 5W2H
  const pl = P('d3-plano');
  Object.assign(pl, { papel: 'O grupo transforma as demandas priorizadas em ações pelo método 5W2H, com horizonte de curto, médio ou longo prazo.' });
  pl.campos = [{ k: 'acoes', t: 'repeat', n: 5, item: 'Eixo', titles: ['Dados', 'Funcionalidades', 'Capacitações', 'Cooperação', 'Interoperabilidade (trilha SISFOGO/ADPF nº 743)'],
    f: [{ k: 'horizonte', t: 'choice', l: 'Horizonte', o: ['Curto', 'Médio', 'Longo'] }, ...W5, { k: 'produto', t: 'line', l: 'Produto esperado' }] },
    { k: 'anotacoes', t: 'area', l: 'Anotações gerais', rows: 4 }];
  ETAPAS.sort((a, b) => a.dia - b.dia || _m(a.ini) - _m(b.ini));
  Object.assign(TEMAS, { 'd1-barbante': 'Integração', 'd2-ufmg': 'Soluções e pesquisa' });
  Object.assign(OBSERVE, { 'd1-estados1': ['PMIF: existe, está vigente, quem coordena', 'Sala de situação: estrutura, rotina e quem decide', 'O que a apresentação confirma ou acrescenta ao levantamento prévio do estado'],
    'd1-grupos': ['Todos falam a partir da realidade do seu estado ou instituição', 'Uma demanda boa diz o que falta, para quem e para quê', 'Use as perguntas do tema para orientar a rodada'],
    'd2-ufmg': ['O que a UFMG oferece aos estados', 'Condições de acesso e uso', 'Qual demanda do Dia 1 pode ser atendida'],
    'd2-clinicas': ['A clínica trata as demandas que se encaixam na sua categoria', 'Use o levantamento prévio e o que foi apresentado no Dia 2 como referência', 'Registre a lacuna e a trilha de interoperabilidade de cada demanda'],
    'd3-priorizacao': ['Aplique os 6 critérios antes de escolher as prioridades', 'O quê: começa com verbo e gera um produto concreto', 'Quem: uma instituição responsável, não uma pessoa'] });
  P('d2-painel').campos = P('d2-painel').campos.map(f => ({ ...f, rows: 2 }));
  Object.assign(PEDE, { 'd1-estados1': ['Para cada um dos 5 estados: programas, linhas de ação, ferramentas, integração, desafio, prática e demanda. Registro feito pela UNODC, com o INPE e a SEMAS/PA.', '5 quadros de estado e os pontos da discussão'],
    'd1-estados2': ['Para cada um dos 4 estados: o mesmo quadro, a partir do tema do grupo. O quinto quadro fica reservado para o Piauí ou outro estado, se houver mais uma apresentação.', 'Quadros de estado e o que é comum'],
    'd1-grupos': ['Discutir o tema do grupo e registrar até 3 demandas, com desafio, para quem, quem pode atender e prioridade.', 'Até 3 demandas do tema e as perguntas para o Dia 2'],
    'd2-ufmg': ['Registrar o que a solução apresentada serve para os estados e o que ainda falta.', 'O que serve, o que falta e 1 pergunta'],
    'd2-clinicas': ['Identificar as demandas da categoria da clínica e preencher a matriz demanda–solução–lacuna, com trilha de interoperabilidade.', 'Matriz da clínica'],
    'd3-priorizacao': ['Aplicar os critérios às demandas do tema e responder o 5W2H de até 3 demandas prioritárias.', 'Até 3 demandas priorizadas em 5W2H, anotações e considerações finais'],
    'd3-plano': ['Montar uma ação por eixo no formato 5W2H, com horizonte e produto esperado.', '5 ações em 5W2H, uma por eixo'] });
  let nEx = 0;
  ETAPAS.forEach(e => {
    e.tema = TEMAS[e.id] || '';
    e.observe = (OBSERVE[e.id] || []).slice(0, 3);
    if (e.tipo === 'pausa') return;
    if (e.campos.length && e.id !== 'd1-abertura') {
      e.ex = ++nEx;
      e.exNome = `Exercício ${e.ex} · ${e.sessao}`;
      const fim = e.fim.replace(':', 'h'), ini = e.ini.replace(':', 'h');
      e.quando = e.tipo === 'grupo' ? `No espaço do grupo, das ${ini} às ${fim}. Entregar até ${fim}.`
        : e.tipo === 'apoio' ? `Na chegada, das ${ini} às ${fim}. Entregar até ${fim}.`
        : `Durante a sessão "${e.sessao}" (${ini}–${fim}). Entregar ao final da sessão, até ${fim}.`;
      [e.pede, e.entrega] = PEDE[e.id] || ['', ''];
      const pre = e.resp === 'unodc' ? [{ k: 'redatores', t: 'line', l: 'Quem registra', h: 'Nomes das pessoas da UNODC, do INPE e da SEMAS/PA que fazem o registro' }]
        : [{ k: 'lider', t: 'line', l: 'Líder deste exercício', h: 'Nome ou nº da lista. A liderança pode mudar a cada exercício' }, { k: 'presentes', t: 'multi', l: 'Presentes (nº da lista do grupo)', o: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] }];
      const pos = [{ k: 'consideracoes', t: 'area', l: e.id === 'd3-priorizacao' ? 'Considerações finais' : 'Considerações adicionais', h: 'Espaço livre para acrescentar o que quiser antes de enviar', rows: 4 }];
      if (e.camposDe) { const fn = e.camposDe; e.camposDe = (g) => [...pre, ...fn(g), ...pos]; e.campos = e.camposDe(null); }
      else e.campos = [...pre, ...e.campos, ...pos];
    }
  });

  const toMin = (h) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };
  // Garantia: os passos de cada etapa somam exatamente a duração oficial
  const erros = [];
  ETAPAS.forEach(e => { if (e.tipo === 'pausa') return; const d = toMin(e.fim) - toMin(e.ini); const s = e.passos.reduce((a, p) => a + p.min, 0); if (d !== s) erros.push(`${e.id}: ${s} de ${d} min`); });

  const camposDe = (e, g) => (e.camposDe && g && g.tema ? e.camposDe(g) : e.campos);
  const CFG = { UFS, DEST, GRUPOS, GUNODC, TEMAS5, CLINICAS, camposDe, CORES, POR_COR, NG, DIAS, ETAPAS, RITUAL: typeof RITUAL !== 'undefined' ? RITUAL : [], OBJETIVO, OBJ_ESP, GLOSSARIO, toMin, erros, evento: 'Encontro Técnico · Monitoramento e Gestão Integrado do Fogo na Amazônia Legal', local: 'São José dos Campos/SP' };
  if (typeof module !== 'undefined') module.exports = CFG; else root.CFG = CFG;
})(this);



(() => {
'use strict';
const { GRUPOS, DIAS, ETAPAS, UFS, toMin } = CFG;
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const hm = (h) => h.replace(':', 'h');
const pad = (n) => String(n).padStart(2, '0');
const fromMin = (m) => `${pad(Math.floor(m / 60))}h${pad(m % 60)}`;
const G = Object.fromEntries([...GRUPOS, CFG.GUNODC].map(g => [g.id, g]));
const E = Object.fromEntries(ETAPAS.map(e => [e.id, e]));
const WORK = ETAPAS.filter(e => e.tipo !== 'pausa');
const LS = {
  get(k, d) { try { const v = localStorage.getItem('kfa:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('kfa:' + k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem('kfa:' + k); } catch {} },
};

// ---------- estado ----------
const S = {
  role: (() => { const r = LS.get('role', null); return r === 'equipe' || r === 'unodc' || (r && CFG.GRUPOS.some(g => g.id === r)) ? r : null; })(),          // 'amarelo' | ... | 'equipe'
  db: null, user: null, downloads: null, mode: 'connecting', // 'online' | 'local'
  resp: {},                            // id -> doc
  ativa: null, ativaAuto: true,        // etapa liberada
  termo: {},
  view: null, dayView: null, tab: LS.get('tab', 'conducao'), respStage: null,
  dirty: {}, saving: {}, savedAt: {},
};
const docId = (etapa, grupo) => `${etapa}__${grupo}`;
const DEMO = /*__DEMO__*/false;
const BASE = location.origin + '/';
S.screen = 'auto'; S.pendingStage = null; S.aval = {}; S.avals = []; S.avalSent = false;

// ---------- relógio ----------
const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60; };
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const eventDay = () => (DIAS.find(d => d.data === todayISO()) || {}).n || null;
function clockStage() {
  const d = eventDay(); if (!d) return null;
  const m = nowMin();
  return ETAPAS.find(e => e.dia === d && m >= toMin(e.ini) && m < toMin(e.fim)) || null;
}
function activeStage() { const a = S.ativa && E[S.ativa] ? E[S.ativa] : (clockStage() || WORK[0]); if (a.ex || PANEL(S.role)) return a; const i = WORK.findIndex(x => x.id === a.id); return WORK.slice(i).find(x => x.ex) || a; }
function tick() {
  const d = new Date(); $('#clock').textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  document.querySelectorAll('[data-timer]').forEach(el => paintTimer(el, E[el.dataset.timer]));
}
function paintTimer(el, e) {
  if (!e) return;
  const a = toMin(e.ini), b = toMin(e.fim), m = nowMin(), dur = b - a;
  const today = eventDay() === e.dia;
  let txt, sub, pct = 0, late = false;
  if (today && m >= a && m < b) { const rest = Math.ceil(b - m); txt = `faltam ${rest} min`; sub = `de ${dur} min · termina às ${hm(e.fim)}`; pct = (m - a) / dur * 100; }
  else if (today && m >= b) { txt = 'horário encerrado'; sub = `terminou às ${hm(e.fim)}`; pct = 100; late = true; }
  else if (today && m < a) { txt = `começa às ${hm(e.ini)}`; sub = `duração ${dur} min`; }
  else { txt = `${hm(e.ini)} às ${hm(e.fim)}`; sub = `duração ${dur} min`; }
  el.querySelector('.big').textContent = txt; el.querySelector('.sub').textContent = sub;
  const bar = el.querySelector('.bar'); bar.classList.toggle('late', late); bar.firstElementChild.style.width = pct + '%';
  // passo atual
  if (today) { let t = a; el.closest('.stage')?.querySelectorAll('.steps li').forEach((li, i) => { const p = e.passos[i]; li.classList.toggle('now', m >= t && m < t + p.min); t += p.min; }); }
}

// ---------- toast ----------
let toastT; function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600); }


// ---------- Base externa (Supabase) para a versão publicada em site próprio ----------
const SUPA = {"url":"https://bkajbntazonnunhewxdt.supabase.co","key":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrYWpibnRhem9ubnVuaGV3eGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MTkzMzksImV4cCI6MjEwNjE5NTMzOX0.O0I9pT_VLJSFG2N3HAdaUGaxhbZPT6mXYJnEaLoGmOo"};
const PANEL = (r) => r === 'equipe' || r === 'unodc';
// ---------- Verificação de local (cerca geográfica do INPE) ----------
// A posição fica só na memória do aparelho; o servidor confere a distância e não guarda a posição de quem está no local.
const GEOFN = ['ef_entrar', 'ef_ler', 'ef_salvar', 'ef_trocar_mesa', 'ef_avaliar'];
const GEO = { pos: null, err: null, watch: null, pedido: false };
function geoSet(p) { GEO.pos = { lat: Math.round(p.coords.latitude * 1e5) / 1e5, lng: Math.round(p.coords.longitude * 1e5) / 1e5, prec: Math.round(p.coords.accuracy || 0) }; GEO.err = null; }
function geoPayload() { if (GEO.pos) return { lat: GEO.pos.lat, lng: GEO.pos.lng, prec: GEO.pos.prec }; if (GEO.err) return { erro: GEO.err }; return null; }
function geoObter() {
  return new Promise(res => {
    if (!navigator.geolocation) { GEO.err = 'indisponivel'; return res(); }
    navigator.geolocation.getCurrentPosition(p => { geoSet(p); geoWatch(); res(); }, e => { GEO.err = e && e.code === 1 ? 'negado' : 'indisponivel'; res(); }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  });
}
function geoWatch() { if (GEO.watch != null || !navigator.geolocation) return; try { GEO.watch = navigator.geolocation.watchPosition(geoSet, () => {}, { enableHighAccuracy: true, maximumAge: 60000 }); } catch {} }
function bloquear(motivo) {
  if (S.bloqueio === motivo && S.screen === 'login') return;
  S.bloqueio = motivo; if (S.db && S.db.stop) S.db.stop(); S.db = null; S.screen = 'login'; S.loginEquipe = false; render(); scrollTo(0, 0);
}
async function rpc(fn, args) {
  const g = GEOFN.includes(fn);
  const call = () => rpcRaw(fn, g && GEO.pedido ? { ...args, p_geo: geoPayload() } : args);
  try { return await call(); }
  catch (e) {
    const m = String(e);
    if (g && /localizacao necessaria/.test(m) && !GEO.pos) { GEO.pedido = true; await geoObter();
      try { return await call(); } catch (e2) { const m2 = String(e2); if (/fora da area/.test(m2)) bloquear('fora'); else if (/localizacao necessaria/.test(m2)) bloquear(GEO.err === 'negado' ? 'negado' : 'sem'); throw e2; } }
    if (g && /fora da area/.test(m)) bloquear('fora');
    else if (g && /localizacao necessaria/.test(m)) bloquear(GEO.err === 'negado' ? 'negado' : 'sem');
    throw e;
  }
}
function rpcRaw(fn, args) {
  return fetch(SUPA.url + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SUPA.key, Authorization: 'Bearer ' + SUPA.key }, body: JSON.stringify(args) })
    .then(async r => { const t = await r.text(); if (!r.ok) throw new Error(t); return t ? JSON.parse(t) : null; });
}
function SupaDB(codigo) {
  const L = { respostas: [], controle: [], termometro: [], avaliacoes: [] };
  const snap = (obj) => ({ docs: Object.entries(obj || {}).map(([id, v]) => ({ id, data: () => v })) });
  let last = null;
  async function poll() {
    try { last = await rpc('ef_ler', { p_codigo: codigo }); if (!alive) return;
      L.respostas.forEach(([cb]) => cb(snap(last.respostas)));
      L.controle.forEach(([cb]) => cb({ data: () => last.controle || null }));
      L.termometro.forEach(([cb]) => cb(snap(last.termometro)));
      L.avaliacoes.forEach(([cb]) => cb({ docs: (last.avaliacoes || []).map((v, i) => ({ id: String(i), data: () => v })) }));
      (L.participantes || []).forEach(([cb]) => cb(last.participantes || null, last.mesa_participantes || null));
      if (last.alertas) { const sig = last.alertas.length + '|' + JSON.stringify(last.controle?.cerca || null); const ch = sig !== S.segSig; S.segSig = sig; S.alertas = last.alertas; S.cerca = last.controle?.cerca || null; if (ch && PANEL(S.role) && S.screen === 'auto' && !document.activeElement?.matches?.('input,textarea,select')) { const y = scrollY; render(); scrollTo(0, y); } }
    } catch (e) { if (/fora da area|localizacao necessaria/.test(String(e))) { alive = false; clearInterval(iv); return; } if (/acesso negado/.test(String(e)) && alive) { alive = false; clearInterval(iv); LS.del('codigo'); LS.del('role'); S.role = null; S.db = null; S.screen = 'login'; $('#app').innerHTML = loginHTML('Este acesso não é mais válido. Leia o QR Code do seu grupo.'); return; } [...L.respostas, ...L.controle].forEach(([, err]) => err && err(e)); }
  }
  let alive = true; const iv = setInterval(() => alive && poll(), 4000); setTimeout(() => alive && poll(), 50);
  const key = (p) => p.split('/')[0];
  return {
    liberarDias: (dias) => rpc('ef_liberar_dias', { p_codigo: codigo, p_dias: dias }),
    salvarParticipante: (doc) => rpc('ef_participante_salvar', { p_codigo: codigo, p_doc: doc }),
    stop: () => { alive = false; clearInterval(iv); Object.keys(L).forEach(k => L[k] = []); },
    collection: (name) => ({ onSnapshot: (cb, err) => { (L[name] || (L[name] = [])).push([cb, err]); }, add: (rec) => name === 'avaliacoes' ? rpc('ef_avaliar', { p_codigo: codigo, p_doc: rec }) : Promise.resolve() }),
    doc: (path) => ({
      onSnapshot: (cb, err) => { if (key(path) === 'controle') L.controle.push([cb, err]); },
      set: (v) => { const [col, id] = path.split('/');
        if (col === 'respostas') return rpc(S.role === 'unodc' ? 'ef_salvar_unodc' : 'ef_salvar', { p_codigo: codigo, p_id: id, p_doc: v }).then(r => { setTimeout(poll, 300); return r; });
        if (col === 'controle') return rpc('ef_liberar', { p_codigo: codigo, p_etapa: v.ativa || null }).then(r => { setTimeout(poll, 300); return r; });
        if (col === 'termometro') return rpc('ef_termometro', { p_codigo: codigo, p_uf: v.uf || id, p_valor: v });
        return Promise.resolve(); },
    }),
  };
}
function bloqueioHTML() {
  const b = S.bloqueio;
  const t = b === 'fora' ? ['Acesso restrito ao local do encontro', 'Este acesso funciona somente no INPE', 'O QR Code dos grupos é válido apenas nas dependências do INPE, em São José dos Campos, durante o encontro. A tentativa de acesso de fora do local foi registrada e comunicada à equipe organizadora.', 'Se você está no INPE, ative o GPS do aparelho, aguarde alguns segundos e toque em Tentar novamente.']
    : b === 'negado' ? ['Confirmação de local', 'Permita o uso da localização para continuar', 'Durante o encontro, o sistema confirma que o aparelho está no INPE antes de abrir o grupo. A localização serve apenas para essa conferência e não fica guardada.', 'No iPhone: Ajustes › Privacidade e Segurança › Serviços de Localização › navegador utilizado › Durante o Uso. No Android: toque no cadeado ao lado do endereço › Permissões › Localização › Permitir. Depois, toque em Tentar novamente.']
    : ['Confirmação de local', 'Não foi possível confirmar a localização', 'Durante o encontro, o sistema confirma que o aparelho está no INPE antes de abrir o grupo.', 'Ative a localização (GPS) do aparelho e toque em Tentar novamente. Se o problema continuar, procure a equipe de facilitação.'];
  return `<div class="wrap"><div class="kiosk"><article class="stage"><div class="stage-head"><span class="eyebrow">${t[0]}</span><h2>${t[1]}</h2><p class="muted" style="margin:0">${t[2]}</p></div>
    <div class="stage-body"><p class="banner">${t[3]}</p><button class="btn" id="geo-tentar">Tentar novamente</button></div></article></div></div>`;
}
function loginHTML(msg) {
  if (S.bloqueio && !S.loginEquipe) return bloqueioHTML();
  const eq = S.loginEquipe;
  if (!eq) return `<div class="wrap"><div class="kiosk"><article class="stage"><div class="stage-head"><span class="eyebrow">Acesso dos grupos</span><h2>Aponte a câmera do celular para o QR Code do seu grupo</h2><p class="muted" style="margin:0">O sistema abre direto no seu grupo. Para trocar de grupo em outro exercício, basta ler o QR Code do novo grupo.</p></div>
    <div class="stage-body">${msg ? `<p class="banner">${esc(msg)}</p>` : ''}<button class="btn ghost" id="login-equipe">Acesso da equipe Kenosis ou da UNODC</button></div></article></div></div>`;
  return `<div class="wrap"><div class="kiosk"><article class="stage"><div class="stage-head"><span class="eyebrow">Bastidores</span><h2>Senha de acesso</h2><p class="muted" style="margin:0">Equipe Kenosis: painel completo. UNODC: tabela de credenciamento.</p></div>
    <div class="stage-body"><div class="fld"><label for="cod">Senha</label><input type="password" id="cod" autocomplete="off" autocapitalize="none" placeholder="Senha" style="font-size:22px;letter-spacing:.08em;text-transform:uppercase"></div>
    ${msg ? `<p class="banner">${esc(msg)}</p>` : ''}<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="entrar">Entrar</button><button class="btn ghost" id="voltar-mesas">Voltar</button></div></div></article></div></div>`;
}
const TROCA_INI = '2026-11-16T10:20:00-03:00';
function podeTrocar() { if (!S.role || PANEL(S.role) || DEMO) return true; if (LS.get('trocaOk', false)) return true; const ex1 = WORK.find(x => x.ex === 1); const ok = Date.now() >= Date.parse(TROCA_INI) || (ex1 && getDoc(ex1.id, S.role).status === 'enviada'); if (ok) LS.set('trocaOk', true); return ok; }
async function purgeMesa(old, oldCode) {
  // antes de trocar de grupo: envia o que estiver pendente e apaga do aparelho o conteúdo do grupo anterior
  for (const id of Object.keys(S.resp)) { const d = S.resp[id]; if (!d || d.grupo !== old) continue;
    if (S.dirty[id] && oldCode && d.status !== 'enviada') { try { await rpc('ef_salvar', { p_codigo: oldCode, p_id: id, p_doc: d }); } catch {} }
    delete S.resp[id]; delete S.dirty[id]; LS.del('r:' + id); }
}
async function entrar(codeArg, viaLink) {
  const c = (codeArg || $('#cod')?.value || '').trim().toUpperCase(); if (!c) return;
  try { let papel = await rpc('ef_entrar', { p_codigo: c });
    if (papel === 'bloqueio:pedir_localizacao') { GEO.pedido = true; await geoObter(); papel = await rpc('ef_entrar', { p_codigo: c }); }
    if (typeof papel === 'string' && papel.startsWith('bloqueio:')) { S.codePend = c; bloquear(papel === 'bloqueio:fora_da_area' ? 'fora' : GEO.err === 'negado' ? 'negado' : 'sem'); return; }
    S.bloqueio = null; S.codePend = null;
    if (!papel) { S.screen = 'login'; $('#app').innerHTML = loginHTML('Código não reconhecido. Confira e tente de novo.'); return; }
    if (viaLink && PANEL(papel)) { S.loginEquipe = true; S.screen = 'login'; $('#app').innerHTML = loginHTML('O acesso dos bastidores é feito digitando a senha.'); return; }
    S.loginEquipe = false;
    if (papel === 'participante') { S.screen = 'login'; $('#app').innerHTML = loginHTML('Código não reconhecido.'); return; }
    if (S.role && /^mesa/.test(S.role) && /^mesa/.test(papel) && papel !== S.role && !podeTrocar()) { toast('Este aparelho está no ' + G[S.role].papel + '. A troca de grupo fica liberada a partir do Exercício 2.'); S.screen = 'auto'; render(); return; }
    if (false) { LS.set('evento', c); S.screen = 'auto'; S.role = null; if (S.pendingMesa) { const m = S.pendingMesa; S.pendingMesa = null; selectMesa(m); return; } render(); return; }
    const old = S.role, oldCode = LS.get('codigo', null);
    if (S.db && S.db.stop) S.db.stop();
    if (old && old !== papel && /^mesa/.test(old)) await purgeMesa(old, oldCode);
    if (PANEL(papel)) LS.del('trocaOk');
    LS.set('codigo', c); S.role = papel; LS.set('role', papel); S.screen = 'auto'; startSupa(c); render(); }
  catch { S.screen = 'login'; $('#app').innerHTML = loginHTML('Não foi possível conectar. Verifique a internet e tente de novo.'); }
}
function selectMesa(id, stage) {
  const ev = LS.get('evento', null); if (!ev) { S.pendingMesa = id; S.screen = 'login'; render(); return; }
  if (S.role !== id || !S.db) { if (S.db && S.db.stop) S.db.stop(); const c = ev + '/' + id; LS.set('codigo', c); S.role = id; LS.set('role', id); startSupa(c); }
  S.screen = 'auto'; if (stage && E[stage] && E[stage].tipo !== 'pausa') { S.view = stage; S.dayView = E[stage].dia; } else { S.view = null; S.dayView = null; }
  render(); scrollTo(0, 0);
}
function leaveMesa() { if (S.db && S.db.stop) S.db.stop(); S.db = null; S.role = null; LS.del('role'); LS.del('codigo'); S.view = null; if (SUPA) S.screen = 'login'; if (location.hash) history.replaceState(null, '', location.pathname); render(); scrollTo(0, 0); }

// ---------- sincronização ----------
function setSync() {
  const el = $('#sync'); el.className = 'sync' + (S.mode === 'local' || S.mode === 'demo' ? ' local' : S.mode === 'connecting' ? ' off' : '');
  el.lastElementChild.textContent = S.mode === 'online' ? 'Sincronizado' : S.mode === 'demo' ? 'Demonstração · nada é gravado na base' : S.mode === 'local' ? 'Modo local · salvo neste aparelho' : 'Conectando…';
}
function startSupa(c) {
  S.db = SupaDB(c); S.mode = 'connecting'; setSync(); loadLocal(); attachDb();
}
async function connect() {
  if (SUPA && Date.now() >= Date.parse('2026-11-19T00:00:00-03:00')) { try { Object.keys(localStorage).filter(k => k.startsWith('kfa:') && k !== 'kfa:limpo').forEach(k => localStorage.removeItem(k)); } catch {} }
  if (SUPA) { LS.del('evento'); const c = LS.get('codigo', null); if (!c) { S.mode = 'local'; setSync(); if (!LS.get('evento', null)) S.screen = 'login'; route(); return; } S.role = LS.get('role', null); startSupa(c); route(); return; }
  if (DEMO) { S.mode = 'demo'; setSync(); loadLocal(); render(); return; }
  let to = setTimeout(() => { if (S.mode === 'connecting') { S.mode = 'local'; setSync(); loadLocal(); render(); } }, 10000);
  try { S.db = await window.claude?.use?.('db'); } catch { S.db = null; }
  try { S.user = await window.claude?.use?.('user'); } catch { S.user = null; }
  try { S.downloads = await window.claude?.use?.('downloads'); } catch { S.downloads = null; }
  if (!S.db) { clearTimeout(to); S.mode = 'local'; setSync(); loadLocal(); render(); return; }
  try { if (S.user && S.user.can && (await S.user.can('data.write')) === false) { clearTimeout(to); S.db = null; S.mode = 'demo'; setSync(); loadLocal(); render(); return; } } catch {}
  loadLocal();
  attachDb();
}
function attachDb() {
  let to = setTimeout(() => { if (S.mode === 'connecting') { S.mode = 'local'; setSync(); } }, 12000);
  S.db.collection('respostas').onSnapshot(snap => {
    clearTimeout(to); if (S.mode !== 'online') { S.mode = 'online'; setSync(); setTimeout(reenviarPendentes, 500); }
    snap.docs.forEach(d => { const v = d.data(); if (!v) return; const loc = S.resp[d.id];
      if (loc && loc.status === 'enviada' && v.status !== 'enviada') { subirEnvio(d.id); return; }
      if (v.oculto) { delete S.dirty[d.id]; S.resp[d.id] = JSON.parse(JSON.stringify(v)); LS.set('r:' + d.id, S.resp[d.id]); return; }
      if (S.dirty[d.id] && loc && (loc.atualizadoEm || 0) > (v.atualizadoEm || 0)) return;
      if (loc && (loc.atualizadoEm || 0) > (v.atualizadoEm || 0)) { queueSave(d.id); return; }
      S.resp[d.id] = JSON.parse(JSON.stringify(v)); LS.set('r:' + d.id, S.resp[d.id]); });
    // envia o que só existe localmente
    Object.keys(S.resp).forEach(id => { if (!snap.docs.find(d => d.id === id) && S.resp[id]?.grupo === S.role && S.resp[id].atualizadoEm && S.resp[id].status !== 'vazio') queueSave(id); });
    softRender();
  }, () => { S.mode = 'local'; setSync(); });
  S.db.doc('controle/estado').onSnapshot(s => { const v = s.data(); const prev = S.ativa; S.ativa = v?.ativa || null; S.ativaAuto = !v?.ativa; const dl = JSON.stringify(v?.dias || []); const dch = dl !== JSON.stringify(S.diasLib || []); S.diasLib = v?.dias || [];
    if (S.role && !PANEL(S.role) && (prev !== S.ativa || dch) && !document.activeElement?.matches?.('input,textarea,select')) { const y = scrollY; render(); scrollTo(0, y); } else softRender(); }, () => {});
  S.db.collection('avaliacoes').onSnapshot(s => { S.avals = s.docs.map(d => d.data()).filter(Boolean); if (PANEL(S.role) && S.tab === 'avaliacoes' && S.screen === 'auto') render(); }, () => {});
  // envia avaliações guardadas sem conexão
  setTimeout(async () => { const loc = LS.get('avals', []); let ch = false; for (const a of loc) { if (!a.sync && S.mode === 'online') { try { const { sync, ...rec } = a; await S.db.collection('avaliacoes').add(rec); a.sync = true; ch = true; } catch {} } } if (ch) LS.set('avals', loc); }, 4000);
  S.db.collection('participantes').onSnapshot((parts, mesa) => { if (parts) { S.parts = parts; if (PANEL(S.role) && S.tab === 'credenciamento' && S.screen === 'auto' && !document.activeElement?.closest?.('#tabbody input, #tabbody select, #tabbody textarea')) { const tb = $('#tabbody'); if (tb) { const y = scrollY; tb.innerHTML = credHTML(); scrollTo(0, y); } } } if (mesa) { const ch = JSON.stringify(mesa) !== JSON.stringify(S.mesaParts || []); S.mesaParts = mesa; if (ch && !PANEL(S.role) && S.screen === 'auto' && !document.activeElement?.matches?.('input,textarea,select')) { const y = scrollY; render(); scrollTo(0, y); } } }, () => {});
  S.db.collection('termometro').onSnapshot(s => { s.docs.forEach(d => S.termo[d.id] = d.data()); if (PANEL(S.role) && S.tab === 'termometro' && !document.activeElement?.closest?.('.termo')) render(); }, () => {});
}
function loadLocal() {
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('kfa:r:')) { const id = k.slice(6); const v = LS.get('r:' + id); if (v && (!S.resp[id] || (v.atualizadoEm || 0) > (S.resp[id].atualizadoEm || 0))) S.resp[id] = v; } } } catch {}
}
const timers = {};
function queueSave(id, delay = 1200) {
  clearTimeout(timers[id]); S.dirty[id] = true; paintSave(id, 'Salvando…');
  timers[id] = setTimeout(() => flush(id), delay);
}
async function flush(id) {
  const doc = S.resp[id]; if (!doc) return;
  if (doc.status === 'enviada') { S.dirty[id] = false; return; }
  LS.set('r:' + id, doc);
  if (!S.db || S.mode !== 'online') { S.dirty[id] = false; S.savedAt[id] = Date.now(); paintSave(id); return; }
  if (S.saving[id]) { queueSave(id, 600); return; }
  S.saving[id] = true;
  try { await S.db.doc('respostas/' + id).set(doc); S.dirty[id] = false; S.savedAt[id] = Date.now(); paintSave(id); }
  catch (e) { paintSave(id, 'Salvo só neste aparelho. Tentaremos de novo.'); setTimeout(() => queueSave(id), 4000); }
  finally { S.saving[id] = false; }
}
function paintSave(id, msg) {
  const el = document.querySelector(`[data-save="${id}"]`); if (!el) return;
  if (msg) { el.textContent = msg; return; }
  const t = new Date(S.savedAt[id] || Date.now());
  el.textContent = (S.mode === 'online' ? 'Salvo e sincronizado às ' : 'Salvo neste aparelho às ') + `${pad(t.getHours())}:${pad(t.getMinutes())}`;
}
let rodadaT = null;
function iniciarRodada() {
  clearInterval(rodadaT); let rest = 60;
  const el = $('#rt'), bt = $('#rtbtn'); if (!el) return;
  el.classList.remove('fim'); el.textContent = '1:00'; bt.textContent = 'Próxima pessoa';
  rodadaT = setInterval(() => { rest--; const e2 = $('#rt'); if (!e2) { clearInterval(rodadaT); return; }
    e2.textContent = `0:${String(Math.max(rest, 0)).padStart(2, '0')}`;
    if (rest <= 0) { clearInterval(rodadaT); e2.textContent = 'Tempo'; e2.classList.add('fim'); } }, 1000);
}
async function enviarExercicio(etapa) {
  const id = docId(etapa, S.role); const doc = getDoc(etapa, S.role);
  if (doc.status === 'enviada') return;
  clearTimeout(timers[id]);
  doc.status = 'enviada'; doc.enviadoEm = Date.now(); doc.atualizadoEm = doc.enviadoEm;
  doc.lider = doc.dados?.lider || S.resp[docId('d1-credenciamento', S.role)]?.dados?.lider || '';
  LS.set('r:' + id, doc); LS.set('pend:' + id, true);
  await subirEnvio(id);
  toast(`${E[etapa].exNome} enviado`); if (!DEMO) S.view = null; render(); scrollTo(0, 0);
}
async function subirEnvio(id) {
  const doc = S.resp[id]; if (!doc) return;
  if (!S.db || S.mode !== 'online') return; // fica pendente neste aparelho e sobe quando a conexão voltar
  try {
    await S.db.doc('respostas/' + id).set(doc);
    await S.db.doc('envios/' + id).set({ ...doc, recebidoEm: Date.now() });
    LS.del('pend:' + id);
  } catch { setTimeout(() => subirEnvio(id), 5000); }
}
function reenviarPendentes() {
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('kfa:pend:')) subirEnvio(k.slice(9)); } } catch {}
}
function getDoc(etapa, grupo) {
  const id = docId(etapa, grupo);
  if (!S.resp[id]) S.resp[id] = { etapa, grupo, dados: {}, status: 'vazio', atualizadoEm: 0 };
  const d = S.resp[id], gg = G[grupo];
  if (gg && gg.tema && d.tema == null) { d.tema = gg.tema; d.temaNome = gg.temaNome; if (etapa === 'd2-clinicas') { d.clinica = gg.clinica; d.clinicaNome = gg.clinicaNome; } }
  return d;
}
const statusOf = (etapa, grupo) => { const d = S.resp[docId(etapa, grupo)]; return d ? d.status : 'vazio'; };
const ENV_TS = {};

// ---------- rotas por link ----------
function route() {
  const h = (location.hash || '').slice(1);
  const gm = GRUPOS.find(g => h === g.id || h === 'g-' + g.id || h.startsWith(g.id + '-'));
  if (h.startsWith('acesso=')) { const c = decodeURIComponent(h.slice(7)); history.replaceState(null, '', location.pathname); entrar(c, true); return; }
  if (gm && SUPA && !PANEL(S.role)) { if (!S.role) { S.screen = 'login'; render(); return; } if (gm.id !== S.role) { toast('Este aparelho está conectado à ' + G[S.role].papel + '.'); history.replaceState(null, '', location.pathname + '#' + S.role); return; } }
  if (gm) { S.role = gm.id; LS.set('role', gm.id); S.screen = 'auto'; const st = h.slice(gm.id.length + 1); if (E[st] && E[st].tipo !== 'pausa') { S.view = st; S.dayView = E[st].dia; } else { S.view = null; S.dayView = null; } render(); scrollTo(0, 0); return; }
  if (h === 'bastidores') { history.replaceState(null, '', location.pathname); S.loginEquipe = true; S.screen = 'login'; render(); scrollTo(0, 0); return; }
  if (h === 'mapa') S.screen = 'mapa';
  else if (h === 'avaliacao') { S.screen = 'avaliacao'; S.avalSent = false; }
  else if (E[h] && E[h].tipo !== 'pausa') { S.screen = 'auto'; if (S.role && !PANEL(S.role)) { S.view = h; S.dayView = E[h].dia; } else if (!S.role) S.pendingStage = h; else { S.respStage = h; S.tab = 'respostas'; } }
  else S.screen = (SUPA && !LS.get('evento', null) && !LS.get('codigo', null)) || S.loginEquipe ? 'login' : 'auto';
  render(); scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
document.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && ev.target && ev.target.id === 'cod') entrar(); });
function exercicio(e) { return e.individual ? 'Grupo e individual' : e.campos.length && e.id !== 'd1-abertura' ? 'Exercício do grupo' : 'Sem registro'; }

// ---------- render raiz ----------
let lastRenderKey = '';
function render() { renderCore(); const app = $('#app'); if (app && !PANEL(S.role) && !S.loginEquipe && !app.querySelector('.bastidores-link')) app.insertAdjacentHTML('beforeend', `<p class="bastidores-link" style="text-align:center;margin:28px 0 24px;font-size:13px"><a href="#bastidores" style="color:var(--muted,#5b6660)">Acesso da equipe Kenosis ou da UNODC</a></p>`); }
function renderCore() {
  const app = $('#app');
  const who = $('#who');
  const nav = `<a class="navbtn" href="#mapa">Mapa do encontro</a>`;
  if (S.screen === 'login') { who.innerHTML = ''; app.innerHTML = loginHTML(); return; }
  if (S.screen === 'mapa') { who.innerHTML = (S.role ? `<a class="navbtn" href="#">Voltar</a>` : `<a class="navbtn" href="#">Início</a>`); app.innerHTML = mapaHTML(); return; }
  if (S.screen === 'avaliacao') { who.innerHTML = `<a class="navbtn" href="#">Sair da avaliação</a>`; app.innerHTML = avaliacaoHTML(); return; }
  if (!S.role) { who.innerHTML = nav; app.innerHTML = homeHTML(); return; }
  if (S.screen === 'troca' && /^mesa/.test(S.role)) { who.innerHTML = nav; app.innerHTML = trocaHTML(); return; }
  if (PANEL(S.role)) { document.documentElement.style.setProperty('--g', 'var(--forest)'); who.innerHTML = nav + ` <button class="chip" id="trocar">${S.role === 'unodc' ? 'UNODC' : 'Equipe Kenosis'} · sair</button>`; app.innerHTML = (S.role === 'equipe' && S.eqEdit) ? eqEditHTML() : panelHTML(); afterPanel(); return; }
  const g = G[S.role]; document.documentElement.style.setProperty('--g', g.cor);
  who.innerHTML = nav + (podeTrocar() ? ` <span style="display:inline-flex;flex-direction:column;gap:6px;vertical-align:middle"><button class="chip" id="outro-grupo" title="Entrar em outro grupo">⇄ Outro grupo</button><button class="chip" id="trocar" title="Sair deste grupo"><span class="dot"></span>${esc(g.papel)} · sair</button></span>` : ` <span class="chip" title="A troca de grupo fica liberada depois do Exercício 1"><span class="dot"></span>${esc(g.papel)}</span>`);
  app.innerHTML = tabletHTML(g); tick();
}
function softRender() {
  // re-render que não interrompe digitação
  if (!S.role || S.screen !== 'auto') return;
  if (PANEL(S.role)) { if (!document.activeElement?.matches?.('input,textarea,select')) { const y = scrollY; render(); scrollTo(0, y); } return; }
  const rail = $('.rail'); if (rail) rail.innerHTML = railHTML(G[S.role]);
}

// ---------- início ----------
function homeHTML() {
  return `<div class="wrap"><section class="home">
    <div class="homelogo"><img alt="UNODC · Escritório das Nações Unidas sobre Drogas e Crime" src="data:image/png;base64,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"></div>
    <div><span class="eyebrow">Sistema de registro do encontro</span>
      <h1>Monitoramento e Gestão Integrado do Fogo na Amazônia Legal</h1>
      <p class="lead">Cada grupo tem o seu número e o seu tema, e responde pelo celular. Em cada exercício o grupo escolhe um líder, que conduz a conversa e registra; a liderança pode mudar a cada exercício. O rascunho é salvo enquanto o grupo escreve; o envio é definitivo e alimenta a matriz comum do relatório final.</p></div>
    ${S.mode === 'demo' ? `<div class="banner">Versão de demonstração para avaliação. Navegue à vontade, escolha um grupo e preencha os exercícios: as respostas ficam só neste aparelho e não vão para a base do encontro.</div>` : ''}
    ${S.pendingStage ? `<div class="banner">Você abriu o link de <b>${esc(E[S.pendingStage].sessao)}</b> (${esc(DIAS[E[S.pendingStage].dia - 1].rotulo)}, ${hm(E[S.pendingStage].ini)}). Escolha o grupo deste tablet para continuar.</div>` : ''}
    <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn" href="#mapa" style="text-decoration:none">Ver o mapa do encontro: sessões, exercícios e links</a><a class="btn ghost" href="#avaliacao" style="text-decoration:none">Avaliação individual</a></div>
    <div><span class="eyebrow">Escolha o grupo deste aparelho</span>${SUPA ? ` <button class="chip" id="sair-evento" style="margin-left:8px">Sair</button>` : ''}
      <div class="tiles" style="margin-top:10px">
        ${GRUPOS.map(g => `<button class="tile" data-role="${g.id}" data-hash="${g.id}" style="--g:${g.cor}"><b>${esc(g.papel)}</b><small>${esc(g.temaNome || '')}</small></button>`).join('')}
        <button class="tile team" data-role="equipe"><b>Painel da equipe</b><small>Libera as etapas, acompanha os ${GRUPOS.length} grupos, matriz comum, avaliações e exportação</small></button>
      </div></div>
    <div><span class="eyebrow">Como cada exercício acontece</span><ol class="ritual" style="margin-top:10px">${CFG.RITUAL.map(r => { const [a, b] = r.split(': '); return `<li><b>${esc(a)}</b>${esc(b)}</li>`; }).join('')}</ol></div>
    <details class="about"><summary>Sobre o encontro: objetivo, objetivos específicos e glossário</summary>
      <p style="margin:0 0 10px;font-size:15px">${esc(CFG.OBJETIVO)}</p>
      <ol>${CFG.OBJ_ESP.map(o => `<li>${esc(o)}</li>`).join('')}</ol>
      <dl>${CFG.GLOSSARIO.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl></details>
    <div class="homeinfo">
      <div><b>Um exercício por vez</b>O tablet abre só o exercício liberado pela equipe, com o mesmo nome da sessão do cronograma. Depois de enviado, não é possível voltar nem editar.</div>
      <div><b>Tempo da programação</b>Cada etapa mostra o horário oficial, o tempo restante e o passo a passo, com minutos que somam exatamente a duração da sessão.</div>
      <div><b>Sem perder nada</b>As respostas ficam salvas no próprio celular. Se a internet cair, o registro continua e sincroniza quando a conexão voltar.</div>
    </div>
  </section></div>`;
}

// ---------- tablet ----------
function tabletHTML(g) {
  const act = activeStage();
  const e = E[S.view] || (DEMO ? WORK.find(x => x.ex) : act);
  S.view = e.id;
  if (!S.dayView) S.dayView = e.dia;
  return `<div class="wrap"><div class="shell">
    <aside class="rail">${railHTML(g)}</aside>
    <section>${stageHTML(e, g, act)}</section>
  </div></div>`;
}
function railHTML(g) {
  const act = activeStage();
  const day = S.dayView || act.dia;
  return `<div class="daytabs" role="group" aria-label="Dia">${DIAS.map(d => `<button data-day="${d.n}" aria-pressed="${d.n === day}">Dia ${d.n}</button>`).join('')}</div>
    <div class="eyebrow" style="padding:4px 2px">${esc(DIAS[day - 1].eixo)}</div>
    <ol class="tl">${ETAPAS.filter(e => e.dia === day).map(e => {
      if (e.tipo === 'pausa') return `<li class="pausa"><button disabled><span class="t">${hm(e.ini)}</span><span class="n">${esc(e.sessao)}</span><span></span></button></li>`;
      const st = statusOf(e.id, g.id); const isAct = e.id === act.id;
      const pill = e.resp === 'unodc' ? '<span class="s">UNODC</span>' : st === 'enviada' ? '<span class="s ok">Enviado</span>' : !dayOpen(e.dia) ? `<span class="s">Abre ${DIA_DATA[e.dia]}</span>` : (isAct && !DEMO) ? '<span class="s agora">Agora</span>' : '';
      const sel = e.id === S.view; const op = dayOpen(e.dia);
      return `<li class="${sel ? 'ativa' : ''}"><button ${op ? `data-go="${e.id}"` : 'disabled'} ${sel ? 'aria-current="step"' : ''}><span class="t">${hm(e.ini)}</span><span class="n">${e.ex ? `<b class="mono" style="font-size:12px">Ex. ${e.ex}</b> ` : ''}${esc(e.sessao)}</span>${pill}</button></li>`;
    }).join('')}</ol>
    <p class="muted" style="font-size:12.5px;margin:6px 2px">${dayOpen(day) ? 'Toque em qualquer atividade para abrir. Os exercícios ficam abertos para escrever, alterar e salvar.' : `As atividades do Dia ${day} abrem no início do dia, em ${DIA_DATA[day]}.`} Depois de enviado, o registro segue para a equipe e não pode mais ser alterado.</p>`;
}
function stepsHTML(e) {
  let t = toMin(e.ini);
  return `<ol class="steps">${e.passos.map(p => { const a = t; t += p.min; return `<li><span class="when"><b>${p.min} min</b>${fromMin(a)}–${fromMin(t)}</span><span>${esc(p.txt)}</span></li>`; }).join('')}</ol>`;
}
const fill = (s, g) => String(s || '').replace('{mesa}', g.mesa).replace('{eixo}', g.eixo);
const hhmm = (ts) => { const d = new Date(ts); return `${pad(d.getHours())}h${pad(d.getMinutes())}`; };
function stageHead(e, g) {
  const tipo = e.tipo === 'grupo' ? '<span class="badge grupo">Dinâmica em grupo</span>' : e.tipo === 'apoio' ? '<span class="badge">Acolhimento</span>' : '<span class="badge">Plenária</span>';
  return `<div class="stage-head">
      ${e.ex ? `<span class="exname">${esc(e.exNome)}</span>` : `<span class="exname none">Sem exercício nesta sessão</span>`}
      <div class="meta">${tipo}<span><b>${esc(DIAS[e.dia - 1].rotulo)}</b></span><span class="mono"><b>${hm(e.ini)}–${hm(e.fim)}</b></span><span>Conteúdo: <b>${esc(e.quem)}</b></span><span>Tema: <b>${esc(e.tema)}</b></span></div>
      <h2>${esc(e.sessao)}</h2>
      <div class="timer" data-timer="${e.id}"><div class="row"><span class="big"></span><span class="sub muted"></span></div><div class="bar"><i></i></div></div>
    </div>`;
}
const DIA_INI = { 1: '2026-11-16T07:00:00-03:00', 2: '2026-11-17T07:00:00-03:00', 3: '2026-11-18T07:00:00-03:00' };
const DIA_DATA = { 1: '16/11', 2: '17/11', 3: '18/11' };
const dayOpen = (d) => d === 1 || DEMO || PANEL(S.role) || (S.diasLib || []).includes(d) || Date.now() >= Date.parse(DIA_INI[d]);
const isOpen = (e) => dayOpen(e.dia);
function stageHTML(e, g, act) {
  const order = WORK.findIndex(x => x.id === e.id), actOrder = WORK.findIndex(x => x.id === act.id);
  const doc = getDoc(e.id, g.id);
  if (doc.status === 'enviada' && !PANEL(S.role)) {
    return `<article class="stage"><div class="pausebox"><h2>${esc(e.exNome || e.sessao)}</h2><p>Enviado às <b>${hhmm(doc.enviadoEm)}</b>. O registro foi entregue à equipe de facilitação e, por segurança, não fica mais visível nem editável neste aparelho.</p><button class="btn" data-go="${act.id}">Ir para o exercício atual</button></div></article>`;
  }
  if (!isOpen(e)) {
    const msg = `<h2>${esc(e.exNome || e.sessao)}</h2><p>As atividades do Dia ${e.dia} abrem no início do dia, em <b>${DIA_DATA[e.dia]}</b>. Horário desta atividade: <b>${hm(e.ini)}–${hm(e.fim)}</b>.</p>`;
    return `<article class="stage"><div class="pausebox">${msg}<button class="btn" data-go="${act.id}">Ir para o exercício atual</button></div></article>`;
  }
  if (e.resp === 'unodc' && !PANEL(S.role)) return `<article class="stage" data-stage="${e.id}">${stageHead(e, g)}<div class="stage-body"><div class="pede"><span class="eyebrow">Registro da UNODC</span><p class="pede-t">Este exercício é registrado pela UNODC, com o INPE e a SEMAS/PA. O grupo acompanha as apresentações e o Termômetro de Convergência; não há registro do grupo.</p></div>
      <div class="two"><div class="box"><h3>O que acontece nesta sessão</h3><p>${esc(e.papel)}</p><p class="muted" style="margin-top:10px;font-size:14px"><b>Conteúdo da sessão:</b> ${esc(e.conteudo)}</p></div><div class="box"><h3>Passo a passo no tempo</h3>${stepsHTML(e)}</div></div></div></article>`;
  const sent = doc.status === 'enviada';
  return `<article class="stage" data-stage="${e.id}">
    ${stageHead(e, g)}
    ${e.ex && !sent ? `<div class="quando"><b>Quando:</b> ${esc(e.quando)}</div>` : ''}
    <div class="stage-body">
      ${e.ex && !sent ? `<div class="pede"><span class="eyebrow">O que este exercício pede</span><p class="pede-t">${esc(e.pede)}</p><p class="pede-e"><b>O grupo entrega:</b> ${esc(e.entrega)}</p></div>` : ''}
      ${e.tipo === 'grupo' && !sent ? `<div class="rodada"><div><b>Rodada de 1 minuto</b><span class="muted" style="display:block;font-size:13.5px">Cada estado ou instituição fala uma vez. Toque para iniciar o tempo de quem vai falar.</span></div><span class="rt mono" id="rt">1:00</span><button class="btn" data-rodada="1" id="rtbtn">Iniciar</button></div>` : ''}
      ${sent ? `<div class="sentbox"><span class="ok-ic" aria-hidden="true">✓</span><div><h3>${esc(e.exNome)} enviado às ${hhmm(doc.enviadoEm)}</h3><p>As respostas do ${esc(g.nome)} foram registradas. Aguarde a equipe liberar o próximo exercício.</p></div></div>` : ''}
      <div class="two">
        <div class="box"><h3>O que o grupo faz</h3><p>${esc(fill(e.papel, g))}</p>
          ${e.observe?.length ? `<p style="margin-top:12px;font-weight:600">Perguntas para orientar o registro</p><ul class="obs">${e.observe.map(o => `<li>${esc(o)}</li>`).join('')}</ul>` : ''}
          <p class="muted" style="margin-top:10px;font-size:14px"><b>Conteúdo da sessão:</b> ${esc(e.conteudo)}</p>
          <p class="muted" style="margin-top:6px;font-size:14px"><b>Resultado esperado:</b> ${esc(e.resultado)}</p></div>
        <div class="box"><h3>Passo a passo no tempo</h3>${stepsHTML(e)}</div>
      </div>
      ${e.nota ? `<p class="note">${esc(e.nota)}</p>` : ''}
      ${e.individual ? `<div class="box" style="border-color:var(--river)"><h3>${esc(e.individual.titulo)}</h3><p>Exercício individual. Cada participante responde a sua avaliação, no celular ou na ficha impressa.</p><p style="margin-top:10px"><a class="btn" href="#avaliacao" style="text-decoration:none;display:inline-flex;align-items:center">Abrir avaliação individual</a></p></div>` : ''}
      ${e.ex && !sent ? `<div class="form" data-doc="${docId(e.id, g.id)}"><h3>${esc(e.exNome)} · registro do ${esc(g.nome)}</h3>${CFG.camposDe(e, g).map(f => fieldHTML(f, doc.dados, true, e, g)).join('')}</div>` : !e.ex ? `<p class="muted">Nesta sessão o grupo acompanha a apresentação. Não há exercício.</p>` : ''}
    </div>
    ${e.ex && !sent ? `<div class="foot"><span class="savestate" data-save="${docId(e.id, g.id)}">${doc.atualizadoEm ? 'Rascunho salvo' : 'Rascunho salvo automaticamente enquanto o grupo escreve'}</span>
      <div class="sendzone" id="sendzone"><button class="btn" data-enviar="${e.id}">Enviar ${esc(e.exNome.split(' · ')[0].toLowerCase())}</button></div></div>` : ''}
  </article>`;
}

// ---------- campos ----------
function fieldHTML(f, data, ed, e, g, path = '') {
  const key = path + f.k; const v = data?.[f.k];
  const dis = ed ? '' : 'disabled';
  const id = 'f-' + key.replace(/[^\w-]/g, '_');
  const hint = f.h ? `<span class="hint">${esc(f.h)}</span>` : '';
  switch (f.t) {
    case 'guia': return `<div class="guia" style="border:1px solid var(--line);border-left:6px solid ${g && g.cor ? g.cor : 'var(--forest)'};border-radius:10px;padding:12px 14px;background:var(--paper,#fff)"><span class="eyebrow">${esc(f.h || '')}</span><h4 style="margin:4px 0 6px;font-size:17px">${esc(f.l)}</h4><ul class="obs">${(f.o || []).map(q => `<li>${esc(q)}</li>`).join('')}</ul></div>`;
    case 'line': return `<div class="fld"><label for="${id}">${esc(f.l)}</label>${hint}<input type="text" id="${id}" data-k="${key}" value="${esc(v || '')}" ${dis}></div>`;
    case 'area': return `<div class="fld"><label for="${id}">${esc(f.l)}</label>${hint}<textarea id="${id}" data-k="${key}" rows="${Math.max(4, (f.rows || 3) + 1)}" ${dis}>${esc(v || '')}</textarea></div>`;
    case 'select': return `<div class="fld"><label for="${id}">${esc(f.l)}</label><select id="${id}" data-k="${key}" ${dis}><option value="">Selecione</option>${f.o.map(o => `<option ${v === o ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select></div>`;
    case 'choice': return `<div class="fld"><span class="lbl">${esc(f.l)}</span><div class="opts" role="radiogroup">${f.o.map(o => `<label><input type="radio" name="${id}" data-k="${key}" value="${esc(o)}" ${v === o ? 'checked' : ''} ${dis}>${esc(o)}</label>`).join('')}</div></div>`;
    case 'multi': if (f.k === 'presentes' && S.mesaParts && S.mesaParts.length) { const opts = S.mesaParts.map(m => m.nome + (m.uf ? ' (' + m.uf + ')' : '')); return `<div class="fld"><span class="lbl">Presentes neste exercício</span><span class="hint">Lista do grupo, vinda do credenciamento</span><div class="opts">${opts.map(o => `<label><input type="checkbox" data-k="${key}" data-multi="1" value="${esc(o)}" ${(v || []).includes(o) ? 'checked' : ''} ${dis}>${esc(o)}</label>`).join('')}</div></div>`; }
      return `<div class="fld"><span class="lbl">${esc(f.l)}</span><div class="opts">${f.o.map(o => `<label><input type="checkbox" data-k="${key}" data-multi="1" value="${esc(o)}" ${(v || []).includes(o) ? 'checked' : ''} ${dis}>${esc(o)}</label>`).join('')}</div></div>`;
    case 'repeat': {
      const arr = Array.isArray(v) ? v : [];
      const n = Math.max(f.n, arr.length);
      return `<div class="fld"><span class="lbl">${esc(f.item)}s</span><div class="rep ${f.compact ? 'compact' : 'cardgrid'}" ${f.compact ? '' : 'style="grid-template-columns:minmax(0,1fr)"'}>${Array.from({ length: n }, (_, i) =>
        `<div class="card"><div class="ct"><b><span class="num">${i + 1}</span>${esc(f.titles ? f.item + ': ' + f.titles[i] : f.item)}</b></div>${f.guias && f.guias[i] ? `<div class="guia"><span class="eyebrow">Perguntas para orientar a rodada</span><ul class="obs">${f.guias[i].map(q => `<li>${esc(q)}</li>`).join('')}</ul></div>` : ''}${f.f.map(sf => fieldHTML(sf, arr[i] || {}, ed, e, g, `${key}.${i}.`)).join('')}</div>`).join('')}</div></div>`;
    }
    case 'lista': {
      const arr = Array.isArray(v) ? v : [];
      return `<div class="fld"><span class="lbl">${esc(f.l)}</span>${hint}<div class="tbl-wrap"><table><thead><tr><th>Nº</th><th>Nome</th><th>Estado (UF) ou instituição</th><th>Órgão ou função</th></tr></thead><tbody>${Array.from({ length: f.n }, (_, i) =>
        `<tr><td>${i + 1}</td>${['nome', 'uf', 'orgao'].map(c => `<td><input type="text" aria-label="${c} ${i + 1}" data-k="${key}.${i}.${c}" value="${esc((arr[i] || {})[c] || '')}" ${dis}></td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
    }
    case 'rating': {
      const o = v || {};
      return `<div class="fld"><span class="lbl">${esc(f.l)}</span><div class="rating">${f.o.map((q, i) => `<div class="r"><span>${esc(q)}</span><div class="seg" role="group" aria-label="${esc(q)}">${[1, 2, 3, 4, 5].map(nv => `<button type="button" data-k="${key}.${i}" data-val="${nv}" aria-pressed="${o[i] == nv}" ${dis}>${nv}</button>`).join('')}</div></div>`).join('')}</div></div>`;
    }
    case 'clinica': {
      const arr = clinicaItems(g, v);
      return `<div class="fld"><span class="lbl">${esc(f.l)}</span><span class="hint">As primeiras vêm dos Grupos temáticos (Dia 1). Inclua nos campos seguintes as demandas que surgiram hoje.</span><div class="rep">${arr.map((it, i) =>
        `<div class="card"><div class="ct"><b><span class="num">${i + 1}</span>Demanda</b>${it.origem ? `<span class="badge">${esc(it.origem)}</span>` : ''}</div>
          ${fieldHTML({ k: 'demanda', t: 'area', l: 'Demanda', rows: 1 }, it, ed, e, g, `${key}.${i}.`)}
          ${fieldHTML({ k: 'categoria', t: 'choice', l: 'Categoria', o: f.o }, it, ed, e, g, `${key}.${i}.`)}
          <div class="two">${fieldHTML({ k: 'competente', t: 'line', l: 'Produto ou instituição que pode atender' }, it, ed, e, g, `${key}.${i}.`)}
          ${fieldHTML({ k: 'lacuna', t: 'line', l: 'Lacuna que permanece' }, it, ed, e, g, `${key}.${i}.`)}</div>
          ${/SISFOGO/.test(it.categoria || '') ? fieldHTML({ k: 'requisito', t: 'line', l: 'Requisito de integração (trilha SISFOGO/ADPF nº 743)' }, it, ed, e, g, `${key}.${i}.`) : ''}
        </div>`).join('')}</div>${ed ? `<button type="button" class="addbtn" data-add="${key}">+ Incluir outra demanda</button>` : ''}</div>`;
    }
    case 'priorizacao': {
      const arr = priorItems(g, v);
      return `<div class="fld"><span class="lbl">${esc(f.l)}</span><span class="hint">1 = baixo · 2 = médio · 3 = alto. Em dependências, 3 significa poucas dependências.</span><div class="rep">${arr.map((it, i) => {
        const tot = f.crit.reduce((a, _, c) => a + (Number(it['c' + c]) || 0), 0);
        return `<div class="card"><div class="ct"><b><span class="num">${i + 1}</span>${esc(it.demanda || 'Demanda')}</b><span class="total">Total ${tot} / 18</span></div>
          ${it.categoria ? `<span class="muted" style="font-size:13.5px">${esc(it.categoria)}</span>` : ''}
          ${!it.fixa ? fieldHTML({ k: 'demanda', t: 'line', l: 'Demanda' }, it, ed, e, g, `${key}.${i}.`) : ''}
          <div class="score">${f.crit.map((c, ci) => `<div class="crit">${esc(c)}<div class="seg">${[1, 2, 3].map(nv => `<button type="button" data-k="${key}.${i}.c${ci}" data-val="${nv}" aria-pressed="${it['c' + ci] == nv}" ${dis}>${nv}</button>`).join('')}</div></div>`).join('')}</div>
          ${fieldHTML({ k: 'horizonte', t: 'choice', l: 'Horizonte', o: f.hz }, it, ed, e, g, `${key}.${i}.`)}
        </div>`; }).join('')}</div>${ed ? `<button type="button" class="addbtn" data-add="${key}">+ Incluir outra demanda</button>` : ''}</div>`;
    }
  }
  return '';
}
function clinicaItems(g, v) {
  if (Array.isArray(v) && v.length) return v;
  const d1 = S.resp[docId('d1-grupos', g.id)]?.dados?.demandas || [];
  const base = d1.filter(x => x && x.problema).map(x => ({ demanda: x.problema, competente: x.competente || '', lacuna: x.lacuna || '', origem: 'Dia 1' }));
  while (base.length < 5) base.push({ demanda: '', origem: 'Dia 1' });
  while (base.length < 7) base.push({ demanda: '' });
  return base;
}
function priorItems(g, v) {
  if (Array.isArray(v) && v.length) return v;
  const cl = S.resp[docId('d2-clinicas', g.id)]?.dados?.itens || [];
  const base = cl.filter(x => x && x.demanda).map(x => ({ demanda: x.demanda, categoria: x.categoria || '', fixa: true }));
  while (base.length < 3) base.push({ demanda: '' });
  return base;
}

// set by path "a.0.b"
function setPath(obj, path, val) {
  const ks = path.split('.'); let o = obj;
  for (let i = 0; i < ks.length - 1; i++) { const k = ks[i], nk = ks[i + 1]; if (o[k] == null) o[k] = /^\d+$/.test(nk) ? [] : {}; o = o[k]; }
  o[ks[ks.length - 1]] = val;
}
function getPath(obj, path) { return path.split('.').reduce((o, k) => o == null ? undefined : o[k], obj); }

function editDoc(formEl, mut) {
  if (formEl.dataset.equipe && S.eqEdit) { const d = S.eqEdit; const e = E[d.etapa]; const g = G[d.grupo]; d.dados = d.dados || {}; e.campos.forEach(f => { if ((f.t === 'clinica' || f.t === 'priorizacao') && !Array.isArray(d.dados[f.k])) d.dados[f.k] = JSON.parse(JSON.stringify(f.t === 'clinica' ? clinicaItems(g) : priorItems(g))); }); mut(d.dados); S.eqDirty = true; const st = $('#eqstate'); if (st) st.textContent = 'Alterações não salvas'; return; }
  const id = formEl.dataset.doc; const doc = S.resp[id]; if (!doc || doc.status === 'enviada') return; const e = E[doc.etapa]; const g = G[doc.grupo];
  // materializa listas derivadas na primeira edição
  e.campos.forEach(f => { if ((f.t === 'clinica' || f.t === 'priorizacao') && !Array.isArray(doc.dados[f.k])) doc.dados[f.k] = JSON.parse(JSON.stringify(f.t === 'clinica' ? clinicaItems(g) : priorItems(g))); });
  mut(doc.dados);
  doc.atualizadoEm = Date.now(); doc.status = 'andamento';
  doc.lider = doc.dados?.lider || '';
  queueSave(id);
}

// ---------- eventos ----------
document.addEventListener('input', ev => {
  const ta = ev.target; const af = ta.closest?.('.form[data-aval]');
  if (af && ta.dataset.k) { if (ta.type === 'radio') setPath(S.aval, ta.dataset.k, ta.value); else setPath(S.aval, ta.dataset.k, ta.value); return; }
  const t = ev.target; const form = t.closest('.form[data-doc]'); if (!form || t.disabled) return;
  const k = t.dataset.k; if (!k) return;
  if (t.type === 'checkbox' && t.dataset.multi) { editDoc(form, d => { const arr = new Set(getPath(d, k) || []); t.checked ? arr.add(t.value) : arr.delete(t.value); setPath(d, k, [...arr]); }); return; }
  if (t.type === 'radio') { editDoc(form, d => setPath(d, k, t.value)); if (/categoria$/.test(k)) rerenderStage(); return; }
  editDoc(form, d => setPath(d, k, t.value));
});
document.addEventListener('change', ev => { const t = ev.target; if (t.tagName === 'SELECT' && t.closest('.form[data-doc]')) { const form = t.closest('.form'); editDoc(form, d => setPath(d, t.dataset.k, t.value)); } });
function rerenderStage() { const y = scrollY; const g = G[S.role]; const sec = $('.shell > section'); if (sec) { sec.innerHTML = stageHTML(E[S.view], g, activeStage()); tick(); } scrollTo(0, y); }


// ---------- credenciamento (organização e UNODC) ----------
const TIPOS = ['Estadual', 'Federal', 'Municipal', 'Organismo internacional', 'Universidade ou pesquisa', 'Sociedade civil', 'Outro'];
const DIAS3 = [['d1', '16/11'], ['d2', '17/11'], ['d3', '18/11']];
const normTxt = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function credDia() { if (S.credDia) return S.credDia; const k = { '2026-11-16': 'd1', '2026-11-17': 'd2', '2026-11-18': 'd3' }[new Date().toLocaleDateString('sv-SE')]; return k || 'd1'; }
function mesaOpts(sel) { return `<option value="">Sem grupo</option>${GRUPOS.map(g => `<option value="${g.id}" ${sel === g.id ? 'selected' : ''}>${esc(g.papel)} · ${esc(CFG.CORES.find(c => c.id === g.base)?.nome || '')}</option>`).join('')}`; }
function pformHTML(p) {
  const v = (k) => esc(p[k] || ''); const pr = p.presenca || {};
  return `<div class="pform" data-pform="${p.id || 'novo'}">
    <label class="full">Nome completo *<input data-pf="nome" value="${v('nome')}" autocomplete="off"></label>
    <label>Nome para o crachá<input data-pf="nome_cracha" value="${v('nome_cracha')}"></label>
    <label>Instituição<input data-pf="instituicao" value="${v('instituicao')}"></label>
    <label>Tipo de instituição<select data-pf="tipo"><option value=""></option>${TIPOS.map(t => `<option ${p.tipo === t ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
    <label>Cargo ou função<input data-pf="cargo" value="${v('cargo')}"></label>
    <label>Estado que representa<select data-pf="estado"><option value=""></option>${[...UFS, 'Não se aplica'].map(t => `<option ${p.estado === t ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
    <label>UF de origem<input data-pf="uf" value="${v('uf')}" maxlength="2" style="text-transform:uppercase"></label>
    <label>Cidade<input data-pf="cidade" value="${v('cidade')}"></label>
    <label>E-mail<input data-pf="email" type="email" value="${v('email')}"></label>
    <label>Telefone ou WhatsApp<input data-pf="telefone" type="tel" value="${v('telefone')}"></label>
    <label>Grupo<select data-pf="mesa">${mesaOpts(p.mesa)}</select></label>
    <div class="full"><span style="font-size:14px;font-weight:600">Presença</span><div class="chk">${DIAS3.map(([k, l]) => `<label><input type="checkbox" data-pfp="${k}" ${pr[k] ? 'checked' : ''}> ${l}</label>`).join('')}</div></div>
    <div class="full"><span style="font-size:14px;font-weight:600">Autoriza o uso de imagem</span><div class="chk">${['Sim', 'Não'].map(o => `<label><input type="radio" name="img-${p.id || 'novo'}" data-pf="autoriza_imagem" value="${o}" ${p.autoriza_imagem === o ? 'checked' : ''}> ${o}</label>`).join('')}</div></div>
    <label class="full">Observações<textarea data-pf="observacoes" rows="2">${v('observacoes')}</textarea></label>
    <div class="full" style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" data-psave="${p.id || 'novo'}">Salvar</button><button class="btn ghost" data-pcancel="1">Cancelar</button></div>
  </div>`;
}
function credHTML() {
  const P = S.parts || []; const dia = credDia(); const q = normTxt(S.credQ);
  const lista = P.filter(p => (!q || normTxt([p.nome, p.nome_cracha, p.instituicao, p.uf, p.cargo, p.cidade, p.estado].join(' ')).includes(q)) && (!S.credUF || p.uf === S.credUF) && (!S.credMesa || (S.credMesa === 'sem' ? !p.mesa : p.mesa === S.credMesa)));
  const pres = P.filter(p => p.presenca && p.presenca[dia]).length; const semMesa = P.filter(p => !p.mesa).length; const pend = (LS.get('credPend', []) || []).length;
  const ufs = [...new Set(P.map(p => p.uf).filter(Boolean))].sort();
  const dl = DIAS3.find(d => d[0] === dia)[1];
  return `<div>
    <div class="credtop"><div class="k"><b>${P.length}</b><span>inscritos</span></div><div class="k"><b>${pres}</b><span>presentes em ${dl}</span></div><div class="k"><b>${P.length - pres}</b><span>ainda não credenciados em ${dl}</span></div><div class="k"><b>${semMesa}</b><span>sem grupo definido</span></div></div>
    ${pend ? `<div class="banner">${pend} alteração(ões) guardada(s) neste aparelho, aguardando conexão para enviar.</div>` : ''}
    <div class="credbar"><span class="seg3" role="group" aria-label="Dia">${DIAS3.map(([k, l]) => `<button data-pdia="${k}" aria-pressed="${k === dia}">${l}</button>`).join('')}</span>
      <input type="search" id="credq" placeholder="Buscar por nome, instituição ou estado" value="${esc(S.credQ || '')}" autocomplete="off">
      <select id="creduf" aria-label="Filtrar por UF"><option value="">Todas as UFs</option>${ufs.map(u => `<option ${S.credUF === u ? 'selected' : ''}>${u}</option>`).join('')}</select>
      <select id="credmesa" aria-label="Filtrar por grupo"><option value="">Todos os grupos</option><option value="sem" ${S.credMesa === 'sem' ? 'selected' : ''}>Sem grupo</option>${GRUPOS.map(g => `<option value="${g.id}" ${S.credMesa === g.id ? 'selected' : ''}>${esc(g.papel)}</option>`).join('')}</select>
      <button class="btn" id="cred-novo">+ Novo participante</button><button class="btn ghost" id="cred-csv">Baixar lista</button></div>
    ${S.credEdit === 'novo' ? `<div class="pcard">${pformHTML({ presenca: { [dia]: true } })}</div>` : ''}
    <div class="plist">${lista.map(p => { const on = !!(p.presenca && p.presenca[dia]); const g = G[p.mesa];
      return `<div class="pcard ${on ? 'on' : ''}"><div class="prow"><div class="pmain"><b>${esc(p.nome)}</b><span>${esc([p.instituicao, p.uf, p.cargo].filter(Boolean).join(' · '))}</span></div>
        <div class="pact"><select data-pmesa="${p.id}" aria-label="Grupo de ${esc(p.nome)}" ${g ? `style="border-left:6px solid ${g.cor}"` : ''}>${mesaOpts(p.mesa)}</select>
        <button class="pbtn" data-ppres="${p.id}">${on ? 'Presente ✓' : 'Credenciar'}</button><button class="lbtn" data-pedit="${p.id}">${S.credEdit === p.id ? 'Fechar' : 'Dados'}</button></div></div>
        ${S.credEdit === p.id ? pformHTML(p) : ''}</div>`; }).join('') || '<p class="muted">Nenhum participante encontrado.</p>'}</div>
  </div>`;
}
function credRender(keepFocus) { const tb = $('#tabbody'); if (!tb) return; const a = document.activeElement; const id = a && a.id; const pos = a && a.selectionStart; const y = scrollY; tb.innerHTML = credHTML(); scrollTo(0, y); if (keepFocus && id) { const el = document.getElementById(id); if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch {} } } }
async function savePart(doc) {
  S.parts = S.parts || []; const i = doc.id ? S.parts.findIndex(p => p.id === doc.id) : -1; if (i >= 0) S.parts[i] = { ...S.parts[i], ...doc };
  try { if (!S.db || !S.db.salvarParticipante) throw new Error('offline'); const r = await S.db.salvarParticipante(doc);
    if (r) { const j = S.parts.findIndex(p => p.id === r.id); if (j >= 0) S.parts[j] = r; else S.parts.push(r); } toast('Salvo'); return true; }
  catch (e) { if (/nome obrigatorio/.test(String(e))) { toast('Informe o nome do participante.'); return false; } const pend = LS.get('credPend', []); pend.push(doc); LS.set('credPend', pend); toast('Sem conexão: guardado neste aparelho e enviado quando a conexão voltar.'); return true; }
}
setInterval(async () => { if (!S.db || !S.db.salvarParticipante) return; const pend = LS.get('credPend', []); if (!pend.length) return; const rest = []; for (const d of pend) { try { await S.db.salvarParticipante(d); } catch { rest.push(d); } } LS.set('credPend', rest); }, 10000);
function readPform(box) { const doc = {}; box.querySelectorAll('[data-pf]').forEach(el => { if (el.type === 'radio') { if (el.checked) doc[el.dataset.pf] = el.value; } else doc[el.dataset.pf] = el.value.trim(); }); doc.uf = (doc.uf || '').toUpperCase(); doc.presenca = {}; box.querySelectorAll('[data-pfp]').forEach(el => { doc.presenca[el.dataset.pfp] = el.checked; }); return doc; }
function credCSV() {
  const cols = [['ordem', 'Nº'], ['nome', 'Nome'], ['nome_cracha', 'Nome no crachá'], ['instituicao', 'Instituição'], ['tipo', 'Tipo'], ['cargo', 'Cargo'], ['estado', 'Estado que representa'], ['uf', 'UF'], ['cidade', 'Cidade'], ['email', 'E-mail'], ['telefone', 'Telefone'], ['mesa', 'Grupo'], ['d1', '16/11'], ['d2', '17/11'], ['d3', '18/11'], ['autoriza_imagem', 'Uso de imagem'], ['observacoes', 'Observações']];
  const q = (x) => '"' + String(x ?? '').replace(/"/g, '""') + '"';
  const rows = (S.parts || []).map(p => cols.map(([k]) => q(k === 'mesa' ? (G[p.mesa]?.papel || '') : /^d[123]$/.test(k) ? (p.presenca?.[k] ? 'Presente' : '') : p[k])).join(';'));
  const blob = new Blob(['﻿' + [cols.map(c => q(c[1])).join(';'), ...rows].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'credenciamento_encontro_fogo.csv'; document.body.appendChild(a); a.click(); a.remove();
}
document.addEventListener('input', ev => { if (ev.target.id === 'credq') { S.credQ = ev.target.value; credRender(true); } });
document.addEventListener('change', async ev => { const t = ev.target;
  if (t.id === 'creduf') { S.credUF = t.value; credRender(); return; }
  if (t.id === 'credmesa') { S.credMesa = t.value; credRender(); return; }
  if (t.dataset.pmesa) { const p = (S.parts || []).find(x => String(x.id) === t.dataset.pmesa); if (p) { await savePart({ ...p, mesa: t.value }); credRender(); } } });
document.addEventListener('click', async ev => {
  const b = ev.target.closest('button'); if (!b) return;
  if (b.id === 'outro-grupo') { S.screen = 'troca'; render(); scrollTo(0, 0); return; }
  if (b.dataset.trocacancel) { S.screen = 'auto'; render(); return; }
  if (b.dataset.trocapara) { try { const c = await rpc('ef_trocar_mesa', { p_codigo: LS.get('codigo', null), p_mesa: b.dataset.trocapara }); if (!c) throw new Error('x'); S.screen = 'auto'; await entrar(c); toast('Agora este aparelho está no ' + G[b.dataset.trocapara].papel); } catch (e) { toast(/troca bloqueada/.test(String(e)) ? 'A troca de grupo fica liberada depois do Exercício 1.' : 'Não foi possível trocar agora. Verifique a conexão.'); } return; }
  if (b.dataset.eqedit) { const id = docId(b.dataset.eqstage, b.dataset.eqedit); const d = S.resp[id] || { etapa: b.dataset.eqstage, grupo: b.dataset.eqedit, status: 'vazio', dados: {} }; S.eqEdit = JSON.parse(JSON.stringify(d)); S.eqEdit.dados = S.eqEdit.dados || {}; S.eqDirty = false; render(); scrollTo(0, 0); return; }
  if (b.dataset.eqback) { if (S.eqDirty && !b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'Há alterações não salvas. Toque de novo para sair'; return; } S.eqEdit = null; S.eqDirty = false; render(); return; }
  if (b.dataset.eqsave) { const d = S.eqEdit; const st = $('#eqst')?.value || 'andamento'; const id = docId(d.etapa, d.grupo); const now = Date.now();
    const doc = { ...d, status: st, atualizadoEm: now, editadoPorEquipe: now, enviadoEm: st === 'enviada' ? (d.enviadoEm || now) : null };
    try { await rpc('ef_salvar_equipe', { p_codigo: LS.get('codigo', null), p_id: id, p_doc: doc }); S.resp[id] = JSON.parse(JSON.stringify(doc)); S.eqEdit = JSON.parse(JSON.stringify(doc)); S.eqDirty = false; toast('Alterações salvas na base'); render(); }
    catch { toast('Não foi possível salvar agora. Verifique a conexão e tente de novo.'); } return; }
  if (b.dataset.libdia) { const d = Number(b.dataset.libdia); const cur = S.diasLib || []; const nv = cur.includes(d) ? cur.filter(x => x !== d) : [...cur, d].sort(); try { await S.db.liberarDias(nv); S.diasLib = nv; toast(cur.includes(d) ? `Dia ${d} fechado para os grupos` : `Dia ${d} liberado para os grupos`); } catch { toast('Não foi possível alterar agora. Verifique a conexão.'); } render(); return; }
  if (b.dataset.pdia) { S.credDia = b.dataset.pdia; credRender(); return; }
  if (b.id === 'cred-novo') { S.credEdit = 'novo'; credRender(); const el = $('[data-pform="novo"] [data-pf="nome"]'); if (el) el.focus(); return; }
  if (b.id === 'cred-csv') { credCSV(); return; }
  if (b.dataset.pedit) { const id = Number(b.dataset.pedit); S.credEdit = S.credEdit === id ? null : id; credRender(); return; }
  if (b.dataset.pcancel) { S.credEdit = null; credRender(); return; }
  if (b.dataset.ppres) { const p = (S.parts || []).find(x => String(x.id) === b.dataset.ppres); if (p) { const d = credDia(); await savePart({ ...p, presenca: { ...(p.presenca || {}), [d]: !(p.presenca && p.presenca[d]) } }); credRender(); } return; }
  if (b.dataset.psave) { const box = b.closest('[data-pform]'); const doc = readPform(box); if (b.dataset.psave !== 'novo') doc.id = Number(b.dataset.psave); if (!doc.nome) { toast('Informe o nome do participante.'); return; } if (await savePart(doc)) { S.credEdit = null; credRender(); } return; }
  if (b.dataset.hash) { if (S.pendingStage) { location.hash = b.dataset.hash + '-' + S.pendingStage; S.pendingStage = null; } else location.hash = b.dataset.hash; return; }
  if (b.id === 'login-equipe') { S.loginEquipe = true; S.screen = 'login'; render(); return; }
  if (b.id === 'voltar-mesas') { S.loginEquipe = false; S.screen = S.role ? 'auto' : 'login'; render(); return; }
  if (b.id === 'sair-evento') { LS.del('evento'); leaveMesa(); S.screen = 'login'; render(); return; }
  if (SUPA && b.dataset.role === 'equipe') { S.loginEquipe = true; S.screen = 'login'; render(); return; }
  if (b.dataset.role) { S.role = b.dataset.role; LS.set('role', S.role); S.view = null; S.dayView = null; if (S.pendingStage && !PANEL(S.role)) { S.view = S.pendingStage; S.dayView = E[S.pendingStage].dia; } S.pendingStage = null; render(); scrollTo(0, 0); return; }
  if (b.dataset.copylink) { const url = BASE + '#' + b.dataset.copylink; try { await navigator.clipboard.writeText(url); toast('Link copiado'); } catch { toast(url); } return; }
  if (b.id === 'aval-enviar') { await enviarAval(); return; }
  if (b.id === 'aval-proxima') { S.aval = {}; S.avalSent = false; render(); scrollTo(0, 0); return; }
  if (b.dataset.val && b.closest('.form[data-aval]')) { setPath(S.aval, b.dataset.k, Number(b.dataset.val)); const y = scrollY; render(); scrollTo(0, y); return; }
  if (b.id === 'trocar') { if (SUPA && !PANEL(S.role)) { if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'Toque de novo para sair'; setTimeout(() => { delete b.dataset.armed; softRender(); }, 3500); return; } leaveMesa(); return; } if (b.dataset.armed) { S.role = null; LS.del('role'); if (SUPA) { LS.del('codigo'); location.reload(); return; } render(); return; } b.dataset.armed = '1'; b.textContent = 'Tocar de novo para trocar'; setTimeout(() => render(), 3000); return; }
  if (b.dataset.day) { S.dayView = Number(b.dataset.day); $('.rail').innerHTML = railHTML(G[S.role]); return; }
  if (b.dataset.go) { S.view = b.dataset.go; S.dayView = E[b.dataset.go].dia; render(); scrollTo(0, 0); return; }
  if (b.dataset.val && b.closest('.form[data-doc]')) { const form = b.closest('.form'); editDoc(form, d => setPath(d, b.dataset.k, Number(b.dataset.val))); rerenderStage(); return; }
  if (b.dataset.add) { const form = b.closest('.form'); editDoc(form, d => { const arr = getPath(d, b.dataset.add) || []; arr.push({ demanda: '' }); setPath(d, b.dataset.add, arr); }); rerenderStage(); return; }
  if (b.id === 'entrar') { entrar(); return; }
  if (b.dataset.rodada) { iniciarRodada(); return; }
  if (b.dataset.enviar) { const z = $('#sendzone'); const e = E[b.dataset.enviar]; z.innerHTML = `<div class="confirm" role="alert"><span>Depois de enviar, o grupo não poderá voltar nem editar o ${esc(e.exNome)}. Confirmar envio?</span><button class="btn" data-confirmar="${e.id}">Confirmar envio</button><button class="btn ghost" data-revisar="${e.id}">Revisar</button></div>`; return; }
  if (b.dataset.revisar) { const e = E[b.dataset.revisar]; $('#sendzone').innerHTML = `<button class="btn" data-enviar="${e.id}">Enviar ${esc(e.exNome.split(' · ')[0].toLowerCase())}</button>`; return; }
  if (b.dataset.confirmar) { b.disabled = true; await enviarExercicio(b.dataset.confirmar); return; }
  // painel
  if (b.id === 'geo-tentar') { b.disabled = true; b.textContent = 'Conferindo a localização…'; GEO.pos = null; GEO.err = null; GEO.pedido = true; await geoObter(); const c = S.codePend || LS.get('codigo', null); S.bloqueio = null; if (c) { await entrar(c); } else { S.screen = 'login'; render(); } return; }
  if (b.dataset.cerca) { try { await rpc('ef_cerca', { p_codigo: LS.get('codigo', null), p_modo: b.dataset.cerca }); S.cerca = { ...(S.cerca || {}), modo: b.dataset.cerca }; toast(b.dataset.cerca === 'desligada' ? 'Verificação de local desligada' : b.dataset.cerca === 'ligada' ? 'Verificação de local ligada agora' : 'Verificação de local automática nos dias do encontro'); } catch { toast('Não foi possível alterar agora. Verifique a conexão.'); } render(); return; }
  if (b.dataset.tab) { S.tab = b.dataset.tab; LS.set('tab', S.tab); render(); return; }
  if (b.dataset.liberar) { await liberar(b.dataset.liberar); return; }
  if (b.dataset.auto) { await liberar(null); return; }
  if (b.dataset.exp) { await exportar(b.dataset.exp); return; }
  if (b.id === 'imp-btn') { importar(); return; }
  if (b.dataset.copy) { const ta = $('#' + b.dataset.copy); try { await navigator.clipboard.writeText(ta.value); toast('Copiado'); } catch { ta.select(); toast('Selecionado. Use copiar do teclado.'); } return; }
});
document.addEventListener('change', ev => {
  const t = ev.target;
  if (t.id === 'resp-stage') { S.respStage = t.value; render(); }
  if (t.dataset.termo) { const [uf, cor] = t.dataset.termo.split('|'); const cur = { ...(S.termo[uf] || {}) }; cur[cor] = Number(t.value) || 0; S.termo[uf] = cur; if (S.db && S.mode === 'online') S.db.doc('termometro/' + uf.replace(/\s/g, '_')).set({ uf, ...cur }).catch(() => toast('Não foi possível salvar o termômetro.')); LS.set('termo', S.termo); }
});

// ---------- mapa do encontro ----------
function mapaHTML() {
  const ex = (e) => { const lab = exercicio(e); const cls = e.individual ? 'i' : lab === 'Sem registro' ? 'n' : 'g'; return `<span class="ex ${cls}">${lab}</span>`; };
  const itens = (e) => { if (e.id === 'd1-abertura' || !e.campos.length) return ''; const ls = e.campos.map(f => f.t === 'repeat' ? `${f.item}s (${f.n})` : f.l).slice(0, 5); return `<ul>${ls.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`; };
  return `<div class="wrap"><div class="mapa">
    <div><span class="eyebrow">Mapa do encontro</span><h1 style="font-size:clamp(26px,3.6vw,38px);margin-top:4px">Sessões, exercícios e links</h1>
      <p class="muted" style="max-width:72ch;margin:8px 0 0">Cada sessão tem o seu link. Os exercícios levam o nome da sessão do cronograma: ao terminar uma apresentação, o grupo faz o exercício com o mesmo nome. O celular só abre o exercício liberado pela equipe e, depois de enviado, não permite voltar nem editar.</p>
      <h2 style="font-size:22px;margin-top:18px">Acesso de cada grupo</h2>
      <p class="muted" style="margin:4px 0 10px">Cada grupo abre o seu próprio link e só vê os seus exercícios.</p>
      <div class="gaccess">${GRUPOS.map(g => `<div class="gc" style="--g:${g.cor}"><b>${esc(g.nome)}</b><span style="font-size:13.5px">Cor ${esc(g.corNome)} · grupo misto</span><div class="acts" style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn small ghost" href="#${g.id}">Abrir área do grupo</a><button class="btn small ghost" data-copylink="${g.id}">Copiar link</button></div><span class="linktxt">${esc(BASE)}#${g.id}</span></div>`).join('')}</div>
      <div class="legend" style="margin-top:14px"><span class="ex g">Exercício do grupo</span><span class="ex i">Exercício individual</span><span class="ex n">Sem registro</span></div></div>
    ${DIAS.map(d => `<section style="display:grid;gap:12px"><div class="dayhead"><h2>${esc(d.rotulo)}</h2><span class="muted">${esc(d.eixo)}</span></div>
      <div class="boxes">${ETAPAS.filter(e => e.dia === d.n).map(e => e.tipo === 'pausa' ? `<div class="pauserow sbox" style="background:transparent;border-style:dashed">${hm(e.ini)}–${hm(e.fim)} · ${esc(e.sessao)}</div>` : `
        <div class="sbox ${e.individual ? 'ind' : exercicio(e) === 'Sem registro' ? '' : 'grupo'}">
          <div class="top2"><span class="mono" style="font-weight:600">${hm(e.ini)}–${hm(e.fim)}</span>${ex(e)}</div>
          ${e.ex ? `<span class="exname" style="--g:var(--ember);font-size:13px">${esc(e.exNome.split(' · ')[0])}</span>` : ''}
          <span class="tema">${esc(e.tema)}</span>
          <h3>${esc(e.sessao)}</h3>
          ${e.ex ? `<span style="font-size:13.5px"><b>Quando:</b> ${esc(e.quando)}</span>` : ''}
          <span class="muted" style="font-size:13.5px">Conteúdo: ${esc(e.quem || '')}</span>
          ${itens(e)}
          ${e.ex ? `<span style="font-size:13.5px"><b>Pede:</b> ${esc(e.pede)}</span>` : ''}
          <div class="acts"><a class="btn small" href="#${e.id}">Abrir</a><button class="btn small ghost" data-copylink="${e.id}">Copiar link</button></div>
          <span class="linktxt">Link por grupo: ${esc(BASE)}#<i>grupo</i>-${e.id}</span>
        </div>`).join('')}
        ${d.n === 3 ? `<div class="sbox ind"><div class="top2"><span class="mono" style="font-weight:600">12h30–12h35</span><span class="ex i">Individual</span></div><span class="tema">Avaliação e continuidade</span><h3>Avaliação individual do encontro</h3><span class="muted" style="font-size:13.5px">Cada participante responde a sua</span><ul><li>Notas de 1 a 5 para 5 itens</li><li>O que manter e o que melhorar</li><li>Um compromisso pessoal</li></ul><div class="acts"><a class="btn small" href="#avaliacao">Abrir</a><button class="btn small ghost" data-copylink="avaliacao">Copiar link</button></div><span class="linktxt">${esc(BASE)}#avaliacao</span></div>` : ''}
      </div></section>`).join('')}
  </div></div>`;
}

// ---------- avaliação individual (uma pessoa por vez) ----------
function avaliacaoHTML() {
  const ind = E['d3-encerramento'].individual;
  if (S.avalSent) return `<div class="wrap"><div class="kiosk"><div class="thanks stage"><h2>Obrigado pela sua avaliação</h2><p class="muted">Ela é anônima e será sistematizada no relatório final.</p><button class="btn" id="aval-proxima">Próxima pessoa</button></div></div></div>`;
  return `<div class="wrap"><div class="kiosk"><article class="stage"><div class="stage-head" style="--g:var(--river)"><span class="ex i" style="justify-self:start">Exercício individual · anônimo</span><h2>${esc(ind.titulo)}</h2><p class="muted" style="margin:0">Responda e toque em Enviar. Depois passe o tablet para a próxima pessoa.</p></div>
    <div class="stage-body"><div class="form" data-aval="1" style="--g:var(--river)">${ind.campos.map(f => fieldHTML(f, S.aval, true, E['d3-encerramento'], GRUPOS[0], '')).join('')}</div></div>
    <div class="foot"><span class="savestate">${S.mode === 'online' ? 'Envio direto para a equipe' : 'Sem conexão: fica guardada neste aparelho'}</span><button class="btn" id="aval-enviar" style="--g:var(--river);background:var(--river)">Enviar avaliação</button></div></article></div></div>`;
}
async function enviarAval() {
  const rec = { ...JSON.parse(JSON.stringify(S.aval)), tablet: S.role || '', enviadoEm: Date.now() };
  const has = Object.values(S.aval).some(v => v && (typeof v !== 'object' || Object.keys(v).length));
  if (!has) { toast('Preencha ao menos uma resposta.'); return; }
  const loc = LS.get('avals', []); loc.push(rec); LS.set('avals', loc);
  const evc = SUPA ? (LS.get('codigo', null) || LS.get('evento', null)) : null;
  if (SUPA && evc) { try { await rpc('ef_avaliar', { p_codigo: evc, p_doc: rec }); loc[loc.length - 1].sync = true; LS.set('avals', loc); } catch { toast('Guardada neste aparelho; será enviada depois.'); } }
  else if (S.db && S.mode === 'online') { try { await S.db.collection('avaliacoes').add(rec); rec.sync = true; loc[loc.length - 1].sync = true; LS.set('avals', loc); } catch { toast('Guardada neste aparelho; será enviada depois.'); } }
  S.avalSent = true; S.aval = {}; render(); scrollTo(0, 0);
}
function avaliacoesHTML() {
  const all = S.avals.length ? S.avals : LS.get('avals', []);
  const ind = E['d3-encerramento'].individual; const items = ind.campos[0].o;
  if (!all.length) return `<p class="empty">As avaliações individuais aparecem aqui assim que forem enviadas.</p>`;
  const med = items.map((_, i) => { const v = all.map(a => Number(a.aval?.[i])).filter(Boolean); return v.length ? v.reduce((x, y) => x + y, 0) / v.length : 0; });
  const perf = {}; all.forEach(a => { if (a.perfil) perf[a.perfil] = (perf[a.perfil] || 0) + 1; });
  return `<div class="two"><div class="box" style="display:grid;gap:10px"><h3>${all.length} avaliações</h3>${items.map((q, i) => `<div class="stat"><span>${esc(q)}</span><span class="mono">${med[i].toFixed(1)}</span><div class="bar"><i style="width:${med[i] / 5 * 100}%"></i></div></div>`).join('')}
    <p class="muted" style="font-size:13.5px">${Object.entries(perf).map(([k, v]) => `${esc(k)}: ${v}`).join(' · ')}</p><button class="btn small ghost" data-exp="aval">Baixar avaliações (CSV)</button></div>
    <div class="box" style="display:grid;gap:10px"><h3>Comentários</h3>${all.filter(a => a.manter || a.melhorar || a.compromisso).map(a => `<div style="border-bottom:1px solid var(--line);padding-bottom:8px;font-size:14px">${a.manter ? `<div><b>Manter:</b> ${esc(a.manter)}</div>` : ''}${a.melhorar ? `<div><b>Melhorar:</b> ${esc(a.melhorar)}</div>` : ''}${a.compromisso ? `<div><b>Compromisso:</b> ${esc(a.compromisso)}</div>` : ''}</div>`).join('') || '<p class="empty">Sem comentários.</p>'}</div></div>`;
}

// ---------- painel da equipe ----------
async function liberar(id) {
  S.ativa = id; S.ativaAuto = !id;
  if (S.db && S.mode === 'online') { try { await S.db.doc('controle/estado').set({ ativa: id || '', atualizadoEm: Date.now() }); toast(id ? 'Etapa liberada para os grupos' : 'Grupos seguindo o relógio'); } catch { toast('Não foi possível liberar. Verifique a conexão.'); } }
  else toast('Sem conexão: cada tablet segue o próprio relógio.');
  render();
}
function panelHTML() {
  const tabs = S.role === 'unodc' ? [['ex1', E['d1-estados1'].exNome.replace(' · bloco 1', '')], ['conducao', 'Condução'], ['credenciamento', 'Credenciamento'], ['mapa', 'Mapa e links'], ['respostas', 'Respostas por etapa'], ['matriz', 'Matriz comum'], ['perguntas', 'Perguntas'], ['termometro', 'Termômetro'], ['avaliacoes', 'Avaliações']]
    : [['conducao', 'Condução'], ['credenciamento', 'Credenciamento'], ['mapa', 'Mapa e links'], ['respostas', 'Respostas por etapa'], ['matriz', 'Matriz comum'], ['perguntas', 'Perguntas'], ['termometro', 'Termômetro'], ['avaliacoes', 'Avaliações'], ['seguranca', 'Segurança' + ((S.alertas || []).length ? ` (${S.alertas.length})` : '')], ['exportar', 'Exportar e importar']];
  if (S.role === 'unodc' && S.tabIni !== 'unodc') { S.tab = 'ex1'; S.tabIni = 'unodc'; }
  if (!tabs.some(t => t[0] === S.tab)) S.tab = tabs[0][0];
  return `<div class="wrap"><div class="panel ${S.role === 'unodc' ? 'ro' : ''}">
    ${S.mode === 'demo' ? `<div class="banner">Demonstração: libere etapas e veja as respostas deste aparelho. Nada é gravado na base do encontro.</div>` : ''}
    ${S.mode === 'local' ? `<div class="banner">Modo local: este aparelho não está sincronizando. Os celulares seguem o próprio relógio e guardam as respostas. Ao final, importe o arquivo de cada tablet na aba Exportar e importar.</div>` : ''}
    ${S.role === 'equipe' && (S.alertas || []).some(a => a.tipo === 'fora_da_area') && S.tab !== 'seguranca' ? `<div class="banner" style="border-color:#B3261E;background:#fbeceb"><b>Atenção:</b> houve tentativa de acesso de fora do INPE com o QR Code de: ${[...new Set(S.alertas.filter(a => a.tipo === 'fora_da_area').map(a => G[a.mesa]?.papel || a.mesa))].map(esc).join(', ')}. <button class="btn small" data-tab="seguranca">Ver detalhes</button></div>` : ''}
    <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" data-tab="${k}" aria-selected="${S.tab === k}">${l}</button>`).join('')}</div>
    <div id="tabbody">${({ mapa: () => mapaHTML().replace('class="wrap"', 'class=""'), ex1: ex1HTML, conducao: conducaoHTML, credenciamento: credHTML, respostas: respostasHTML, matriz: matrizHTML, perguntas: perguntasHTML, termometro: termoHTML, avaliacoes: avaliacoesHTML, seguranca: segHTML, exportar: exportHTML })[S.tab]()}</div>
  </div></div>`;
}
function afterPanel() { tick(); }
function ex1HTML() { const e = E['d1-estados1']; const d = S.resp[docId(e.id, 'unodc')];
  if (d && d.status === 'enviada') return `<div class="sentbox"><span class="ok-ic" aria-hidden="true">✓</span><div><h3>${esc(e.exNome)} enviado às ${hhmm(d.enviadoEm)}</h3><p>O registro da UNODC, com o INPE e a SEMAS/PA, foi entregue. Ele aparece na aba Respostas por etapa.</p></div></div>`;
  return stageHTML(e, G.unodc, e); }
function segHTML() {
  const c = S.cerca || { modo: 'auto' }; const modo = c.modo || 'auto'; const now = Date.now();
  const ativa = modo === 'ligada' || (modo === 'auto' && now >= Date.parse('2026-11-16T00:00:00-03:00') && now < Date.parse('2026-11-19T00:00:00-03:00'));
  const fmt = (q) => new Date(q).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const A = S.alertas || [];
  const btn = (m, l) => `<button class="btn small ${modo === m ? '' : 'ghost'}" data-cerca="${m}">${l}</button>`;
  return `<div class="banner" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><b>Verificação de local (INPE · raio de ${esc(String(c.raio_km || 3))} km):</b> ${ativa ? 'ativa agora' : 'inativa agora'}
    ${btn('auto', 'Automática de 16 a 18/11')}${btn('ligada', 'Ligar agora')}${btn('desligada', 'Desligar')}
    <span class="muted" style="font-size:13px">Vale só para os QR Codes dos grupos. Kenosis e UNODC entram de qualquer lugar pela senha. Use "Desligar" apenas se o GPS falhar no local.</span></div>
    <h3 style="margin:18px 0 8px">Ocorrências registradas</h3>
    ${A.length ? `<div class="tbl-wrap"><table><thead><tr><th>Quando</th><th>QR Code do grupo</th><th>Ocorrência</th><th>Distância do INPE</th><th>Local aproximado</th><th>Precisão</th><th>Conexão</th></tr></thead><tbody>${A.map(a => `<tr><td>${fmt(a.quando)}</td><td><b>${esc(G[a.mesa]?.papel || a.mesa)}</b></td><td>${a.tipo === 'fora_da_area' ? 'Acesso de fora do local' : 'Localização recusada ou indisponível'}</td><td>${a.distancia_km != null ? esc(String(a.distancia_km).replace('.', ',')) + ' km' : '—'}</td><td>${a.lat_aprox != null ? esc(a.lat_aprox + ', ' + a.lng_aprox) : '—'}</td><td>${a.precisao_m != null ? esc(String(a.precisao_m)) + ' m' : '—'}</td><td style="font-size:12px">${esc(a.ip || '—')}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">Nenhuma ocorrência até agora.</p>'}`;
}
function dotsFor(e) { return `<span class="dots">${(e.resp === 'unodc' ? [G.unodc] : GRUPOS).map(g => { const s = statusOf(e.id, g.id); return `<i class="${s === 'enviada' ? 'ok' : s === 'andamento' ? 'and' : ''}" style="--gc:${g.cor}" title="${esc(g.nome)}: ${s === 'enviada' ? 'enviado' : s === 'andamento' ? 'em rascunho' : 'sem registro'}"></i>`; }).join('')}</span>`; }
function diasHTML() {
  if (S.role !== 'equipe') return '';
  return `<div class="banner" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><b>Abertura dos dias para os grupos:</b> Dia 1 aberto${[2, 3].map(d => { const auto = Date.now() >= Date.parse(DIA_INI[d]); const lib = (S.diasLib || []).includes(d); return auto ? ` · Dia ${d} aberto (início do dia)` : ` · <button class="btn small ${lib ? '' : 'ghost'}" data-libdia="${d}">${lib ? `Dia ${d} liberado · fechar` : `Liberar Dia ${d} agora`}</button>`; }).join('')}<span class="muted" style="font-size:13px">Sem ação da equipe, cada dia abre sozinho às 7h de ${DIA_DATA[2]} e ${DIA_DATA[3]}.</span></div>`;
}
function conducaoHTML() {
  const act = activeStage(); const ck = clockStage();
  return `${diasHTML()}<div class="ctrl">
    <div style="display:grid;gap:14px;min-width:0">
      <div class="now-card"><span class="eyebrow" style="color:rgba(255,255,255,.75)">${S.ativa ? 'Etapa liberada pela equipe' : 'Seguindo o relógio'} · ${esc(DIAS[act.dia - 1].rotulo)}</span>
        <h2>${esc(act.sessao)}</h2><span class="mono">${hm(act.ini)}–${hm(act.fim)} · ${esc(act.quem || '')}</span>
        <div class="timer" data-timer="${act.id}"><div class="row"><span class="big"></span><span class="sub muted"></span></div><div class="bar"><i></i></div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">${dotsFor(act)}<span class="muted" style="font-size:13px">Grupos: ${GRUPOS.map(g => g.papel).join(' · ')}</span></div>
      </div>
      ${ck && ck.id !== act.id ? `<div class="banner">Pelo relógio, agora seria <b>${esc(ck.sessao)}</b> (${hm(ck.ini)}–${hm(ck.fim)}). <button class="btn small" data-liberar="${ck.id}">Liberar esta etapa</button></div>` : ''}
      <div class="box"><h3>Passo a passo no tempo</h3>${stepsHTML(act)}<p class="muted" style="margin-top:10px;font-size:14px">${esc(act.conteudo)}</p></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn ghost" data-auto="1">Deixar os tablets seguirem o relógio</button></div>
    </div>
    <div class="stlist">${DIAS.map(d => `<div class="eyebrow" style="margin-top:8px">${esc(d.rotulo)} · ${esc(d.eixo)}</div>` + ETAPAS.filter(e => e.dia === d.n).map(e => e.tipo === 'pausa'
      ? `<div class="strow pausa"><span class="mono">${hm(e.ini)}–${hm(e.fim)}</span><span>${esc(e.sessao)}</span><span></span><span></span></div>`
      : `<div class="strow ${e.id === act.id ? 'ativa' : ''}"><span class="mono">${hm(e.ini)}–${hm(e.fim)}</span><span>${esc(e.sessao)}${e.tipo === 'grupo' ? ' <span class="badge grupo" style="--g:var(--forest)">grupo</span>' : ''}</span>${e.campos.length ? dotsFor(e) : '<span></span>'}<button class="btn small ${e.id === act.id ? '' : 'ghost'}" data-liberar="${e.id}" ${e.id === act.id && S.ativa ? 'disabled' : ''}>${e.id === act.id && S.ativa ? 'Liberada' : 'Liberar'}</button></div>`).join('')).join('')}</div>
  </div>`;
}
function valueText(f, v) {
  if (f.t === 'guia' || v == null || v === '' || (Array.isArray(v) && !v.length)) return '';
  if (f.t === 'multi') return v.join(', ');
  if (f.t === 'rating') return f.o.map((q, i) => `${q}: ${v[i] ?? '–'}`).join('\n');
  if (f.t === 'repeat') return v.map((it, i) => it && Object.values(it).some(x => x) ? (f.titles ? `${f.titles[i]} · ` : `${i + 1}. `) + f.f.map(sf => it[sf.k] ? `${sf.l}: ${it[sf.k]}` : '').filter(Boolean).join(' | ') : '').filter(Boolean).join('\n');
  if (f.t === 'clinica') return v.filter(x => x?.demanda).map((it, i) => `${i + 1}. ${it.demanda} → ${it.categoria || 'sem categoria'}${it.competente ? ' · ' + it.competente : ''}${it.lacuna ? ' · lacuna: ' + it.lacuna : ''}${it.requisito ? ' · requisito: ' + it.requisito : ''}`).join('\n');
  if (f.t === 'priorizacao') return v.filter(x => x?.demanda).map((it, i) => `${i + 1}. ${it.demanda} · total ${f.crit.reduce((a, _, c) => a + (Number(it['c' + c]) || 0), 0)} · ${it.horizonte || 'sem horizonte'}`).join('\n');
  return String(v);
}
function trocaHTML() {
  return `<div class="wrap" style="padding-top:18px"><article class="stage"><div class="stage-head"><span class="eyebrow">Trocar de grupo</span><h2>Escolha o novo grupo</h2><p class="muted" style="margin:0">O registro do grupo atual fica salvo. Também é possível ler o QR Code do novo grupo.</p></div>
    <div class="stage-body"><div class="tiles">${GRUPOS.filter(g => g.id !== S.role).map(g => `<button class="tile" data-trocapara="${g.id}" style="--g:${g.cor}"><b>${esc(g.papel)}</b><small>${esc(g.temaNome || '')}</small></button>`).join('')}</div>
    <p style="margin-top:14px"><button class="btn ghost" data-trocacancel="1">Continuar na ${esc(G[S.role].papel)}</button></p></div></article></div>`;
}
function eqEditHTML() {
  const d = S.eqEdit; const e = E[d.etapa]; const g = G[d.grupo];
  return `<div class="wrap" style="padding-top:18px;padding-bottom:40px"><article class="stage" data-stage="${e.id}">
    <div class="stage-head"><span class="eyebrow">Edição da equipe Kenosis · bastidores</span><h2>${esc(g.nome)} · ${esc(e.exNome)}</h2>
      <p class="muted" style="margin:0">Dia ${e.dia} · ${hm(e.ini)}–${hm(e.fim)}. Toda alteração fica registrada no histórico, com a versão anterior.</p></div>
    <div class="stage-body">
      <div class="toolbar" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <label class="eyebrow" for="eqst">Situação</label><select id="eqst"><option value="andamento" ${d.status !== 'enviada' ? 'selected' : ''}>Aberto para o grupo (rascunho)</option><option value="enviada" ${d.status === 'enviada' ? 'selected' : ''}>Enviado (fechado para o grupo)</option></select>
        <button class="btn" data-eqsave="1">Salvar alterações</button><button class="btn ghost" data-eqback="1">Voltar às respostas</button><span id="eqstate" class="muted">${S.eqDirty ? 'Alterações não salvas' : 'Sem alterações pendentes'}</span></div>
      <div class="form" data-doc="${docId(e.id, g.id)}" data-equipe="1"><h3>Registro do ${esc(g.nome)}</h3>${CFG.camposDe(e, g).map(f => fieldHTML(f, d.dados || {}, true, e, g)).join('')}</div>
    </div></article></div>`;
}
function respostasHTML() {
  const sid = S.respStage && E[S.respStage] ? S.respStage : activeStage().id; const e = E[sid];
  return `<div style="display:grid;gap:14px"><div class="toolbar"><label for="resp-stage" class="eyebrow">Etapa</label><select id="resp-stage">${WORK.filter(x => x.ex).map(x => `<option value="${x.id}" ${x.id === sid ? 'selected' : ''}>Dia ${x.dia} · ${hm(x.ini)} · ${esc(x.exNome || x.sessao)}</option>`).join('')}</select></div>
    <div class="cols4">${(e.resp === 'unodc' ? [G.unodc] : GRUPOS).map(g => { const d = S.resp[docId(sid, g.id)]; const st = d?.status || 'vazio';
      return `<div class="col" style="--gc:${g.cor}"><div style="display:flex;justify-content:space-between;gap:8px"><span class="gtag" style="--gc:${g.cor}">${esc(g.nome)}</span>${S.role === 'equipe' ? `<button class="btn small ghost" data-eqedit="${g.id}" data-eqstage="${sid}">Editar</button>` : ''}<span class="s ${st === 'enviada' ? 'ok' : st === 'andamento' ? 'and' : ''}" style="font-size:12px">${st === 'enviada' ? 'Enviado ' + hhmm(d.enviadoEm) : st === 'andamento' ? 'Rascunho' : 'Sem registro'}</span></div>
        ${g.tema ? `<span class="muted" style="font-size:12.5px">${sid === 'd2-clinicas' ? `Clínica ${g.clinica} · ${esc(g.clinicaNome)}` : `Tema ${g.tema} · ${esc(g.temaNome)}`}</span>` : ''}${d ? `<dl>${CFG.camposDe(e, g).map(f => { const t = valueText(f, d.dados?.[f.k]); return t ? `<div><dt>${esc(f.l || f.item)}</dt><dd>${esc(t)}</dd></div>` : ''; }).join('') || '<p class="empty">Nada registrado ainda.</p>'}</dl>` : '<p class="empty">Nada registrado ainda.</p>'}</div>`; }).join('')}</div></div>`;
}
function matrizRows() {
  const rows = []; const ord = { Alta: 3, Média: 2, Baixa: 1 };
  GRUPOS.forEach(g => {
    const d1 = S.resp[docId('d1-grupos', g.id)]?.dados?.demandas || [];
    const cl = S.resp[docId('d2-clinicas', g.id)]?.dados?.itens || [];
    const pr = S.resp[docId('d3-priorizacao', g.id)]?.dados?.itens || [];
    const seen = new Map();
    d1.forEach(x => { if (x?.problema) seen.set(x.problema.trim(), { grupo: g, tema: g.temaNome, origem: 'Dia 1 · Grupos temáticos', problema: x.problema, desafio: x.desafio, usuario: x.usuario, competente: x.competente, prioridade: x.prioridade }); });
    cl.forEach(x => { if (!x?.demanda) return; const k = x.demanda.trim(); const r = seen.get(k) || { grupo: g, tema: g.temaNome, origem: 'Dia 2 · Clínica ' + g.clinica, problema: x.demanda };
      Object.assign(r, { categoria: g.clinicaNome, solucao: x.solucao, competente: x.competente || r.competente, lacuna: x.lacuna, trilha: x.trilha }); seen.set(k, r); });
    pr.forEach(x => { if (!x?.demanda) return; const k = x.demanda.trim(); const r = seen.get(k) || { grupo: g, tema: g.temaNome, origem: 'Dia 3 · Priorização', problema: x.demanda };
      Object.assign(r, { criterios: (x.criterios || []).join(', '), prioridade: x.prioridade || r.prioridade, horizonte: x.horizonte, oque: x.oque, quem: x.quem, quando: x.quando, como: x.como, quanto: x.quanto }); seen.set(k, r); });
    rows.push(...seen.values());
  });
  return rows.sort((a, b) => (ord[b.prioridade] || 0) - (ord[a.prioridade] || 0));
}
const MCOLS = [['grupo', 'Grupo'], ['tema', 'Tema'], ['origem', 'Origem'], ['problema', 'Demanda'], ['desafio', 'Desafio'], ['usuario', 'Para quem e para quê'], ['solucao', 'Solução relacionada'], ['competente', 'Quem pode atender'], ['lacuna', 'Lacuna'], ['categoria', 'Clínica (categoria)'], ['trilha', 'Trilha SISFOGO/ADPF nº 743'], ['criterios', 'Critérios'], ['prioridade', 'Prioridade'], ['horizonte', 'Horizonte'], ['oque', 'O quê'], ['quem', 'Quem'], ['quando', 'Quando'], ['como', 'Como'], ['quanto', 'Quanto']];
function matrizHTML() {
  const rows = matrizRows();
  return `<div style="display:grid;gap:12px"><p class="muted" style="margin:0">Montada automaticamente: demandas dos grupos temáticos (Dia 1), matriz das clínicas (Dia 2) e priorização em 5W2H (Dia 3). Com 10 grupos, os dois grupos de cada tema compõem a mesma base do tema. Ordenada pela prioridade.</p>
    ${rows.length ? `<div class="tbl-wrap"><table><thead><tr>${MCOLS.map(c => `<th>${c[1]}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${MCOLS.map(([k]) => k === 'grupo' ? `<td><span class="gtag" style="--gc:${r.grupo.cor}">${esc(r.grupo.papel)}</span></td>` : k === 'total' ? `<td class="n">${r.total ?? ''}</td>` : `<td>${esc(r[k] || '')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : `<p class="empty">A matriz aparece aqui assim que os grupos registrarem as demandas na sessão de grupos temáticos (Dia 1, 15h30).</p>`}</div>`;
}
function perguntasList() {
  const out = [];
  GRUPOS.forEach(g => WORK.forEach(e => { const d = S.resp[docId(e.id, g.id)]?.dados; if (!d) return;
    if (d.pergunta) out.push({ g, e, texto: d.pergunta, dest: d.destinatario || (e.quem || '') });
    (d.perguntas || []).forEach(p => p?.texto && out.push({ g, e, texto: p.texto, dest: p.destinatario || '' })); }));
  return out;
}
function perguntasHTML() {
  const ps = perguntasList(); const by = {};
  ps.forEach(p => (by[p.dest || 'Sem destinatário'] ||= []).push(p));
  return ps.length ? `<div class="cardgrid">${Object.entries(by).map(([d, arr]) => `<div class="card"><div class="ct"><b>${esc(d)}</b><span class="badge">${arr.length}</span></div>${arr.map(p => `<div style="display:grid;gap:2px"><span class="gtag" style="--gc:${p.g.cor};font-size:12.5px">${esc(p.g.papel)} · ${esc(p.e.sessao)}</span><span>${esc(p.texto)}</span></div>`).join('')}</div>`).join('')}</div>` : `<p class="empty">As perguntas registradas pelos grupos aparecem aqui, agrupadas por destinatário, para entregar a quem conduz cada grupo.</p>`;
}
function termoHTML() {
  const local = LS.get('termo', {}); const T = { ...local, ...S.termo };
  return `<div style="display:grid;gap:12px"><p class="muted" style="margin:0">Contagem aproximada dos cartões ao fim de cada estado (Dia 1). Verde: realidade semelhante · Amarelo: quero saber mais · Vermelho: lacuna também crítica para nós.</p>
    <div class="termo">${UFS.map(uf => { const v = T[uf] || T[uf.replace(/\s/g, '_')] || {}; return `<div class="card"><b style="font-family:var(--f-display);font-size:17px">${esc(uf)}</b>
      ${[['verde', 'Verde'], ['branco', 'Amarelo'], ['rosa', 'Vermelho']].map(([c, l]) => `<label for="t-${uf}-${c}">${l}<input inputmode="numeric" id="t-${esc(uf.replace(/\s/g, '_'))}-${c}" data-termo="${esc(uf)}|${c}" value="${v[c] ?? ''}" ${S.role === 'unodc' ? 'readonly' : ''}></label>`).join('')}</div>`; }).join('')}</div></div>`;
}
function exportHTML() {
  return `<div class="two">
    <div class="box" style="display:grid;gap:12px"><h3>Exportar</h3><p class="muted">Para o relatório: a matriz comum em planilha (CSV) e todas as respostas em arquivo completo (JSON).</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" data-exp="csv">Baixar matriz comum (CSV)</button><button class="btn ghost" data-exp="json">Baixar todas as respostas (JSON)</button></div>
      <p class="muted" style="font-size:13.5px">Se o download não abrir, use a caixa abaixo para copiar o conteúdo completo.</p>
      <textarea class="io" id="exp-text" readonly>${esc(JSON.stringify(exportObj(), null, 1))}</textarea><button class="btn small ghost" data-copy="exp-text">Copiar</button></div>
    <div class="box" style="display:grid;gap:12px"><h3>Importar de um tablet sem conexão</h3><p class="muted">No tablet que ficou sem internet, abra Painel da equipe, Exportar, copie o conteúdo e cole aqui. Vale sempre a versão mais recente de cada resposta.</p>
      <textarea class="io" id="imp-text" placeholder="Cole aqui o conteúdo exportado"></textarea><button class="btn" id="imp-btn">Importar respostas</button></div>
  </div>`;
}
function exportObj() { return { evento: CFG.evento, exportadoEm: new Date().toISOString(), respostas: S.resp, avaliacoes: S.avals.length ? S.avals : LS.get('avals', []), termometro: { ...LS.get('termo', {}), ...S.termo } }; }
async function exportar(kind) {
  let data, filename;
  if (kind === 'csv') {
    const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
    const rows = matrizRows();
    data = '﻿' + [MCOLS.map(c => q(c[1])).join(';'), ...rows.map(r => MCOLS.map(([k]) => q(k === 'grupo' ? r.grupo.papel : r[k])).join(';'))].join('\r\n');
    filename = 'matriz-comum-encontro-fogo.csv';
  } else if (kind === 'aval') {
    const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`; const items = E['d3-encerramento'].individual.campos[0].o;
    const all = S.avals.length ? S.avals : LS.get('avals', []);
    data = '\ufeff' + [[...items, 'Perfil', 'Manter', 'Melhorar', 'Compromisso'].map(q).join(';'), ...all.map(a => [...items.map((_, i) => a.aval?.[i] ?? ''), a.perfil, a.manter, a.melhorar, a.compromisso].map(q).join(';'))].join('\r\n');
    filename = 'avaliacoes-individuais-encontro-fogo.csv';
  } else { data = JSON.stringify(exportObj(), null, 2); filename = 'respostas-encontro-fogo.json'; }
  if (!S.downloads) { toast('Download indisponível aqui. Use o botão Copiar.'); return; }
  try { await S.downloads.save({ filename, data }); } catch { toast('Download não concluído. Use o botão Copiar.'); }
}
function importar() {
  let obj; try { obj = JSON.parse($('#imp-text').value); } catch { toast('Conteúdo inválido. Cole o texto exportado completo.'); return; }
  const r = obj.respostas || {}; let n = 0;
  Object.entries(r).forEach(([id, v]) => { if (!v?.etapa || !v?.grupo) return; const cur = S.resp[id]; if (!cur || (v.atualizadoEm || 0) > (cur.atualizadoEm || 0)) { S.resp[id] = v; LS.set('r:' + id, v); if (S.db && S.mode === 'online') S.db.doc('respostas/' + id).set(v).catch(() => {}); n++; } });
  const av = obj.avaliacoes || []; let m = 0; const loc = LS.get('avals', []);
  av.forEach(a => { if (a?.enviadoEm && !loc.find(x => x.enviadoEm === a.enviadoEm && x.tablet === a.tablet)) { loc.push({ ...a, sync: false }); m++; } }); LS.set('avals', loc);
  toast(`${n} respostas e ${m} avaliações importadas`); render();
}

// ---------- início ----------
setSync(); route(); connect();
setInterval(() => { tick(); if (!DEMO && S.ativaAuto && S.role && !PANEL(S.role) && !S.view) { const a = activeStage(); const cur = document.querySelector('.tl li.ativa button')?.dataset.go; if (cur && cur !== a.id && !document.activeElement?.matches?.('input,textarea')) { S.view = null; render(); } } }, 15000);
setInterval(() => { const el = $('#clock'); const d = new Date(); el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`; }, 5000);
// wake lock para o tablet não apagar
(async () => { try { await navigator.wakeLock?.request('screen'); } catch {} })();
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { try { navigator.wakeLock?.request('screen'); } catch {} } });
})();
