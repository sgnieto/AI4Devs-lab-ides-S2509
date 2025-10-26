# LTI - Sistema de Seguimiento de Talento

Monorepo full‑stack con frontend React y backend Express/TypeScript. El backend aplica DDD + Arquitectura Hexagonal + SOLID, con Prisma, Zod y DI con tsyringe.

## 🚀 Estado del Proyecto

✅ **Backend completamente funcional** con autenticación JWT, rate limiting y tests E2E  
✅ **Frontend React** con componentes shadcn/ui y autenticación  
✅ **Base de datos PostgreSQL** con Prisma ORM  
✅ **Tests automatizados** con Jest y Supertest  
✅ **Documentación OpenAPI** generada automáticamente
✅ **Módulo de Candidatos (MVP)** con listado protegido y dashboard por rol

## Explicación de Directorios y Archivos

- `backend/`: Contiene el código del lado del servidor escrito en Node.js.
  - `src/`: Contiene el código fuente para el backend.
    - `index.ts`: El punto de entrada para el servidor backend.
  - `prisma/`: Contiene el archivo de esquema de Prisma para ORM.
  - `tsconfig.json`: Archivo de configuración de TypeScript.
  - `.env`: Contiene las variables de entorno.
- `frontend/`: Contiene el código del lado del cliente escrito en React.
  - `src/`: Contiene el código fuente para el frontend.
  - `public/`: Contiene archivos estáticos como el archivo HTML e imágenes.
  - `build/`: Contiene la construcción lista para producción del frontend.
- `docker-compose.yml`: Contiene la configuración de Docker Compose para gestionar los servicios de tu aplicación.
- `README.md`: Este archivo contiene información sobre el proyecto e instrucciones sobre cómo ejecutarlo.

## Estructura del Proyecto

El proyecto está dividido en dos directorios principales: `frontend` y `backend`.

### Frontend

El frontend es una aplicación React y sus archivos principales están ubicados en el directorio `src`. El directorio `public` contiene activos estáticos y el directorio `build` contiene la construcción de producción de la aplicación.

### Backend

Backend en Express + TypeScript con Prisma y arquitectura limpia. Documentación completa:

`backend/README.md`

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js LTS (v18 o superior)
- Docker y Docker Compose
- npm o yarn

### Configuración rápida

1. **Clona el repositorio**
```bash
git clone <repository-url>
cd AI4Devs-lab-ides-S2509
```

2. **Configura la base de datos**
```bash
# Inicia PostgreSQL con Docker
docker-compose up -d
```

3. **Configura el backend**
```bash
cd backend
npm install
cp .env.example .env  # Configura las variables de entorno
npm run prisma:generate
npm run prisma:migrate
```

4. **Configura el frontend**
```bash
cd frontend
npm install
```

### 🚀 Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

- **Backend**: http://localhost:3010
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:3010/api-docs (Swagger UI)

### 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests  
cd frontend
npm test
```

### 🧭 Flujo Dashboard (MVP)
- Rutas protegidas tras login.
- Dashboard muestra email/rol y widgets por rol.
- “Últimos 5 candidatos”: nombre+apellido / email / createdAt.

### 🗄️ Base de datos y seeds (Candidatos)
- Prisma incluye el modelo `Candidate` (MVP) con migración.
- Seed de desarrollo:
```powershell
cd backend
npx prisma migrate dev --name add_candidates --skip-generate --schema prisma/schema.prisma
npx prisma generate --schema prisma/schema.prisma
npm run seed:candidates
```

### 🔗 OpenAPI y Tipos Frontend
```powershell
cd backend
npm run generate:openapi
cd ..
cd frontend
npm run types:openapi
```

## Docker y PostgreSQL

Este proyecto usa Docker para ejecutar una base de datos PostgreSQL. Así es cómo ponerlo en marcha:

Instala Docker en tu máquina si aún no lo has hecho. Puedes descargarlo desde aquí.
Navega al directorio raíz del proyecto en tu terminal.
Ejecuta el siguiente comando para iniciar el contenedor Docker:
```
docker-compose up -d
```
Esto iniciará una base de datos PostgreSQL en un contenedor Docker. La bandera -d corre el contenedor en modo separado, lo que significa que se ejecuta en segundo plano.

Para acceder a la base de datos PostgreSQL, puedes usar cualquier cliente PostgreSQL con los siguientes detalles de conexión:
 - Host: localhost
 - Port: 5432
 - User: postgres
 - Password: password
 - Database: mydatabase

Por favor, reemplaza User, Password y Database con el usuario, la contraseña y el nombre de la base de datos reales especificados en tu archivo .env.

Para detener el contenedor Docker, ejecuta el siguiente comando:
```
docker-compose down
```

## 📚 Documentación

- **Frontend**: `frontend/README.md` - React + TypeScript + shadcn/ui
- **Backend**: `backend/README.md` - Express + DDD + Arquitectura Hexagonal
- **API**: `backend/openapi.json` - Documentación OpenAPI generada automáticamente

## 🔧 Características Principales

### Backend
- ✅ **Autenticación JWT** con roles (recruiter, hiring_manager, hr_ops)
- ✅ **Rate Limiting** configurable por endpoint
- ✅ **Arquitectura Hexagonal** con DDD y SOLID
- ✅ **Tests E2E** con Jest y Supertest
- ✅ **Logging estructurado** con Pino
- ✅ **Validación** con Zod y envalid
- ✅ **Inyección de dependencias** con tsyringe

### Frontend  
- ✅ **React 18** con TypeScript
- ✅ **shadcn/ui** para componentes
- ✅ **Tailwind CSS** para estilos
- ✅ **Autenticación** con contexto React
- ✅ **Tipos generados** desde OpenAPI

### Base de Datos
- ✅ **PostgreSQL** con Docker
- ✅ **Prisma ORM** con migraciones
- ✅ **Singleton pattern** para conexiones
