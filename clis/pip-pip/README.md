# pip-pip

Uses `cheerio` to parse the HTML of a page and get the text content within a selector.

## Usage

```bash
bunx pip-pip <url> <selector>


bun index.ts https://example.com
bun index.ts https://try.com .framer-text
bun index.ts https://roadmap.sh/full-stack div.relative div.container


# if downloaded example
pip-pip https://roadmap.sh/full-stack .roadmap-checklist
```
