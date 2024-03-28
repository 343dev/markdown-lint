import prettier from 'prettier';
import remark from 'remark';
import textr from 'remark-textr';

import fixEyo from './fix-eyo.js';
import fixTypography from './fix-typography.js';
import { getObjectPath } from './utils.js';

async function fix(string, { appConfig, externalConfig, typograph } = {}) {
	// https://prettier.io/docs/en/options.html
	let prettyString = await prettier.format(
		string,
		{
			...getObjectPath(appConfig, 'prettier'),
			...getObjectPath(externalConfig, 'prettier'),
		},
	);

	// https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#options
	const remarkStringify = {
		settings: {
			...getObjectPath(appConfig, 'remark.stringifySettings'),
			...getObjectPath(externalConfig, 'remark.stringifySettings'),

		},
	};

	const processor = remark().use(remarkStringify);

	if (typograph) {
		prettyString = fixEyo(prettyString);

		processor.use(textr, {
			plugins: [
				input => fixTypography(input, { appConfig, externalConfig }),
			],
		});
	}

	return processor.processSync(prettyString).toString();
}

export default fix;
