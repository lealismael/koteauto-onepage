# KoteAuto — One Image Website (Vercel)

Este projeto exibe **apenas uma imagem** ocupando toda a tela.

## Arquivos
- `index.html` — página que mostra a imagem `koteauto.jpg`
- `koteauto.jpg` — imagem principal (pode substituir pelo seu arquivo final)
- `vercel.json` — cabeçalho de cache para a imagem

## Como trocar a imagem
1. Substitua `koteauto.jpg` por sua arte final (mesmo nome).
2. Resolução sugerida: **1920 x 1080** ou **2560 x 1440** (JPG).
3. Para mobile, mantenha foco central na composição.

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
