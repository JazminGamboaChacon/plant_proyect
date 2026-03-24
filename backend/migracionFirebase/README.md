# Iniciar con datos Firebase

## Nota
Para no tener problemas con versiones de python, lo ideal sería, generar una ambiente de python solo para este proyecto o para este y el de el API con fastAPI

Esta carpeta incluye un script en Python para cargar datos iniciales en Firestore desde un archivo JSON.

El script es generico  no depende de colecciones fijas.
Lee cualquier archivo con la forma:

```json
{
  "collections": {
    "users": [
      {
        "id": "user-1",
        "email": "user@example.com",
        "createdAt": "2026-03-08T08:00:00.000Z"
      }
    ],
    "plants": [
      {
        "id": "plant-1",
        "userId": "user-1",
        "name": "Lavanda"
      }
    ]
  }
}
```

Cada propiedad dentro de `collections` se toma como una coleccion de Firestore.
Cada elemento del arreglo se toma como un documento.
El campo `id` se usa como el id del documento y el resto de propiedades se guardan como payload.

## Archivos

- `seed_firestore.py`: script en Python para cargar el JSON en Firestore.
- `seed_data.json`: ejemplo de datos para cargar a la db.

## Requisitos

Instala la libreria de Firebase Admin en tu Python:

```powershell
pip install firebase-admin
```

## Credenciales

Descarga una `service account` desde Firebase Console:

1. `Project settings`
2. `Service accounts`
3. `Generate new private key`

Guarda ese JSON, por ejemplo, como `serviceAccountKey.json`.

## Ejecucion

Desde la raiz del proyecto:

```powershell
python .\initial_firebase\seed_firestore.py --credentials .\serviceAccountKey.json
```

Si no indicas `--data`, el script intenta usar primero `.\firebase-seed.json` y luego `.\initial_firebase\seed_data.json`.

Para indicar otro archivo manualmente:

```powershell
python .\initial_firebase\seed_firestore.py --credentials .\serviceAccountKey.json --data .\firebase-seed.json
```

Para simular sin escribir:

```powershell
python .\initial_firebase\seed_firestore.py --credentials .\serviceAccountKey.json --dry-run
```

Para mezclar con documentos existentes en vez de sobrescribirlos completos:

```powershell
python .\initial_firebase\seed_firestore.py --credentials .\serviceAccountKey.json --merge
```

- Convierte automaticamente `createdAt`, `updatedAt` y `scheduledFor` desde ISO 8601 hacia timestamps de Firestore.
