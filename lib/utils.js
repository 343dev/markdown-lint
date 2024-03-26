const glob = require('glob');

function getFilesByPath(directory, extension, recursive) {
	return glob.sync(recursive ? `${directory}/**/*.+(${extension})` : `${directory}/*.+(${extension})`, {
		ignore: ['./node_modules/**', '**/node_modules/**'],
	});
}

function getObjectPath(value, path) {
	return path.toString()
		.split('.')
		.reduce((branch, key) => (branch ? branch[key] : undefined), value);
}

function prepareExtensions(value, previous) {
	return [...previous, value];
}

module.exports = { getFilesByPath, getObjectPath, prepareExtensions };
