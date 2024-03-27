const { fdir: Fdir } = require('fdir');

const fs = require('node:fs');
const path = require('node:path');

const fixFile = require('./lib/fix');
const lintFile = require('./lib/lint');

const appConfig = require('./.markdownlintrc');

function isFileExtnameAllowed(filePath, extensions) {
	const extname = path.extname(filePath)
		.toLocaleLowerCase()
		.slice(1);

	return extname && extensions.includes(extname);
}

function markdownLint({ paths = [], fix, ext, recursive, config, typograph }) {
	const extensions = ext.join('|');

	const directoryFilesCrawler = new Fdir()
		.filter(filePath => isFileExtnameAllowed(filePath, extensions))
		.withMaxDepth(recursive ? undefined : 0)
		.withBasePath();

	const filePaths = [...new Set(
		paths.reduce((accumulator, filePath) => {
			if (fs.existsSync(filePath)) {
				const isDirectory = fs.statSync(filePath).isDirectory();

				// search for files recursively inside the directory
				if (isDirectory) {
					accumulator = [
						...accumulator,
						...directoryFilesCrawler.crawl(filePath).sync(),
					];
				}

				// filter files by extension
				if (!isDirectory && isFileExtnameAllowed(filePath, extensions)) {
					accumulator.push(filePath);
				}
			}

			return accumulator;
		}, []),
	)];

	const externalConfig = config && require(path.resolve(config));

	for (const filePath of filePaths) {
		let fileContent = fs.readFileSync(filePath, 'utf8');

		if (fix) {
			fileContent = fixFile(fileContent, {
				appConfig,
				externalConfig,
				typograph,
			});

			fs.writeFileSync(filePath, fileContent);
		}

		lintFile(fileContent, {
			appConfig,
			externalConfig,
			filePath,
		});
	}
}

module.exports = markdownLint;
