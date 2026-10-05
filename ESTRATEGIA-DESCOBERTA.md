# Descoberta da KoteAuto em buscas e respostas de IA

Revisão: 05/10/2026. Escopo: site público institucional, com plataforma em desenvolvimento.
Não houve publicação, alteração de DNS nem cadastro em serviços externos nesta rodada.

## Direção editorial

Nossa recomendação é construir uma fonte útil sobre compra e troca de carros. A quantidade de
vezes que a marca aparece não substitui explicações verificáveis, boa navegação e experiência real.
O aviso de desenvolvimento permanece: o site pode informar agora sem anunciar cadastro ou
funcionalidades como disponíveis.

O [Google orienta](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
a priorizar conteúdo útil, rastreável e boa experiência, reduzir duplicação e não depender de
arquivos especiais para IA. `llms.txt` não melhora o posicionamento no Google. Mantemos o arquivo
como resumo auxiliar, sem a lista solta de palavras-chave que repetia o conteúdo.

### Organização adotada na integração da home

- **Home:** apresentação clara, demonstração de quatro ações, status e caminhos para saber mais.
  O conteúdo deve continuar disponível no HTML e sem assistir à animação.
- **Institucional:** “O que é” explica a empresa; “Como funciona” detalha a jornada prevista;
  “Para concessionárias” atende às dúvidas das lojas. Não precisam repetir o mesmo texto.
- **Guias:** avaliação do usado e orçamento respondem a problemas concretos, com exemplos
  identificados e fontes próximas das afirmações.
- **FAQ:** respostas curtas e links para os guias, sem reproduzir capítulos inteiros.
- **Privacidade:** explicação fiel ao site atual, separada da futura aplicação.

Preservar as oito URLs existentes nesta migração. Consolidar uma página só se houver conteúdo
realmente redundante e um redirecionamento planejado. Não criar várias URLs com sinônimos do
mesmo assunto para aumentar volume.

### Próximas pautas recomendadas (ainda não publicadas)

| Dúvida | Material que ajudaria o visitante |
| --- | --- |
| Como comparar propostas de troca? | Exemplo lado a lado, incluindo usado, dinheiro adicional, prazo e custo total. |
| Uma avaliação maior do usado significa negócio melhor? | Dois cenários mostrando a relação com o preço do próximo carro. |
| Como me preparar para conversar com a loja? | Checklist de informações e perguntas, sem promessa de compra segura garantida. |

Antes de abrir páginas novas, avaliar se a resposta cabe em um guia existente.
Publicar resultados do piloto apenas quando houver dados reais autorizados, método, período,
limitações e quantidade de participantes. Depoimentos, parceiros e menções externas devem ser
verdadeiros. A ambição de ser referência não deve virar alegação de liderança sem evidência.

## Correções aplicadas nesta rodada

- O site público redireciona de `koteauto.com.br` para `www.koteauto.com.br`. Alinhados os sinais
  canônicos locais ao destino real, preservando os caminhos.
- Sitemap gerado no build, com URLs das páginas e datas editoriais do JSON-LD. Removidos
  `priority` e `changefreq`, que o Google não utiliza. As datas não mudam a cada deploy.
- Build produz `dist/` apenas com material público, sem publicar estudos ou documentação.
- Nas páginas de avaliação e FAQ, corrigida a descrição da FIPE; removida a generalização de
  que nenhuma loja paga o valor cheio. A [FIPE](https://veiculos.fipe.org.br/) descreve uma
  referência de preços médios de revenda à vista ao consumidor final, com variações por veículo
  e mercado. Fonte incluída nas páginas e descrição coerente no JSON-LD.
- Mantidos os avisos de desenvolvimento e as permissões existentes de rastreamento.

Essa revisão é pontual, não uma auditoria completa dos cálculos, alegações comerciais ou regras
do produto de todas as páginas. A integração posterior da 024 harmonizou as páginas; veja INTEGRACAO-HOME.md para o registro.

## Sitemap e Google Search Console

O [sitemap é um sinal de descoberta](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
não uma garantia de rastreamento ou indexação. O endereço permanece o mesmo; não é necessário
criar um sitemap com nome novo a cada atualização. O build o regenera quando o site é preparado.
O editor atualiza `dateModified` apenas quando o conteúdo da página muda de maneira relevante.

Passos na conta do proprietário:

1. Abrir [Google Search Console](https://search.google.com/search-console/) e conferir se já existe
   uma propriedade para `koteauto.com.br` antes de criar outra.
2. Se necessário, adicionar propriedade de **Domínio** e verificar usando o registro DNS fornecido
   pelo próprio Google. Não inventar token ou alterar DNS antes de obter o valor da conta.
   [Orientações de verificação](https://support.google.com/webmasters/answer/9008080).
3. Na propriedade verificada, enviar `https://www.koteauto.com.br/sitemap.xml` na área Sitemaps.
   O sitemap público atual já está acessível; não é necessário esperar a nova home.
4. Inspecionar a home e páginas principais: acesso ao Googlebot, canonical selecionado, presença
   no índice e possíveis motivos de exclusão. Solicitar indexação de páginas relevantes quando
   necessário, sem tratar isso como garantia de prazo.
5. Depois da publicação, confirmar status 200 das URLs finais e que o sitemap lista os destinos
   canônicos. O `robots.txt` já informa o endereço do mapa.

Não foi possível verificar o estado da propriedade ou envio: não houve acesso à conta Search Console.
Não foi criado token de verificação. Não adicionamos analytics; o aviso de privacidade atual não
precisa mudar por conta desta rodada. Bing Webmaster Tools pode ser cadastrado como canal adicional,
sem tratá-lo como garantia de aparição em assistentes.

## Busca com IA e rastreadores

A [OpenAI distingue OAI-SearchBot de GPTBot](https://developers.openai.com/api/docs/bots): o primeiro
atende à busca; o segundo pode coletar conteúdo para treinamento. Permitir treinamento não é
pré-requisito para busca. A [Anthropic também distingue seus robôs](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler),
incluindo Claude-SearchBot, Claude-User e ClaudeBot. As permissões atuais foram preservadas.

`Allow` no robots não prova que houve visita ou indexação. Não instalar desafios que impeçam o
acesso aos conteúdos públicos pelos buscadores; se surgirem bloqueios, verificar a hospedagem
pelos procedimentos de identificação de robôs de cada fornecedor. Nenhuma configuração garante
que ChatGPT, Claude ou Gemini recomendem a marca.

## Como acompanhar

Depois do cadastro, acompanhar páginas indexadas, consultas, impressões e cliques no Search Console.
Separar buscas pela marca das dúvidas sobre troca, avaliação e comparação de carros. Usar isso
para escolher conteúdos úteis, não para inflar páginas semelhantes. Resultados de perguntas
manuais a assistentes são apenas observações, pois variam por contexto e momento.

## Verificação feita e limites

- HTTP público em 05/10/2026: sitemap e `/como-funciona` redirecionaram de sem www para www
  com 308 e responderam 200 no destino. `robots.txt` público permitiu os rastreadores mencionados.
- Testes locais do gerador: inclusão de nova página, exclusão de noindex do sitemap, estabilidade
  das datas, rejeição de canonical/data inválidos e exclusão de documentos e estudos do pacote.
- A publicação continua pendente; a nova configuração de build não foi executada na Vercel.
- Não foi confirmada indexação atual nem feita auditoria de desempenho ou de aparelhos nesta rodada.
