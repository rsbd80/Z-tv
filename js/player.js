/* =====================================================
   FULLSCREEN STYLES (নতুন যোগ করা)
   ===================================================== */

/* ফুলস্ক্রিন মোডে প্লেয়ার র্যাপার */
.player-wrapper:fullscreen,
.player-wrapper:-webkit-full-screen,
.player-wrapper:-moz-full-screen,
.player-wrapper:-ms-fullscreen {
    width: 100vw !important;
    height: 100vh !important;
    max-width: none !important;
    max-height: none !important;
    background: #000 !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    border-radius: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: hidden;
}

/* ফুলস্ক্রিনে ভিডিও কন্টেইনার পুরো জায়গা নেবে */
.player-wrapper:fullscreen .video-container,
.player-wrapper:-webkit-full-screen .video-container,
.player-wrapper:-moz-full-screen .video-container {
    width: 100% !important;
    height: 100% !important;
    position: relative;
    background: #000;
}

/* ফুলস্ক্রিনে ভিডিও ঠিকমতো সেন্টার হবে */
.player-wrapper:fullscreen video,
.player-wrapper:-webkit-full-screen video,
.player-wrapper:-moz-full-screen video {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain;
    background: #000;
}

/* ফুলস্ক্রিনে ওভারলে নিচে থাকবে */
.player-wrapper:fullscreen .player-overlay,
.player-wrapper:-webkit-full-screen .player-overlay,
.player-wrapper:-moz-full-screen .player-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
}

/* =====================================================
   ROTATE TIP OVERLAY (নতুন)
   ===================================================== */

.rotate-tip {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 22px 30px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    z-index: 999999;
    opacity: 0;
    transition: opacity 0.35s ease, transform 0.35s ease;
    pointer-events: none;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    font-family: inherit;
    max-width: 85vw;
}

.rotate-tip.show {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
}

.rotate-tip i {
    font-size: 40px;
    color: #4da6ff;
    animation: rotatePhone 2.2s ease-in-out infinite;
}

.rotate-tip span {
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    line-height: 1.5;
    white-space: normal;
}

@keyframes rotatePhone {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(90deg); }
}

/* =====================================================
   MOBILE RESPONSIVE (নতুন - মোবাইলের জন্য)
   ===================================================== */

@media (max-width: 768px) {
    .player-wrapper:fullscreen .player-overlay,
    .player-wrapper:-webkit-full-screen .player-overlay {
        padding-bottom: env(safe-area-inset-bottom, 0);
    }
    
    .rotate-tip {
        padding: 18px 24px;
    }
    
    .rotate-tip i {
        font-size: 34px;
    }
    
    .rotate-tip span {
        font-size: 13px;
    }
}
