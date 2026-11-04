// ===== GLOBAL STATE =====
const STATE = {
    allChannels: [],
    filteredChannels: [],
    favorites: new Set(),
    history: [],
    currentChannel: null,
    currentIndex: -1,
    hls: null,
    controlsTimeout: null,
    statsInterval: null,
    playStartTime: null,
    loadProgress: 0,
    autoPlayAttempt: 0,
    isOverlayHidden: false,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
};
