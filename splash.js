const enterBtn    = document.getElementById('enterBtn');
// Skip splash if guest already opened it this session
if (sessionStorage.getItem('splashSeen')) {
  window.location.href = 'index.html';
}

enterBtn.addEventListener('click', function () {
  sessionStorage.setItem('splashSeen', 'true'); // remember they've seen it
  document.getElementById('stage').style.transition = 'opacity 0.8s ease';
  document.getElementById('stage').style.opacity    = '0';
  setTimeout(() => { window.location.href = 'index.html'; }, 800);
});
(function () {

  const waxSeal     = document.getElementById('waxSeal');
  const topFlap     = document.getElementById('topFlap');
  const letterPeek  = document.getElementById('letter-peek');
  const envelopeWrap = document.getElementById('envelope-wrap');
  const invCard     = document.getElementById('invitation-card');
  const enterBtn    = document.getElementById('enterBtn');
  const hintText    = document.getElementById('hintText');
  const audio = document.getElementById('bgMusic');

 

  let opened = false;

  // ── Step 1: Tap the wax seal → envelope opens ──
  waxSeal.addEventListener('click', function () {
    if (opened) return;
    opened = true;

    // Start music on user gesture
    if (audio) {
  audio.volume = 0;
  audio.play().catch(() => {});
  
  let fade = setInterval(() => {
    if (audio.volume < 1) {
      audio.volume += 0.05;
    } else {
      clearInterval(fade);
    }
  }, 100);
}

    hintText.classList.add('hidden');

    // Fold the top flap back
    topFlap.classList.add('open');

    // Letter slides up out of envelope
    setTimeout(() => letterPeek.classList.add('revealed'), 600);

    // Envelope fades away, invitation card appears
    setTimeout(() => {
      envelopeWrap.classList.add('opened');
      invCard.classList.add('visible');
    }, 1800);
  });

  // ── Step 2: "View Invitation" → go to main website ──
  enterBtn.addEventListener('click', function () {
    // Fade out entire splash
    document.getElementById('stage').style.transition = 'opacity 0.8s ease';
    document.getElementById('stage').style.opacity    = '0';

    setTimeout(() => {
      // ↓↓ CHANGE THIS to your main website file ↓↓
      window.location.href = 'main.html';
    }, 800);
  });

})();