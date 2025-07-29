from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from ..models import Dashboard
from ..db import engine

router = APIRouter()

@router.get("/dashboards")
def list_dashboards():
    with Session(engine) as session:
        return session.exec(select(Dashboard)).all()

@router.get("/dashboards/{dashboard_id}")
def get_dashboard(dashboard_id: int):
    with Session(engine) as session:
        dashboard = session.get(Dashboard, dashboard_id)
        if not dashboard:
            raise HTTPException(status_code=404, detail="Dashboard not found")
        return dashboard

@router.post("/dashboards", status_code=201)
def create_dashboard(dashboard: Dashboard):
    with Session(engine) as session:
        session.add(dashboard)
        session.commit()
        session.refresh(dashboard)
        return dashboard

@router.put("/dashboards/{dashboard_id}")
def update_dashboard(dashboard_id: int, updated: Dashboard):
    with Session(engine) as session:
        dashboard = session.get(Dashboard, dashboard_id)
        if not dashboard:
            raise HTTPException(status_code=404, detail="Dashboard not found")
        dashboard.title = updated.title
        dashboard.description = updated.description
        session.add(dashboard)
        session.commit()
        session.refresh(dashboard)
        return dashboard

@router.delete("/dashboards/{dashboard_id}", status_code=204)
def delete_dashboard(dashboard_id: int):
    with Session(engine) as session:
        dashboard = session.get(Dashboard, dashboard_id)
        if not dashboard:
            raise HTTPException(status_code=404, detail="Dashboard not found")
        session.delete(dashboard)
        session.commit()
        return None 