# Atelier — CMS do Portfólio

Aplicação web profissional para gerir o conteúdo do site de um artista:
blog, obras, exposições, mapa de localizações, páginas editáveis e
contactos — tudo a partir de um painel de administração seguro.

## Stack

| Camada        | Tecnologia                          |
| ------------- | ----------------------------------- |
| Framework     | Next.js 15 (App Router) + TypeScript |
| Base de dados | PostgreSQL                          |
| ORM           | Prisma                              |
| Autenticação  | Auth.js (NextAuth v5) + bcrypt      |
| UI            | Tailwind CSS                        |
| Alojamento    | Vercel + Postgres gerido            |

## Arranque rápido

1. **Instalar dependências**

   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente**

   ```bash
   cp .env.example .env
   ```

   Preenche o `.env`:
   - `DATABASE_URL` — string de ligação ao PostgreSQL (Vercel Postgres, Neon ou Supabase).
   - `AUTH_SECRET` — gera com `openssl rand -base64 32`.
   - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — conta de administrador inicial.

3. **Criar o esquema e popular**

   ```bash
   npm run db:migrate   # cria as tabelas
   npm run db:seed      # cria o admin + páginas de conteúdo
   ```

4. **Arrancar**

   ```bash
   npm run dev
   ```

   - Site público: `http://localhost:3000`
   - Painel: `http://localhost:3000/admin` (redireciona para `/login` se não houver sessão)

## Segurança da autenticação

- Todo o `/admin` é protegido em **duas camadas**: `middleware.ts` (antes de renderizar) e verificação de sessão no `admin/layout.tsx`.
- Sessões via **JWT assinado** (`AUTH_SECRET`).
- Palavras-passe guardadas com **bcrypt** (nunca em texto simples).
- Papéis (`ADMIN`, `EDITOR`) já no modelo; a matriz de permissões vive em `src/lib/permissions.ts` e é facilmente extensível.

## Estrutura

```
prisma/schema.prisma     → modelo de dados completo (todas as entidades)
prisma/seed.ts           → admin inicial + singletons de conteúdo
middleware.ts            → proteção de rotas /admin
src/auth.config.ts       → config Auth.js compatível com edge
src/auth.ts              → provider de credenciais (Node)
src/lib/                 → prisma, permissões, utilitários
src/components/admin/    → shell do painel (sidebar, topbar, cartões)
src/app/login/           → página de login
src/app/admin/           → dashboard + um módulo por área de gestão
```

## Modelo de dados

Entidades: `User`, `Media`, `Post`, `PostImage`, `Category`, `Tag`,
`Artwork`, `ArtworkImage`, `MapPin`, `Exhibition`, `ExhibitionImage`,
`AboutPage`, `HomePage`, `ContactInfo`, `SocialLink`.

`Media` é transversal (imagens, PDFs, catálogos, documentos) e é
referenciada por todos os módulos que precisam de ficheiros.

## Roadmap (próximas fases)

1. ✅ **Fundação** — BD, autenticação, painel protegido. *(esta entrega)*
2. **Media + Upload** — biblioteca de ficheiros (base de tudo).
3. **Blog** — CRUD, editor rico (Tiptap), categorias/tags, agendamento.
4. **Obras + Mapa** — catálogo e pinpoints (Leaflet).
5. **Exposições + Páginas** (Sobre, Inicial, Contactos).
6. **Frontend público premium** consumindo o CMS.

## Deploy na Vercel

1. Cria a base de dados (Vercel Postgres / Neon).
2. Liga o repositório à Vercel.
3. Define as variáveis de ambiente no projeto Vercel.
4. O comando de build (`prisma generate && next build`) já está configurado.
5. Após o primeiro deploy, corre as migrações e o seed contra a BD de produção.
