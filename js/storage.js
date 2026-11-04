// ===== STORAGE MANAGER =====
const Storage = {
    getFavorites() {
        return new Set(JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.favorites) || '[]'));
    },
    
    saveFavorites(favorites) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.favorites, JSON.stringify([...favorites]));
    },
    
    getHistory() {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.history) || '[]');
    },
    
    saveHistory(history) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.history, JSON.stringify(history));
    },
    
    getVolume() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.volume) || 80;
    },
    
    saveVolume(volume) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.volume, volume);
    },
    
    getTheme() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.theme) || 'dark';
    },
    
    saveTheme(theme) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.theme, theme);
    }
};
