from fastapi import APIRouter, HTTPException, Query
from sqlmodel import Session, select
from typing import Optional, List
from ..models import EconomicReport
from ..db import engine

router = APIRouter()

@router.get("/reports")
def list_reports(
    title: Optional[str] = None,
    date: Optional[str] = None,
    sort_by: Optional[str] = Query("date", enum=["date", "title"]),
    sort_order: Optional[str] = Query("desc", enum=["asc", "desc"]),
    limit: int = 10,
    offset: int = 0
) -> List[EconomicReport]:
    with Session(engine) as session:
        query = select(EconomicReport)
        if title:
            query = query.where(EconomicReport.title.contains(title))
        if date:
            query = query.where(EconomicReport.date == date)
        if sort_by == "date":
            order = EconomicReport.date.desc() if sort_order == "desc" else EconomicReport.date.asc()
        else:
            order = EconomicReport.title.desc() if sort_order == "desc" else EconomicReport.title.asc()
        query = query.order_by(order)
        query = query.offset(offset).limit(limit)
        return session.exec(query).all()

@router.get("/reports/{report_id}")
def get_report(report_id: int):
    with Session(engine) as session:
        report = session.get(EconomicReport, report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        return report

@router.post("/reports", status_code=201)
def create_report(report: EconomicReport):
    with Session(engine) as session:
        session.add(report)
        session.commit()
        session.refresh(report)
        return report

@router.put("/reports/{report_id}")
def update_report(report_id: int, updated: EconomicReport):
    with Session(engine) as session:
        report = session.get(EconomicReport, report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        report.title = updated.title
        report.content = updated.content
        report.date = updated.date
        session.add(report)
        session.commit()
        session.refresh(report)
        return report

@router.delete("/reports/{report_id}", status_code=204)
def delete_report(report_id: int):
    with Session(engine) as session:
        report = session.get(EconomicReport, report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        session.delete(report)
        session.commit()
        return None 