from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String, MetaData, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from typing import List, Optional

# SQLite database file
sqlite_file_name = 'sqlite_db.db'
DATABASE_URL = f"sqlite:///{sqlite_file_name}"

database = create_engine(DATABASE_URL)
metadata = MetaData()

Base = declarative_base()

class JobPostingInDB(Base):
    __tablename__ = "job_postings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True)
    company = Column(String, nullable=True)
    location = Column(String, nullable=True)
    jobType = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    postedDate = Column(String, nullable=True)
    jobUrl = Column(String, nullable=True)
    source = Column(String, nullable=True)
    ratePay = Column(String, nullable=True)

Base.metadata.create_all(bind=database)

SessionLocal = sessionmaker(bind=database)

app = FastAPI()

class JobPosting(BaseModel):
    title: str
    company: Optional[str] = None
    location: str
    posting_date: Optional[str] = None
    description: str
    job_url: str
    job_type: Optional[str] = None
    rate_pay: Optional[str] = None
    source: str

@app.post("/add-job-postings/", response_model=List[JobPosting])
def add_job_postings(job_postings: List[JobPosting]):
    try:
        job_postings_dicts = []
        for job_posting in job_postings:
            job_postings_dicts.append({
                "title": job_posting.title,
                "company": job_posting.company,
                "location": job_posting.location,
                "jobType": job_posting.job_type,
                "description": job_posting.description,
                "postedDate": job_posting.posting_date,
                "jobUrl": job_posting.job_url,
                "source": job_posting.source,
                "ratePay": job_posting.rate_pay
            })
        
        with SessionLocal() as session:
            session.execute(JobPostingInDB.__table__.insert().values(job_postings_dicts))
            session.commit()

        return job_postings
    except Exception as e:
        print(f"Error while inserting job postings: {e}")
        raise e

@app.get("/get-job-postings/", response_model=List[JobPosting])
def get_job_postings():
    with SessionLocal() as session:
        result = session.execute(JobPostingInDB.__table__.select()).fetchall()
        return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)
