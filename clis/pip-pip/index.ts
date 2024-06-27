import * as cheerio from "cheerio";

const usage = `pip-pip <url> [selector]
  Extracts the text content of the selected elements from the HTML file at the URL.
  If no CSS selector is provided, the text content of the entire HTML file is returned.

  Examples:
    pip-pip https://example.com
	pip-pip https://github.com div.flex
`;

async function main(args: string[]) {
	if (args.length < 1) {
		console.error(usage);
		process.exit(1);
	}

	const url = args[0];
	let selector = "body";

	if (args.length > 1) {
		selector = args.slice(1).join(" ");
	}

	const response = await fetch(url);
	const html = await response.text();
	const text = extractText(html, selector);

	console.log(text);
}

function extractText(html: string, selector: string) {
	const $ = cheerio.load(html);
	const elements = $(selector);

	const text = elements
		.map((_, element) => $(element).text())
		.get()
		.join("\n");

	return text;
}

// run the main function with the command-line arguments
// skip the first arg (script-runner) and the second arg (script name)
main(process.argv.slice(2));
