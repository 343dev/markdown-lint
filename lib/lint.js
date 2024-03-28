import remark from 'remark';
import reporter from 'vfile-reporter';

import { getObjectPath } from './utils.js';

function lint(fileContent, { appConfig, externalConfig, filePath } = {}) {
	remark()
		.use(getObjectPath(appConfig, 'remark.plugins'))
		.use(getObjectPath(externalConfig, 'remark.plugins'))
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
