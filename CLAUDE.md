# PUSU COFFEE — Estándares de desarrollo

## Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS + CSS Variables (app/globals.css)
- Supabase (cliente browser: lib/supabase/client.ts, servidor: lib/supabase/server.ts)
- Pago actual: MOCK en /api/payments/mock (migrar a Mercado Pago cuando haya credenciales)
- Deploy: Vercel

## Estructura de carpetas real
```
app/
  (public)/productos/page.tsx
  (public)/checkout/page.tsx
  (public)/pedido-confirmado/page.tsx
  (private)/dashboard/page.tsx
  api/orders/create/route.ts
  api/payments/mock/route.ts
  api/payments/culqi/route.ts       ← preparado para cuando haya RUC
  api/webhooks/treble/route.ts
  globals.css
  layout.tsx
  page.tsx                          ← landing principal

components/
  features/
    carrito/CarritoDrawer.tsx
    checkout/BotonPago.tsx
    checkout/PagoMock.tsx
    landing/HeroSection.tsx
    landing/TickerSection.tsx
    landing/ProductosSection.tsx
    landing/RitualSection.tsx
    landing/PhilosophySection.tsx
    landing/OriginSection.tsx
    landing/HowToBuySection.tsx
    landing/FinalCTASection.tsx
    productos/ProductoCard.tsx
    productos/ProductoCardPremium.tsx
  layout/
    Navbar.tsx
    Footer.tsx
  ui/
    Button.tsx
    Card.tsx
    ScrollRevealScript.tsx
```

## Paleta de colores oficial — globals.css :root
```
/* Base */
--color-brand-black:         #080808   ← hero, navbar, filosofía, footer
--color-brand-black-2:       #111
--color-brand-white:         #FFFFFF   ← secciones claras, refleja empaque físico
--color-brand-cream:         #F8F4ED   ← secciones suaves
--color-brand-cream-2:       #EFE9DA
--color-brand-off:           #F2EEE6
--color-brand-bark:          #3D2010   ← texto cuerpo sobre fondos claros
--color-brand-mid:           #6B6460   ← texto secundario
--color-brand-charcoal:      #141414

/* Dorado — hilo conductor */
--color-brand-gold:          #C49530
--color-brand-gold-2:        #D9AA4A
--color-brand-gold-3:        #ECC96A
--color-brand-gold-lt:       #D4A84B
--color-brand-gold-pale:     #F5EDD8   ← fondos dorado muy suave

/* Acentos por producto */
--color-brand-vino:          #5C1515   ← Colibrí Rojo
--color-brand-colibri-negro: #0F1B2D   ← Colibrí Negro
/* Colibrí Dorado usa --color-brand-gold */

/* Tipografía */
--font-display: 'Cormorant', Georgia, serif
--font-body:    'Inter', system-ui, sans-serif
```

