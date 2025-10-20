## Live Demo
Aplicación desplegada: https://gestor-de-tareas-ivory.vercel.app/
(Puede tardar un poco en cargar si el backend de Render no ha recibido tráfico recientemente)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/carlosbalaguer/gestor-tareas-v2/
cd gestor-tareas-v2
```

### 2. Configurar el Backend

#### a) Navegar a la carpeta del backend

```bash
cd backend
```

#### b) Instalar dependencias

```bash
npm install
```

#### c) Configurar variables de entorno

Crear un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/gestor_de_tareas_v2?schema=public" # O si no tiene constaseña: "postgresql://usuario@localhost:5432/gestor_de_tareas_v2?schema=public"
JWT_SECRET="generar_clave_random"
PORT=4000
```

> **Nota:** Reemplazar `usuario`, `contraseña` y `gestor_de_tareas_v2` con las credenciales de PostgreSQL.

#### d) Crear la base de datos

```bash
createdb gestor_de_tareas_v2
```

#### e) Ejecutar migraciones de Prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### f) Iniciar el servidor backend

```bash
npm run start
```

El backend estará corriendo en `http://localhost:4000`

---

### 3. Configurar el Frontend

#### a) Abrir una nueva terminal y navegar a la carpeta del frontend

```bash
cd frontend
```

#### b) Instalar dependencias

```bash
npm install
```

#### c) Configurar variables de entorno

Crea un archivo `.env` en la carpeta `frontend/` con el siguiente contenido:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/
```

#### d) Iniciar el servidor frontend

```bash
npm run dev
```

El frontend estará corriendo en `http://localhost:3000`