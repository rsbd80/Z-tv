// ===== SEQUENTIAL PLAYLIST LOADER =====
const Loader = {
    async loadAll() {
        const total = CONFIG.SOURCES.length;
        
        // Load one by one (not Promise.all) - more secure, part by part
        for (let i = 0; i < CONFIG.SOURCES.length; i++) {
            const source = CONFIG.SOURCES[i];
            try {
                const res = await fetch(source.url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const text = await res.text();
                Parser.parse(text, source.priority, source.isLive || false, source.url, source.isFancode || false);
                UI.updateLoadProgress(((i + 1) / total) * 100);
            } catch (err) {
                console.error('Failed to load:', source.url, err);
                UI.updateLoadProgress(((i + 1) / total) * 100);
            }
        }
        
        STATE.allChannels.sort((a, b) => {
            if (a.priority !== b.priority) return a.priority - b.priority;
            return a.name.localeCompare(b.name);
        });
        
        STATE.filteredChannels = [...STATE.allChannels];
    }
};
