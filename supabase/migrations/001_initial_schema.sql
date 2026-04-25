-- ================================================================
-- PUSU COFFEE — Initial Schema
-- Migration : 001_initial_schema
-- Project   : xkaoxfltclfgrsxhbcrk
-- Run via   : Supabase Dashboard → SQL Editor
--             https://supabase.com/dashboard/project/xkaoxfltclfgrsxhbcrk/editor
-- Prices    : all in soles (numeric 10,2)
-- ================================================================


-- ================================================================
-- CATALOG
-- ================================================================

CREATE TABLE categorias (
  id       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre   text        NOT NULL,
  slug     text        NOT NULL UNIQUE,
  orden    int         NOT NULL DEFAULT 0,
  activo   bool        NOT NULL DEFAULT true
);

CREATE TABLE productos (
  id           uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id uuid          REFERENCES categorias(id) ON DELETE SET NULL,
  nombre       text          NOT NULL,
  slug         text          NOT NULL UNIQUE,
  descripcion  text,
  proceso      text,
  precio       numeric(10,2) NOT NULL,
  peso         int,                        -- gramos
  stock        int           NOT NULL DEFAULT 0,
  activo       bool          NOT NULL DEFAULT true,
  notas        text,
  imagen_url   text,
  metadata     jsonb         NOT NULL DEFAULT '{}',
  created_at   timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE packs (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      text          NOT NULL,
  slug        text          NOT NULL UNIQUE,
  descripcion text,
  precio      numeric(10,2) NOT NULL,
  activo      bool          NOT NULL DEFAULT true,
  imagen_url  text,
  orden       int           NOT NULL DEFAULT 0,
  created_at  timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE pack_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id     uuid NOT NULL REFERENCES packs(id)     ON DELETE CASCADE,
  producto_id uuid NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  cantidad    int  NOT NULL DEFAULT 1,
  UNIQUE (pack_id, producto_id)
);


-- ================================================================
-- MARKETING
-- (before pedidos — pedidos has a FK to cupones)
-- ================================================================

CREATE TABLE cupones (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo        text          NOT NULL UNIQUE,
  tipo          text          NOT NULL,   -- 'porcentaje' | 'monto_fijo'
  valor         numeric(10,2) NOT NULL,
  uso_maximo    int,                      -- NULL = ilimitado
  usos_actuales int           NOT NULL DEFAULT 0,
  activo        bool          NOT NULL DEFAULT true,
  vence_at      timestamptz,
  created_at    timestamptz   NOT NULL DEFAULT now()
);


-- ================================================================
-- CUSTOMERS
-- ================================================================

CREATE TABLE clientes (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre     text        NOT NULL,
  email      text        NOT NULL UNIQUE,
  telefono   text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE direcciones (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id   uuid        NOT NULL REFERENCES clientes(id)  ON DELETE CASCADE,
  alias        text,
  direccion    text        NOT NULL,
  referencia   text,
  distrito     text,
  es_principal bool        NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Only one principal address per customer
CREATE UNIQUE INDEX idx_direcciones_principal
  ON direcciones(cliente_id)
  WHERE es_principal = true;


-- ================================================================
-- ORDERS
-- ================================================================

CREATE TABLE pedidos (
  id           uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id   uuid          NOT NULL REFERENCES clientes(id)   ON DELETE RESTRICT,
  direccion_id uuid          REFERENCES direcciones(id)         ON DELETE SET NULL,
  estado       text          NOT NULL DEFAULT 'pendiente',
  total        numeric(10,2) NOT NULL,
  metodo_pago  text,                    -- 'mock' | 'culqi' | 'mercadopago'
  cupon_id     uuid          REFERENCES cupones(id)             ON DELETE SET NULL,
  notas        text,
  created_at   timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE pedido_items (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id       uuid          NOT NULL REFERENCES pedidos(id)  ON DELETE CASCADE,
  producto_id     uuid          REFERENCES productos(id)         ON DELETE SET NULL,
  pack_id         uuid          REFERENCES packs(id)             ON DELETE SET NULL,
  cantidad        int           NOT NULL DEFAULT 1,
  precio_unitario numeric(10,2) NOT NULL
);

CREATE TABLE envios (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id              uuid        NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  courier                text,
  tracking               text,
  estado                 text        NOT NULL DEFAULT 'pendiente',
  fecha_despacho         timestamptz,
  fecha_entrega_estimada timestamptz,
  notas                  text
);


-- ================================================================
-- MARKETING (cont.)
-- ================================================================

CREATE TABLE recomendaciones (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid        REFERENCES clientes(id) ON DELETE SET NULL,
  respuestas jsonb       NOT NULL DEFAULT '{}',
  resultado  text,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- ================================================================
-- RETENTION
-- ================================================================

CREATE TABLE resenas (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id  uuid        NOT NULL REFERENCES clientes(id)  ON DELETE CASCADE,
  producto_id uuid        REFERENCES productos(id)          ON DELETE SET NULL,
  pedido_id   uuid        REFERENCES pedidos(id)            ON DELETE SET NULL,
  puntuacion  int         NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
  comentario  text,
  aprobado    bool        NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cliente_id, producto_id, pedido_id)
);

CREATE TABLE notificaciones (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid        NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  pedido_id  uuid        REFERENCES pedidos(id)           ON DELETE SET NULL,
  canal      text        NOT NULL,   -- 'whatsapp' | 'email' | 'sms'
  tipo       text        NOT NULL,   -- 'confirmacion' | 'despacho' | 'entrega' | 'marketing'
  contenido  jsonb       NOT NULL DEFAULT '{}',
  enviado_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- ================================================================
-- AUDIT
-- ================================================================

CREATE TABLE audit_log (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tabla       text,
  accion      text        NOT NULL,
  registro_id text,
  datos       jsonb       NOT NULL DEFAULT '{}',
  ip          text,
  created_at  timestamptz NOT NULL DEFAULT now()
);


-- ================================================================
-- FK INDEXES
-- ================================================================

CREATE INDEX idx_productos_categoria   ON productos(categoria_id);
CREATE INDEX idx_pack_items_pack       ON pack_items(pack_id);
CREATE INDEX idx_pack_items_producto   ON pack_items(producto_id);
CREATE INDEX idx_direcciones_cliente   ON direcciones(cliente_id);
CREATE INDEX idx_pedidos_cliente       ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_direccion     ON pedidos(direccion_id);
CREATE INDEX idx_pedidos_cupon         ON pedidos(cupon_id);
CREATE INDEX idx_pedido_items_pedido   ON pedido_items(pedido_id);
CREATE INDEX idx_pedido_items_producto ON pedido_items(producto_id);
CREATE INDEX idx_pedido_items_pack     ON pedido_items(pack_id);
CREATE INDEX idx_envios_pedido         ON envios(pedido_id);
CREATE INDEX idx_recomendaciones_cli   ON recomendaciones(cliente_id);
CREATE INDEX idx_resenas_cliente       ON resenas(cliente_id);
CREATE INDEX idx_resenas_producto      ON resenas(producto_id);
CREATE INDEX idx_resenas_pedido        ON resenas(pedido_id);
CREATE INDEX idx_notificaciones_cli    ON notificaciones(cliente_id);
CREATE INDEX idx_notificaciones_pedido ON notificaciones(pedido_id);
CREATE INDEX idx_audit_log_tabla       ON audit_log(tabla);
CREATE INDEX idx_audit_log_accion      ON audit_log(accion);
CREATE INDEX idx_audit_log_created     ON audit_log(created_at);


-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE categorias      ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos       ENABLE ROW LEVEL SECURITY;
ALTER TABLE packs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE direcciones     ENABLE ROW LEVEL SECURITY;
ALTER TABLE cupones         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE envios          ENABLE ROW LEVEL SECURITY;
ALTER TABLE recomendaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE resenas         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones  ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log       ENABLE ROW LEVEL SECURITY;

-- ── Public read: catalog ──────────────────────────────────────────
-- Any visitor can browse active products, categories and packs.

CREATE POLICY "public_read_categorias"
  ON categorias FOR SELECT USING (true);

CREATE POLICY "public_read_productos"
  ON productos FOR SELECT USING (activo = true);

CREATE POLICY "public_read_packs"
  ON packs FOR SELECT USING (activo = true);

CREATE POLICY "public_read_pack_items"
  ON pack_items FOR SELECT USING (true);

-- ── anon INSERT ───────────────────────────────────────────────────
-- Guest checkout: anon role may only insert, never read or mutate
-- existing rows (server-side routes use service_role for that).

CREATE POLICY "anon_insert_clientes"
  ON clientes FOR INSERT WITH CHECK (true);

CREATE POLICY "anon_insert_pedidos"
  ON pedidos FOR INSERT WITH CHECK (true);

CREATE POLICY "anon_insert_pedido_items"
  ON pedido_items FOR INSERT WITH CHECK (true);

CREATE POLICY "anon_insert_recomendaciones"
  ON recomendaciones FOR INSERT WITH CHECK (true);

-- ── service_role ──────────────────────────────────────────────────
-- service_role bypasses RLS automatically in Supabase.
-- All API routes that read/update orders, envios, audit_log, etc.
-- must use the service_role client (lib/supabase/server.ts).


-- ================================================================
-- SEED DATA
-- ================================================================

-- ── Categoría ─────────────────────────────────────────────────────

INSERT INTO categorias (nombre, slug, orden, activo)
VALUES ('Café de Especialidad', 'cafe-de-especialidad', 1, true);

-- ── Productos ─────────────────────────────────────────────────────

INSERT INTO productos
  (categoria_id, nombre, slug, descripcion, proceso, precio, peso, stock, activo, metadata)
SELECT
  c.id,
  p.nombre,
  p.slug,
  p.descripcion,
  p.proceso,
  p.precio,
  p.peso,
  p.stock,
  true,
  p.metadata
FROM categorias c
CROSS JOIN (
  VALUES
    (
      'Colibrí Rojo',
      'colibri-rojo',
      'Arábica lavado de altura. Notas de cacao, nuez y final dulce. Café de entrada accesible y equilibrado.',
      'Lavado',
      37.00::numeric(10,2),
      250,
      50,
      '{"notas": ["Cacao", "Nuez", "Final dulce"], "origen": "Cusco", "altitud_msnm": 1650}'::jsonb
    ),
    (
      'Colibrí Dorado',
      'colibri-dorado',
      'Proceso honey de Cajamarca. Notas de miel, durazno y caramelo. Dulzura natural sin azúcar.',
      'Honey',
      40.00::numeric(10,2),
      250,
      40,
      '{"notas": ["Miel", "Durazno", "Caramelo"], "origen": "Cajamarca", "altitud_msnm": 1820}'::jsonb
    ),
    (
      'Colibrí Negro',
      'colibri-negro',
      'Natural de Amazonas. Notas de frutos rojos, chocolate e intensidad compleja. Para el paladar exigente.',
      'Natural',
      42.00::numeric(10,2),
      250,
      30,
      '{"notas": ["Frutos rojos", "Chocolate", "Intenso"], "origen": "Amazonas", "altitud_msnm": 1540}'::jsonb
    )
) AS p(nombre, slug, descripcion, proceso, precio, peso, stock, metadata)
WHERE c.slug = 'cafe-de-especialidad';

-- ── Populate notas column from seed data ──────────────────────────
UPDATE productos SET notas = 'Cacao, Nuez, Final dulce'       WHERE slug = 'colibri-rojo';
UPDATE productos SET notas = 'Miel, Durazno, Caramelo'        WHERE slug = 'colibri-dorado';
UPDATE productos SET notas = 'Frutos rojos, Chocolate, Intenso' WHERE slug = 'colibri-negro';
