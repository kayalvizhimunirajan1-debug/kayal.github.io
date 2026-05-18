(function() {
  // Starfield background
  const starCanvas = document.getElementById('galaxy-canvas');
  let starCtx = starCanvas.getContext('2d');
  let stars = [];
  
  function initStars() {
    stars = [];
    for(let i = 0; i < 400; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2.2,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.5 + 0.1
      });
    }
  }
  
  function drawStars() {
    if (!starCtx) return;
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    starCtx.fillStyle = '#03030f';
    starCtx.fillRect(0, 0, starCanvas.width, starCanvas.height);
    for(let s of stars) {
      starCtx.beginPath();
      starCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      starCtx.fillStyle = `rgba(255, 240, 200, ${s.alpha})`;
      starCtx.fill();
      s.y += s.speed;
      if(s.y > starCanvas.height) s.y = 0;
    }
    requestAnimationFrame(drawStars);
  }
  
  function resizeStars() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
    initStars();
  }
  
  window.addEventListener('resize', resizeStars);
  resizeStars();
  initStars();
  drawStars();

  // -------------------- MERCURY PNG ROTATION ANIMATION --------------------
  const mercuryImage = document.getElementById('mercuryImage');
  let currentRotation = 0;
  let isRotating = true;
  let rotationSpeed = 8; // degrees per second
  let lastTimestamp = 0;
  let animationId = null;
  
  // Check if Mercury PNG exists
  if (mercuryImage) {
    mercuryImage.onerror = function() {
      console.warn('Mercury PNG not found! Please place mercury.png in the same folder.');
      const wrapper = document.querySelector('.earth-rotation-wrapper');
      if (wrapper) {
        const errorMsg = document.createElement('div');
        errorMsg.style.position = 'absolute';
        errorMsg.style.top = '50%';
        errorMsg.style.left = '50%';
        errorMsg.style.transform = 'translate(-50%, -50%)';
        errorMsg.style.color = '#ff6666';
        errorMsg.style.backgroundColor = 'rgba(0,0,0,0.7)';
        errorMsg.style.padding = '1rem';
        errorMsg.style.borderRadius = '12px';
        errorMsg.style.fontSize = '14px';
        errorMsg.style.textAlign = 'center';
        errorMsg.style.zIndex = '10';
        errorMsg.innerHTML = '⚠️ mercury.png not found<br>Add your Mercury image to this folder';
        wrapper.style.position = 'relative';
        wrapper.appendChild(errorMsg);
      }
    };
    
    mercuryImage.onload = function() {
      console.log('Mercury PNG loaded successfully');
    };
  }
  
  function rotateMercury(timestamp) {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
      animationId = requestAnimationFrame(rotateMercury);
      return;
    }
    
    // Calculate time difference in seconds
    const deltaTime = Math.min(0.1, (timestamp - lastTimestamp) / 1000);
    lastTimestamp = timestamp;
    
    if (isRotating && mercuryImage) {
      // Update rotation based on speed (degrees per second)
      currentRotation += rotationSpeed * deltaTime;
      currentRotation = currentRotation % 360;
      mercuryImage.style.transform = `rotate(${currentRotation}deg)`;
    }
    
    animationId = requestAnimationFrame(rotateMercury);
  }
  
  // Start rotation animation
  animationId = requestAnimationFrame(rotateMercury);
  
  // Get DOM elements
  const speedSlider = document.getElementById('rotationSpeed');
  const speedValue = document.getElementById('speedValue');
  const resetSpeedBtn = document.getElementById('resetSpeed');
  const pauseBtn = document.getElementById('pauseRotationBtn');
  const resumeBtn = document.getElementById('resumeRotationBtn');
  const resetBtn = document.getElementById('resetRotationBtn');
  
  // Speed control
  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      rotationSpeed = parseFloat(e.target.value);
      speedValue.textContent = rotationSpeed.toFixed(1) + '°/s';
    });
  }
  
  // Reset speed to normal (8 degrees per second - one full rotation every 45 seconds)
  if (resetSpeedBtn) {
    resetSpeedBtn.addEventListener('click', () => {
      rotationSpeed = 8;
      speedSlider.value = 8;
      speedValue.textContent = '8.0°/s';
    });
  }
  
  // Pause rotation
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isRotating = false;
    });
  }
  
  // Resume rotation
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      isRotating = true;
    });
  }
  
  // Reset rotation position
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentRotation = 0;
      if (mercuryImage) {
        mercuryImage.style.transform = `rotate(0deg)`;
      }
    });
  }
  
  // Hover effect for faster rotation (optional)
  const mercuryWrapper = document.querySelector('.earth-rotation-wrapper');
  let originalSpeed = rotationSpeed;
  let hoverTimeout = null;
  
  if (earthWrapper) {
    earthWrapper.addEventListener('mouseenter', () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      // Speed up on hover for interactive feel
      if (isRotating) {
        originalSpeed = rotationSpeed;
        rotationSpeed = 24; // Speed up on hover
        if (speedSlider) speedSlider.value = 24;
        if (speedValue) speedValue.textContent = '24.0°/s';
      }
    });
    
    earthWrapper.addEventListener('mouseleave', () => {
      // Return to original speed after 0.3 seconds
      hoverTimeout = setTimeout(() => {
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
    
    function drawOrbitSimulation(angleDeg) {
      if (!orbitCtx) return;
      orbitCtx.clearRect(0, 0, orbitCanvas.width, orbitCanvas.height);
      orbitCtx.fillStyle = "#000015";
      orbitCtx.fillRect(0, 0, orbitCanvas.width, orbitCanvas.height);
      
      const centerX = orbitCanvas.width/2, centerY = orbitCanvas.height/2;
      
      // Draw Sun
      const sunGradient = orbitCtx.createRadialGradient(centerX - 10, centerY - 10, 5, centerX, centerY, 35);
      sunGradient.addColorStop(0, '#ffcc44');
      sunGradient.addColorStop(1, '#ff8800');
      orbitCtx.beginPath();
      orbitCtx.arc(centerX, centerY, 28, 0, Math.PI*2);
      orbitCtx.fillStyle = sunGradient;
      orbitCtx.fill();
      orbitCtx.shadowBlur = 0;
      
      // Orbit path
      orbitCtx.strokeStyle = "#33ccff";
      orbitCtx.lineWidth = 1.5;
      orbitCtx.beginPath();
      orbitCtx.ellipse(centerX, centerY, 140, 88, 0, 0, Math.PI*2);
      orbitCtx.stroke();
      
      // Earth position
      const rad = angleDeg * Math.PI / 180;
      const earthX = centerX + Math.cos(rad) * 140;
      const earthY = centerY + Math.sin(rad) * 88;
      
      // Draw Earth
      const earthGradient = orbitCtx.createRadialGradient(earthX - 5, earthY - 5, 5, earthX, earthY, 18);
      earthGradient.addColorStop(0, '#3399ff');
      earthGradient.addColorStop(1, '#2266cc');
      orbitCtx.beginPath();
      orbitCtx.arc(earthX, earthY, 16, 0, Math.PI*2);
      orbitCtx.fillStyle = earthGradient;
      orbitCtx.fill();
      
      orbitCtx.fillStyle = "#88ddff";
      orbitCtx.font = "12px 'Exo 2'";
      orbitCtx.fillText("Earth", earthX-15, earthY-18);
      orbitCtx.fillStyle = "#ffaa66";
      orbitCtx.fillText("☀️ Sun", centerX-15, centerY-32);
      
      orbitCtx.fillStyle = "#ffffff88";
      orbitCtx.font = "10px 'Exo 2'";
      orbitCtx.fillText(`Orbital position: ${angleDeg}°`, 20, 30);
    }
    
    if (orbitSlider) {
      orbitSlider.addEventListener('input', (e) => {
        orbitAngle = parseInt(e.target.value);
        angleDisplay.textContent = orbitAngle + "°";
        drawOrbitSimulation(orbitAngle);
      });
    }
    drawOrbitSimulation(0);
  }
  
  // Accessibility Implementation
  const highBtn = document.getElementById('highContrastBtn');
  const fontBtn = document.getElementById('fontSizeBtn');
  const narrationBtn = document.getElementById('sectionNarrationBtn');
  const stopBtn = document.getElementById('stopNarration');
  const factsBtn = document.getElementById('factsNarrationBtn');
  const geologyBtn = document.getElementById('geologyNarrationBtn');
  let speechUtterance = null;
  
  if (highBtn) {
    highBtn.addEventListener('click', () => document.body.classList.toggle('high-contrast'));
  }
  
  if (fontBtn) {
    fontBtn.addEventListener('click', () => document.body.classList.toggle('large-font'));
  }
  
  function speakText(text) {
    if(speechUtterance) window.speechSynthesis.cancel();
    speechUtterance = new SpeechSynthesisUtterance(text);
    speechUtterance.rate = 0.9;
    speechUtterance.pitch = 1;
    window.speechSynthesis.speak(speechUtterance);
  }
  
  if (narrationBtn) {
    narrationBtn.addEventListener('click', () => {
      const content = document.querySelector('.container').innerText;
      speakText(content);
    });
  }
  
  if (factsBtn) {
    factsBtn.addEventListener('click', () => {
      const overview = document.getElementById('overview');
      if (overview) speakText(overview.innerText);
    });
  }
  
  if (geologyBtn) {
    geologyBtn.addEventListener('click', () => {
      const deepdive = document.getElementById('deepdive');
      if (deepdive) speakText(deepdive.innerText);
    });
  }
  
  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      window.speechSynthesis.cancel();
      speechUtterance = null;
    });
  }
  
  console.log('Earth page loaded - waiting for earth.png');
})();