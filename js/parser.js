// ===== M3U PARSER =====
const Parser = {
    parse(data, priority, isLiveSource, sourceUrl, isFancode) {
        const lines = data.split(/\r?\n/);
        let channel = {};
        
        lines.forEach(line => {
            line = line.trim();
            
            if (line.startsWith('#EXTINF:')) {
                channel = { 
                    priority, 
                    id: Utils.generateId(),
                    isLive: isLiveSource || isFancode,
                    isFancode: isFancode
                };
                
                const logoMatch = line.match(/tvg-logo="([^"]*)"/);
                channel.logo = logoMatch ? logoMatch[1] : '';
                
                const groupMatch = line.match(/group-title="([^"]*)"/);
                channel.group = groupMatch ? groupMatch[1] : 'Uncategorized';
                
                channel.name = line.split(',').pop().trim();
                
                channel.teams = isFancode ? this.detectTeams(channel.name) : [];
                
            } else if (line && !line.startsWith('#')) {
                channel.url = line;
                
                if (!STATE.allChannels.some(c => c.url === channel.url)) {
                    if (!channel.logo) {
                        channel.logo = `https://via.placeholder.com/80x50/1a1a2e/ffffff?text=${encodeURIComponent(channel.name.charAt(0))}`;
                    }
                    STATE.allChannels.push(channel);
                }
            }
        });
    },
    
    detectTeams(name) {
        const upperName = name.toUpperCase();
        const detected = [];
        
        const vsMatch = upperName.match(/(\w+)\s*(?:VS|V\/S|V)\s*(\w+)/i);
        if (vsMatch) {
            const team1 = CONFIG.TEAM_PATTERNS[vsMatch[1]];
            const team2 = CONFIG.TEAM_PATTERNS[vsMatch[2]];
            if (team1) detected.push(team1);
            if (team2) detected.push(team2);
        }
        
        for (const [pattern, info] of Object.entries(CONFIG.TEAM_PATTERNS)) {
            if (upperName.includes(pattern) && !detected.some(d => d.name === info.name)) {
                detected.push(info);
                if (detected.length >= 2) break;
            }
        }
        
        return detected;
    }
};
