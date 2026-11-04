// ===== CHANNEL RENDERER =====
const Renderer = {
    render() {
        const grid = document.getElementById('channelsGrid');
        grid.innerHTML = '';
        
        if (STATE.filteredChannels.length === 0) {
            grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;"><i class="fas fa-search"></i><p>No channels found</p></div>`;
            return;
        }
        
        const fragment = document.createDocumentFragment();
        
        STATE.filteredChannels.forEach((ch, index) => {
            const card = this.createCard(ch, index);
            fragment.appendChild(card);
        });
        
        grid.appendChild(fragment);
        this.updateCounts();
    },
    
    createCard(ch, index) {
        const card = document.createElement('div');
        card.className = `channel-card priority-${ch.priority} fade-in`;
        if (STATE.currentChannel && STATE.currentChannel.url === ch.url) {
            card.classList.add('active', 'playing');
        }
        card.dataset.index = index;
        card.dataset.id = ch.id;
        
        const isFav = STATE.favorites.has(ch.url);
        
        let badgesHTML = '';
        if (ch.isFancode) {
            badgesHTML = '<span class="badge-live">LIVE</span>';
            if (ch.teams && ch.teams.length > 0) {
                ch.teams.forEach(team => {
                    badgesHTML += `<span class="badge-team badge-${team.type}"><i class="fas ${team.icon}"></i>${team.name}</span>`;
                });
            }
        }
        
        card.innerHTML = `
            <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); Channels.toggleFavorite('${ch.url}', this)">
                <i class="fas fa-heart"></i>
            </button>
            <div class="priority-indicator"></div>
            <div class="channel-logo-wrapper">
                <img class="channel-logo" src="${ch.logo}" alt="${ch.name}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/80x50/1a1a2e/666?text=TV'">
            </div>
            <div class="channel-info">
                <div class="channel-name" title="${ch.name}">${ch.name}</div>
                <div class="channel-badges">${badgesHTML}</div>
            </div>
        `;
        
        card.addEventListener('click', () => Player.play(ch, index));
        return card;
    },
    
    updateCounts() {
        document.getElementById('allCount').textContent = STATE.allChannels.length;
        document.getElementById('favCount').textContent = STATE.favorites.size;
    },
    
    updateGroups() {
        const groups = [...new Set(STATE.allChannels.map(c => c.group))].sort();
        const select = document.getElementById('groupFilter');
        select.innerHTML = '<option value="all">All Groups</option>';
        groups.forEach(g => {
            const opt = document.createElement('option');
            opt.value = g;
            opt.textContent = g;
            select.appendChild(opt);
        });
    },
    
    updateActiveCard() {
        document.querySelectorAll('.channel-card').forEach(card => {
            card.classList.remove('active', 'playing');
        });
        
        if (STATE.currentChannel) {
            const activeCard = document.querySelector(`[data-id="${STATE.currentChannel.id}"]`);
            if (activeCard) activeCard.classList.add('active', 'playing');
        }
    }
};
