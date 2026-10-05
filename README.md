# KoteAuto — site público em desenvolvimento

Site institucional estático. A plataforma de compra e troca ainda não está disponível ao público.
A home integra a referência visual 024, preservada em `claude-lab/`. As páginas internas foram
revisadas para o estágio de desenvolvimento e a identidade verde/porcelana.

## Preparar a publicação

Requer Node.js 22 ou posterior, sem instalar dependências:

```sh
node --test scripts/build-site.test.mjs
node scripts/build-site.mjs
```

O `vercel.json` executa esse build e publica **somente `dist/`**. Essa pasta contém as páginas
HTML da raiz, imagens, favicon, `assets/`, `robots.txt`, `llms.txt` e o sitemap gerado.
Documentação, scripts, testes e `claude-lab/` não entram no pacote. Novos arquivos públicos
fora dessas categorias precisam ser incluídos explicitamente em `scripts/build-site.mjs`.
Não suba a pasta de trabalho inteira como saída estática. O diretório raiz do projeto Vercel
deve ser este repositório (`koteauto-onepage`), com o build e a saída definidos no arquivo.

Para atualizar também a cópia versionada do sitemap:

```sh
node scripts/build-site.mjs --sitemap-only
```

## Conferir localmente

Após o build, execute `node scripts/serve.mjs` e abra `http://127.0.0.1:4173`.
O servidor local resolve as URLs sem extensão, como a Vercel. Não use `file://`, porque os assets
e links partem da raiz do site. Execute o build novamente após editar.

## Páginas e funções

| Página | Papel |
| --- | --- |
| `index.html` | Apresentação, situação do produto e acesso ao conteúdo. |
| `o-que-e-a-koteauto.html` | Identidade e proposta da empresa. |
| `como-funciona.html` | Jornada prevista e funcionamento do produto em desenvolvimento. |
| `avaliacao-do-usado.html` | Entender a avaliação do carro na troca. |
| `quanto-de-carro-consigo-comprar.html` | Entender orçamento e comparar cenários ilustrativos. |
| `para-concessionarias.html` | Proposta para lojas. |
| `privacidade-e-dados.html` | Aviso do site institucional atual. |
| `perguntas-frequentes.html` | Respostas breves e acesso às explicações detalhadas. |

As URLs usam `https://www.koteauto.com.br` e caminhos sem `.html` (configuração `cleanUrls`).
Em 05/10/2026, o domínio sem www redirecionou com 308 para www em requisições públicas.
Canonical, Open Graph, dados estruturados, llms.txt e sitemap foram alinhados a esse destino.
Os links internos relativos à raiz continuam funcionando nos dois ambientes.

## Ao editar ou criar uma página

1. Escreva conteúdo útil, com propósito próprio. Não replique páginas para repetir palavras-chave.
2. Preserve o aviso de desenvolvimento e diferencie funcionalidade prevista de serviço disponível.
3. Mantenha `title`, descrição e um canonical absoluto coerente com o domínio acima.
4. Atualize `dateModified` no JSON-LD quando houver mudança editorial relevante; preserve
   `datePublished`. A home usa `dateModified` no objeto `WebSite`. Não use a data do build,
   checkout ou upload como se todo o conteúdo tivesse sido revisado.
5. Se editar uma resposta com dados estruturados, mantenha texto visível e JSON-LD coerentes.
6. Nova página pública deve ser HTML na raiz (nome em minúsculas e hífens), ter link em outra
   página e entrar na navegação adequada. O gerador a inclui automaticamente no sitemap.
7. Execute os comandos acima e confira as alterações. Páginas com `noindex` não entram no mapa.
   Isso não as torna privadas; estudos e material interno devem ficar fora da raiz pública.

O build valida canonical, descrição, JSON-LD e data editorial. Não garante correção do conteúdo,
acessibilidade, indexação ou posicionamento. `lastmod` é lido do conteúdo; sua atualização editorial
não é automática. Repetir um build sem editar as páginas mantém as mesmas datas.

## Indexação e conteúdo

Veja [ESTRATEGIA-DESCOBERTA.md](ESTRATEGIA-DESCOBERTA.md) para o plano editorial,
fontes oficiais, cadastro no Search Console e verificações após a publicação.

O sitemap facilita descoberta; não garante indexação. `llms.txt` é um resumo auxiliar e não
uma condição para aparecer em buscas ou respostas de IA. As permissões de rastreamento existentes
foram preservadas; busca e treinamento de modelos são finalidades diferentes.

## Antes de abrir a plataforma

Manter `contato@koteauto.com.br` monitorado. Preparar a política e os termos aplicáveis ao produto
real, com identificação do responsável e revisão adequada, antes do cadastro público.
O aviso atual trata apenas do site institucional. A aplicação privada permanece em outro projeto.

## Verificação da integração

Veja [INTEGRACAO-HOME.md](INTEGRACAO-HOME.md) para mudanças, limites e testes.
O teste de navegador reutilizável é `scripts/check-home.cjs`. Ele requer Playwright já disponível
no ambiente de desenvolvimento (não é dependência da publicação):

```sh
PLAYWRIGHT_MODULE=/caminho/para/node_modules/playwright node scripts/check-home.cjs
```

Capturas e relatório vão para a pasta temporária `koteauto-qa`; use `KOTEAUTO_EVIDENCE_DIR`
para escolher outro destino. O teste cria um servidor local temporário e o fecha ao terminar.
