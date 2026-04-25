from uuid import uuid4
from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException

from .firebase import get_firestore_client


def _convert_timestamps(data: dict[str, Any]) -> dict[str, Any]:
    result = {}
    for k, v in data.items():
        if isinstance(v, datetime):
            result[k] = v.isoformat()
        elif isinstance(v, dict):
            result[k] = _convert_timestamps(v)
        elif isinstance(v, list):
            result[k] = [
                _convert_timestamps(item) if isinstance(item, dict)
                else item.isoformat() if isinstance(item, datetime)
                else item
                for item in v
            ]
        else:
            result[k] = v
    return result


def _doc_to_dict(doc) -> dict[str, Any]:
    return {"id": doc.id, **_convert_timestamps(doc.to_dict())}


def get_document(collection_name: str, document_id: str) -> dict[str, Any]:
    db = get_firestore_client()
    doc = db.collection(collection_name).document(document_id).get()
    if not doc.exists:
        raise HTTPException(
            status_code=404,
            detail=f"No se encontró el documento '{document_id}' en '{collection_name}'.",
        )
    return _doc_to_dict(doc)


def get_collection(
    collection_name: str,
    *,
    filters: list[tuple[str, str, Any]] | None = None,
    order_by: str | None = None,
) -> list[dict[str, Any]]:
    db = get_firestore_client()
    query = db.collection(collection_name)
    if filters:
        for field, op, value in filters:
            query = query.where(field, op, value)
    if order_by:
        query = query.order_by(order_by)
    return [_doc_to_dict(doc) for doc in query.stream()]


def update_document(
    collection_name: str, document_id: str, data: dict[str, Any]
) -> dict[str, Any]:
    db = get_firestore_client()
    ref = db.collection(collection_name).document(document_id)
    if not ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail=f"No se encontró el documento '{document_id}' en '{collection_name}'.",
        )
    data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    ref.update(data)
    return _doc_to_dict(ref.get())


def create_document(collection_name: str, data: dict[str, Any]) -> dict[str, Any]:
    db = get_firestore_client()
    doc_id = data.pop("id", str(uuid4()))
    data.setdefault("createdAt", datetime.now(timezone.utc).isoformat())
    db.collection(collection_name).document(doc_id).set(data)
    return {"id": doc_id, **data}
