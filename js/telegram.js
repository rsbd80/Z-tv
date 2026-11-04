// ===== TELEGRAM EFFECTS =====
const Telegram = {
    init() {
        // Header telegram button ripple effect
        const headerBtn = document.querySelector('.header-btn.telegram-btn');
        if (headerBtn) {
            headerBtn.addEventListener('click', (e) => this.ripple(e, headerBtn));
        }
        
        // Float button ripple effect
        const floatBtn = document.querySelector('.telegram-float');
        if (floatBtn) {
            floatBtn.addEventListener('click', (e) => this.ripple(e, floatBtn));
        }
        
        this.injectRippleStyles();
    },
    
    ripple(e, element) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'telegram-click-ripple';
        
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: rgba(255,255,255,0.6);
            transform: scale(0);
            animation: telegramRippleAnim 0.6s ease-out;
            pointer-events: none;
            z-index: 10;
        `;
        
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    },
    
    injectRippleStyles() {
        if (document.getElementById('telegram-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'telegram-styles';
        style.textContent = `
            @keyframes telegramRippleAnim {
                to {
                    transform: scale(2.5);
                    opacity: 0;
                }
            }
            
            .telegram-float {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #0088cc, #00a0e0);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                box-shadow: 0 4px 20px rgba(0,136,204,0.5);
                cursor: pointer;
                z-index: 999;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                text-decoration: none;
                overflow: visible;
                animation: telegramPulse 2.5s infinite;
            }
            
            .telegram-float:hover {
                transform: scale(1.12) rotate(8deg);
                box-shadow: 0 8px 40px rgba(0,136,204,0.8);
            }
            
            .telegram-float:active {
                transform: scale(0.95);
            }
            
            .telegram-float i {
                animation: telegramFly 3s ease-in-out infinite;
                position: relative;
                z-index: 2;
            }
            
            .telegram-float::before {
                content: "";
                position: absolute;
                inset: -6px;
                border-radius: 50%;
                border: 2px solid rgba(0,136,204,0.6);
                animation: telegramRing 2s infinite;
                z-index: 0;
            }
            
            .telegram-float::after {
                content: "";
                position: absolute;
                inset: 0;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
                opacity: 0;
                transition: opacity 0.3s;
                z-index: 1;
            }
            
            .telegram-float:hover::after {
                opacity: 1;
            }
            
            .telegram-ripple {
                position: absolute;
                inset: -6px;
                border-radius: 50%;
                border: 2px solid rgba(0,136,204,0.7);
                animation: telegramRing 2s infinite;
                pointer-events: none;
            }
            
            .telegram-ripple:nth-child(2) {
                animation-delay: 0s;
            }
            
            .telegram-ripple:nth-child(3) {
                animation-delay: 1s;
            }
            
            @keyframes telegramPulse {
                0%, 100% { 
                    box-shadow: 0 4px 20px rgba(0,136,204,0.5); 
                }
                50% { 
                    box-shadow: 0 4px 30px rgba(0,136,204,0.9), 0 0 0 8px rgba(0,136,204,0.1); 
                }
            }
            
            @keyframes telegramRing {
                0% {
                    transform: scale(0.9);
                    opacity: 1;
                }
                100% {
                    transform: scale(1.6);
                    opacity: 0;
                }
            }
            
            @keyframes telegramFly {
                0%, 100% { 
                    transform: translate(0, 0) rotate(0deg); 
                }
                25% { 
                    transform: translate(2px, -2px) rotate(-5deg); 
                }
                50% { 
                    transform: translate(-2px, 2px) rotate(5deg); 
                }
                75% { 
                    transform: translate(2px, 2px) rotate(-3deg); 
                }
            }
            
            @media (min-width: 768px) {
                .telegram-float {
                    bottom: 30px;
                    right: 30px;
                    width: 60px;
                    height: 60px;
                    font-size: 26px;
                }
            }
        `;
        document.head.appendChild(style);
    }
};
