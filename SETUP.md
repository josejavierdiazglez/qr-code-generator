# Setup - Generador de códigos QR

Guía de instalación y desarrollo local. Este proyecto usa **pnpm** (no npm ni yarn).

## Estructura del proyecto

```
src/
  App.vue, main.ts, style.css   # entrada y estilos globales
  fonts/                        # @font-face acotados (Geist latin)
  components/                   # QrTool, ShareBar + ui/*
  composables/                  # useQr (estado + generación)
  state/                        # codec URL (url-state) + useUrlState
  qr/                           # encoder, payloads, render SVG/PNG
  utils/                        # cn() para clases Tailwind
tests/                          # Vitest
```

## Requisitos

- [Node.js](https://nodejs.org/) 20+ (recomendado LTS)
- [pnpm](https://pnpm.io/installation) 11+

Activar pnpm con Corepack (viene con Node):

```bash
corepack enable
corepack prepare pnpm@11.22.0 --activate
```

## Instalación

Desde la raíz del repo:

```bash
pnpm install
```

## Desarrollo

```bash
pnpm dev
```

Abre la URL que muestre Vite (por defecto `http://localhost:5173/`).

## Build

```bash
pnpm build
pnpm preview
```

La salida queda en `dist/`.

## Tests

```bash
pnpm test
```

## Scripts disponibles

| Comando        | Descripción                          |
|----------------|--------------------------------------|
| `pnpm install` | Instala dependencias                 |
| `pnpm dev`     | Servidor de desarrollo (Vite)        |
| `pnpm build`   | Typecheck (`vue-tsc`) + build        |
| `pnpm preview` | Sirve el build de producción         |
| `pnpm test`    | Vitest (unitarios en `tests/`)       |
