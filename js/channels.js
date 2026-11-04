// ===== CHANNELS MANAGER =====
const Channels = {
    init() {
        STATE.favorites = Storage.getFavorites();
        STATE.history = Storage.getHistory();
        this.bindEvents();
    },
    
    bindEvents() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchView(btn.dataset.view));
        });
        
        document.getElementById('searchInput').addEventListener('input', Utils.debounce(() => this.applyFilters(), 300));
        document.getElementById('groupFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('sortFilter').addEventListener('change', () => this.applyFilters());
    },
    
    switchTab(tab) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        switch (tab) {
            case 'all': STATE.filteredChannels = [...STATE.allChannels]; break;
            case 'favorites': STATE.filteredChannels = STATE.allChannels.filter(c => STATE.favorites.has(c.url)); break;
            case 'history': STATE.filteredChannels = STATE.history.filter(h => STATE.allChannels.some(c => c.url === h.url)); break;
        }
        this.applyFilters();
    },
    
    switchView(view) {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        document.getElementById('channelsGrid').className = `channels-grid ${view}-view`;
    },
    
    applyFilters() {
        const search = document.getElementById('searchInput').value.toLowerCase();
        const group = document.getElementById('groupFilter').value;
        const sort = document.getElementById('sortFilter').value;
        const currentTab = document.querySelector('.tab.active').dataset.tab;
        
        let baseList;
        switch (currentTab) {
            case 'favorites': baseList = STATE.allChannels.filter(c => STATE.favorites.has(c.url)); break;
            case 'history': baseList = STATE.history.filter(h => STATE.allChannels.some(c => c.url === h.url)); break;
            default: baseList = [...STATE.allChannels];
        }
        
        let results = baseList.filter(ch => {
            const matchesSearch = ch.name.toLowerCase().includes(search);
            const matchesGroup = group === 'all' || ch.group === group;
            return matchesSearch && matchesGroup;
        });
        
        results.sort((a, b) => {
            switch (sort) {
                case 'name': return a.name.localeCompare(b.name);
                default: return a.priority - b.priority || a.name.localeCompare(b.name);
            }
        });
        
        STATE.filteredChannels = results;
        Renderer.render();
    },
    
    toggleFavorite(url, btn) {
        if (STATE.favorites.has(url)) {
            STATE.favorites.delete(url);
            btn.classList.remove('active');
            UI.showToast('Removed from favorites', 'warning');
        } else {
            STATE.favorites.add(url);
            btn.classList.add('active');
            UI.showToast('Added to favorites', 'success');
        }
        Storage.saveFavorites(STATE.favorites);
        Renderer.updateCounts();
    },
    
    addToHistory(channel) {
        STATE.history = STATE.history.filter(h => h.url !== channel.url);
        STATE.history.unshift({ ...channel, watchedAt: Date.now() });
        STATE.history = STATE.history.slice(0, 20);
        Storage.saveHistory(STATE.history);
    }
};
