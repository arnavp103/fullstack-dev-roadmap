# github-most-starred

Finds the most starred repositories on GitHub between a date range.

> Note the GitHub API gives inconsistent and often times wrong responses when the date range exceeds six months. You can also get different results seemingly depending on which server you hit.

## Usage

The dates must be in the format `YYYY-MM-DD`. If the end date is not provided, it will default to the current date.
If the start date is not provided, it will default to the end date minus 1 month.

```bash
bun index.ts
bun index.ts --start-date 2020-11-01 --end-date 2020-12-31

# if you installed the package globally
github-most-starred --start-date 2020-11-01 --end-date 2020-12-31
```