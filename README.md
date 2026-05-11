# KoteAuto — Landing Page Estática (Vercel)

Este projeto exibe uma **landing page estática em HTML puro** com fundo visual em tela cheia e
links sociais clicáveis.

## Arquivos
- `index.html` — página principal, com CSS e JavaScript inline
- `new_desktop.png` — arte principal usada no desktop
- `new_mobile.png` — arte principal usada no mobile
- `fundo_limpo.png` — alternativa de fundo limpo
- `koteauto_desktop.png` — arte anterior de desktop
- `koteauto_mobile.png` — arte anterior de mobile
- `vercel.json` — configuração do deploy estático

## Como cadastrar os links sociais
1. Abra `index.html`.
2. Vá até o objeto `socialLinks`, no fim do arquivo.
3. Substitua as URLs atuais pelos perfis oficiais da KoteAuto.

## Como ajustar a arte
1. Para trocar a composição principal, altere os caminhos em `cleanBackgrounds` no `index.html`.
2. Se quiser voltar para o modo com hotspots sobre a arte antiga, mude `backgroundMode` para `art`.
3. Se surgir uma versão mobile diferente, atualize o campo `mobile` em `cleanBackgrounds`.

## Deploy na Vercel (sem repositório)
1. Acesse https://vercel.com/dashboard
2. **Add New → Project → Upload Files**
3. Faça upload da **pasta inteira** (ou arraste os arquivos).
4. Deploy.

## Conectar domínio
1. No projeto, vá em **Settings → Domains**.
2. Clique em **Add Domain** e informe `koteauto.com.br`.
3. No **registro.br**, aponte:
   - **A** (raiz) → `76.76.21.21`
   - **CNAME** `www` → `cname.vercel-dns.com.`
4. Aguarde a propagação (até 1 hora).

## Dica
Se já existe outro projeto na Vercel (por exemplo, sua landing completa), use um subdomínio para ele
(`beta.koteauto.com.br`) e deixe o domínio raiz `koteauto.com.br` apontando para este projeto de imagem única.
