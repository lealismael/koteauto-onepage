# Prévia local — transição e acessibilidade

05/10/2026. Branch `codex/previa-transicao-acessibilidade`. Prévia aprovada pelo usuário para publicação.
Base anterior à alteração: commit `37df747`.

## O que comparar

- A informação entra em aproximadamente 46% do percurso, antes em 66%.
- A expansão da luz fecha mais cedo para acompanhar a informação. Mantidos carro, zoom,
  extensão da rolagem e viagem do botão de aproximadamente 1,8 segundo.
- Entre a saída da abertura e o resumo, um convite clicável orienta a continuação.
  A rolagem não avança sozinha quando o usuário para.
- O resumo entra sem transparência do texto. Há apenas uma translação curta.
- O fundo fica totalmente porcelana enquanto o resumo está visível, inclusive no scroll reverso.
- Antes de ocultar uma camada que contém foco, o foco passa a um destino visível, sem scroll extra.
  O título de destino tem indicador de foco para teclado.

## Evidências

Bateria funcional existente passou em 1440×810, 390×844 e 320×568: CTA, teclado, cancelamento,
âncora direta, pular conteúdo, retorno do scroll, movimento reduzido e ausência de JavaScript.

Auditoria adicional em 1440×810, 390×844 e 320×844: 14 posições por largura, incluindo fronteiras
e recuo. Em 42 estados, sempre houve abertura, convite ou resumo exposto. A árvore de
acessibilidade do Chrome apresentou o título do resumo apenas quando a seção estava exposta.
A mudança do foco para o convite, Enter até o resumo e alternância para movimento reduzido passaram.

Contraste: 279 amostras dos textos da abertura, convite e resumo. Foi capturado o fundo real com
o preenchimento dos textos temporariamente transparente, mantendo a geometria. A cor declarada
do texto foi comparada aos pixels do fundo dentro das caixas de texto, em grade de 3 px.
Menor resultado: 5,316:1, rótulo cobre do resumo. Nenhuma amostra abaixo de 4,5:1 para texto
normal ou 3:1 para texto grande, conforme [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
Não é uma amostragem de todos os pixels ou de todos os instantes possíveis.

Capturas e JSON desta execução: `../output/previa-transicao/`.
Scripts reutilizáveis: `scripts/audit-transition.cjs` (Playwright disponível no ambiente local)
e `scripts/check-transition-contrast.py` (Pillow). Nenhuma dependência de produção foi adicionada.
A auditoria adicional usa o servidor de prévia em `127.0.0.1:4173`.

## Limites

Não houve leitura completa com VoiceOver/NVDA, medição de fluidez ou teste no Safari real.
Safari segue adiado a pedido do usuário. A presença correta na árvore de acessibilidade
não equivale a uma certificação da experiência com leitor de tela.
Esta rodada mede os textos da transição, não audita todo o site.

## Revisar

`node scripts/build-site.mjs` e `node scripts/serve.mjs`.
Abrir http://127.0.0.1:4173 e comparar com https://www.koteauto.com.br/.
Rolar devagar, parar no meio, clicar no convite e voltar ao início.
