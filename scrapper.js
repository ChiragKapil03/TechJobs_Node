const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');

const URL = 'https://www.timesjobs.com/candidate/job-search.html?searchType=Home_Search&from=submit&asKey=OFF&txtKeywords=&cboPresFuncArea=35';

async function scrapeJobs() {
    try {
        const { data } = await axios.get(URL);
        const $ = cheerio.load(data);

        const jobs = [];

        $('.clearfix.job-bx.wht-shd-bx').each((i, el) => {
            const jobTitle = $(el).find('h2 a').text().trim() || 'N/A';
            const companyName = $(el).find('.joblist-comp-name').text().trim() || 'N/A';
            const location = $(el).find('.top-jd-dtl span').first().text().trim() || 'N/A';
            const postedDate = $(el).find('.sim-posted').text().trim() || 'N/A';
            const jobDescription = $(el).find('.list-job-dtl.clearfix li').text().trim() || 'N/A';

            jobs.push({
                JobTitle: jobTitle,
                CompanyName: companyName,
                Location: location,
                JobType: 'N/A',
                PostedDate: postedDate,
                JobDescription: jobDescription,
            });
        });

        console.log(jobs);

        const worksheet = xlsx.utils.json_to_sheet(jobs);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Jobs');
        xlsx.writeFile(workbook, 'tech_job_postings.xlsx');

        console.log('Data saved to tech_job_postings.xlsx');
    } catch (error) {
        console.error('Error scraping data:', error.message);
    }
}

scrapeJobs();
