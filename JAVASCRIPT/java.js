(function() {
  // -------------------- STARFIELD CANVAS --------------------
  const canvas = document.getElementById('galaxy-canvas');
  let ctx = canvas.getContext('2d');
  let stars = [];
  
  function initStars() {
    stars = [];
    for(let i = 0; i < 500; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.3 + 0.1,
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }
  
  function drawStars() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#03030f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for(let s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      const twinkleAlpha = s.alpha + Math.sin(s.twinkle) * 0.2;
      ctx.fillStyle = `rgba(255, 240, 200, ${Math.max(0.1, twinkleAlpha)})`;
      ctx.fill();
      s.y += s.speed;
      s.twinkle += 0.03;
      if(s.y > canvas.height) s.y = 0;
    }
    requestAnimationFrame(drawStars);
  }
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  initStars();
  drawStars();

  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.querySelector('.main-nav');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }

  // -------------------- PLANETS with ROTATING PNGs --------------------
  const imageFolderPath = "images/";
  console.log("Looking for images in folder: " + imageFolderPath);
  
  const planetsData = [
    { name: "Mercury", desc: "Smallest & fastest planet, extreme temperatures from -173°C to 427°C.", png: imageFolderPath + "mercury.png", fact: "A year on Mercury is just 88 Earth days!", link: "mercury.html" },
    { name: "Venus", desc: "Thick toxic atmosphere, hottest planet with surface temps of 475°C.", png: imageFolderPath + "venus.png", fact: "Venus rotates backwards compared to other planets.", link: "venus.html" },
    { name: "Earth", desc: "Our home, unique life & vast oceans. The only known habitable planet.", png: imageFolderPath + "earth.png", fact: "Earth is the densest planet in the solar system.", link: "earth.html" },
    { name: "Mars", desc: "The Red Planet, home to Olympus Mons, the tallest volcano.", png: imageFolderPath + "mars.png", fact: "." },
    { name: "Jupiter", desc: "Gas giant with the Great Red Spot - a storm bigger than Earth.", png: imageFolderPath + "jupiter.png", fact: "." },
    { name: "Saturn", desc: "Famous rings made of ice and rock, stunning through any telescope.", png: imageFolderPath + "saturn.png", fact: "." },
    { name: "Uranus", desc: "An icy giant that rotates on its side.", png: imageFolderPath + "uranus.png", fact: "." },
    { name: "Neptune", desc: "A cold, windy planet farthest from the Sun.", png: imageFolderPath + "neptune.png", fact: "." }
  ];
  
  const planetsGrid = document.getElementById('planetsGrid');
  if (planetsGrid) {
    planetsData.forEach(p => {
      const card = document.createElement('div');
      card.className = 'planet-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Learn about planet ${p.name}`);
      
      // Create image element with error handling
      const img = document.createElement('img');
      img.alt = p.name;
      img.className = 'planet-img';
      img.style.width = '120px';
      img.style.height = '120px';
      img.style.objectFit = 'contain';
      
      img.src = p.png;
      
      card.innerHTML = `
        <div class="planet-image-container">
        </div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <small style="color: var(--glow-accent);">${p.fact}</small>
      `;
      
      // Add the image to the container
      const container = card.querySelector('.planet-image-container');
      if (container) {
        container.appendChild(img);
      }
      
      if(p.link) {
        card.addEventListener('click', () => {
          window.location.href = p.link;
        });
      } else {
        card.addEventListener('click', () => {
          alert(`${p.name}\n${p.desc}\n\nFun fact: ${p.fact}\n\nVisit BigPlanetarium in Bristol to learn more!`);
        });
      }
      planetsGrid.appendChild(card);
    });
  }

  // Orbit Simulation
  const orbitCanvas = document.getElementById('orbitSim');
  if(orbitCanvas) {
    const orbitCtx = orbitCanvas.getContext('2d');
    let angle = 0;
    let speed = 0.01;
    const speedSlider = document.getElementById('orbitSpeed');
    orbitCanvas.width = 500;
    orbitCanvas.height = 300;
    
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => { speed = parseFloat(e.target.value); });
    }
    
    function drawOrbit() {
      if(!orbitCanvas || !orbitCtx) return;
      orbitCtx.clearRect(0, 0, orbitCanvas.width, orbitCanvas.height);
      orbitCtx.fillStyle = "#010018";
      orbitCtx.fillRect(0, 0, orbitCanvas.width, orbitCanvas.height);
      
      const centerX = orbitCanvas.width/2, centerY = orbitCanvas.height/2;
      
      orbitCtx.beginPath();
      orbitCtx.arc(centerX, centerY, 28, 0, Math.PI*2);
      orbitCtx.fillStyle = "#ffcc44";
      orbitCtx.shadowBlur = 15;
      orbitCtx.fill();
      
      const planetX = centerX + Math.cos(angle) * 110;
      const planetY = centerY + Math.sin(angle) * 80;
      orbitCtx.beginPath();
      orbitCtx.arc(planetX, planetY, 13, 0, Math.PI*2);
      orbitCtx.fillStyle = "#3a86ff";
      orbitCtx.fill();
      
      orbitCtx.strokeStyle = "#0ff";
      orbitCtx.lineWidth = 1.5;
      orbitCtx.beginPath();
      orbitCtx.ellipse(centerX, centerY, 110, 80, 0, 0, Math.PI*2);
      orbitCtx.stroke();
      
      angle += speed;
      requestAnimationFrame(drawOrbit);
    }
    drawOrbit();
  }

  // -------------------- ASTEROID SHOOTER GAME --------------------
  const gameCanvas = document.getElementById('gameCanvas');
  if(gameCanvas) {
    const gCtx = gameCanvas.getContext('2d');
    
    gameCanvas.width = 900;
    gameCanvas.height = 550;
    
    let score = 0;
    let lives = 3;
    let level = 1;
    let gameRunning = false;
    let asteroidSpawnInterval = null;
    
    let spaceship = {
      x: gameCanvas.width / 2 - 20,
      y: gameCanvas.height - 80,
      width: 40,
      height: 40,
      speed: 7
    };
    
    let bullets = [];
    let bulletCooldown = 0;
    const bulletCooldownMax = 10;
    let asteroids = [];
    let explosions = [];
    
    let keys = {
      ArrowLeft: false,
      ArrowRight: false,
      Space: false,
      ArrowUp: false
    };
    
    let soundMuted = false;
    
    function playShootSound() {
      if(soundMuted || !gameRunning) return;
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 880;
        gainNode.gain.value = 0.08;
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.15);
        oscillator.stop(audioCtx.currentTime + 0.15);
        setTimeout(() => audioCtx.close(), 200);
      } catch(e) {}
    }
    
    function playExplosionSound() {
      if(soundMuted || !gameRunning) return;
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 150;
        gainNode.gain.value = 0.1;
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.2);
        oscillator.stop(audioCtx.currentTime + 0.2);
        setTimeout(() => audioCtx.close(), 200);
      } catch(e) {}
    }
    
    function playHitSound() {
      if(soundMuted || !gameRunning) return;
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 440;
        gainNode.gain.value = 0.05;
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
        oscillator.stop(audioCtx.currentTime + 0.1);
        setTimeout(() => audioCtx.close(), 200);
      } catch(e) {}
    }
    
    function spawnAsteroid() {
      if (!gameRunning) return;
      const size = Math.random() * 25 + 15;
      asteroids.push({
        x: Math.random() * (gameCanvas.width - 60) + 30,
        y: -size,
        width: size,
        height: size,
        speedX: (Math.random() - 0.5) * (1.5 + level * 0.2),
        speedY: Math.random() * 3 + 2 + level * 0.4,
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 0.08
      });
    }
    
    function createExplosion(x, y) {
      for(let i = 0; i < 12; i++) {
        explosions.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 1,
          size: Math.random() * 4 + 2
        });
      }
      playExplosionSound();
    }
    
    function drawSpaceship() {
      gCtx.save();
      gCtx.shadowBlur = 12;
      gCtx.shadowColor = '#0ff';
      
      const flicker = Math.sin(Date.now() * 0.02) * 3;
      gCtx.fillStyle = '#ff6600';
      gCtx.beginPath();
      gCtx.moveTo(spaceship.x + spaceship.width/2, spaceship.y + spaceship.height - 5);
      gCtx.lineTo(spaceship.x + spaceship.width/2 - 8, spaceship.y + spaceship.height + 8 + flicker);
      gCtx.lineTo(spaceship.x + spaceship.width/2, spaceship.y + spaceship.height + 3);
      gCtx.lineTo(spaceship.x + spaceship.width/2 + 8, spaceship.y + spaceship.height + 8 + flicker);
      gCtx.fill();
      
      gCtx.fillStyle = '#33ccff';
      gCtx.beginPath();
      gCtx.moveTo(spaceship.x + spaceship.width/2, spaceship.y - 8);
      gCtx.lineTo(spaceship.x + spaceship.width - 8, spaceship.y + spaceship.height - 12);
      gCtx.lineTo(spaceship.x + spaceship.width/2, spaceship.y + spaceship.height - 5);
      gCtx.lineTo(spaceship.x + 8, spaceship.y + spaceship.height - 12);
      gCtx.fill();
      
      gCtx.fillStyle = '#00aaff';
      gCtx.fillRect(spaceship.x + 5, spaceship.y, spaceship.width - 10, spaceship.height - 12);
      
      gCtx.fillStyle = '#88ddff';
      gCtx.beginPath();
      gCtx.arc(spaceship.x + spaceship.width/2, spaceship.y + 12, 9, 0, Math.PI * 2);
      gCtx.fill();
      
      gCtx.fillStyle = '#2266aa';
      gCtx.beginPath();
      gCtx.arc(spaceship.x + spaceship.width/2, spaceship.y + 12, 5, 0, Math.PI * 2);
      gCtx.fill();
      
      gCtx.fillStyle = '#33ccff';
      gCtx.beginPath();
      gCtx.moveTo(spaceship.x + 5, spaceship.y + spaceship.height - 20);
      gCtx.lineTo(spaceship.x - 8, spaceship.y + spaceship.height - 5);
      gCtx.lineTo(spaceship.x + 5, spaceship.y + spaceship.height - 8);
      gCtx.fill();
      
      gCtx.beginPath();
      gCtx.moveTo(spaceship.x + spaceship.width - 5, spaceship.y + spaceship.height - 20);
      gCtx.lineTo(spaceship.x + spaceship.width + 8, spaceship.y + spaceship.height - 5);
      gCtx.lineTo(spaceship.x + spaceship.width - 5, spaceship.y + spaceship.height - 8);
      gCtx.fill();
      
      gCtx.restore();
    }
    
    function drawAsteroid(a) {
      gCtx.save();
      gCtx.translate(a.x + a.width/2, a.y + a.height/2);
      gCtx.rotate(a.rotation);
      gCtx.fillStyle = '#8B7355';
      gCtx.shadowBlur = 8;
      gCtx.shadowColor = '#ff8844';
      
      gCtx.beginPath();
      gCtx.ellipse(0, 0, a.width/2, a.height/2, 0, 0, Math.PI * 2);
      gCtx.fill();
      
      gCtx.fillStyle = '#6B5335';
      for(let i = 0; i < 5; i++) {
        gCtx.beginPath();
        gCtx.ellipse(-a.width/4 + Math.sin(i) * a.width/6, -a.height/4 + Math.cos(i) 
        * a.height/6, a.width/8, a.height/8, 0, 0, Math.PI * 2);
        gCtx.fill();
      }
      gCtx.restore();
    }
    
    function drawBullet(b) {
      gCtx.fillStyle = '#ffff00';
      gCtx.shadowBlur = 8;
      gCtx.shadowColor = '#ffff00';
      gCtx.fillRect(b.x, b.y, 4, 10);
      gCtx.fillStyle = '#ffaa00';
      gCtx.fillRect(b.x + 1, b.y, 2, 10);
    }
    
    function updateGame() {
      if (!gameRunning) return;
      
      if(keys.ArrowLeft && spaceship.x > 5) spaceship.x -= spaceship.speed;
      if(keys.ArrowRight && spaceship.x < gameCanvas.width - spaceship.width - 5) spaceship.x += spaceship.speed;
      
      if((keys.Space || keys.ArrowUp) && bulletCooldown <= 0) {
        bullets.push({
          x: spaceship.x + spaceship.width/2 - 2,
          y: spaceship.y - 5,
          width: 4,
          height: 10
        });
        bulletCooldown = bulletCooldownMax;
        playShootSound();
      }
      if(bulletCooldown > 0) bulletCooldown--;
      
      for(let i = 0; i < bullets.length; i++) {
        bullets[i].y -= 8;
        if(bullets[i].y < 0) bullets.splice(i, 1);
      }
      
      for(let a of asteroids) {
        a.x += a.speedX;
        a.y += a.speedY;
        a.rotation += a.rotSpeed;
        
        if(a.x + a.width < 0) a.x = gameCanvas.width;
        if(a.x > gameCanvas.width) a.x = -a.width;
      }
      
      for(let i = 0; i < bullets.length; i++) {
        for(let j = 0; j < asteroids.length; j++) {
          const b = bullets[i];
          const a = asteroids[j];
          if(b.x < a.x + a.width && b.x + b.width > a.x &&
             b.y < a.y + a.height && b.y + b.height > a.y) {
            bullets.splice(i, 1);
            asteroids.splice(j, 1);
            score += 10;
            playHitSound();
            createExplosion(a.x + a.width/2, a.y + a.height/2);
            updateUI();
            i--;
            break;
          }
        }
      }
      
      for(let i = 0; i < asteroids.length; i++) {
        const a = asteroids[i];
        if(spaceship.x < a.x + a.width && spaceship.x + spaceship.width > a.x &&
           spaceship.y < a.y + a.height && spaceship.y + spaceship.height > a.y) {
          asteroids.splice(i, 1);
          lives--;
          createExplosion(spaceship.x + spaceship.width/2, spaceship.y + spaceship.height/2);
          updateUI();
          
          if(lives <= 0) {
            gameRunning = false;
            if(asteroidSpawnInterval) clearInterval(asteroidSpawnInterval);
          }
          i--;
        }
      }
      
      const newLevel = Math.floor(score / 100) + 1;
      if(newLevel > level) {
        level = newLevel;
        updateUI();
        if(asteroidSpawnInterval) {
          clearInterval(asteroidSpawnInterval);
          const spawnDelay = Math.max(400, 800 - level * 30);
          asteroidSpawnInterval = setInterval(spawnAsteroid, spawnDelay);
        }
      }
      
      for(let i = 0; i < explosions.length; i++) {
        explosions[i].x += explosions[i].vx;
        explosions[i].y += explosions[i].vy;
        explosions[i].life -= 0.03;
        if(explosions[i].life <= 0) explosions.splice(i, 1);
      }
    }
    
    function drawExplosions() {
      for(let e of explosions) {
        gCtx.fillStyle = `rgba(255, 100, 0, ${e.life})`;
        gCtx.fillRect(e.x, e.y, e.size, e.size);
      }
    }
    
    function drawUI() {
      gCtx.font = "bold 20px 'Orbitron'";
      gCtx.fillStyle = '#0ff';
      gCtx.shadowBlur = 5;
      gCtx.fillText(`SCORE: ${score}`, 20, 40);
      gCtx.fillText(`LIVES: ${lives}`, 20, 75);
      gCtx.fillText(`LEVEL: ${level}`, 20, 110);
      
      if(gameRunning) {
        gCtx.beginPath();
        gCtx.moveTo(spaceship.x + spaceship.width/2, spaceship.y - 15);
        gCtx.lineTo(spaceship.x + spaceship.width/2, spaceship.y - 5);
        gCtx.moveTo(spaceship.x + spaceship.width/2 - 5, spaceship.y - 10);
        gCtx.lineTo(spaceship.x + spaceship.width/2 + 5, spaceship.y - 10);
        gCtx.strokeStyle = '#ff3366';
        gCtx.lineWidth = 2;
        gCtx.stroke();
      }
    }
    
    function updateUI() {
      const scoreEl = document.getElementById('scoreValue');
      const livesEl = document.getElementById('livesValue');
      const levelEl = document.getElementById('levelValue');
      if(scoreEl) scoreEl.textContent = score;
      if(livesEl) livesEl.textContent = lives;
      if(levelEl) levelEl.textContent = level;
    }
    
    function draw() {
      if (!gCtx) return;
      
      gCtx.fillStyle = 'rgba(0, 0, 20, 0.3)';
      gCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
      
      for(let i = 0; i < 150; i++) {
        gCtx.fillStyle = `rgba(255,255,200,${Math.random() * 0.5})`;
        gCtx.fillRect(Math.random() * gameCanvas.width, Math.random() * gameCanvas.height, 1, 1);
      }
      
      for(let a of asteroids) drawAsteroid(a);
      for(let b of bullets) drawBullet(b);
      drawSpaceship();
      drawExplosions();
      drawUI();
      
      if(!gameRunning) {
        gCtx.font = "bold 36px 'Orbitron'";
        gCtx.fillStyle = '#ffcc00';
        gCtx.shadowBlur = 15;
        gCtx.textAlign = 'center';
        gCtx.fillText('⚡ PRESS START ⚡', gameCanvas.width/2, gameCanvas.height/2 - 40);
        gCtx.font = "18px 'Exo 2'";
        gCtx.fillStyle = '#0ff';
        gCtx.fillText('Click START GAME to defend Earth!', gameCanvas.width/2, gameCanvas.height/2 + 20);
        gCtx.font = "14px 'Exo 2'";
        gCtx.fillStyle = '#aaa';
        gCtx.fillText('← → arrows to move | SPACE or ↑ to shoot', gameCanvas.width/2, gameCanvas.height/2 + 60);
        gCtx.textAlign = 'left';
      }
    }
    
    function gameLoop() {
      updateGame();
      draw();
      requestAnimationFrame(gameLoop);
    }
    
    function startGame() {
      if (gameRunning) return;
      
      gameRunning = true;
      score = 0;
      lives = 3;
      level = 1;
      bullets = [];
      asteroids = [];
      explosions = [];
      spaceship.x = gameCanvas.width / 2 - 20;
      bulletCooldown = 0;
      
      if(asteroidSpawnInterval) clearInterval(asteroidSpawnInterval);
      asteroidSpawnInterval = setInterval(spawnAsteroid, 700);
      
      updateUI();
      
      const startBtn = document.getElementById('startGameBtn');
      if (startBtn) startBtn.textContent = '🎮 GAME IN PROGRESS';
    }
    
    window.addEventListener('keydown', (e) => {
      if(!gameRunning) return;
      if(e.key === 'ArrowLeft') keys.ArrowLeft = true;
      if(e.key === 'ArrowRight') keys.ArrowRight = true;
      if(e.key === ' ') {
        keys.Space = true;
        e.preventDefault();
      }
      if(e.key === 'ArrowUp') {
        keys.ArrowUp = true;
        e.preventDefault();
      }
    });
    
    window.addEventListener('keyup', (e) => {
      if(e.key === 'ArrowLeft') keys.ArrowLeft = false;
      if(e.key === 'ArrowRight') keys.ArrowRight = false;
      if(e.key === ' ') keys.Space = false;
      if(e.key === 'ArrowUp') keys.ArrowUp = false;
    });
    
    function restartGame() {
      startGame();
    }
    
    const muteBtn = document.getElementById('muteSound');
    if(muteBtn) {
      muteBtn.addEventListener('click', () => {
        soundMuted = !soundMuted;
        muteBtn.textContent = soundMuted ? "🔇 Sound OFF" : "🔊 Sound ON";
      });
    }
    
    const startBtn = document.getElementById('startGameBtn');
    if(startBtn) {
      startBtn.addEventListener('click', () => {
        startGame();
      });
    }
    
    const restartBtn = document.getElementById('restartGameBtn');
    if(restartBtn) {
      restartBtn.addEventListener('click', () => {
        restartGame();
      });
    }
    
    gameLoop();
  }

  // -------------------- ACCESSIBILITY FEATURES --------------------
  const highBtn = document.getElementById('highContrastBtn');
  const fontBtn = document.getElementById('fontSizeBtn');
  let currentUtterance = null;
  
  if (highBtn) {
    highBtn.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
    });
  }
  
  if (fontBtn) {
    fontBtn.addEventListener('click', () => {
      document.body.classList.toggle('large-font');
    });
  }
  
  const exploreBtn = document.getElementById('exploreBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      const overview = document.getElementById('overview');
      if (overview) overview.scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  console.log('Landing page loaded - checking for images in folder: ' + imageFolderPath);
})();