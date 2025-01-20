import './consts.js';
import './typeCalculator.js';
(function() {
    "use strict";
    const api = chrome || browser;
    const _currentVersion = api.runtime.getManifest().version;

	const getStorage = async function(key) {
		const result = await api.storage.local.get(key);
		return result[key];
	}

	const saveStorage = async function(key, value) {
		let storage = await getStorage(key) ?? {};
		storage[key] = value;
		const result = await api.storage.local.set({ [key]: storage });
        return result;
	}

	api.runtime.onInstalled.addListener(async (details) => {
        if (details.reason === "install") saveStorage("roobyVersion", { currentVersion: _currentVersion, state: details.reason });
	});
})();