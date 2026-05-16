/**
 * Theme store for CryptoSharia Academy
 * Supports 3 modes: 'light', 'dark', 'system'
 */

type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'cryptosharia-theme';

let mode = $state<ThemeMode>('system');
let resolved = $state<'light' | 'dark'>('light');

function getSystemPreference(): 'light' | 'dark' {
	if (typeof window === 'undefined') return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(m: ThemeMode) {
	if (typeof document === 'undefined') return;
	const effectiveTheme = m === 'system' ? getSystemPreference() : m;
	resolved = effectiveTheme;

	if (effectiveTheme === 'dark') {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
}

export function initTheme() {
	if (typeof window === 'undefined') return;

	const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
	if (saved && ['light', 'dark', 'system'].includes(saved)) {
		mode = saved;
	}
	applyTheme(mode);

	// Listen for OS preference changes (only matters when mode is 'system')
	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	mediaQuery.addEventListener('change', () => {
		if (mode === 'system') {
			applyTheme('system');
		}
	});
}

export function setTheme(newMode: ThemeMode) {
	mode = newMode;
	localStorage.setItem(STORAGE_KEY, newMode);
	applyTheme(newMode);
}

export function getThemeMode(): ThemeMode {
	return mode;
}

export function getResolvedTheme(): 'light' | 'dark' {
	return resolved;
}

export const theme = {
	get mode() { return mode; },
	get resolved() { return resolved; },
	set: setTheme,
	init: initTheme
};
