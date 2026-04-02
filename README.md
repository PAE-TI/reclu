# Reclu

Replica en desarrollo de la plataforma original de evaluacion y reclutamiento, siguiendo el plan definido en:

- `docs/RECLU_MASTER_PLAN.md`

## Estado actual

Etapa implementada en este commit:

- `Etapa 0`: fundacion tecnica (Next.js, Tailwind, estructura base, env template)
- `Etapa 1`: shell funcional del portal con rutas principales y navegacion completa

Esto deja lista la base para conectar logica real en siguientes etapas:

- autenticacion
- base de datos dedicada en DigitalOcean (`reclu`)
- creditos
- evaluaciones
- scoring
- analytics
- pagos

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Vercel (deploy)
- DigitalOcean PostgreSQL (DB dedicada)

## Getting Started

Instala dependencias:

```bash
npm install
```

Copia variables de entorno:

```bash
cp .env.example .env.local
```

Ejecuta en local:

```bash
npm run dev
```

Abre `http://localhost:3000`.

## Learn More

Rutas principales ya disponibles en esta etapa:

- `/`
- `/dashboard`
- `/analytics`
- `/campaigns`
- `/campaigns/new`
- `/campaigns/[id]`
- `/team`
- `/admin`
- `/admin/technical-questions`
- `/external-evaluations`
- `/external-driving-forces-evaluations`
- `/external-eq-evaluations`
- `/external-dna-evaluations`
- `/external-acumen-evaluations`
- `/external-values-evaluations`
- `/external-stress-evaluations`
- `/batch-evaluations`
- `/external-technical-evaluations`
- `/evaluations-guide`
- `/guia-plataforma`
- `/profile`
- `/profile/edit`
- `/settings`
- `/credits/purchase`
- `/auth/signin`
- `/auth/signup`
- `/terms`

## Deployment

Objetivo de produccion definido:

- `Vercel` en `https://reclu.pasosalexito.com`

Para la base de datos:

- usar una base dedicada llamada `reclu` dentro del cluster de DigitalOcean
- no modificar ni borrar bases existentes del cluster
