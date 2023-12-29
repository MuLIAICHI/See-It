import puppeteer, { Browser, Page } from 'puppeteer';
import axios from 'axios';

interface JobPosting {
    title: string;
    company: string;
    location: string;
    job_type: string;
    description: string;
    posting_date: string;
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

async function scrapeJobPostingsFromTalent(query: string, location: string): Promise<JobPosting[]> {
    const browser: Browser = await puppeteer.launch();
    const page: Page = await browser.newPage();

    const baseUrl: string = "https://www.talent.com/jobs?context=";
    const url: string = `${baseUrl}&k=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`;
    
    await page.goto(url);

    const jobPostings: JobPosting[] = [];

    while (true) {
        await page.waitForSelector("section.card__job", { timeout: 60000 });

        const newJobPostings: JobPosting[] = await page.$$eval("section.card__job", (cards) => {
            return cards.map((card) => {
                const title: string = card.querySelector('.gojob')?.textContent?.trim() || "";
                const urlBase: string = " ";
                const job_url: string = (card.querySelector('.card__job > div') as HTMLElement)?.dataset?.link ? urlBase + (card.querySelector('.card__job > div') as HTMLElement)?.dataset?.link : "";
                const company: string = card.querySelector('.card__job-empname-label')?.textContent?.trim() || "";
                const location: string = card.querySelector('#nv-jobs span')?.textContent?.trim() || "";
                const description: string = card.querySelector('.card__job-snippet p')?.textContent?.trim() || "";
                const job_type: string = card.querySelector('.card__job-badge-wrap')?.textContent?.trim() || "";
                const posting_date: string = card.querySelector('.c-card__jobDatePosted')?.textContent?.trim() || "";

                return {
                    title,
                    company,
                    location,
                    job_type,
                    description,
                    posting_date,
                    job_url,
                    source: 'Talent'
                };
            });
        });

        for (const jobPosting of newJobPostings) {
            await pushDataToAPI(jobPosting);
            jobPostings.push(jobPosting);  // Storing the job posting in the array after sending it to the API
        }

        const nextPageButton = await page.$("div.pagination a:last-child");
        
        if (!nextPageButton) {
            break;
        }

        const nextPageStyle: string = await page.evaluate((a: HTMLAnchorElement) => a.style.pointerEvents, nextPageButton);
        
        if (nextPageStyle === 'none') {
            break;
        }
        const nextPageUrl: string = await page.evaluate((a: HTMLAnchorElement) => a.dataset.href ?? "", nextPageButton);
        await page.goto(encodeURI("https://www.talent.com" + nextPageUrl));
    }

    await browser.close();
    return jobPostings;
}

export default scrapeJobPostingsFromTalent;
