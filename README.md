# 🚀 Web de Bienvenida - Escuela Proa (SQL + Node + Vue 3) [Sin Docker]

Esta aplicación funciona directamente con **Node.js** y **Nixpacks** (el sistema nativo de Coolify para desplegar sin escribir Dockerfiles).

---

## 🛠️ Stack Tecnológico
- **Frontend**: Vue 3 + Vite
- **Backend**: Node.js + Express
- **Base de Datos**: MySQL / MariaDB (con creación automática de tabla `visitors`)

---

## 📁 Estructura del Proyecto

```text
├── backend/
│   ├── db.js             # Conexión MySQL y auto-creación de tabla `visitors`
│   ├── index.js          # API REST Express (Endpoints: /api/visitors, /health)
│   ├── package.json      # Dependencias (express, mysql2, cors, dotenv)
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.vue       # Formulario y listado lateral de visitas
│   │   ├── style.css     # Estilos modernos
│   │   ├── assets/       # Logo institucional
│   │   └── main.js
│   ├── vite.config.js    # Configuración de Vite con proxy
│   ├── package.json      # Dependencias de Vue 3
│   └── .env.example
├── .gitignore
└── README.md
```

---

## ☁️ Cómo desplegar en Coolify SIN Docker (con Nixpacks)

Coolify detecta aplicaciones Node.js automáticamente usando **Nixpacks**. No necesitás ningún archivo Dockerfile ni Docker Compose.

### 1. Base de Datos en Coolify
1. En tu proyecto de Coolify, agregá un nuevo recurso: **Databases -> MySQL** (o MariaDB).
2. Asignale un nombre a la base (ej: `proa_db`).
3. Anotate las credenciales internas de conexión (Host, Puerto, Usuario, Password o URL de conexión).

---

### 2. Desplegar el Backend (Node.js)
1. En Coolify: **New Resource -> Application -> Public / Private Git Repository**.
2. Seleccioná este repositorio.
3. En la configuración del servicio:
   - **Build Pack**: `Nixpacks` *(opción por defecto en Coolify)*
   - **Base Directory**: `/backend`
   - **Install Command**: `npm install`
   - **Start Command**: `npm start`
   - **Ports Exposes**: `3000`
4. En **Environment Variables**:
   ```env
   DATABASE_URL=mysql://usuario:password@host_interno_mysql:3306/proa_db
   PORT=3000
   ```
   *(o `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`)*.
5. Asignale un dominio o subdominio (ej: `https://api.tudominio.com`).
6. Clic en **Deploy**. Al arrancar, el backend creará la tabla `visitors` en MySQL automáticamente.

---

### 3. Desplegar el Frontend (Vue 3)
1. En Coolify: **New Resource -> Application -> Git Repository** (el mismo repo).
2. En la configuración:
   - **Build Pack**: `Static` o `Nixpacks`
   - **Base Directory**: `/frontend`
   - **Install Command**: `npm install`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. En **Environment Variables**:
   ```env
   VITE_API_URL=https://api.tudominio.com
   ```
   *(La URL pública de tu backend creada en el paso 2)*.
4. Asignale tu dominio público (ej: `https://tudominio.com`).
5. Clic en **Deploy**. Coolify servirá el frontend estático automáticamente con HTTPS y soporte SPA.

---

## 💻 Cómo ejecutarlo en tu computadora (Local sin Docker)

### 1. Backend:
```bash
cd backend
npm install
# Configurá tu archivo .env con los datos de tu MySQL local:
cp .env.example .env
npm run dev # o npm start
```
El backend correrá en `http://localhost:3000`.

### 2. Frontend:
```bash
cd frontend
npm install
npm run dev
```
El frontend correrá en `http://localhost:5173` y conectará automáticamente con el backend local.
