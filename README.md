# Urban Resilience MVP - Monorepo

## Folder Structure
- `apps/`: Main applications (frontend, backend)
  - `frontend/`: Next.js app with TypeScript, Tailwind, and MapLibre.
  - `backend/`: FastAPI app with Python, SQLAlchemy, and Pydantic.
- `packages/`: Shared packages (types, config)
- `infra/`: Infrastructure files (docker, easypanel, scripts)
- `docs/`: Documentation (architecture, decisions, api, setup)
- `.github/`: CI/CD workflows

## Local Development
Detailed setup instructions can be found in `docs/setup/dev-guide.md`.

### Core Requirements
- Docker & Docker Compose
- Node.js (Latest LTS recommended)
- Python 3.10+
