// ===== CONFIGURATION =====
const CONFIG = {
    TELEGRAM_URL: "https://t.me/rslivetv",
    
    SOURCES: [
        { 
            url: "https://raw.githubusercontent.com/sm-monirulislam/Tapmad_Auto_Update_Playlist/refs/heads/main/tapmad_sm.m3u", 
            priority: 1, 
            isLive: true, 
            isFancode: true 
        },
        { 
            url: "https://raw.githubusercontent.com/sm-monirulislam/Tapmad_Auto_Update_Playlist/refs/heads/main/tapmad_sm.m3u", 
            priority: 1 
        },
        { 
            url: "https://raw.githubusercontent.com/sm-monirulislam/jago_bd_auto_update_playlist-/refs/heads/main/jago_bd_main.m3u", 
            priority: 3 
        },
        { 
            url: "https://raw.githubusercontent.com/sm-monirulislam/SM-Movie-Hup-Auto-Update/refs/heads/main/Movie_Combined.m3u", 
            priority: 2 
        }
    ],
    
    TEAM_PATTERNS: {
        'CSK': { name: 'CSK', type: 'ipl', icon: 'fa-cricket-bat-ball' },
        'MI': { name: 'MI', type: 'ipl', icon: 'fa-cricket-bat-ball' },
        'RCB': { name: 'RCB', type: 'ipl', icon: 'fa-cricket-bat-ball' },
        'KKR': { name: 'KKR', type: 'ipl', icon: 'fa-cricket-bat-ball' },
        'DC': { name: 'DC', type: 'ipl', icon: 'fa-cricket-bat-ball' },
        'SRH': { name: 'SRH', type: 'ipl', icon: 'fa-cricket-bat-ball' },
        'PBKS': { name: 'PBKS', type: 'ipl', icon: 'fa-cricket-bat-ball' },
        'RR': { name: 'RR', type: 'ipl', icon: 'fa-cricket-bat-ball' },
        'GT': { name: 'GT', type: 'ipl', icon: 'fa-cricket-bat-ball' },
        'LSG': { name: 'LSG', type: 'ipl', icon: 'fa-cricket-bat-ball' },
        'IPL': { name: 'IPL', type: 'ipl', icon: 'fa-trophy' },
        'IND': { name: 'IND', type: 'cricket', icon: 'fa-flag' },
        'INDIA': { name: 'IND', type: 'cricket', icon: 'fa-flag' },
        'PAK': { name: 'PAK', type: 'cricket', icon: 'fa-flag' },
        'AUS': { name: 'AUS', type: 'cricket', icon: 'fa-flag' },
        'ENG': { name: 'ENG', type: 'cricket', icon: 'fa-flag' },
        'SA': { name: 'SA', type: 'cricket', icon: 'fa-flag' },
        'NZ': { name: 'NZ', type: 'cricket', icon: 'fa-flag' },
        'T20': { name: 'T20', type: 'cricket', icon: 'fa-cricket-bat-ball' },
        'ODI': { name: 'ODI', type: 'cricket', icon: 'fa-cricket-bat-ball' },
        'WORLD CUP': { name: 'WC', type: 'wc', icon: 'fa-trophy' },
        'WC': { name: 'WC', type: 'wc', icon: 'fa-trophy' },
        'EPL': { name: 'EPL', type: 'football', icon: 'fa-futbol' },
        'UCL': { name: 'UCL', type: 'football', icon: 'fa-trophy' },
        'FIFA': { name: 'FIFA', type: 'football', icon: 'fa-futbol' },
    },
    
    STORAGE_KEYS: {
        favorites: 'iptv_favorites',
        history: 'iptv_history',
        volume: 'iptv_volume',
        theme: 'iptv_theme'
    }
};
