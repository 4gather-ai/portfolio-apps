# site/ — northstackapps.com

HTML estático puro. **Sem build, sem dependência, sem script, sem fonte remota, sem rastreador.**

Isso não é minimalismo por gosto: a política de privacidade promete que o app não rastreia ninguém, e um site que carrega Google Fonts ou analytics contradiz a própria política na primeira linha. Também é o que faz a página abrir instantaneamente e passar em revisão de segurança sem conversa.

```
site/
  index.html              northstackapps.com
  style.css               folha única, tema claro e escuro
  nativelog/
    beta.html             guia de instalação do beta (o link que vai nos anúncios)
    support.html          página de suporte  ← exigida pela Marketplace
    privacy.html          política de privacidade  ← exigida pela Marketplace
```

## Publicar no Cloudflare Pages — precisa do humano

1. Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Escolher o repositório `portfolio-apps`.
3. Configuração do build:
   - **Framework preset:** `None`
   - **Build command:** *(deixar vazio)*
   - **Build output directory:** `site`
4. **Custom domains** → adicionar `northstackapps.com` (e `www`, se quiser).
5. Conferir no ar:
   - `https://northstackapps.com/nativelog/privacy.html`
   - `https://northstackapps.com/nativelog/support.html`
   - `https://northstackapps.com/nativelog/beta.html`

Depois disso, todo push na `main` republica sozinho.

## E-mail — precisa do humano

As três páginas apontam para **`support@northstackapps.com`**, que ainda não existe. No Cloudflare: **Email** → **Email Routing** → regra de `support@northstackapps.com` para o e-mail pessoal. É grátis e leva uns minutos.

**Sem esse endereço, as páginas prometem um canal que não responde** — e a página de suporte é item obrigatório da revisão da Atlassian.

## Ao mexer nas páginas

- Manter **uma frase = um fato verificável**. A política de privacidade afirma coisas sobre armazenamento que o código cumpre; se o código mudar, a página muda no mesmo commit.
- A data no topo (`Last updated`) é parte do conteúdo. Mudou o texto, muda a data.
- Nada de link para CDN, fonte remota ou script de terceiro. Se algum dia precisar, o arquivo entra no repositório.
