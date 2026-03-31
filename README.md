# Contador de Férias

Aplicação web moderna para acompanhar sua contagem de férias com:

- dias totais até o início
- dias úteis e não úteis
- saldo de dias de férias restantes
- tema claro/escuro com persistência

## Stack

- TypeScript (fonte em `ts/`)
- HTML/CSS fonte em `src/`
- build final em `dist/`
- execução com `pnpm`

## Estrutura

```txt
.
├── src/
│   ├── index.html
│   └── css/
│       └── styles.css
├── ts/
│   └── *.ts
├── scripts/
│   ├── copy-assets.mjs
│   └── serve-dist.mjs
├── dist/                # saída do build (gerada)
│   ├── index.html
│   ├── css/
│   └── js/
├── .env.example
├── package.json
└── tsconfig.json
```

## Configuração

Crie um `.env` local com base no `.env.example`:

```env
VACATION_START_DATE=2026-05-04
VACATION_TOTAL_DAYS=30
VACATION_LOCALE=pt-BR
```

## Scripts

```bash
pnpm run build   # limpa e gera dist/ (TS + assets)
pnpm run serve   # sobe servidor local servindo dist/
pnpm run start   # build + serve
pnpm run watch   # watch do TypeScript
```

## Como executar

1. Instalar dependências:

```bash
pnpm install
```

2. Rodar tudo com um comando:

```bash
pnpm run start
```

3. Abrir no navegador:

```txt
http://localhost:5500
```

## Sobre o `index.html`

Sim: agora ele não fica mais na raiz.

- fonte: `src/index.html`
- arquivo usado para rodar: `dist/index.html`

Isso deixa o projeto organizado entre código-fonte e artefato final de build.
