#!/usr/bin/env node

const { program } = require('commander');

const markdownLint = require('.');
const { prepareExtensions } = require('./lib/utils');

const { version, description } = require('./package.json');

program
	.option('--fix', 'Automatically fix problems')
	.option('--ext <value>', 'Specify file extensions', prepareExtensions, ['md', 'MD'])
	.option('-t, --typograph', 'Enable typograph')
	.option('-r, --recursive', 'Get files from provided directory and the entire subtree')
	.option('-c, --config <file>', 'Use this configuration, overriding default options if present');

program
	.usage('[options] <dir> <file ...>')
	.version(version, '-v, --version')
	.description(description)
	.parse(process.argv);

if (program.args.length === 0) {
	program.help();
} else {
	const options = program.opts();

	markdownLint({
		paths: program.args,
		fix: options.fix,
		ext: options.ext,
		recursive: options.recursive,
		config: options.config,
		typograph: options.typograph,
	});
}
