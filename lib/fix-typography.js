import Typograf from 'typograf';

import { getObjectPath } from './utils.js';

function fixTypography(string, { appConfig, externalConfig } = {}) {
	const tpConfig = {
		...getObjectPath(appConfig, 'typograf'),
		...getObjectPath(externalConfig, 'typograf'),
	};
	const enableRules = tpConfig.enableRules || [];
	const disableRules = tpConfig.disableRules || [];
	const rulesSettings = tpConfig.rulesSettings || [];

	const tp = new Typograf({ locale: tpConfig.locale });

	for (const rule of enableRules) {
		tp.enableRule(rule);
	}

	for (const rule of disableRules) {
		tp.disableRule(rule);
	}

	for (const setting of rulesSettings) {
		tp.setSetting(...setting);
	}

	return tp.execute(string);
}

export default fixTypography;
