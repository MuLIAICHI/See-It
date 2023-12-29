// import scrapeJobPostingsFromBebee from "./scrapers/bebeeScraper";
import scrapeJobPostingsFromJobomas from "./scrapers/jobomasScraper";
import scrapeJobPostingsFromJora from "./scrapers/joraScraper";
import scrapeJobPostingsFromtalent from "./scrapers/talentScraper";
// import scrapeJobPostingsFromInsightGlobal from "./scrapers/insightglobalScraper";
// import scrapeJobPostingsFromCB from "./scrapers/careerBuilderScraper";
// import scrapeJobPostingsFromJudge from "./scrapers/judgeScraper";

async function runScraper() {
  try {
    const query: string = "Software Engineer";
    const location: string = "California City, CA";
    const remote: number = 0;
    const radius: number = 100;

    const [jobPostingsFromJobomas, jobPostingsFromJora, jobPostingsFromTalent] =
      await Promise.all([
        // scrapeJobPostingsFromBebee(query, location, remote),
        scrapeJobPostingsFromJobomas(query, location),
        scrapeJobPostingsFromJora(query, location),
        scrapeJobPostingsFromtalent(query, location),
        // scrapeJobPostingsFromInsightGlobal(query, location, radius),
        // scrapeJobPostingsFromCB(query, location),
        // scrapeJobPostingsFromJudge(query, location),
      ]);

    // console.log("Job postings from Bebee:", jobPostingsFromBebee);
    console.log("Job postings from Jobomas:", jobPostingsFromJobomas);
    console.log("Job postings from Jora:", jobPostingsFromJora);
    console.log("Job postings from Talent:", jobPostingsFromTalent);
    // console.log("Job postings from InsightGlobal:", JobPostingsFromInsightGlobal);
    // console.log("Job postings from CareerBuilder:", JobPostingsFromCB);
    // console.log("Job postings from Judge:", JobPostingsFromJudge);
  } catch (error) {
    console.error("An error occurred while scraping:", error);
  }
}

runScraper();
