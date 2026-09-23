# 🚀 Web de Bienvenida - Escuela Proa (SQL + Node + Vue 3)

Proyecto de prueba para validar el despliegue en la nube mediante **Coolify**.

## 🛠️ Stack Tecnológico
- **Frontend**: Vue 3 + Vite + Nginx
- **Backend**: Node.js + Express
- **Base de Datos**: MySQL / MariaDB (con inicialización automática de tablas)
- **Contenedores**: Dockerfiles optimizados para Coolify

---

## 📁 Estructura del Proyecto

```text
├── backend/
│   ├── db.js             # Conexión a MySQL y creación automática de tabla `visitors`
│   ├── index.js          # API REST (Endpoints: /api/visitors, /health)
│   ├── Dockerfile        # Imagen Docker ligera (Node 22 Alpine)
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.vue       # Formulario para ingresar nombre y lista lateral de visitas
│   │   ├── style.css     # Estilos modernos y responsivos
│   │   ├── assets/       # Logo de la institución
│   │   └── main.js
│   ├── Dockerfile        # Multi-stage build con Nginx
│   ├── nginx.conf
│   ├── package.json
│   └── .env.example
├── docker-compose.yml     # Para probar todo junto localmente si lo deseas
└── README.md
```

---

## ☁️ Guía de Despliegue en Coolify

Dado que vas a desplegar el **Frontend** y el **Backend** por separado conectándose a una base de datos MySQL ya creada en Coolify:

### 1. Base de Datos en Coolify
1. En tu panel de Coolify, agregá un nuevo recurso: **Databases -> MySQL** (o MariaDB).
2. Asignale un nombre a la base (por ejemplo `proa_db`).
3. Anotate las credenciales o la variable de conexión interna que te da Coolify (Host interno, Puerto 3306, Usuario, Password y Nombre de BD, o la URL de conexión).

### 2. Desplegar el Backend (Node.js)
1. En Coolify, agregá un nuevo recurso: **Application -> Git Repository** (o Public Git Repository).
2. Seleccioná tu repositorio.
3. Configurá:
   - **Base Directory**: `/backend`
   - **Build Pack**: `Dockerfile`
   - **Ports Exposes**: `3000`
4. En la pestaña **Environment Variables** del Backend, agregá las credenciales de tu MySQL:
   - Opción con URL directa:
     ```env
     DATABASE_URL=mysql://usuario:password@host_interno_coolify:3306/proa_db
     ```
   - O con variables separadas:
     ```env
     DB_HOST=host_interno_coolify
     DB_PORT=3306
     DB_USER=proa_user
     DB_PASSWORD=tu_password
     DB_NAME=proa_db
     PORT=3000
     ```
5. Asignale un dominio o subdominio en Coolify (por ejemplo `https://api.tu-dominio.com`).
6. Presioná **Deploy**. ¡Listo! Al arrancar, el backend creará automáticamente la tabla `visitors` si no existe.

### 3. Desplegar el Frontend (Vue 3)
1. Agregá otro recurso en Coolify: **Application -> Git Repository**.
2. Seleccioná el mismo repositorio.
3. Configurá:
   - **Base Directory**: `/frontend`
   - **Build Pack**: `Dockerfile`
   - **Ports Exposes**: `80`
4. En **Environment Variables** (o Build Args):
   ```env
   VITE_API_URL=https://api.tu-dominio.com
   ```
   *(Reemplazá por la URL pública que le asignaste al Backend en el paso 2)*.
5. Asignale el dominio principal (por ejemplo `https://tu-dominio.com`).
6. Presioná **Deploy**.

---

## 💻 Prueba Local (Opcional)

Si querés probar todo en tu computadora antes de subirlo:

```bash
# Opción con Docker Compose (levanta MySQL, Backend y Frontend juntos):
docker compose up --build

# El frontend estará disponible en http://localhost:8080
# El backend estará disponible en http://localhost:3000
```

