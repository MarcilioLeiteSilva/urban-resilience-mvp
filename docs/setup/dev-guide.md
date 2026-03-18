# Guia de Desenvolvimento local

Este documento descreve como configurar e executar o **Urban Resilience MVP** localmente.

## Infraestrutura Básica
O projeto utiliza **Docker Compose** para orquestrar os serviços essenciais (Banco PostGIS, Backend e Frontend).

### Pré-requisitos
- [Docker](https://www.docker.com/) instalado.
- [Node.js 18+](https://nodejs.org/) (opcional se rodar tudo no docker).
- [Python 3.10+](https://www.python.org/) (opcional se rodar tudo no docker).

---

## 🚀 Como Rodar Tudo no Docker

1. Navegue até a pasta de infra:
   ```bash
   cd infra/docker
   ```

2. Suba os containers com build (demorará um pouco na primeira vez):
   ```bash
   docker-compose up --build
   ```

O Compose iniciará:
- **Banco**: `localhost:5432` com PostGIS.
- **Backend API**: `http://localhost:8000` (FastAPI)
- **Frontend Dashboard**: `http://localhost:3000` (Next.js)

---

## 🛠️ Rodando Localmente (Sem Docker)

### 1. Banco de Dados (PostgreSQL + PostGIS)
Requer rodar pelo menos o banco de dados no docker ou ter um serviço PostGIS local rodando na porta `5432`.
```bash
docker run --name urban-postgis -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=urban_resilience -p 5432:5432 -d postgis/postgis:15-3.4
```

### 2. Backend (FastAPI)
1. Navegue para `apps/backend/`:
   ```bash
   cd apps/backend
   ```
2. Crie e ative um ambiente virtual:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
4. Inicie o servidor:
   ```bash
   uvicorn app.main:app --reload
   ```

### 3. Frontend (Next.js)
1. Navegue para `apps/frontend/`:
   ```bash
   cd apps/frontend
   ```
2. Instale dependências:
   ```bash
   npm install
   ```
3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
