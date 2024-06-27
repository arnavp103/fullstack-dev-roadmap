# compress-image-dir

A simple CLI tool to compress all images in a directory using the `sharp` library. This CLI was built with `commander`.

## Usage

```bash
bun index.ts <directory> [outputDir]

bun index.ts ./images --output ./compressed-images
bun index.ts ./images -o ./compressed-images
```