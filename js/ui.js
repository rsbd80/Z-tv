// ===== UI MANAGER =====
const UI = {
    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = { 
            success: 'fa-check-circle', 
            error: 'fa-times-circle', 
            warning: 'fa-exclamation-circle' 
        };
        toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },
    
    toggleModal(id) {
        document.getElementById(id).classList.toggle('visible');
    },
    
    initTheme() {
        const savedTheme = Storage.getTheme();
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    },
    
    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        Storage.saveTheme(next);
        this.updateThemeIcon(next);
    },
    
    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        if (icon) icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    },
    
    updateConnectionStatus(online) {
        const dot = document.getElementById('connectionDot');
        const text = document.getElementById('connectionText');
        if (online) {
            dot.classList.remove('offline');
            text.textContent = 'Online';
        } else {
            dot.classList.add('offline');
            text.textContent = 'Offline';
            this.showToast('You are offline', 'error');
        }
    },
    
    updateLoadProgress(percent) {
        STATE.loadProgress = percent;
        document.getElementById('loaderProgress').style.width = percent + '%';
    },
    
    hideLoading() {
        this.updateLoadProgress(100);
        setTimeout(() => {
            document.getElementById('loadingOverlay').classList.add('hidden');
        }, 600);
    }
};
