import json
from app.database import SessionLocal, engine, Base
from app.models.travel_db import TravelDB
from app.models.day_db import DayDB

Base.metadata.create_all(bind=engine)

with open("data/travels.json", "r", encoding="utf-8") as f:
    travels = json.load(f)

db = SessionLocal()
for t in travels:
    travel = TravelDB(
        id=t["id"],
        town=t["town"],
        city=t["city"],
        year=t["year"],
        start_date=t["start_date"],
        end_date=t["end_date"],
        general_vote=t.get("general_vote"),
        votes=t.get("votes")
    )
    db.add(travel)
    db.commit()
    db.refresh(travel)

    for d in t.get("days", []):
        day = DayDB(
            id=d["id"],
            date=d["date"],
            title=d["title"],
            description=d["description"],
            photo=d.get("photo", []),
            lat=d.get("lat"),
            lng=d.get("lng"),
            travel_id=travel.id
        )
        db.add(day)
    db.commit()

db.close()
