# EmailPro - plantilla de dashboard

Aplicación local de referencia en Vue 3 y Vuetify 3. Utiliza datos simulados y no se conecta a ningún repositorio, API ni servicio externo.

## Para ejecutarla

1. Abre una terminal dentro de esta carpeta.
2. Instala las dependencias con `npm install`.
3. Inicia la vista local con `npm run dev`.
4. Abre la dirección que muestre la terminal (normalmente `http://localhost:5173`).

## Estructura

- `src/components/layout/`: navegación lateral, barra superior y menú de perfil.
- `src/components/dashboard/`: tarjetas y actividad reutilizables.
- `src/views/`: vistas para Inicio, Distribuidores y vistas base.
- `src/styles/main.css`: estilos de la identidad EmailPro.

No hay archivos que mover o renombrar. El proyecto es autocontenido y puede entregarse tal cual al equipo de frontend.

El botón "Volver al sitio" del acceso dirige actualmente a la página web local (`/sitio`). Cuando la web pública se publique en otro dominio, esa ruta se podrá reemplazar por la dirección final.
