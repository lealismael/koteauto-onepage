# KoteAuto — Site estático (Vercel)

Site em HTML puro, sem build. A home mantém o aviso de **em construção** e os questionários do
piloto. Além dela existe um **hub de conteúdo** de sete páginas, criado para que buscadores e
assistentes de IA (ChatGPT, Gemini, Claude, Perplexity) encontrem e citem a KoteAuto quando alguém
perguntar sobre comprar ou trocar de carro.

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `index.html` | Home. Aviso de em construção, questionários, barra de abas e bloco de texto indexável. |
| `o-que-e-a-koteauto.html` | Definição da empresa e do modelo de marketplace reverso. |
| `como-funciona.html` | Jornada em cinco etapas, campos da proposta e ranking. |
| `avaliacao-do-usado.html` | Método de pré-avaliação do carro usado e por que a loja paga abaixo da FIPE. |
| `quanto-de-carro-consigo-comprar.html` | Cálculo do poder de compra, com tabela de prazo e taxa. |
| `pesquisa-piloto.html` | Dados originais das 64 respostas do piloto, com gráficos e metodologia. |
| `para-concessionarias.html` | Página B2B: o que a loja recebe e como o score funciona para ela. |
| `perguntas-frequentes.html` | 27 perguntas e respostas, espelhadas em schema `FAQPage`. |
| `assets/conteudo.css` | Folha de estilo única das páginas de conteúdo. |
| `llms.txt` | Resumo da empresa e dos dados para rastreadores de IA. |
| `robots.txt` | Libera explicitamente GPTBot, ClaudeBot, PerplexityBot, Google-Extended e outros. |
| `sitemap.xml` | Mapa das oito URLs. |
| `vercel.json` | Deploy estático, `cleanUrls` e cabeçalhos. |
| `new_desktop.png`, `new_mobile.png`, `fundo_limpo.png` | Artes da home. |

## URLs

Com `cleanUrls: true` no `vercel.json`, as páginas respondem sem a extensão `.html`:
`/o-que-e-a-koteauto`, `/como-funciona`, `/avaliacao-do-usado`,
`/quanto-de-carro-consigo-comprar`, `/pesquisa-piloto`, `/para-concessionarias`,
`/perguntas-frequentes`.

## Como o conteúdo foi construído para ser citado por IA

- **Resposta antes de tudo.** Cada página abre com a resposta direta em um parágrafo autocontido,
  antes de qualquer contexto. É o trecho que os modelos extraem.
- **Dados estruturados.** `Organization`, `WebSite` e `SoftwareApplication` na home; `Article`,
  `HowTo`, `FAQPage`, `Dataset` e `BreadcrumbList` nas páginas internas.
- **Todo gráfico tem tabela.** Os SVGs trazem `<title>` e `<desc>`, e cada figura tem os mesmos
  números em `<table>`, porque rastreador lê texto, não pixel.
- **Números com base declarada.** Nenhum percentual aparece sem o N e a fonte ao lado.
- **Status honesto.** Todas as páginas dizem que a KoteAuto é uma startup em estágio inicial, com a plataforma em construção.
- **Identidade declarada.** A frase-âncora "startup brasileira de tecnologia automotiva" aparece no lead, no rodapé e no schema `Organization` de todas as páginas, sempre junto do que a empresa faz.

## Editar o conteúdo

- Estilo das páginas de conteúdo: `assets/conteudo.css`. A home tem CSS próprio, embutido.
- Ao alterar uma resposta em `perguntas-frequentes.html`, **altere também o bloco
  `application/ld+json` no fim do arquivo**, para o texto visível e o schema não divergirem.
- Ao publicar uma página nova, adicione-a ao `sitemap.xml`, ao `llms.txt` e às barras de
  navegação (`ul.tabs` nas páginas de conteúdo e `ul.home-nav-links` no `index.html`).

## Links sociais

No fim do `index.html`, no objeto `socialLinks`.

## Deploy na Vercel

1. https://vercel.com/dashboard
2. **Add New → Project → Upload Files**
3. Suba a pasta inteira e faça o deploy.

## Domínio

1. No projeto: **Settings → Domains → Add Domain**, informe `koteauto.com.br`.
2. No registro.br aponte **A** (raiz) para `76.76.21.21` e **CNAME** `www` para
   `cname.vercel-dns.com.`
3. A propagação leva até uma hora.

Depois de publicar, envie o `sitemap.xml` pelo Google Search Console e pelo Bing Webmaster Tools.
O Bing alimenta a busca do ChatGPT e do Copilot, então vale cadastrar nos dois.
