const PageContent = require('../../models/PageContent');
const { link } = require('../../modules/admin/routes');

const seedMetodologia = async () => {
  try {
    const page = 'metodologia'; // Identificador único para a seção de metodologia

    // ==============================================================================
    // 1. BANNER & PROGRESSO
    // ==============================================================================
    const bannerExists = await PageContent.findOne({ page, section: 'banner_progress' });
    
    if (!bannerExists) {
      await PageContent.create({
        page,
        section: 'banner_progress',
        content: {
          banner: {
            title: "Monitoramento da Eletrificação da <br/> Frota de Ônibus de <br/> São Paulo",
            subtitle: "Com o objetivo de medir as emissões de poluentes no transporte coletivo da capital, o Projeto acompanha os ônibus municipais em seus trajetos diários, produz um ranking e oferece indicadores para a gestão na substituição por veículos mais limpos, beneficiando a todos os moradores da nossa cidade.",
            backgroundImage: "/images/banner.svg"
          },
          progressBar: {
            title: "Acompanhe de perto a meta de Eletrificação para 2028",
            description: "Substituir 2.600 ônibus movidos a diesel por veículos de matriz energética mais limpa, reforçando o compromisso da cidade com a preservação ambiental.",
            currentValue: [{
              label: "veículos já substituídos!",
              value: 1259
            }],
            maxValue: [{
                label: "veículos eletrificados<br/>até 2028",
                value: 2600
            }],
            intermediateValue: [{
                label: "veículos eletrificados<br/>em 2025",
                value: 1000
            }]
          }
        },
        lastUpdatedBy: null 
      });
      console.log('✅ Seed: Metodologia (Banner) criado!');
    }

    // ==============================================================================
    // 2. CENÁRIOS (Cards)
    // ==============================================================================
    const cenariosExists = await PageContent.findOne({ page, section: 'cenarios' });
    
    if (!cenariosExists) {
      await PageContent.create({
        page,
        section: 'cenarios',
        content: {
          title: "Como construímos <br /> cenários?",
          subtitle: "Entenda como funcionam as<br /> análises apresentadas",
          cards: [
            { 
                id: 0, 
                icon: "bus",
                description: "A etapa de prognóstico baseia-se em uma Simulação de Monte Carlo, com o objetivo de apoiar a tomada de decisões futuras. A partir de 2.000 repetições, são estimados os efeitos de emissões evitadas associados à incorporação de diferentes quantidades de novos ônibus elétricos, bem como o número de veículos elétricos necessários para atingir metas específicas de emissões evitadas." 
            },
            { 
                id: 1, 
                icon: "globe", 
                description: "Os resultados incorporam ainda uma projeção temporal em dias, permitindo avaliar os impactos ao longo do tempo. A distribuição dos resultados possibilita estimar o impacto médio esperado da substituição, assim como a variabilidade decorrente da heterogeneidade da frota.​" 
            },
            { 
                id: 2, 
                icon: "cloud", 
                description: "Adicionalmente, identifica-se um cenário de impacto máximo e o mais provável, no qual os ônibus a diesel mais poluentes são priorizados na substituição por veículos elétricos. A comparação entre esses cenários fornece subsídios objetivos para o planejamento público, indicando tanto o resultado esperado quanto os ganhos potenciais de estratégias mais direcionadas.​" 
            }
          ]
        }
      });
      console.log('✅ Seed: Metodologia (Cenários) criado!');
    }

    // ==============================================================================
    // 3. IMPACTOS (Acordeão 1)
    // ==============================================================================
    const impactosExists = await PageContent.findOne({ page, section: 'impactos' });
    
    if (!impactosExists) {
      await PageContent.create({
        page,
        section: 'impactos',
        content: {
          title: "COMO ESTIMAMOS O<br /> IMPACTO NA POPULAÇÃO?",
          subtitle: "Entenda como funciona a estimativa de impacto da eletrificação da <br /> frota de ônibus na população",
          modalTitle: "Metodologia Detalhada: Impactos na Saúde",
          modalFooter: "Fonte: SPTrans e IBGE (2022)",
          doc: `Além disso, estima-se o efeito da emissão dos poluentes na saúde dos residentes da cidade. Os poluentes analisados apresentam comportamentos de emissão distintos. O CO₂ possui impacto global e baixa relevância territorial direta. Já o NOₓ e o MP produzem efeitos locais e imediatos sobre a qualidade do ar e a saúde da população. Portanto, a mensuração do impacto na saúde se dá pela população potencialmente afetada pela emissão de NOₓ e MP dos trajetos dos ônibus em circulação.

            Para isso, utiliza-se os setores censitários do IBGE (2022). A partir dos trajetos dos ônibus, ao redor deles aplica-se um buffer espacial de [incluir] metros para o NOₓ e  [incluir] metros para o MP, de modo a representar a área potencialmente afetada pela emissão da circulação dos ônibus. Os buffers dos trajetos são então sobrepostos aos setores censitários do município, por meio de uma operação de interseção espacial. Essa etapa permite identificar as porções dos setores que se encontram dentro da área de influência dos ônibus. Para evitar geometrias de interseções muito pequenas, áreas residuais sem relevância espacial são descartadas.

            A população afetada é estimada de forma proporcional à área de interseção entre cada setor censitário e o buffer dos trajetos. Assume-se uma distribuição homogênea da população dentro de cada setor, de modo que a parcela da população exposta corresponde à razão entre a área interceptada pelo buffer e a área total do setor. A partir desse procedimento, obtém-se uma estimativa do número de habitantes potencialmente afetados pelas emissões de poluentes da circulação dos ônibus em cada trecho. Dessa forma, não levamos em consideração a quantidade de pessoas que transitam na região diariamente, como pedestres, pessoas em situação de rua, ou trabalhadores da região; apenas consideramos os moradores. Por fim, os resultados são agregados em diferentes níveis de análise, permitindo a obtenção da população afetada por veículo, por linha de ônibus e por distrito administrativo.`,
          items: [
            { 
                id: 0, 
                number: "1", 
                description: "Para estimar o impacto dos poluentes na população residente, consideramos apenas o MP e o NOx. Assim, o impacto é mensurado a partir da população potencialmente afetada pelas emissões desses poluentes de comportamento local ao longo dos trajetos dos ônibus.​" 
            },
            { 
                id: 1, 
                number: "2", 
                description: "Para isso, são utilizados os setores censitários do IBGE (2022) e aplicadas áreas de influência espacial ao redor dos trajetos, representando as áreas afetadas pela emissão da circulação dos veículos. Essas áreas são cruzadas com os setores censitários do município, permitindo identificar as regiões atingidas. ​" 
            },
            { 
                id: 2, 
                number: "3", 
                description: "A população potencialmente afetada é estimada de forma proporcional à área afetada em cada setor, assumindo uma distribuição homogênea dos residentes. Por fim, os resultados são agregados, possibilitando a análise da população potencialmente afetada por ônibus, por linha e por distrito administrativo." 
            },
          ]
        }
      });
      console.log('✅ Seed: Metodologia (Impactos) criado!');
    }

    // ==============================================================================
    // 4. REDUÇÕES (Acordeão 2 - Textos Longos)
    // ==============================================================================
    const reducoesExists = await PageContent.findOne({ page, section: 'reducoes' });
    
    if (!reducoesExists) {
      await PageContent.create({
        page,
        section: 'reducoes',
        content: {
          title: "COMO ESTIMAMOS <br /> AS REDUÇÕES?",
          subtitle: "Entenda como funcionam as análises apresentadas",
          modalTitle: "Metodologia Detalhada: Estimativa de Reduções de Emissões",
          modalFooter: `Nota técnica: Cálculos baseados na instrução normativa nº 11.`,
          doc: `A metodologia adotada neste projeto foi desenvolvida para estimar os impactos da política de eletrificação da frota de ônibus do município de São Paulo, estruturando-se em duas etapas complementares: diagnóstico e prognóstico.

            Na etapa de diagnóstico, o projeto faz uso da API do Olho Vivo, disponibilizada pela SPTrans, que fornece em regime de quase tempo real (near real time) a posição geográfica (latitude e longitude) de todos os ônibus em operação no município de São Paulo. Foi construído um sistema automatizado que realiza a coleta dessas informações a cada minuto, possibilitando a reconstrução dos trajetos individuais de cada veículo ao longo do dia. A partir da sequência temporal de posições sucessivas, são calculadas as distâncias percorridas em cada intervalo e, posteriormente, consolidada a quilometragem diária percorrida por veículo.

            Com base nas taxas médias de consumo de combustível por quilômetro, diferenciadas por modelo de ônibus e características operacionais da frota a diesel, estima-se o consumo de diesel correspondente a cada veículo. Esse consumo é convertido em emissões de CO₂, NOₓ e MP, utilizando fatores da Instrução Técnica nº 11 da SPTrans (2023). O impacto ambiental da frota elétrica é mensurado por meio de um exercício contrafactual, aplicando a média das emissões da frota a diesel sobre a quilometragem percorrida pelos ônibus elétricos.

            A etapa de prognóstico utiliza uma Simulação de Monte Carlo como instrumento para apoiar o planejamento. A técnica baseia-se na realização de 2.000 simulações independentes, selecionando aleatoriamente ônibus a diesel para substituição. Para cada simulação, estima-se o volume diário de emissões evitadas, permitindo obter um valor médio esperado e a distribuição completa dos resultados.

            Os impactos estimados podem ser projetados ao longo de um horizonte temporal específico. Além do cenário médio, o modelo identifica um cenário de impacto máximo (priorizando ônibus mais poluentes) e permite estimar o número de ônibus elétricos necessários para atingir metas específicas. Essa abordagem fornece uma visão robusta, incorporando incertezas e evitando decisões baseadas apenas em médias simples.`,
          items: [
            { 
                id: 0, 
                number: "1", 
                description: "Acompanhamos os trajetos de todos os ônibus da cidade de São Paulo. Utiliza-se a API do Olho Vivo (SPTrans) que disponibiliza em quase tempo real a posição geográfica dos ônibus em circulação. Foi construído um sistema automatizado que coleta essas informações a cada minuto, permitindo reconstruir os deslocamentos dos veículos ao longo do dia​." 
            },
            { 
                id: 1, 
                number: "2", 
                description: `A partir da distância percorrida por cada ônibus, podemos estimar a quantidade de diesel consumida em litros e/ou Kg:​

                $$Litros ou Kg de diesel = Fator de consumo de diesel (em L ou KG)*km rodados​$$

                O fator de emissão pode variar dependendo do modelo do ônibus e se tem ou não ar condicionado​.

                Dados da Instrução Técnica nº 11 da SPTrans (2023)​
                
                `
             
            },
            { 
                id: 2, 
                number: "3", 
                description: `Com a quantidade de diesel consumida, podemos estimar a emissão dos poluentes CO₂, Material Particulado (MP) e Óxido de Nitrogênio (NOx):

                $$Kg CO₂ emitido = Fator de emissão do CO₂ × Litros de diesel consumidos$$

                $$Kg MP ou NOx emitido = Fator de emissão do MP ou NOx × Kg de diesel consumido$$

                O fator de emissão do CO₂ é constante: 2,671Kg/l; mas o do MP e no NOx variam de acordo com a fase CONAMA do motor do ônibus.
                
                Dados da Instrução Técnica nº 11 da SPTrans (2023)​
                
                `
            },
            { 
                id: 3, 
                number: "4", 
                description: "O CO₂ tem efeito global e pouca relevância local direta, enquanto o NOₓ e o MP afetam diretamente a qualidade do ar e a saúde em escala local.​" 
            },
            { 
                id: 4, 
                number: "5", 
                description: `O impacto da frota elétrica é estimado por meio de um exercício contrafactual: aplica-se a média de emissões por quilômetro da frota a diesel em cada distrito à quilometragem percorrida pelos ônibus elétricos, obtendo-se a estimativa das emissões que teriam ocorrido caso esses veículos fossem movidos a diesel.

                $$Média diesel consumido no distrito × kms rodados pelos ônibus elétricos$$`
            },
          ]
        }
      });
      console.log('✅ Seed: Metodologia (Reduções) criado!');
    }

  } catch (error) {
    console.error('❌ Erro no seed de Metodologia:', error);
  }
};

module.exports = seedMetodologia;