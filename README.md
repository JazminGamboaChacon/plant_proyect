# Plant Project

Aplicación móvil de gestión de plantas construida con **Expo (React Native)** en el frontend y **FastAPI + Firebase Firestore** en el backend.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [Python](https://www.python.org/) 3.10 o superior
- Una cuenta en [Firebase](https://firebase.google.com/) con un proyecto de Firestore creado
- [Expo Go](https://expo.dev/go) instalado en el dispositivo móvil (opcional, para probar en físico)

---

## 1. Configurar Firebase

1. En la [Firebase Console](https://console.firebase.google.com/), abre tu proyecto
2. Ve a **Configuración del proyecto → Cuentas de servicio**
3. Haz clic en **Generar nueva clave privada** y descarga el archivo JSON
4. Coloca el archivo en `backend/migracionFirebase/serviceAccountKey.json`

### Cargar datos iniciales (opcional)

Si necesitas poblar Firestore con datos de prueba:

```bash
cd backend
python migracionFirebase/initial_firebase/seed_firestore.py \
  --credentials migracionFirebase/serviceAccountKey.json

# Solo previsualizar sin escribir:
python migracionFirebase/initial_firebase/seed_firestore.py \
  --credentials migracionFirebase/serviceAccountKey.json \
  --dry-run
```

---

## 2. Configurar el Backend

```bash
cd backend

# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual (Windows)
.venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### Variables de entorno

Copia el archivo de ejemplo y edítalo:

```bash
copy .env.example .env
```

Abre `backend/.env` y ajusta los valores:

```env
API_HOST=127.0.0.1
API_PORT=<puerto>
API_ENV=development
FIREBASE_SERVICE_ACCOUNT_PATH=<ruta-absoluta-al-serviceAccountKey.json>
CORS_ORIGINS=<origenes-separados-por-coma>
```

### Correr el backend

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port <API_PORT>
```

El servidor queda disponible en `http://127.0.0.1:<API_PORT>`.
Documentación interactiva: `http://127.0.0.1:<API_PORT>/docs`

> **Nota:** Reemplaza `<API_PORT>` con el valor que definiste en `.env`. Si el puerto ya está ocupado, cámbialo en `.env` y actualiza también `src/services/api.ts`.

---

## 3. Configurar el Frontend

```bash
# Desde la raíz del proyecto
npm install
```

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (está en `.gitignore`, no se sube al repo):

```bash
copy .env.example .env
```

Edita `.env` con la URL del backend según tu plataforma:

```env
# Web / iOS / dispositivo físico:
EXPO_PUBLIC_API_URL=http://127.0.0.1:<PORT>

# Emulador Android (10.0.2.2 mapea al localhost del PC):
# EXPO_PUBLIC_API_URL=http://10.0.2.2:<PORT>
```

Reemplaza `<PORT>` con el mismo valor que definiste en `backend/.env`.

### Correr el frontend

```bash
npm start
```

Luego selecciona la plataforma:
- Presiona `a` → Android emulator
- Presiona `w` → Navegador web
- Escanea el QR con Expo Go → Dispositivo físico

---

## Endpoints del API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servidor |
| GET | `/api/users/{userId}` | Datos del usuario |
| GET | `/api/users/{userId}/profile` | Perfil completo (plantas, grupos, logros) |
| GET | `/api/users/{userId}/plants` | Plantas del usuario |
| GET | `/api/plants/{plantId}` | Detalle de una planta |
| GET | `/api/users/{userId}/groups` | Grupos del usuario |
| GET | `/api/users/{userId}/achievements` | Logros del usuario |
| GET | `/api/plant-types` | Tipos de plantas disponibles |
| PUT | `/api/users/{userId}` | Actualizar usuario |
| PUT | `/api/plants/{plantId}` | Actualizar planta |
| GET | `/api/collections/{name}` | Ver cualquier colección de Firestore |
