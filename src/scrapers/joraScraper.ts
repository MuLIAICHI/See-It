import puppeteer, { Browser, Page } from 'puppeteer';
import axios from 'axios';

interface JobPosting {
    title: string;
    company: string;
    location: string;
    description: string;
    job_url: string;
    source: string;
}

const API_ENDPOINT = "http://127.0.0.1:8080/add-job-postings/";

async function pushDataToAPI(jobPosting: JobPosting) {
    try {
        console.log("Sending data:", jobPosting);
        const response = await axios.post(API_ENDPOINT, [jobPosting]);
        console.log("Data pushed successfully:", jobPosting.source);
    } catch (error) {
        console.error("Error pushing data to API:", jobPosting.source, error);
    }
}

async function scrapeJobPostingsFromJora(query: string, location: string): Promise<JobPosting[]> {
    const browser: Browser = await puppeteer.launch();
    const page: Page = await browser.newPage();

    const baseUrl: string = "https://us.jora.com/j?sp=homepage&trigger_source=homepage";
    const url: string = `${baseUrl}&q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`;
    await page.goto(url);

    const jobPostings: JobPosting[] = [];

    while (true) {
        await page.waitForSelector('.job-card', { timeout: 60000 });

        const newJobPostings: JobPosting[] = await page.$$eval('.job-card', (cards) => {
            return cards.map((card) => {
                const title: string = card.querySelector('.job-title a')?.textContent?.trim() || "";
                const job_url: string = (card.querySelector('.job-title a') as HTMLAnchorElement)?.href || "";
                const company: string = card.querySelector('.job-company')?.textContent?.trim() || "";
                const location: string = card.querySelector('.job-location')?.textContent?.trim() || "";
                const description: string = card.querySelector('.job-abstract')?.textContent?.trim() || "";

                return {
                    title,
                    company,
                    location,
                    description,
                    job_url,
                    source: 'Jora'
                };
            });
        });

        for (const jobPosting of newJobPostings) {
            await pushDataToAPI(jobPosting);
            jobPostings.push(jobPosting);  // Storing the job posting in the array after sending it to the API
        }

        const nextPageButton = await page.$('.next-page-button');
        if (!nextPageButton) {
            break;
        }

        const nextPageUrl: string = await page.evaluate((button: Element) => (button as HTMLAnchorElement).href, nextPageButton);
        await page.goto(nextPageUrl);
    }

    await browser.close();

    return jobPostings;
}

export default scrapeJobPostingsFromJora;
