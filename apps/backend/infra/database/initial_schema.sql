-- ==========================================
-- SCRIPT DE MIGRATION INICIAL (SQL)
-- Projeto: Urban Resilience MVP
-- Banco: PostgreSQL + PostGIS
-- ==========================================

-- 0. Garantir extensão PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Tabela: users
-- Ordem: Deve ser criada antes de qualquer tabela que tenha reporter_id (Chave Estrangeira)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'community_member', -- Enum em Pydantic
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela: areas
-- Ordem: Deve ser criada antes de Incidentes, Reportes e Obras e que dependem da Area
CREATE TABLE IF NOT EXISTS areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    
    -- Camada PostGIS (Polygon)
    geom GEOMETRY(POLYGON, 4326) NOT NULL,
    
    risk_score FLOAT DEFAULT 0.0,
    flood_risk_category VARCHAR(20) DEFAULT 'LOW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela: incidents
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(30) NOT NULL, -- Enum tipo de incidente
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    
    -- Camada PostGIS (Point) para o pino no mapa
    point GEOMETRY(POINT, 4326) NOT NULL,
    
    area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela: community_reports
CREATE TABLE IF NOT EXISTS community_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    image_url VARCHAR(500),
    
    -- Camada PostGIS (Point)
    point GEOMETRY(POINT, 4326) NOT NULL,
    
    area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela: interventions
CREATE TABLE IF NOT EXISTS interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PLANNED',
    cost_estimate FLOAT DEFAULT 0.0,
    
    -- Camada PostGIS (Point)
    point GEOMETRY(POINT, 4326) NOT NULL,
    
    area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela: risk_scores
CREATE TABLE IF NOT EXISTS risk_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    score FLOAT DEFAULT 0.0,
    category VARCHAR(20) DEFAULT 'LOW',
    description_details TEXT,
    
    area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ÍNDICES (Otimização para MVP)
-- ==========================================

-- Índice tradicional para login/busca
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Índices Espaciais (GIST) para o PostGIS (Buscas Geográficas rápidas)
CREATE INDEX IF NOT EXISTS idx_areas_geom ON areas USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_incidents_point ON incidents USING GIST (point);
CREATE INDEX IF NOT EXISTS idx_reports_point ON community_reports USING GIST (point);
CREATE INDEX IF NOT EXISTS idx_interventions_point ON interventions USING GIST (point);
