import { remark } from 'remark';
import { reporter } from 'vfile-reporter';

import { getObjectPath } from './utils.js';

async function importPlugin(name) {
	const { default: importedPlugin } = await import(name);
	return importedPlugin;
}

async function lint(fileContent, { appConfig, externalConfig, filePath } = {}) {
	const appConfigPlugins = getObjectPath(appConfig, 'remark.plugins');
	const externalConfigPlugins = getObjectPath(externalConfig, 'remark.plugins') || [];

	const plugins = [...appConfigPlugins, ...externalConfigPlugins];

	const importedPlugins = await Promise.all(
		plugins.map(async plugin => {
			if (typeof plugin === 'string') {
				return importPlugin(plugin);
			}

			if (Array.isArray(plugin) && typeof plugin[0] === 'string') {
				const [pluginName, pluginOptions] = plugin;

				return [
					await importPlugin(pluginName),
					pluginOptions,
				];
			}
		}),
	);

	remark()
		.use(importedPlugins)
		.process(fileContent, (error, result) => {
			if (error) {
				throw error;
			}

			if (result.messages.length > 0) {
				process.exitCode = 1;
				console.error(reporter(result, { defaultName: filePath }), '\n');
			}
		});
}

export default lint;
