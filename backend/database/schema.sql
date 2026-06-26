-- AgroGuardian — Esquema relacional (PostgreSQL)
--
-- Convenciones (STYLE_GUIDE):
--   - Campos en snake_case.
--   - Baja lógica con is_active (nunca DELETE físico).
--   - created_at / updated_at en toda tabla con ciclo de vida.
--   - local_id en tablas sincronizables: idempotencia de la cola offline (#10).

-- Limpieza idempotente para re-aplicar el esquema desde cero
DROP TABLE IF EXISTS batches CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS crop_recommendations CASCADE;
DROP TABLE IF EXISTS pesticides CASCADE;
DROP TABLE IF EXISTS plots CASCADE;
DROP TABLE IF EXISTS farmers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS set_updated_at CASCADE;

-- Trigger reutilizable: mantiene updated_at en cada UPDATE
CREATE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Usuarios institucionales (DRA / municipalidades / cooperativas)
-- El agricultor NO vive aquí: se autentica por su DNI en la tabla farmers.
-- ---------------------------------------------------------------------------
CREATE TABLE users (
    id_user       SERIAL PRIMARY KEY,
    name          VARCHAR(120) NOT NULL,
    email         VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL CHECK (role IN ('DRA', 'MUNICIPALIDAD', 'COOPERATIVA')),
    district      VARCHAR(80),                         -- ámbito territorial (municipalidad/cooperativa)
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Agricultores (usuario principal de la PWA)
-- ---------------------------------------------------------------------------
CREATE TABLE farmers (
    id_farmer     SERIAL PRIMARY KEY,
    name          VARCHAR(120) NOT NULL,
    dni           VARCHAR(15)  NOT NULL UNIQUE,
    password_hash VARCHAR(255),                        -- clave simple de acceso a la app (#5)
    community     VARCHAR(120),
    district      VARCHAR(80),
    province      VARCHAR(80),
    phone         VARCHAR(20),
    association   VARCHAR(120),                         -- opcional
    local_id      VARCHAR(40)  UNIQUE,                  -- idempotencia de sincronización
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_farmers_updated_at
    BEFORE UPDATE ON farmers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Parcelas
-- ---------------------------------------------------------------------------
CREATE TABLE plots (
    id_plot                SERIAL PRIMARY KEY,
    id_farmer              INTEGER NOT NULL REFERENCES farmers(id_farmer),
    name                   VARCHAR(120) NOT NULL,
    area_ha                NUMERIC(10, 2),               -- área en hectáreas
    latitude               NUMERIC(10, 7),
    longitude              NUMERIC(10, 7),
    crop                   VARCHAR(80) NOT NULL,
    planting_date          DATE,
    estimated_harvest_date DATE,
    local_id               VARCHAR(40) UNIQUE,
    is_active              BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_plots_farmer ON plots(id_farmer);

CREATE TRIGGER trg_plots_updated_at
    BEFORE UPDATE ON plots
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Catálogo de pesticidas
-- ---------------------------------------------------------------------------
CREATE TABLE pesticides (
    id_pesticide      SERIAL PRIMARY KEY,
    name              VARCHAR(120) NOT NULL UNIQUE,
    active_ingredient VARCHAR(160),
    is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Recomendaciones por cultivo (alimentan el motor de alertas #18)
-- ---------------------------------------------------------------------------
CREATE TABLE crop_recommendations (
    id_recommendation SERIAL PRIMARY KEY,
    crop              VARCHAR(80)  NOT NULL,
    id_pesticide      INTEGER      NOT NULL REFERENCES pesticides(id_pesticide),
    recommended_dose  NUMERIC(10, 2) NOT NULL,          -- dosis recomendada por hectárea
    dose_unit         VARCHAR(20)  NOT NULL,             -- ej. 'kg/ha', 'L/ha'
    frequency_days    INTEGER,                            -- días entre aplicaciones
    withdrawal_days   INTEGER      NOT NULL,             -- tiempo de carencia (días)
    is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    UNIQUE (crop, id_pesticide)
);

CREATE INDEX idx_recommendations_crop ON crop_recommendations(crop);

-- ---------------------------------------------------------------------------
-- Aplicaciones de pesticidas (núcleo de la trazabilidad)
-- ---------------------------------------------------------------------------
CREATE TABLE applications (
    id_application SERIAL PRIMARY KEY,
    id_plot        INTEGER NOT NULL REFERENCES plots(id_plot),
    id_pesticide   INTEGER NOT NULL REFERENCES pesticides(id_pesticide),
    applied_at     TIMESTAMPTZ NOT NULL,                 -- fecha y hora de la aplicación
    dose           NUMERIC(10, 2) NOT NULL,              -- dosis aplicada por hectárea
    quantity       NUMERIC(10, 2),                        -- cantidad total usada
    photo_url      VARCHAR(255),
    observations   TEXT,
    local_id       VARCHAR(40) UNIQUE,
    is_active      BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_applications_plot ON applications(id_plot);

CREATE TRIGGER trg_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Lotes / trazabilidad por QR
-- ---------------------------------------------------------------------------
CREATE TABLE batches (
    id_batch   SERIAL PRIMARY KEY,
    id_plot    INTEGER NOT NULL REFERENCES plots(id_plot),
    code       VARCHAR(40) NOT NULL UNIQUE,              -- código legible que viaja en el QR
    level      VARCHAR(10) CHECK (level IN ('BRONCE', 'PLATA', 'ORO')),
    closed_at  TIMESTAMPTZ,
    local_id   VARCHAR(40) UNIQUE,
    is_active  BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_batches_plot ON batches(id_plot);
