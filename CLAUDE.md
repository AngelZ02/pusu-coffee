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

## Tablas Supabase
- clientes: id, nombre, email, telefono, direccion, referencia, created_at
- productos: id, nombre, proceso, precio, peso_g, notas[], activo, stock
- pedidos: id, cliente_id, producto_id, cantidad, total, estado, mp_payment_id, created_at
- audit_log: id, tabla, accion, registro_id, datos(jsonb), ip, created_at

## Productos
- Colibrí Rojo 250g | Proceso Lavado | S/37 | notas: Cacao, Nuez, Final dulce | acento: vino #5C1515
- Colibrí Dorado 250g | Proceso Honey | S/40 | notas: Miel, Durazno, Caramelo | acento: gold #C49530
- Colibrí Negro 250g | Proceso Natural | S/42 | notas: Frutos rojos, Chocolate, Intenso | acento: navy #0F1B2D

## Variables de entorno (.env.local)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CULQI_PUBLIC_KEY=
CULQI_SECRET_KEY=
NEXT_PUBLIC_WA_NUMBER=             # formato 51XXXXXXXXX sin +

## Reglas de seguridad — NUNCA violar
- NUNCA NEXT_PUBLIC_ para secrets (solo llaves públicas)
- NUNCA deshabilitar RLS en Supabase
- SIEMPRE validar precios en servidor — nunca confiar en precio del cliente
- SIEMPRE llamar auditLog() en pagos y creación de pedidos
- SIEMPRE responder { ok: boolean, data?, error? } en API routes

## Pendiente por crear
- lib/supabase/client.ts y lib/supabase/server.ts
- lib/payments/index.ts
- lib/audit/log.ts
- types/orders.ts y types/payments.ts
- SQL de tablas en Supabase (no ejecutado todavía)