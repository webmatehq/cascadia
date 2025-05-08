# Cascadia Tap House – Frontend Deployment

Este proyecto es una aplicación frontend construida con **React + Vite + Tailwind CSS**. Tenía una estructura tipo monorepo con el frontend dentro de la carpeta `client/`.

Este `README.md` documenta los pasos realizados para limpiar, reorganizar y desplegar correctamente la aplicación en Vercel y dejar funcionando el entorno local con backend Express.

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

### ✅ Servidor local con Express

Para desarrollo local, el backend `server/index.ts` fue simplificado para servir el contenido compilado del frontend:

```ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
```

Esto no afecta el deploy en Vercel porque Vercel **no usa `server/index.ts`**.

---

## ✅ Resultado final

Tu proyecto ahora se muestra correctamente en producción en:

🔗 [https://www.cascadiataps.com](https://www.cascadiataps.com)

Y funciona en local vía:

```bash
npm run build
npm run dev
```

---

## 💡 Siguientes pasos sugeridos

- Agregar soporte para rutas con React Router.
- Integrar SEO (título dinámico, Open Graph, etc.).
- Agregar backend o API si se necesita en futuro (en Render o Railway).
- Crear una plantilla base con esta estructura para nuevos proyectos.

---

Desarrollado por Dario Realpe y subido por Jorge Arboleda.