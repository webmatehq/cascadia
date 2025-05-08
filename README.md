# Cascadia Tap House – Frontend Deployment

Este proyecto es una aplicación frontend construida con **React + Vite + Tailwind CSS**. Tenía una estructura tipo monorepo con el frontend dentro de la carpeta `client/`.

Este `README.md` documenta los pasos realizados para limpiar, reorganizar y desplegar correctamente la aplicación en Vercel.

---

## ✅ Estructura original

```
/client
  ├─ index.html
  └─ src/
       └─ App.tsx, main.tsx, componentes...
/server
  └─ index.ts (Express backend)
/vite.config.ts
/package.json
```

---

## 🔁 Cambios realizados

### 1. Mover el frontend a la raíz del proyecto

Se ejecutaron los siguientes comandos:

```bash
mv client/src ./src
mv client/index.html ./index.html
mv client/index.css ./src/index.css
rm -rf client
```

---

### 2. Actualizar `vite.config.ts`

Anteriormente tenía esto:

```ts
root: path.resolve(__dirname, "client")
```

Se eliminó la propiedad `root` y se actualizó la configuración así:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
```

---

### 3. Actualizar `tailwind.config.ts`

Se cambió el campo `content` de:

```ts
content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"]
```

a:

```ts
content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"]
```

Esto garantiza que Tailwind escanee correctamente los archivos en la nueva ubicación.

---

### 4. Confirmar que el CSS se importe

Se confirmó que `index.css` está correctamente importado desde `main.tsx`:

```ts
import './index.css';
```

No se añadió `<link>` manual en `index.html`, ya que Vite se encarga de inyectarlo.

---

### 5. Limpiar y hacer build

```bash
rm -rf dist
npm install
npm run build
```

---

### 6. Confirmar con Git y hacer deploy

```bash
git rm -r client
git add index.html src vite.config.ts tailwind.config.ts
git commit -m "Moved frontend from /client to root for Vercel deployment"
git push
```

---

### 7. Configuración en Vercel

- **Framework Preset**: `Vite`
- **Build Command**: `vite build`
- **Output Directory**: `dist`
- **Root Directory**: *(vacío)*

---

## ✅ Resultado final

Tu proyecto ahora se muestra correctamente en producción en:

🔗 [https://www.cascadiataps.com](https://www.cascadiataps.com)

---

## 💡 Siguientes pasos sugeridos

- Agregar soporte para rutas con React Router.
- Integrar SEO (título dinámico, Open Graph, etc.).
- Agregar backend o API si se necesita en futuro (en Render o Railway).
- Crear una plantilla base con esta estructura para nuevos proyectos.

---

Desarrollado con por Dario Realpe y subido por Jorge Arboleda.