## Regla de fondos — CRÍTICA
El empaque físico es BLANCO con dorado. La web debe ser coherente:
- OSCURO (#080808): HeroSection, PhilosophySection, RitualSection, FinalCTASection, Navbar, Footer
- CLARO (#FFFFFF o #F8F4ED): ProductosSection, OriginSection, HowToBuySection, Checkout, Confirmación

## Clases utilitarias disponibles
Layout: .container-brand .section-brand
Botones: .btn-primary (dorado→negro, para fondos oscuros) | .btn-primary-dark (negro→crema, para fondos claros) | .btn-ghost | .btn-solid
Tipografía: .text-display (Cormorant light)
Inputs: .input-premium (border-bottom dorado, texto bark)
Cards: .pcard .pcard-rojo .pcard-dorado .pcard-negro | .prod-card-premium
Carrito: .drawer-overlay .drawer-panel .drawer-items
Checkout: .checkout-grid .float-field .float-input .float-label
Misc: .spinner-gold .check-circle .productos-grid

## Flujo de datos — pedido
1. Cliente selecciona producto → CarritoDrawer (Context/localStorage)
2. /checkout → formulario datos → POST /api/orders/create
3. API valida precios vs Supabase → upsert cliente → crea pedido "pendiente"
4. PagoMock → POST /api/payments/mock → pedido "pagado" → auditLog
5. Redirect → /pedido-confirmado?id=[pedidoId]

## Flujo de pago actual (MOCK)
- lib/payments/index.ts → llama /api/payments/mock
- Mock: delay 1500ms + actualiza Supabase a "pagado"
- TODO: reemplazar lib/payments/index.ts por Mercado Pago SDK cuando haya credenciales

## Supabase
- Project ref: `xkaoxfltclfgrsxhbcrk`
- URL: `https://xkaoxfltclfgrsxhbcrk.supabase.co`
- Migration: `supabase/migrations/001_initial_schema.sql`
- Dashboard SQL editor: https://supabase.com/dashboard/project/xkaoxfltclfgrsxhbcrk/editor

## Schema de tablas — versión final (24/04/2025)

Todos los precios en soles (`numeric(10,2)`). RLS habilitado en todas las tablas.
`service_role` bypasses RLS automáticamente. El cliente browser usa `anon`.

### CATALOG
| Tabla | Columnas clave |
|---|---|
| `categorias` | id, nombre, slug, orden, activo |
| `productos` | id, categoria_id FK, nombre, slug, descripcion, proceso, precio, peso (g), stock, activo, imagen_url, metadata jsonb, created_at |
| `packs` | id, nombre, slug, descripcion, precio, activo, imagen_url, orden, created_at |
| `pack_items` | id, pack_id FK, producto_id FK, cantidad — UNIQUE(pack_id, producto_id) |

### CUSTOMERS
| Tabla | Columnas clave |
|---|---|
| `clientes` | id, nombre, email UNIQUE, telefono, created_at |
| `direcciones` | id, cliente_id FK, alias, direccion, referencia, distrito, es_principal bool, created_at — UNIQUE parcial: un solo es_principal por cliente |

### ORDERS
| Tabla | Columnas clave |
|---|---|
| `pedidos` | id, cliente_id FK, direccion_id FK, estado (pendiente/pagado/enviado/entregado/cancelado), total, metodo_pago (mock/culqi/mercadopago), cupon_id FK nullable, notas, created_at |
| `pedido_items` | id, pedido_id FK, producto_id FK nullable, pack_id FK nullable, cantidad, precio_unitario |
| `envios` | id, pedido_id FK, courier, tracking, estado, fecha_despacho, fecha_entrega_estimada, notas |

### MARKETING
| Tabla | Columnas clave |
|---|---|
| `cupones` | id, codigo UNIQUE, tipo (porcentaje/monto_fijo), valor, uso_maximo nullable, usos_actuales, activo, vence_at, created_at |
| `recomendaciones` | id, cliente_id FK nullable, respuestas jsonb, resultado, created_at |

### RETENTION
| Tabla | Columnas clave |
|---|---|
| `resenas` | id, cliente_id FK, producto_id FK, pedido_id FK, puntuacion (1–5), comentario, aprobado bool, created_at — UNIQUE(cliente_id, producto_id, pedido_id) |
| `notificaciones` | id, cliente_id FK, pedido_id FK nullable, canal (whatsapp/email/sms), tipo, contenido jsonb, enviado_at, created_at |

### AUDIT
| Tabla | Columnas clave |
|---|---|
| `audit_log` | id, tabla, accion, registro_id, datos jsonb, ip, created_at |

### RLS — resumen de políticas anon
| Tabla | Operación permitida |
|---|---|
| `categorias`, `productos` (activo=true), `packs` (activo=true), `pack_items` | SELECT |
| `clientes`, `pedidos`, `pedido_items`, `recomendaciones` | INSERT |
| Todo lo demás | solo service_role |

> **`lib/audit/log.ts` requiere actualización**: usa columnas antiguas (`action, entity, entity_id, user_id, metadata`). El nuevo schema usa (`accion, tabla, registro_id, datos, ip`).

## Productos (seed incluido en migration)
- Colibrí Rojo 250g | Proceso Lavado | S/37 | notas: Cacao, Nuez, Final dulce | acento: vino #5C1515
- Colibrí Dorado 250g | Proceso Honey | S/40 | notas: Miel, Durazno, Caramelo | acento: gold #C49530
- Colibrí Negro 250g | Proceso Natural | S/42 | notas: Frutos rojos, Chocolate, Intenso | acento: navy #0F1B2D
- Notas detalladas y origen/altitud guardados en `productos.metadata` (jsonb)

## Variables de entorno (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xkaoxfltclfgrsxhbcrk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ver .env.local>
SUPABASE_SERVICE_ROLE_KEY=<ver .env.local — NUNCA exponer>
NEXT_PUBLIC_CULQI_PUBLIC_KEY=          # pendiente — necesita RUC
CULQI_SECRET_KEY=                      # pendiente — necesita RUC
NEXT_PUBLIC_WA_NUMBER=                 # formato 51XXXXXXXXX sin +

## Reglas de seguridad — NUNCA violar
- NUNCA NEXT_PUBLIC_ para secrets (solo llaves públicas)
- NUNCA deshabilitar RLS en Supabase
- SIEMPRE validar precios en servidor — nunca confiar en precio del cliente
- SIEMPRE llamar auditLog() en pagos y creación de pedidos
- SIEMPRE responder { ok: boolean, data?, error? } en API routes
- SIEMPRE usar el cliente service_role en API routes que lean o muten datos de pedidos

## Pendiente
- Ejecutar `supabase/migrations/001_initial_schema.sql` en el SQL Editor del dashboard
- Actualizar `lib/audit/log.ts` para usar las columnas nuevas: `accion, tabla, registro_id, datos, ip`
- Actualizar `app/api/orders/create/route.ts` para escribir en `pedido_items` (esquema multi-item)
- Actualizar `lib/payments/index.ts` y `app/api/payments/culqi/route.ts` cuando haya credenciales Culqi
- Poblar `NEXT_PUBLIC_WA_NUMBER` en `.env.local`

---

## Changelog

### 24/04/2025 — Rediseño editorial de la landing (Claude Design handoff)

#### Componentes creados
| Archivo | Tipo | Descripción |
|---|---|---|
| `components/features/landing/landing.module.css` | CSS Module | Todos los estilos de la landing; reemplaza clases globales para secciones de landing |
| `components/features/landing/CafesSection.tsx` | Server component | Grid de 3 cafés (Rojo / Dorado / Negro) con ficha técnica y chips de notas |
| `components/features/landing/PacksSection.tsx` | Server component | 3 packs con doble CTA: botón web + enlace WhatsApp (`NEXT_PUBLIC_WA_NUMBER`) |
| `components/features/landing/TrustSection.tsx` | Server component | Grid 1fr / 1.3fr con título izquierda y 4 items de confianza a la derecha |
| `components/features/landing/Recomendador.tsx` | Client component (`"use client"`) | Overlay quiz 3 preguntas → scoring ponderado → resultado con CTA de compra |

#### Componentes refactorizados
| Archivo | Cambio |
|---|---|
| `components/features/landing/HeroSection.tsx` | Reescrito como client component; animación de entrada vía `requestAnimationFrame` + clase CSS module; grid 1.15fr / 1fr; banda de productos; botones con `data-open-recommender` |
| `components/features/landing/RitualSection.tsx` | Reescrito como server component; 4 pasos en grid (Abrir / Preparar / Descubrir / Repetir); elimina dependencia de imágenes externas |
| `components/features/landing/FinalCTASection.tsx` | Reescrito como server component; layout centrado con eyebrow dorado y botón `data-open-recommender` |
| `app/page.tsx` | Reemplaza 8 imports de secciones antiguas por las 6 nuevas + `<Recomendador />` fuera del wrapper |

#### Secciones antiguas reemplazadas (archivos en disco, no importados)
`TickerSection`, `ProductosSection`, `PhilosophySection`, `OriginSection`, `HowToBuySection`
y la versión anterior de `HeroSection`.

#### Sistema de diseño — ajustes del handoff
- **Estética:** editorial marfil (Aesop × Blue Bottle); fondo base `--color-brand-cream`, texto `--color-brand-charcoal`
- **Tipografía en landing:** Cormorant 400 para títulos de sección (`font-weight: 400`, no 300 como en el resto); `ui-monospace` para etiquetas y metadatos
- **Espaciado:** secciones con `clamp(80px, 10vw, 160px)` vertical; contenedor máximo 1440px
- **Botones de landing:** píldora (`border-radius: 999px`), `btnPrimary` usa `--color-brand-charcoal` (no dorado) sobre cream; `btnGhost` con borde `rgba(20,20,20,0.25)`
- **Scroll reveal:** clase global `rv-landing` + `rv-visible` inyectada por `<style>` en `Recomendador.tsx`; stagger con `d1` / `d2` / `d3`
- **Trigger del recomendador:** event delegation en `document` — cualquier elemento con `data-open-recommender` abre el overlay sin prop drilling

#### Correcciones visuales aplicadas
| # | Archivo | Selector | Propiedad | Antes | Después | Problema |
|---|---|---|---|---|---|---|
| 1 | `globals.css` | `.nav-base` | `background` | `rgba(8,8,8,0)` | `rgba(8,8,8,0.88)` | Navbar transparente + texto blanco invisible sobre fondo cream de la nueva landing |
| 2 | `globals.css` | `.cursor-ring` | `border` | `rgba(196,149,48,.4)` | `rgba(196,149,48,.8)` | Anillo del cursor custom casi invisible sobre fondos claros |
| 3 | `landing.module.css` | `.heroSection` | `padding-top` | `clamp(48px, 7vw, 96px)` | `clamp(80px, 10vw, 120px)` | Contenido del hero quedaba tapado por la navbar fija (~58px) en viewports pequeños |
| 4 | `landing.module.css` | `.packFeatured` | `background` | `#faf8f4` | `var(--color-brand-cream-2)` | Color hardcodeado fuera del sistema de variables |
| 5 | `landing.module.css` | `.buyOptionRec` | `background` | `rgba(248, 244, 237, 0.6)` | `var(--color-brand-gold-pale)` | Color hardcodeado fuera del sistema de variables |

#### Regla de fondos — actualización
La landing principal ahora usa fondo `--color-brand-cream` (no oscuro). Actualizar la tabla de secciones:
- **CLARO (`#F8F4ED` cream):** HeroSection (nueva), CafesSection, PacksSection, RitualSection, TrustSection, FinalCTASection
- **OSCURO (`#080808`):** Navbar (siempre; `rgba(8,8,8,0.88)` base, `.95` al hacer scroll), Footer