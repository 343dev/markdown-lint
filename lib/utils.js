function getObjectPath(value, path) {
	return path.toString()
		.split('.')
		.reduce((branch, key) => (branch ? branch[key] : undefined), value);
}

function prepareExtensions(value, previous) {
	return [...previous, value];
}

module.exports = { getObjectPath, prepareExtensions };
