const usage = `github-most-starred [--start-date <YYYY-MM-DD>] [--end-date <YYYY-MM-DD>]

  Fetches the most starred GitHub repositories created within the specified date range. The date range is inclusive. Limits to the top 10 results.

  If no end date is provided, the current date is used. If no start date is provided, the date is set to one year before the end date.

  Examples:
    github-most-starred
	github-most-starred --start-date 2021-01-01 --end-date 2021-12-31
	github-most-starred --end-date 2022-01-01 --limit 5
`;

async function main(args: string[]) {
	// today's date is the default for the end
	let end_date = new Date();
	// today's date - 1 month is the default for start
	let start_date = new Date();
	start_date.setMonth(end_date.getMonth() - 1);

	let limit = 10;

	// read the arguments
	for (let i = 0; i < args.length; i++) {
		switch (args[i]) {
			case "--start-date":
				start_date = new Date(args[i + 1]);
				if (start_date.toString() === "Invalid Date") {
					throw new Error(
						"Invalid start date - must be a valid date format. Consider YYYY-MM-DD."
					);
				}
				i++;
				break;
			case "--end-date":
				end_date = new Date(args[i + 1]);
				if (end_date.toString() === "Invalid Date") {
					throw new Error(
						"Invalid end date - must be a valid date format. Consider YYYY-MM-DD."
					);
				}
				i++;
				break;
			case "--limit":
				limit = parseInt(args[i + 1]);
				if (isNaN(limit)) {
					throw new Error("Invalid limit - must be a number");
				}
				i++;
				break;
			default:
				throw new Error(`Invalid argument: ${args[i]}`);
		}
	}

	const response = await fetchMostStarredRepos(start_date, end_date, limit);
	console.log(response);
}

interface Repos {
	items: {
		// any key to string
		name: string;
		stargazers_count: number;
		html_url: string;
		description: string;
		created_at: string;
		owner: {
			login: string;
		};
	}[];
}

async function fetchMostStarredRepos(
	start_date: Date,
	end_date: Date,
	limit: number = 10
) {
	const startDateStr = start_date.toISOString().split("T")[0];
	const endDateStr = end_date.toISOString().split("T")[0];

	const response = await fetch(
		"https://api.github.com/search/repositories?q=created:" +
			startDateStr +
			".." +
			endDateStr +
			"&sort=stars&order=desc"
	);

	const res = (await response.json()) as Repos;
	const items = res.items.slice(0, limit);

	return items.map(item => {
		return {
			name: item.name,
			stars: item.stargazers_count,
			owner: item.owner.login,
			url: item.html_url,
			description: item.description,
			created_at: item.created_at
		};
	});
}

// get rid of `bun index.ts` and `node index.ts`
const args = process.argv.slice(2);

try {
	main(args);
} catch (error: any) {
	console.error(error.message);
	console.error(usage);
}
