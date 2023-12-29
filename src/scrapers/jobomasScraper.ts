import puppeteer, { Browser, Page } from 'puppeteer';
import axios from 'axios';

interface JobPosting {
    title: string;
    company: string;
    location: string;
    posting_date: string;
    description: string;
    job_url: string;
    source: string;  // Added source field
}

const API_ENDPOINT = "http://127.0.0.1:8080/add-job-postings/";

async function pushDataToAPI(jobPosting: JobPosting) {
    try {
        console.log("Sending data:", jobPosting);
        const response = await axios.post(API_ENDPOINT, [jobPosting]);  // Enclosed jobPosting in an array
        console.log("Data pushed successfully for:", jobPosting.source);
    } catch (error) {
        console.error("Error pushing data to API for:", jobPosting.source, error);
    }
}

async function scrapeJobPostingsFromJobomas(query: string, location: string): Promise<JobPosting[]> {
    const browser: Browser = await puppeteer.launch();
    const page: Page = await browser.newPage();

    const url: string = `https://us.jobomas.com/Jobs-of-${encodeURIComponent(query)}-in-${encodeURIComponent(location)}`;
    await page.goto(url);

    const jobPostings: JobPosting[] = await scrapeJobPostings(page);

    for (const jobPosting of jobPostings) {
        jobPosting.source = 'Jobomas';  // Setting the source field
        await pushDataToAPI(jobPosting);
    }

    await browser.close();

    return jobPostings;
}

async function scrapeJobPostings(page: Page): Promise<JobPosting[]> {
    const jobPostings: JobPosting[] = [];

    while (true) {
        const newJobPostings: JobPosting[] = await page.evaluate(() => {
            const postings: JobPosting[] = [];

            const jobCards: NodeListOf<Element> = document.querySelectorAll(".item-vacante");

            jobCards.forEach((card) => {
                const title: string = card.querySelector("h3.titulo-vacante")?.textContent?.trim() || "";
                const company: string = card.querySelector("ul.resumen-vacante span:nth-child(4)")?.textContent?.trim() || "";
                const location: string = card.querySelector("ul.resumen-vacante span:nth-child(6)")?.textContent?.trim() || "";
                const posting_date: string = card.querySelector("ul.resumen-vacante span:nth-child(8)")?.textContent?.trim() || "";
                const description: string = card.querySelector("p.extracto-vacante")?.textContent?.trim() || "";
                const job_url: string = (card.querySelector("a") as HTMLAnchorElement)?.href || "";

                postings.push({
                    title,
                    company,
                    location,
                    posting_date,
                    description,
                    job_url,
                    source: 'Jobomas',  // Placeholder for the source field, will be set later
                });
            });

            return postings;
        });

    for (const jobPosting of newJobPostings) {
        await pushDataToAPI(jobPosting);
        jobPostings.push(jobPosting);  // Storing the job posting in the array after sending it to the API
    }
        const nextPageButton = await page.$(".pagination li.active + li a");
        if (nextPageButton) {
            await Promise.all([page.waitForNavigation(), nextPageButton.click()]);
        } else {
            break;
        }
    }

    return jobPostings;
}

export default scrapeJobPostingsFromJobomas;
