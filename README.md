# CryptoSharia Academy

**CryptoSharia Academy** is the official e-learning platform for **CryptoSharia** (PT Kripto Syariah Indonesia) — an Islamic-based crypto education ecosystem. This project delivers a modern, interactive learning experience focused on Sharia-compliant cryptocurrency knowledge, from fundamentals to advanced trading concepts.

## 🚀 Tech Stack

Built with the CryptoSharia ecosystem standards for consistency and developer experience:

- **Framework:** [SvelteKit](https://svelte.dev/docs/kit) (Powered by **Svelte 5** Runes)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with [Fluid TailwindCSS](https://fluid-tailwindcss.vercel.app/)
- **Components:** [bits-ui](https://www.bits-ui.com/) (Headless UI primitives)
- **Icons:** [Lucide Svelte](https://lucide.dev/)
- **API Client:** [openapi-fetch](https://openapi-ts.dev/openapi-fetch/) (Type-safe CryptoSharia API consumption)
- **Validation:** [Zod](https://zod.dev/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** JWT via [jose](https://github.com/panva/jose) + Argon2id
- **Testing:** [Vitest](https://vitest.dev/)

## ✨ Key Features

- **📚 Course Catalog:** Browse and enroll in structured learning paths covering Sharia-compliant crypto topics.
- **🎓 Interactive Lessons:** Step-by-step modules with video, text, and interactive content.
- **📝 Quizzes & Assessments:** Test understanding with quizzes at the end of each module.
- **📜 Certificates:** Earn verifiable certificates upon course completion.
- **👤 Student Dashboard:** Track progress, bookmarks, and learning history.
- **🔐 Role-Based Access:** Instructor, student, and admin roles integrated with the CryptoSharia RBAC system.
- **🌙 Dark Mode:** Full dark/light theme support.
- **📱 Fully Responsive:** Optimized for mobile, tablet, and desktop viewing.
- **🔍 SEO Optimized:** Semantic HTML and meta tags for discoverability.

## 🏗️ Ecosystem Integration

CryptoSharia Academy is part of the broader CryptoSharia microservice ecosystem:

| Service | Repository | Description |
|---|---|---|
| API | `cryptosharia-api` | Central REST API (auth, content, users) |
| Admin | `cryptosharia-admin` | Content management dashboard |
| Profile | `cryptosharia-profile` | Public-facing website |
| Portal | `cryptosharia-portal` | Community portal |
| Media | `cryptosharia-media` | Media viewer & renderer |
| **Academy** | **`cryptosharia-academy`** | **E-learning platform (this repo)** |

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v24+
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (for local development)
- Access to the CryptoSharia API (API key required)

## ⚡ Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/cryptosharia/cryptosharia-academy.git
cd cryptosharia-academy
```

### 2. Set up environment variables

```sh
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#-environment-variables) below).

### 3. Install dependencies

```sh
npm install
```

### 4. Start the development server

```sh
npm run dev
```

The app will be available at `http://localhost:5177`.

### 5. (Optional) Run with Docker Compose

```sh
docker compose up
```

## 🔑 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PUBLIC_APP_URL` | Public app URL | `http://localhost:5177` |
| `PUBLIC_CS_API_URL` | CryptoSharia API base URL | `https://preview.api.cryptosharia.id` |
| `CS_API_KEY` | CryptoSharia API key (server-only) | `your-api-key-here` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/academy` |

> **Note:** Variables prefixed with `PUBLIC_` are exposed to the client. Never put secrets there.

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run check` | Run Svelte type checking |
| `npm run lint` | Run ESLint + Prettier checks |
| `npm run format` | Auto-format code with Prettier |
| `npm run db:push` | Push schema changes to database |
| `npm run db:generate` | Generate database migrations |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:studio` | Open Drizzle Studio (DB GUI) |
| `npm run gen:api-types` | Generate TypeScript types from OpenAPI spec |
| `npm run test` | Run test suite |

## 📁 Project Structure

```
cryptosharia-academy/
├── src/
│   ├── lib/
│   │   ├── api/           # API client & generated types
│   │   ├── auth/          # Authentication utilities
│   │   ├── components/    # Reusable Svelte components
│   │   ├── db/            # Drizzle ORM schema & migrations
│   │   └── services/      # Business logic services
│   ├── routes/            # SvelteKit file-based routing
│   ├── app.html           # HTML template
│   ├── app.d.ts           # Global type declarations
│   └── hooks.server.ts    # Server-side middleware
├── static/                # Static assets
├── drizzle/               # Database migration files
├── .env.example           # Environment variable template
├── svelte.config.js       # SvelteKit configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── drizzle.config.ts      # Drizzle ORM configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies & scripts
```

## 🚢 Deployment

This project is configured for deployment on **Vercel**:

```sh
npm run build
```

For other platforms, install the appropriate [SvelteKit adapter](https://svelte.dev/docs/kit/adapters).

## 🤝 Contributing

1. Create a feature branch from `main`
2. Follow existing code conventions (TypeScript strict, Prettier, ESLint)
3. Write tests for new features
4. Submit a pull request

## 🔗 Links

- 🌐 **Website:** [cryptosharia.id](https://cryptosharia.id)
- 📡 **API Docs:** [api.cryptosharia.id](https://api.cryptosharia.id)
- 🏢 **Organization:** PT Kripto Syariah Indonesia

## 📄 License

This project is licensed under the [MIT License](LICENSE).
