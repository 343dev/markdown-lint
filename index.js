import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { fdir as Fdir } from 'fdir';

import fixFile from './lib/fix.js';
import lintFile from './lib/lint.js';

function isFileExtnameAllowed(filePath, extensions) {
	const extname = path.extname(filePath)
		.toLocaleLowerCase()
		.slice(1);

	return extname && extensions.includes(extname);
}

async function markdownLint({ paths = [], fix, ext, recursive, config, typograph }) {
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

	const defaultConfigFilePath = path.join(path.dirname(import.meta.url), '.markdownlintrc.cjs');
	const defaultConfigData = await import(defaultConfigFilePath);
	const appConfig = defaultConfigData.default;

	let externalConfig;

	if (config && fs.existsSync(config)) {
		const externalConfigFilepath = pathToFileURL(path.resolve(config));
		const externalConfigData = await import(externalConfigFilepath);

		externalConfig = externalConfigData.default;
	}

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

export default markdownLint;
