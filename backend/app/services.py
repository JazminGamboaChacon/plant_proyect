import json
from pathlib import Path
from typing import Any
from fastapi import HTTPException

# Ruta al archivo de datos
PLANT_DB_PATH = Path(__file__).parent.parent / "migracionFirebase" / "plantDB.json"

# Cache en memoria
_db_cache: dict[str, Any] | None = None


def _load_db() -> dict[str, list[dict[str, Any]]]:
    """Carga el JSON en memoria"""
    global _db_cache
    if _db_cache is not None:
        return _db_cache

    if not PLANT_DB_PATH.exists():
        raise FileNotFoundError(f"No se encontró la base de datos: {PLANT_DB_PATH}")

    with open(PLANT_DB_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    _db_cache = data.get("collections", {})
    return _db_cache


def _save_db() -> None:
    """Guarda el cache en el JSON"""
    if _db_cache is None:
        return

    data = {"collections": _db_cache}
    with open(PLANT_DB_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def get_document(collection_name: str, document_id: str) -> dict[str, Any]:
    """Obtiene un documento por ID"""
    db = _load_db()

    if collection_name not in db:
        raise HTTPException(
            status_code=404,
            detail=f"Colección '{collection_name}' no encontrada.",
        )

    collection = db[collection_name]
    doc = next((d for d in collection if d.get("id") == document_id), None)

    if doc is None:
        raise HTTPException(
            status_code=404,
            detail=f"No se encontró el documento '{document_id}' en '{collection_name}'.",
        )

    return doc


def get_collection(
    collection_name: str,
    *,
    filters: list[tuple[str, str, Any]] | None = None,
    order_by: str | None = None,
) -> list[dict[str, Any]]:
    """Obtiene una colección completa con filtros opcionales"""
    db = _load_db()

    if collection_name not in db:
        raise HTTPException(
            status_code=404,
            detail=f"Colección '{collection_name}' no encontrada.",
        )

    collection = db[collection_name]

    # Aplicar filtros (solo soportamos operador "==")
    if filters:
        for field_name, operator, value in filters:
            if operator == "==":
                collection = [d for d in collection if d.get(field_name) == value]
            else:
                raise ValueError(f"Operador '{operator}' no soportado. Solo se soporta '=='")

    # Ordenar si se especifica
    if order_by:
        collection = sorted(collection, key=lambda d: d.get(order_by, ""))

    return collection


def update_document(
    collection_name: str, document_id: str, data: dict[str, Any]
) -> dict[str, Any]:
    """Actualiza un documento y guarda los cambios"""
    db = _load_db()

    if collection_name not in db:
        raise HTTPException(
            status_code=404,
            detail=f"Colección '{collection_name}' no encontrada.",
        )

    collection = db[collection_name]
    doc_index = next((i for i, d in enumerate(collection) if d.get("id") == document_id), None)

    if doc_index is None:
        raise HTTPException(
            status_code=404,
            detail=f"No se encontró el documento '{document_id}' en '{collection_name}'.",
        )

    # Actualizar documento
    doc = collection[doc_index]
    data["updatedAt"] = __import__("datetime").datetime.now(
        __import__("datetime").timezone.utc
    ).isoformat()
    doc.update(data)
    collection[doc_index] = doc

    # Guardar a disco
    _save_db()

    return doc
