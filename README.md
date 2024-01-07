# Job Postings Aggregation Project

## Overview

This project involves scraping job postings from various sources, storing them in a SQLite database, and exposing a FastAPI service for adding and retrieving job postings.

## Project Structure

The project consists of the following components:

1. **Scraping Scripts:**
   - `scrapers/jobomasScraper.ts`: Puppeteer script for scraping job postings from Jobomas.
   - `scrapers/joraScraper.ts`: Puppeteer script for scraping job postings from Jora.
   - `scrapers/talentScraper.ts`: Puppeteer script for scraping job postings from Talent.

2. **Data Models:**
   - `main.py`: Defines the SQLAlchemy model for the job postings database schema (`JobPostingInDB`).
   - `main.py`: Defines the Pydantic model for the FastAPI API schema (`JobPosting`).

3. **Database Initialization:**
   - `main.py`: Initializes the SQLite database (`sqlite_db.db`) and creates the necessary table (`job_postings`).

4. **FastAPI Service:**
   - `main.py`: Implements the FastAPI service with two endpoints:
     - `POST /add-job-postings/`: Adds job postings to the database.
     - `GET /get-job-postings/`: Retrieves job postings from the database.

## How to Run the Project

1. **Install Dependencies:**
   ```bash
   pip install fastapi sqlalchemy uvicorn
2. **Run the FastAPI Service:**
      uvicorn main:app --reload
3. **Execute Scrapers:**
       Ensure Node.js and Puppeteer are installed.
       Run the individual scraping scripts (scrapers/jobomasScraper.ts, scrapers/joraScraper.ts, scrapers/talentScraper.ts) to populate the job postings database.
4. **Add Job Postings:**
       Use the POST /add-job-postings/ endpoint to add job postings to the database.
5. **Retrieve Job Postings:**
      Use the GET /get-job-postings/ endpoint to retrieve job postings from the database.