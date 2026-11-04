// ===== MAIN APP =====
const App = {
    async init() {
        UI.initTheme();
        Channels.init();
        Player.init();
        Telegram.init();
        this.initLayout();
        this.bindGlobalEvents();
        
        // Load playlists sequentially (part by part)
        await Loader.loadAll();
        
        // Finalize UI
        UI.hideLoading();
        Renderer.updateGroups();
        Renderer.render();
        Renderer.updateCounts();
        
        // Auto play first channel
        setTimeout(() => Player.autoPlayFirst(), 500);
    },
    
    initLayout() {
        if (STATE.isMobile) {
            document.body.classList.add('mobile-layout');
        } else {
            document.body.classList.add('desktop-layout');
        }
        
        window.addEventListener('resize', Utils.debounce(() => {
            const newIsMobile = window.innerWidth < 768;
            if (newIsMobile !== STATE.isMobile) {
                STATE.isMobile = newIsMobile;
                document.body.classList.toggle('mobile-layout', STATE.isMobile);
                document.body.classList.toggle('desktop-layout', !STATE.isMobile);
            }
        }, 300));
    },
    
    bindGlobalEvents() {
        // Theme
        document.getElementById('themeToggle').addEventListener('click', () => UI.toggleTheme());
        
        // Shortcuts modal
        document.getElementById('shortcutsBtn').addEventListener('click', () => UI.toggleModal('shortcutsModal'));
        
        // Player controls
        document.getElementById('playPauseBtn').addEventListener('click', () => Player.togglePlay());
        document.getElementById('muteBtn').addEventListener('click', () => Player.toggleMute());
        document.getElementById('fullscreenBtn').addEventListener('click', () => Player.toggleFullscreen());
        document.getElementById('statsBtn').addEventListener('click', () => Player.toggleStats());
        document.getElementById('prevBtn').addEventListener('click', () => Player.playPrevious());
        document.getElementById('nextBtn').addEventListener('click', () => Player.playNext());
        
        // Volume
        const volumeSlider = document.getElementById('volumeSlider');
        volumeSlider.value = Storage.getVolume();
        Player.video.volume = volumeSlider.value / 100;
        volumeSlider.addEventListener('input', (e) => {
            Player.video.volume = e.target.value / 100;
            Storage.saveVolume(e.target.value);
            Player.updateVolumeIcon();
        });
        
        // Modal backdrop
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('visible');
            });
        });
        
        // Connection status
        window.addEventListener('online', () => UI.updateConnectionStatus(true));
        window.addEventListener('offline', () => UI.updateConnectionStatus(false));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Fullscreen change
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
    },
    
    handleFullscreenChange() {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
        document.body.style.overflow = isFullscreen ? 'hidden' : '';
    },
    
    handleKeyboard(e) {
        if (e.target.tagName === 'INPUT') return;
        
        switch (e.key.toLowerCase()) {
            case ' ': e.preventDefault(); Player.togglePlay(); break;
            case 'm': Player.toggleMute(); break;
            case 'f': Player.toggleFullscreen(); break;
            case 'arrowup': 
                e.preventDefault(); 
                Player.video.volume = Math.min(1, Player.video.volume + 0.1);
                document.getElementById('volumeSlider').value = Player.video.volume * 100;
                break;
            case 'arrowdown': 
                e.preventDefault(); 
                Player.video.volume = Math.max(0, Player.video.volume - 0.1);
                document.getElementById('volumeSlider').value = Player.video.volume * 100;
                break;
            case 'n': Player.playNext(); break;
            case 'b': Player.playPrevious(); break;
            case 's': Player.toggleStats(); break;
            case '/': e.preventDefault(); document.getElementById('searchInput').focus(); break;
            case 'escape':
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('visible'));
                if (STATE.isOverlayHidden) Player.toggleOverlay();
                break;
        }
    }
};

// Boot the app
document.addEventListener('DOMContentLoaded', () => App.init());
