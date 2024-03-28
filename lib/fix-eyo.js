import Eyo from 'eyo-kernel';

function fixEyo(string) {
	const safeEyo = new Eyo();
	safeEyo.dictionary.loadSafeSync();

	return safeEyo.restore(string);
}

export default fixEyo;
