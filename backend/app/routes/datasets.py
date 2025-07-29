from fastapi import APIRouter, HTTPException, Query
from sqlmodel import Session, select
from typing import Optional, List
from ..models import Dataset
from ..db import engine

router = APIRouter()

@router.get("/datasets")
def list_datasets(
    name: Optional[str] = None,
    sort_by: Optional[str] = Query("created_at", enum=["created_at", "name"]),
    sort_order: Optional[str] = Query("desc", enum=["asc", "desc"]),
    limit: int = 10,
    offset: int = 0
) -> List[Dataset]:
    with Session(engine) as session:
        query = select(Dataset)
        if name:
            query = query.where(Dataset.name.contains(name))
        if sort_by == "created_at":
            order = Dataset.created_at.desc() if sort_order == "desc" else Dataset.created_at.asc()
        else:
            order = Dataset.name.desc() if sort_order == "desc" else Dataset.name.asc()
        query = query.order_by(order)
        query = query.offset(offset).limit(limit)
        return session.exec(query).all()

@router.get("/datasets/{dataset_id}")
def get_dataset(dataset_id: int):
    with Session(engine) as session:
        dataset = session.get(Dataset, dataset_id)
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset not found")
        return dataset

@router.post("/datasets", status_code=201)
def create_dataset(dataset: Dataset):
    with Session(engine) as session:
        session.add(dataset)
        session.commit()
        session.refresh(dataset)
        return dataset

@router.put("/datasets/{dataset_id}")
def update_dataset(dataset_id: int, updated: Dataset):
    with Session(engine) as session:
        dataset = session.get(Dataset, dataset_id)
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset not found")
        dataset.name = updated.name
        dataset.description = updated.description
        dataset.source_url = updated.source_url
        session.add(dataset)
        session.commit()
        session.refresh(dataset)
        return dataset

@router.delete("/datasets/{dataset_id}", status_code=204)
def delete_dataset(dataset_id: int):
    with Session(engine) as session:
        dataset = session.get(Dataset, dataset_id)
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset not found")
        session.delete(dataset)
        session.commit()
        return None 