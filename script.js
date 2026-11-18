/* ========================================================
   CYBERNETIC PORTFOLIO INTERACTIVE CORE
   Engineered for Sujit Bidwe
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================
  // 1. WEB AUDIO API SYNTHESIZER (NO EXTERNAL AUDIO FILES)
  // ========================================================
  let audioContext = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
    }
  }

  function playHoverSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (audioContext.state === 'suspended') audioContext.resume();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioContext.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, audioContext.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.02, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.start();
      osc.stop(audioContext.currentTime + 0.05);
    } catch(e) {}
  }

  function playClickSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (audioContext.state === 'suspended') audioContext.resume();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.08, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.start();
      osc.stop(audioContext.currentTime + 0.09);
    } catch(e) {}
  }

  function playTerminalSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (audioContext.state === 'suspended') audioContext.resume();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, audioContext.currentTime);
      osc.frequency.setValueAtTime(1040, audioContext.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.04, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.start();
      osc.stop(audioContext.currentTime + 0.11);
    } catch(e) {}
  }

  // Audio Toggle Switch
  const audioBtn = document.getElementById('audio-toggle');
  const audioText = document.getElementById('audio-text');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        audioBtn.classList.remove('audio-muted');
        audioText.textContent = 'SFX: ON';
        playClickSound();
      } else {
        audioBtn.classList.add('audio-muted');
        audioText.textContent = 'SFX: OFF';
      }
    });
  }


  // ========================================================
  // 2. ULTRA-SMOOTH CUSTOM CURSOR & SHOCKWAVE PHYSICS
  // ========================================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const cursorLabel = document.getElementById('cursor-label');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  // Lerp smoothing loop for cursor ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;

    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Click shockwave
  window.addEventListener('click', (e) => {
    playClickSound();
    const wave = document.createElement('div');
    wave.className = 'click-shockwave';
    wave.style.left = `${e.clientX}px`;
    wave.style.top = `${e.clientY}px`;
    document.body.appendChild(wave);
    setTimeout(() => wave.remove(), 600);
  });

  // Interactive Hover Targets for Cursor
  const interactiveElements = document.querySelectorAll(
    'a, button, [data-cursor], .cyber-card, input, textarea, pre'
  );

  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      playHoverSound();
      cursorRing?.classList.add('hover-active');
      const label = el.getAttribute('data-cursor') || 'VIEW';
      if (cursorLabel) cursorLabel.textContent = label;
    });

    el.addEventListener('mouseleave', () => {
      cursorRing?.classList.remove('hover-active');
      if (cursorLabel) cursorLabel.textContent = '';
    });
  });


  // ========================================================
  // 3. INTERACTIVE 3D CARD TILT & SPECULAR GLARE
  // ========================================================
  const cards = document.querySelectorAll('.cyber-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });


  // ========================================================
  // 4. NEURAL PARTICLE BACKGROUND CANVAS
  // ========================================================
  const canvas = document.getElementById('neural-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 15), 75);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.8 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(0, 245, 255,' : 'rgba(168, 85, 247,'
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Interaction with mouse cursor
        const dxMouse = mouseX - p.x;
        const dyMouse = mouseY - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 120) {
          p.x -= (dxMouse / distMouse) * 1.5;
          p.y -= (dyMouse / distMouse) * 1.5;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '0.7)';
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 245, 255, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }


  // ========================================================
  // 5. MATRIX / SCRAMBLE TEXT EFFECT
  // ========================================================
  const scrambleElements = document.querySelectorAll('.text-scramble');
  const chars = '!<>-_\\/[]{}—=+*^?#________0101';

  function scramble(element) {
    const originalText = element.getAttribute('data-value') || element.textContent;
    let iteration = 0;
    clearInterval(element.scrambleInterval);

    element.scrambleInterval = setInterval(() => {
      element.textContent = originalText
        .split('')
        .map((char, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= originalText.length) {
        clearInterval(element.scrambleInterval);
      }
      iteration += 1 / 2;
    }, 30);
  }

  scrambleElements.forEach((el) => {
    scramble(el);
    el.addEventListener('mouseenter', () => scramble(el));
  });


  // ========================================================
  // 6. INTERACTIVE HUD TERMINAL CLI
  // ========================================================
  const terminalModal = document.getElementById('terminal-modal');
  const terminalTrigger = document.getElementById('terminal-trigger');
  const closeTerminalBtn = document.getElementById('close-terminal-btn');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');

  function openTerminal() {
    playTerminalSound();
    terminalModal.classList.remove('hidden');
    terminalModal.classList.add('flex');
    terminalInput?.focus();
  }

  function closeTerminal() {
    terminalModal.classList.add('hidden');
    terminalModal.classList.remove('flex');
  }

  if (terminalTrigger) terminalTrigger.addEventListener('click', openTerminal);
  if (closeTerminalBtn) closeTerminalBtn.addEventListener('click', closeTerminal);

  window.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '~') {
      e.preventDefault();
      if (terminalModal.classList.contains('hidden')) {
        openTerminal();
      } else {
        closeTerminal();
      }
    }
    if (e.key === 'Escape' && !terminalModal.classList.contains('hidden')) {
      closeTerminal();
    }
  });

  const commands = {
    help: `Available commands:
  • <span class="text-cyan-400">skills</span>      - List categorized tactical tech stack
  • <span class="text-cyan-400">projects</span>    - List flagship software deployments
  • <span class="text-cyan-400">bio</span>         - Output profile background & credentials
  • <span class="text-cyan-400">contact</span>     - Output communication endpoints
  • <span class="text-cyan-400">sudo hire</span>   - Executive authorization sequence
  • <span class="text-cyan-400">clear</span>       - Clear terminal window
  • <span class="text-cyan-400">exit</span>        - Close terminal HUD`,

    skills: `<span class="text-purple-400">[BACKEND]:</span> Java, Spring Boot, Node.js, Express, C++, C# (.NET), Hibernate
<span class="text-cyan-400">[FRONTEND]:</span> React.js, JavaScript (ES6+), Tailwind CSS, 3D CSS, Next.js
<span class="text-emerald-400">[AI &amp; DB]:</span> Google Gemini Vision AI, NLP, MySQL, MongoDB, PostgreSQL, Docker`,

    projects: `1. <span class="text-cyan-400">MediCard</span>: Universal Health Card &amp; Gemini Multimodal AI Companion (HL7 FHIR)
2. <span class="text-purple-400">AI ERP Platform</span>: Spring Boot, React, NLP Automatic Note Summarization
3. <span class="text-emerald-400">Enterprise RBAC</span>: Spring Boot + React Role-Based Access Control System`,

    bio: `Candidate: Sujit Bidwe
Station: C-DAC Bangalore (PG-CPAC: Advanced Computing 2026-2027)
Degree: B.Tech CSE (2022-2026) | CGPA: 7.53
Focus: Enterprise software systems, zero-trust architectures, and generative AI.`,

    contact: `Email: sujitbidwe1010@gmail.com
Phone: +91 9022644012
LinkedIn: https://linkedin.com/in/sujeet-bidwe
GitHub: https://github.com/SujitBidwe`,

    'sudo hire': `<span class="text-emerald-400 font-bold">[ACCESS GRANTED]</span> Welcome aboard!
Launching mail client for sujitbidwe1010@gmail.com...`
  };

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';

        const cmdLine = document.createElement('div');
        cmdLine.innerHTML = `<span class="text-cyan-400 font-bold">guest@sujit-portfolio:~$</span> ${val}`;
        terminalOutput.appendChild(cmdLine);

        if (val === 'clear') {
          terminalOutput.innerHTML = '';
        } else if (val === 'exit') {
          closeTerminal();
        } else if (val === 'sudo hire') {
          const resp = document.createElement('div');
          resp.innerHTML = commands['sudo hire'];
          terminalOutput.appendChild(resp);
          setTimeout(() => {
            window.location.href = 'mailto:sujitbidwe1010@gmail.com?subject=Job%20Opportunity%20//%20Collaboration';
          }, 1200);
        } else if (commands[val]) {
          const resp = document.createElement('div');
          resp.className = 'text-slate-300 leading-relaxed';
          resp.innerHTML = commands[val];
          terminalOutput.appendChild(resp);
        } else if (val !== '') {
          const resp = document.createElement('div');
          resp.className = 'text-red-400';
          resp.innerHTML = `command not found: "${val}". Type <span class="text-white font-bold">'help'</span> for manual.`;
          terminalOutput.appendChild(resp);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }
    });
  }


  // ========================================================
  // 7. ONE-CLICK COPY TELEMETRY & CONTACT FORM
  // ========================================================
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        const originalText = btn.textContent;
        btn.textContent = 'COPIED!';
        btn.classList.add('bg-emerald-500', 'text-black');
        playClickSound();

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('bg-emerald-500', 'text-black');
        }, 1800);
      }
    });
  });

  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playTerminalSound();
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        submitBtn.innerHTML = '<span>PACKET TRANSMITTED &check;</span>';
        submitBtn.classList.remove('bg-cyan-500');
        submitBtn.classList.add('bg-emerald-500');
      }
      if (formFeedback) {
        formFeedback.classList.remove('hidden');
      }
      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = '<span>TRANSMIT PACKET &rarr;</span>';
          submitBtn.classList.add('bg-cyan-500');
          submitBtn.classList.remove('bg-emerald-500');
        }
        if (formFeedback) {
          formFeedback.classList.add('hidden');
        }
      }, 4500);
    });
  }

});

