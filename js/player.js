// ===== PLAYER =====
const Player = {
    video: null,
    wrapper: null,
    container: null,
    
    init() {
        this.video = document.getElementById('videoPlayer');
        this.wrapper = document.getElementById('playerWrapper');
        this.container = document.getElementById('videoContainer');
        this.bindEvents();
    },
    
    bindEvents() {
        this.video.addEventListener('play', () => {
            document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
            STATE.playStartTime = Date.now();
        });
        
        this.video.addEventListener('pause', () => {
            document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-play"></i>';
        });
        
        this.video.addEventListener('timeupdate', () => this.updateTime());
        this.video.addEventListener('waiting', () => this.showState('loading'));
        this.video.addEventListener('playing', () => this.hideStates());
        
        this.wrapper.addEventListener('mousemove', () => this.showControls());
        this.wrapper.addEventListener('mouseleave', () => this.hideControls());
        this.wrapper.addEventListener('touchstart', (e) => this.handleTouch(e));
        this.video.addEventListener('click', () => this.toggleOverlay());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this.toggleOverlay();
        });
    },
    
    play(channel, index) {
        if (STATE.currentChannel && STATE.currentChannel.url === channel.url) return;
        
        STATE.currentChannel = channel;
        STATE.currentIndex = index;
        
        Renderer.updateActiveCard();
        
        document.getElementById('nowPlayingLogo').src = channel.logo;
        document.getElementById('nowPlayingName').textContent = channel.name;
        
        let metaText = '';
        if (channel.isFancode && channel.teams && channel.teams.length > 0) {
            metaText = channel.teams.map(t => t.name).join(' vs ');
        }
        document.getElementById('nowPlayingMeta').textContent = metaText;
        
        this.showState('loading');
        this.loadStream(channel.url);
        Channels.addToHistory(channel);
        
        STATE.isOverlayHidden = false;
        this.wrapper.classList.remove('hide-overlay');
        
        UI.showToast(`Playing: ${channel.name}`, 'success');
    },
    
    loadStream(url) {
        if (STATE.hls) {
            STATE.hls.destroy();
            STATE.hls = null;
        }
        
        if (url.includes('.m3u8') || url.includes('m3u8')) {
            if (Hls.isSupported()) {
                STATE.hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                
                STATE.hls.loadSource(url);
                STATE.hls.attachMedia(this.video);
                
                STATE.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    this.video.play().catch(() => {});
                    this.hideStates();
                    this.updateQuality();
                });
                
                STATE.hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) this.handleError(data.details);
                });
                
            } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
                this.video.src = url;
                this.video.play().catch(() => {});
            }
        } else {
            this.video.src = url;
            this.video.play().catch(() => {});
        }
    },
    
    loadWithFallback(url, index) {
        if (STATE.hls) { STATE.hls.destroy(); STATE.hls = null; }
        
        let hasStarted = false;
        const errorTimeout = setTimeout(() => {
            if (!hasStarted) this.tryAutoPlay(index + 1);
        }, 8000);
        
        if (url.includes('.m3u8') || url.includes('m3u8')) {
            if (Hls.isSupported()) {
                STATE.hls = new Hls({ enableWorker: true, lowLatencyMode: true, backBufferLength: 90 });
                STATE.hls.loadSource(url);
                STATE.hls.attachMedia(this.video);
                
                STATE.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    hasStarted = true;
                    clearTimeout(errorTimeout);
                    this.video.play().catch(() => {});
                    this.hideStates();
                    this.updateQuality();
                    Renderer.updateActiveCard();
                    UI.showToast(`Playing: ${STATE.currentChannel.name}`, 'success');
                });
                
                STATE.hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        clearTimeout(errorTimeout);
                        this.tryAutoPlay(index + 1);
                    }
                });
            } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
                this.video.src = url;
                this.video.addEventListener('loadeddata', () => {
                    hasStarted = true;
                    clearTimeout(errorTimeout);
                    this.video.play();
                    this.hideStates();
                    Renderer.updateActiveCard();
                }, { once: true });
                this.video.addEventListener('error', () => {
                    clearTimeout(errorTimeout);
                    this.tryAutoPlay(index + 1);
                }, { once: true });
            }
        } else {
            this.video.src = url;
            this.video.addEventListener('loadeddata', () => {
                hasStarted = true;
                clearTimeout(errorTimeout);
                this.video.play();
                this.hideStates();
                Renderer.updateActiveCard();
            }, { once: true });
            this.video.addEventListener('error', () => {
                clearTimeout(errorTimeout);
                this.tryAutoPlay(index + 1);
            }, { once: true });
        }
    },
    
    tryAutoPlay(index) {
        if (index >= STATE.allChannels.length) {
            UI.showToast('All channels failed to load', 'error');
            this.showState('error');
            document.getElementById('errorMessage').textContent = 'No working channels found';
            return;
        }
        
        STATE.autoPlayAttempt = index;
        const channel = STATE.allChannels[index];
        STATE.currentChannel = channel;
        STATE.currentIndex = index;
        
        document.getElementById('nowPlayingLogo').src = channel.logo;
        document.getElementById('nowPlayingName').textContent = channel.name;
        
        let metaText = '';
        if (channel.isFancode && channel.teams && channel.teams.length > 0) {
            metaText = channel.teams.map(t => t.name).join(' vs ');
        }
        document.getElementById('nowPlayingMeta').textContent = metaText;
        
        this.showState('loading');
        this.loadWithFallback(channel.url, index);
    },
    
    autoPlayFirst() {
        if (STATE.allChannels.length === 0) {
            UI.showToast('No channels available', 'error');
            return;
        }
        STATE.autoPlayAttempt = 0;
        this.tryAutoPlay(0);
    },
    
    handleError(details) {
        console.error('Stream error:', details);
        this.showState('error');
        document.getElementById('errorMessage').textContent = `Error: ${details}`;
        UI.showToast('Stream failed', 'error');
    },
    
    retry() {
        if (STATE.currentChannel) {
            this.showState('loading');
            setTimeout(() => this.loadStream(STATE.currentChannel.url), 500);
        }
    },
    
    togglePlay() {
        if (this.video.paused) this.video.play();
        else this.video.pause();
    },
    
    toggleMute() {
        this.video.muted = !this.video.muted;
        this.updateVolumeIcon();
    },
    
    updateVolumeIcon() {
        const icon = document.querySelector('#muteBtn i');
        if (this.video.muted || this.video.volume === 0) icon.className = 'fas fa-volume-mute';
        else if (this.video.volume < 0.5) icon.className = 'fas fa-volume-down';
        else icon.className = 'fas fa-volume-up';
    },
    
    toggleFullscreen() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            const el = this.wrapper;
            if (el.requestFullscreen) el.requestFullscreen().catch(() => UI.showToast('Fullscreen not available', 'warning'));
            else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
            else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        }
    },
    
    playNext() {
        if (STATE.filteredChannels.length === 0) return;
        const nextIndex = (STATE.currentIndex + 1) % STATE.filteredChannels.length;
        this.play(STATE.filteredChannels[nextIndex], nextIndex);
    },
    
    playPrevious() {
        if (STATE.filteredChannels.length === 0) return;
        const prevIndex = STATE.currentIndex <= 0 ? STATE.filteredChannels.length - 1 : STATE.currentIndex - 1;
        this.play(STATE.filteredChannels[prevIndex], prevIndex);
    },
    
    showState(state) {
        this.hideStates();
        const el = document.getElementById(`player${state.charAt(0).toUpperCase() + state.slice(1)}`);
        if (el) el.classList.remove('hidden');
    },
    
    hideStates() {
        document.querySelectorAll('.player-state').forEach(el => el.classList.add('hidden'));
    },
    
    toggleOverlay() {
        STATE.isOverlayHidden = !STATE.isOverlayHidden;
        if (STATE.isOverlayHidden) this.wrapper.classList.add('hide-overlay');
        else {
            this.wrapper.classList.remove('hide-overlay');
            this.showControls();
        }
    },
    
    handleTouch(e) {
        if (STATE.isOverlayHidden) {
            e.preventDefault();
            this.toggleOverlay();
        } else {
            this.showControls();
        }
    },
    
    showControls() {
        if (STATE.isOverlayHidden) return;
        this.wrapper.classList.add('controls-visible');
        clearTimeout(STATE.controlsTimeout);
        STATE.controlsTimeout = setTimeout(() => this.hideControls(), 3000);
    },
    
    hideControls() {
        if (!this.video.paused && !STATE.isOverlayHidden) {
            this.wrapper.classList.remove('controls-visible');
        }
    },
    
    updateTime() {
        if (!STATE.playStartTime) return;
        const elapsed = Math.floor((Date.now() - STATE.playStartTime) / 1000);
        document.getElementById('timeDisplay').textContent = Utils.formatTime(elapsed);
    },
    
    updateQuality() {
        if (!STATE.hls) return;
        const level = STATE.hls.levels[STATE.hls.currentLevel];
        if (level) {
            let quality = 'SD';
            if (level.height >= 2160) quality = '4K';
            else if (level.height >= 1080) quality = 'FHD';
            else if (level.height >= 720) quality = 'HD';
            document.getElementById('qualityBadge').textContent = quality;
        }
    },
    
    toggleStats() {
        const overlay = document.getElementById('statsOverlay');
        overlay.classList.toggle('visible');
        if (overlay.classList.contains('visible')) {
            STATE.statsInterval = setInterval(() => this.updateStats(), 1000);
        } else {
            clearInterval(STATE.statsInterval);
        }
    },
    
    updateStats() {
        if (!STATE.hls) return;
        const level = STATE.hls.levels[STATE.hls.currentLevel];
        if (level) {
            document.getElementById('statRes').textContent = `${level.width}x${level.height}`;
            document.getElementById('statBitrate').textContent = Math.round(level.bitrate / 1000) + ' kbps';
        }
        if (this.video.buffered.length > 0) {
            const buffered = this.video.buffered.end(this.video.buffered.length - 1) - this.video.currentTime;
            document.getElementById('statBuffer').textContent = buffered.toFixed(1) + 's';
        }
    }
};
