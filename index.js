const fs = require('node:fs');
const path = require('node:path');

const fixFile = require('./lib/fix');
const lintFile = require('./lib/lint');
const { getFilesByPath } = require('./lib/utils');

const appConfig = require('./.markdownlintrc');

function markdownLint({ paths = [], fix, ext, recursive, config, typograph }) {
	const directories = paths.filter(p => fs.existsSync(p) && fs.statSync(p).isDirectory());
	const extensions = ext.join('|');
	const extensionsRegExp = new RegExp(`.+\\.(${extensions})$`, 'i');

	const files = [
		...paths.filter(p => extensionsRegExp.test(p) && fs.existsSync(p) && fs.statSync(p).isFile()),
		...directories.flatMap(d => getFilesByPath(d, extensions, recursive)),
	];

	const externalConfig = config && require(path.resolve(config));

	for (const filePath of files) {
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
