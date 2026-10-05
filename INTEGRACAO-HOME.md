# Integração da home e revisão de conteúdo

05/10/2026 · branch `codex/descoberta-e-indexacao` · revisão local, sem publicação.

## Home

- Integração da 024 preservada em `claude-lab/respostas/024-prototipo/`. Não foi alterado o estudo.
- Mesma silhueta, paleta, zoom 1 → 1,12, percurso de quatro ações, dois blocos da negociação,
  valores demonstrativos e viagem de aproximadamente 1,8 segundo.
- CSS e JavaScript separados em `assets/home.css` e `assets/home.js`.
- Painel, parâmetros de laboratório e modo manual removidos; resposta ao mouse omitida.
- Camadas invisíveis ficam inertes e fora da leitura assistiva; link de pular conteúdo leva ao
  resumo e coloca foco no título. Interrupção da viagem, movimento reduzido e ausência de JS mantidos.
- Silhueta convertida para WebP, 1672 px (~22 KB) e 960 px (~10 KB), com srcset. Original ~1,2 MB
  preservado no estudo. A compressão precisa ainda de avaliação em telas reais para banding.
- Rodapé com todas as páginas, contato e redes existentes. Sem botão de cadastro ou lançamento.
- Metadados reais preservados e atualizados. Removidos os schemas da antiga FAQ/ItemList que não
  correspondiam mais ao conteúdo visível. Organização, website e produto em desenvolvimento mantidos.
- Favicon existente recolorido em verde; não foi criado um novo símbolo.

## Conteúdo

As oito URLs foram preservadas. Seis páginas receberam revisão editorial; o texto substantivo do
aviso de privacidade foi preservado, com atualização apenas da apresentação, navegação e imagem social.
A política do produto e a documentação privada não foram alteradas.

- **O que é:** definição e limites do projeto, sem prometer disponibilidade, alcance ou resultados.
- **Como funciona:** mantém cinco etapas detalhadas e explica a relação com os três momentos e
  as quatro ações da home. A regra explícita do usuário sobre chat prevalece sobre os docs antigos.
- **Para concessionárias:** contexto do pedido e condições previstas, sem garantia de leads,
  aprovação de crédito ou tabela comercial ainda não confirmada.
- **FAQ:** 14 respostas mais diretas em lugar de 30 repetitivas. Texto e FAQPage gerados juntos.
  Favoritar não é requisito para o consumidor iniciar chat; apenas para a loja iniciar contato.
  Não foi inventada obrigatoriedade de preencher o modal, aceite ou recusa automática das demais.
- **Usado:** preparação e comparação do negócio completo. Substituída a simulação de ajustes
  percentuais por um exemplo simples de preço menos usado, identificado como fictício.
- **Orçamento:** tabela recalculada pela fórmula de valor presente, com taxas hipotéticas,
  arredondamento e exclusões explícitos. Retiradas faixas de mercado sem fonte atual e afirmações
  de aprovação implícita. Nenhum valor dos cartões da home foi alterado.
- **llms.txt:** sincronizado ao conteúdo público, sem disponibilidade presumida ou número antigo de FAQs.

Fontes para conceitos: [FIPE](https://veiculos.fipe.org.br/) e
[Banco Central — cuidados ao contratar crédito](https://www.bcb.gov.br/meubc/faqs/p/cuidados-na-hora-de-contratar-uma-operacao-de-credito).
Os exemplos numéricos são simulações próprias, não cotações desses órgãos.

## Validação executada

- Build e três testes automatizados do gerador passaram; oito URLs canônicas.
- Links e assets locais encontrados, JSON-LD parseável, sitemap versionado igual ao gerado.
- Chrome headless: 1440×810, 390×844 e 320×568. Oito páginas sem overflow horizontal do documento
  e sem erros de console. Tabelas podem rolar internamente em telas estreitas.
- CTA por clique: 1811, 1815 e 1815 ms na rodada final. Enter e foco no H2 passaram.
- Interrupção por roda do mouse, âncora direta, pular conteúdo, scroll de ida e volta e quatro
  marcadores alcançados passaram.
- Movimento reduzido, JavaScript desligado e janela baixa mantiveram conteúdo em fluxo normal.
- Inspeção de capturas: abertura desktop/móvel, resumo desktop e página de jornada móvel.
- Teste reutilizável em `scripts/check-home.cjs`; exige Playwright no ambiente local, sem adicioná-lo
  como dependência da publicação. Capturas desta rodada em `../output/verificacao-home/`.

Esses testes não comprovam desempenho em aparelhos reais, Safari/Firefox, leitura completa com
leitor de tela nem contraste composto em todos os quadros da animação. Não houve medição de FPS
ou auditoria completa de contraste. A publicação permanece pendente da revisão do usuário.

## Abrir para revisar

```sh
node scripts/build-site.mjs
node scripts/serve.mjs
```

Abrir `http://127.0.0.1:4173`. As rotas sem extensão são resolvidas pelo servidor local.
A Vercel continua configurada para gerar e servir `dist/`; nenhum deploy foi disparado.

## Ajuste de continuidade visual após avaliação

As páginas internas receberam cabeçalho grafite com marca porcelana/cobre claro, títulos e
espaçamentos alinhados à home, cartões brancos, avisos sálvia, ações verdes e o mesmo rodapé.
A página de jornada usa marcadores verdes estáticos para as etapas. O texto editorial e as
regras de produto foram mantidos. A abertura animada continua exclusiva da home.

O CSS antigo podia permanecer em cache por sete dias. O build agora inclui uma versão baseada
no conteúdo nas URLs de CSS/JS, sem alterar as URLs das páginas. Um teste confirma estabilidade
quando nada muda e troca de versão quando o CSS muda.

## Ajuste após feedback de Safari mobile

Visitantes relataram travamento e um trecho claro sem informação quando paravam de rolar.
A causa de desempenho não foi medida em aparelho real. Em telas até 700 px ou com ponteiro
principal de toque, a abertura agora rola em fluxo normal, com carro e luz estáticos, sem
pinning, zoom ou crescimento das poças. O resumo segue imediatamente a abertura. Retirado
blur dos feixes nesses dispositivos. Desktop com mouse mantém a cena e a viagem de 1,8 s.

Verificado no Chrome headless em 390 e 320 px: resumo visível em diferentes posições de scroll,
sem lacuna entre blocos, botão e foco no título funcionando. Bateria desktop também passou.
É necessário repetir a avaliação no Safari do aparelho que apresentou travamento; a emulação
não comprova fluidez em iPhone.
