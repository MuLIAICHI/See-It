# Fetch Jobs

Fetch Jobs is a web scraping project that uses Puppeteer to scrape job listings from various websites and save them in a structured format.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) >= 14
- [npm](https://www.npmjs.com/)

### Installing

1. Clone the repository

2. Install the dependencies:

    ```sh
    npm install
    ```

### Directory Structure

ba-fetch-jobs/
├── src/
│ ├── scrapers/
│ │ └── randstadScraper.js
│ └── index.js
├── data/
├── logs/
├── node_modules/
├── .gitignore
├── package.json
└── README.md



- `src/`: Contains the source code of the project.
- `src/scrapers/`: Contains individual scraper scripts (e.g., `randstadScraper.js` for scraping Randstad's website).
- `data/`: Contains the scraped data in structured formats like JSON, CSV.
- `logs/`: Contains log files for error logging and activity logging.
- `.gitignore`: A file containing patterns that describe the files that should not be tracked by Git.
- `package.json`: Keeps track of all metadata relevant to the project, including dependencies.
- `README.md`: A markdown file containing information and documentation about your project.

### Running the Project

1. Run the project using the following command:

    ```sh
    npm start
    ```

2. The scraped data will be saved in the `data` directory, and logs will be saved in the `logs` directory.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING](CONTRIBUTING.md) file for details on how to contribute to this project.

