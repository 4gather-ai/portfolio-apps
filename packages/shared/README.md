# packages/shared

Código comum entre os apps do portfólio. Nada aqui ainda — a extração acontece quando o **segundo** app precisar do mesmo código, não antes.

## Módulos previstos

| Módulo | O que faz | Extrair quando |
|---|---|---|
| `auth/` | Instalação OAuth, verificação de sessão, HMAC | App 2 |
| `billing/` | Wrapper da Shopify Billing API: 3 planos, trial de 14 dias, checagem de plano | App 2 |
| `webhooks/gdpr/` | `customers/data_request`, `customers/redact`, `shop/redact` — obrigatórios em todo app | App 2 |
| `i18n/` | Carregamento de locale, formatação de moeda/data para EN, pt-BR, ES, DE, FR | App 2 |
| `polaris/` | Componentes de UI repetidos (estado vazio, página de erro, seletor de plano) | App 2 |

## Regra

O App 1 (`restock`) escreve tudo dentro dele mesmo. Abstrair com um único consumidor produz a abstração errada — e atrasa a meta de 14 dias.
