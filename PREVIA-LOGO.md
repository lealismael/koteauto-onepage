# Prévia da identidade visual v1.0

13/10/2026 · branch `codex/previa-logo-identidade-v1` · base `fae9493`.

Aplicação local da marca oficial na home e nas oito páginas internas, seguindo a prévia aprovada.

- Assinatura horizontal branca no cabeçalho: 184 px no desktop e 152 px no celular.
- Assinatura horizontal colorida no rodapé: 190 px.
- Favicon oficial Micro.
- SVGs copiados sem alterações do pacote `../koteauto-landing/docs/socialmidia/logo/identidade-v1/`.
- Mantidos imagens do carro, cores da página, animações e navegação.
- A pedido do usuário, chamada inicial atualizada para “Um jeito mais inteligente de comprar ou trocar de carro.”
- As oito páginas internas usam a mesma assinatura branca no cabeçalho escuro e colorida no rodapé; o favicon é compartilhado.

## Visualizar

`node scripts/build-site.mjs`

`PORT=4175 node scripts/serve.mjs`

Abrir http://127.0.0.1:4175.

## Verificação

- Build e quatro testes de publicação passaram.
- `scripts/check-home.cjs`: 1440×810, 390×844, 320×568; sem erros de página ou carregamento, sem transbordamento horizontal; CTA, teclado, cancelamento, âncora direta, retorno da rolagem, movimento reduzido e ausência de JavaScript passaram.
- SVGs carregados e larguras acima do mínimo de 120 px do guia em 1440, 390 e 320 px.
- Páginas internas: oito rotas conferidas em 1440, 390 e 320 px (24 combinações), com SVGs carregados, retorno à home, foco no link da marca e ausência de transbordamento ou erros. Capturas de cabeçalho e rodapé da página Como funciona.
- Capturas temporárias em `/private/tmp/koteauto-logo-v1-review/`.
- Sem commit, push ou publicação.

Complemento aprovado: “Diga o que você procura. Compare propostas de lojas e escolha com mais clareza, no seu tempo.”

## Imagem de fundo da home (14/10/2026, Claude)

- **Imagem nova:** SUV de frente, com fundo verde-escuro. Substitui a silhueta anterior, que parecia esportiva demais.
- **Faróis:** a imagem gerada tinha luzes diurnas no desenho do "K" da marca. A pedido do usuário, foram retocadas para um farol comum: o "K" foi apagado (preenchimento pela cor da lente vizinha) e, no lugar, entrou uma faixa fina de LED acesa, com brilho moderado.
- **Arquivos:** `assets/carro-frente-1672.webp` e `assets/carro-frente-960.webp`. O nome é novo porque `assets/` fica 7 dias em cache. A `silhueta-*.webp` saiu do repositório.
- **Fachos de luz:** âncoras ajustadas para a faixa de LED (`.ln` 19,9% / 64%; `.rn` 79,7% / 64%).
- **Compartilhamento (`og:image`):** opção B, nova arte de 1200 × 630 px com a imagem do carro, a logo branca e a chamada, em `assets/brand/koteauto-compartilhamento-1200x630.jpg` (55 KB), nas 9 páginas e no `twitter:image`. A `koteauto-compartilhamento-v1.png` (1,6 MB), do Codex, ficou fora do commit.
- **Ícone do iPhone:** `apple-touch-icon.png` (180 px) na raiz, com link nas 9 páginas. O `site.webmanifest` ficou de fora: o build não publica `.webmanifest`, e o site é institucional.
