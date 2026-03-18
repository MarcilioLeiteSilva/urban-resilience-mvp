# Urban Resilience MVP - Monorepo

## 📁 Estrutura do Projeto

- `apps/`: Aplicações principais da plataforma
  - `frontend/`: Dashboard **Next.js** + MapLibre para renderização de mapa.
  - `backend/`: API **FastAPI** + PostGIS para lógica espacial e orquestração.
- `infra/`: Orquestradores locais e deploys.
  - `docker/`: contém `docker-compose.yml` local.
- `docs/`: Documentações de setup e arquitetura.

---

## 🚀 Como Rodar Localmente (Docker)

A forma mais rápida de validar o ecossistema é utilizando o Docker Compose de desenvolvimento:

1. Acesse o diretório de infraestrutura:
   ```bash
   cd infra/docker
   ```

2. Suba os containers com build process:
   ```bash
   docker-compose up --build
   ```

Acesse:
- **Dashboard**: [http://localhost:3000](http://localhost:3000)
- **API Health**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🌐 Deploy com Easypanel (Instruções)

Para realizar o deploy e validar a esteira GitHub -> VPS no seu painel Easypanel, crie **dois aplicativos individuais**:

### 1. Serviço: Backend
- **Tipo**: Application
- **Source**: GitHub
  - **Repository**: `MarcilioLeiteSilva/urban-resilience-mvp`
  - **Branch**: `main`
- **Configuradores de Build**:
  - **Dockerfile Path**: `apps/backend/Dockerfile`
- **Rede / Networking**:
  - **Port**: `8000`

### 2. Serviço: Frontend
- **Tipo**: Application
- **Source**: GitHub
  - **Repository**: `MarcilioLeiteSilva/urban-resilience-mvp`
  - **Branch**: `main`
- **Configuradores de Build**:
  - **Dockerfile Path**: `apps/frontend/Dockerfile`
- **Rede / Networking**:
  - **Port**: `3000`
