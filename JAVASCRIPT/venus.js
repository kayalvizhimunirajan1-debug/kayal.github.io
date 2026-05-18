(function() {
  // Starfield
  const canvas = document.getElementById('galaxy-canvas');
  let ctx = canvas.getContext('2d');
  let stars = [];
  
  function initStars() {
    for(let i = 0; i < 400; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2.2,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.3 + 0.1
      });
    }
  }
  
  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#03030f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 240, 200, ${s.alpha})`;
      ctx.fill();
      s.y += s.speed;
      if(s.y > canvas.height) s.y = 0;
    }
    requestAnimationFrame(drawStars);
  }
  
  function resizeStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    initStars();
  }
  
  window.addEventListener('resize', resizeStars);
  resizeStars();
  initStars();
  drawStars();

  // Venus PNG Rotation
  const venusImage = document.getElementById('venusImage');
  let currentRotation = 0;
  let isRotating = true;
  let rotationSpeed = 8;
  let lastTimestamp = 0;
  
  function rotateVenus(timestamp) {
    if (!lastTimestamp) { lastTimestamp = timestamp; requestAnimationFrame(rotateVenus); return; }
    const deltaTime = Math.min(0.1, (timestamp - lastTimestamp) / 1000);
    lastTimestamp = timestamp;
    if (isRotating && venusImage) {
      currentRotation += rotationSpeed * deltaTime;
      currentRotation = currentRotation % 360;
      venusImage.style.transform = `rotate(${currentRotation}deg)`;
    }
    requestAnimationFrame(rotateVenus);
  }
  requestAnimationFrame(rotateVenus);
  
  // Controls
  const speedSlider = document.getElementById('rotationSpeed');
  const speedValue = document.getElementById('speedValue');
  const resetSpeedBtn = document.getElementById('resetSpeed');
  const pauseBtn = document.getElementById('pauseRotationBtn');
  const resumeBtn = document.getElementById('resumeRotationBtn');
  const resetBtn = document.getElementById('resetRotationBtn');
  
  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      rotationSpeed = parseFloat(e.target.value);
      speedValue.textContent = rotationSpeed.toFixed(1) + '°/s';
    });
  }
  if (resetSpeedBtn) {
    resetSpeedBtn.addEventListener('click', () => {
      rotationSpeed = 8;
      speedSlider.value = 8;
      speedValue.textContent = '8.0°/s';
    });
  }
  if (pauseBtn) pauseBtn.addEventListener('click', () => { isRotating = false; });
  if (resumeBtn) resumeBtn.addEventListener('click', () => { isRotating = true; });
  if (resetBtn) resetBtn.addEventListener('click', () => {
    currentRotation = 0;
    if (venusImage) venusImage.style.transform = `rotate(0deg)`;
  });
  
  // Hover effect
  const wrapper = document.querySelector('.planet-rotation-wrapper');
  let originalSpeed = rotationSpeed;
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => {
      if (isRotating) {
        originalSpeed = rotationSpeed;
        rotationSpeed = 24;
        if (speedSlider) speedSlider.value = 24;
        if (speedValue) speedValue.textContent = '24.0°/s';
      }
    });
    wrapper.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (isRotating) {
          rotationSpeed = originalSpeed;
          if (speedSlider) speedSlider.value = originalSpeed;
          if (speedValue) speedValue.textContent = originalSpeed.toFixed(1) + '°/s';
        }
      }, 300);
    });
  }
  
  // Orbit Simulation
  const orbitCanvas = document.getElementById('orbitCanvas');
  if (orbitCanvas) {
    const orbitCtx = orbitCanvas.getContext('2d');
    orbitCanvas.width = 600;
    orbitCanvas.height = 350;
    let orbitAngle = 0;
    const orbitSlider = document.getElementById('orbitSlider');
    const angleDisplay = document.getElementById('angleDisplay');
    
    function drawOrbit(angleDeg) {
      orbitCtx.clearRect(0, 0, orbitCanvas.width, orbitCanvas.height);
      orbitCtx.fillStyle = "#000015";
      orbitCtx.fillRect(0, 0, orbitCanvas.width, orbitCanvas.height);
      const cx = orbitCanvas.width/2, cy = orbitCanvas.height/2;
      
      orbitCtx.beginPath();
      orbitCtx.arc(cx, cy, 25, 0, Math.PI*2);
      orbitCtx.fillStyle = "#ffcc44";
      orbitCtx.fill();
      
      orbitCtx.strokeStyle = "#0ff";
      orbitCtx.beginPath();
      orbitCtx.ellipse(cx, cy, 130, 85, 0, 0, Math.PI*2);
      orbitCtx.stroke();
      
      const rad = angleDeg * Math.PI / 180;
      const px = cx + Math.cos(rad) * 130;
      const py = cy + Math.sin(rad) * 85;
      
      orbitCtx.beginPath();
      orbitCtx.arc(px, py, 14, 0, Math.PI*2);
      orbitCtx.fillStyle = "#ffcc88";
      orbitCtx.fill();
      
      orbitCtx.fillStyle = "#88ddff";
      orbitCtx.font = "12px 'Exo 2'";
      orbitCtx.fillText("Venus", px-18, py-17);
      orbitCtx.fillStyle = "#ffaa66";
      orbitCtx.fillText("☀️ Sun", cx-15, cy-30);
    }
    
    if (orbitSlider) {
      orbitSlider.addEventListener('input', (e) => {
        orbitAngle = parseInt(e.target.value);
        angleDisplay.textContent = orbitAngle + "°";
        drawOrbit(orbitAngle);
      });
    }
    drawOrbit(0);
  }
  
  // Accessibility
  const highBtn = document.getElementById('highContrastBtn');
  const fontBtn = document.getElementById('fontSizeBtn');
  const narrationBtn = document.getElementById('sectionNarrationBtn');
  const stopBtn = document.getElementById('stopNarration');
  const factsBtn = document.getElementById('factsNarrationBtn');
  const geologyBtn = document.getElementById('geologyNarrationBtn');
  let utterance = null;
  
  if (highBtn) highBtn.addEventListener('click', () => document.body.classList.toggle('high-contrast'));
  if (fontBtn) fontBtn.addEventListener('click', () => document.body.classList.toggle('large-font'));
  
  function speak(text) {
    if (utterance) window.speechSynthesis.cancel();
    utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
  
  if (narrationBtn) narrationBtn.addEventListener('click', () => speak(document.body.innerText));
  if (factsBtn) factsBtn.addEventListener('click', () => speak(document.getElementById('overview').innerText));
  if (geologyBtn) geologyBtn.addEventListener('click', () => speak(document.getElementById('deepdive').innerText));
  if (stopBtn) stopBtn.addEventListener('click', () => { window.speechSynthesis.cancel(); utterance = null; });
  
  console.log('Venus page loaded');
})();