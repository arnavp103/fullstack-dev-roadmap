import { Command } from "commander";
import sharp from "sharp";
import fs from "fs";

const program = new Command();

program
	.name("transform-images")
	.version("0.0.1")
	.description("Turns all images in a directory into thumbnails");

program
	.argument("<input>", "Input directory to read images from")
	.option(
		"-o, --output <output>",
		"Output directory to write compressed images to"
	);

program.parse(process.argv);
main();

async function main() {
	const input = program.args[0];
	let { output } = program.opts();

	if (!output) {
		output = input;
	}

	if (!fs.existsSync(input)) {
		console.error(`Input directory ${input} does not exist`);
		process.exit(1);
	}

	const files = fs.readdirSync(input);

	if (!fs.existsSync(output)) {
		fs.mkdirSync(output);
	}

	files.forEach(file => {
		const inputPath = `${input}/${file}`;
		const outputPath = `${output}/compressed_${file}`;
		compressImage(inputPath, outputPath);
	});
}

function compressImage(input: string, output: string) {
	sharp(input)
		.resize(200)
		.toFile(output, (err, info) => {
			if (err) {
				console.error(err);
			} else {
				// console.log(info);
			}
		});
}
