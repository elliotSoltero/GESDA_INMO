/* =========================================
   INDEX — VIDEO SCROLL APPLE x2
   ========================================= */

function initScrollScene({ videoId, spacerId, stepsContainerId, overlayRight }) {
  const video   = document.getElementById(videoId);
  const spacer  = document.getElementById(spacerId);
  const stepsEl = document.getElementById(stepsContainerId);

  if (!video || !spacer || !stepsEl) return;

  const steps = stepsEl.querySelectorAll('.sstep');

  video.load();
  video.pause();

  let ready = false;
  video.addEventListener('loadedmetadata', () => { ready = true; });
  video.addEventListener('canplaythrough',  () => { ready = true; });

  function setStep(i) {
    steps.forEach((s, idx) => s.classList.toggle('active', idx === i));
  }

  function tick() {
    // getBoundingClientRect del spacer relativo a la ventana
    const rect     = spacer.getBoundingClientRect();
    // cuánto del spacer ha pasado por arriba de la ventana
    const scrolled = -rect.top;
    const total    = rect.height - window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrolled / total));

    if (ready && video.duration) {
      const t = progress * video.duration;
      if (Math.abs(video.currentTime - t) > 0.05) {
        video.currentTime = t;
      }
    }

    const idx = Math.min(steps.length - 1, Math.floor(progress * steps.length));
    setStep(idx);
  }

  window.addEventListener('scroll', tick, { passive: true });
  tick();
}

initScrollScene({
  videoId:          'videoVenta',
  spacerId:         'spacerVenta',
  stepsContainerId: 'stepsVenta',
});

initScrollScene({
  videoId:          'videoConstruccion',
  spacerId:         'spacerConstruccion',
  stepsContainerId: 'stepsConstruccion',
  overlayRight:     true,
});
