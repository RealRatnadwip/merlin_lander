/**
 * MERLIN — A Falacy Labs Product
 * Multi-node Edge Runtime for Language-model Inference Networks
 * Vanilla JavaScript // Interactions, Canvas Network Simulation & Observables
 */

(function () {
  'use strict';

  // Check user motion and pointer preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  /* ── 1. Intersection Observer: Scroll Reveals ─────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal-item, .sep');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // Staggered reveal for Hero items on initial load
  window.addEventListener('DOMContentLoaded', () => {
    const initialElements = [
      { selector: '.hero-meta-top', delay: 100 },
      { selector: '.falcon-visual-wrap', delay: 250 },
      { selector: '.hero-title', delay: 400 },
      { selector: '.hero-subline', delay: 600 },
      { selector: '.hero-meta-bottom', delay: 800 },
      { selector: '#sep1', delay: 1000 }
    ];

    initialElements.forEach(({ selector, delay }) => {
      const el = document.querySelector(selector);
      if (el) {
        setTimeout(() => el.classList.add('visible'), delay);
      }
    });
  });

  /* ── 2. Fluid Custom Cursor (Desktop Pointer Only) ─────────────────────── */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (isFinePointer && cursorDot && cursorRing && !prefersReducedMotion) {
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let dotX = -100, dotY = -100;
    let isCursorActive = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isCursorActive) {
        isCursorActive = true;
        document.body.classList.add('cursor-active');
        ringX = mouseX;
        ringY = mouseY;
        dotX = mouseX;
        dotY = mouseY;
      }
    });

    document.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-active');
      isCursorActive = false;
    });

    // Hover effect over interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .statement-line, .title-char, .telemetry-card, .network-canvas-wrapper, .status-badge, .nav-statement, .strip-code'
    );
    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    function renderCursor() {
      if (isCursorActive) {
        // Fast snap for inner dot
        dotX += (mouseX - dotX) * 0.45;
        dotY += (mouseY - dotY) * 0.45;
        cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

        // Smooth spring for outer ring
        ringX += (mouseX - ringX) * 0.14;
        ringY += (mouseY - ringY) * 0.14;
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);
  }

  /* ── 3. Falcon Schematic Interactive Parallax (Desktop Only) ──────────── */
  const falconSvg = document.getElementById('falconSvg');
  const heroSection = document.getElementById('hero');

  if (falconSvg && heroSection && !prefersReducedMotion && isFinePointer) {
    let targetTiltX = 0, targetTiltY = 0;
    let currentTiltX = 0, currentTiltY = 0;

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normX = (e.clientX - centerX) / (rect.width / 2);
      const normY = (e.clientY - centerY) / (rect.height / 2);

      // Very subtle, quiet angles (-4 to +4 degrees)
      targetTiltX = -normY * 4.0;
      targetTiltY = normX * 4.0;
    });

    heroSection.addEventListener('mouseleave', () => {
      targetTiltX = 0;
      targetTiltY = 0;
    });

    function updateFalconTilt() {
      currentTiltX += (targetTiltX - currentTiltX) * 0.08;
      currentTiltY += (targetTiltY - currentTiltY) * 0.08;

      falconSvg.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
      requestAnimationFrame(updateFalconTilt);
    }
    requestAnimationFrame(updateFalconTilt);
  }

  /* ── 4. Decentralized Edge Network Canvas Simulation ───────────────────── */
  const canvas = document.getElementById('networkCanvas');
  const canvasWrap = document.getElementById('canvasContainer');

  if (canvas && canvasWrap) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    let nodes = [];
    let tokenPackets = [];
    let isCanvasVisible = false;
    let animFrameId = null;
    let packetSeq = 0;

    let mouse = {
      x: null,
      y: null,
      radius: 130,
      active: false
    };

    function isSimulatorEnabled() {
      // Disabled on mobile view (< 768px) or when hidden via CSS display: none
      return window.innerWidth > 768 && canvasWrap.offsetParent !== null;
    }

    function resizeCanvas() {
      if (!isSimulatorEnabled()) {
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
        isCanvasVisible = false;
        return;
      }

      const rect = canvasWrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;

      if (width <= 0 || height <= 0) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);

      initNodes();

      if (isCanvasVisible && !animFrameId && !prefersReducedMotion) {
        animFrameId = requestAnimationFrame(updateAndDraw);
      }
    }

    function initNodes() {
      nodes = [];
      tokenPackets = [];

      // Determine node density based on viewport area
      const area = width * height;
      const targetCount = Math.max(22, Math.min(55, Math.floor(area / 6500)));

      for (let i = 0; i < targetCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: 1.1 + Math.random() * 0.9,
          baseAlpha: 0.25 + Math.random() * 0.35,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.02
        });
      }
    }

    // Interactive mouse coordinates inside canvas
    canvasWrap.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    canvasWrap.addEventListener('mouseleave', () => {
      mouse.active = false;
      mouse.x = null;
      mouse.y = null;
    });

    function spawnTokenPacket(fromNode, toNode) {
      if (tokenPackets.length < 9 && Math.random() < 0.014) {
        packetSeq++;
        tokenPackets.push({
          id: packetSeq,
          from: fromNode,
          to: toNode,
          progress: 0,
          speed: 0.008 + Math.random() * 0.008
        });
      }
    }

    function updateAndDraw() {
      if (!isSimulatorEnabled()) {
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const maxDist = Math.min(130, width * 0.35);
      const maxDistSq = maxDist * maxDist;

      // 1. Draw connection links between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        const na = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nb = nodes[j];
          const dx = nb.x - na.x;
          const dy = nb.y - na.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxDist) * 0.16;

            ctx.beginPath();
            ctx.strokeStyle = `rgba(234, 234, 234, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.65;
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);
            ctx.stroke();

            // Opportunity to trigger an inference token pulse
            if (!prefersReducedMotion) {
              spawnTokenPacket(na, nb);
            }
          }
        }

        // Draw connections to mouse cursor if active
        if (mouse.active && mouse.x !== null) {
          const mdx = mouse.x - na.x;
          const mdy = mouse.y - na.y;
          const mDistSq = mdx * mdx + mdy * mdy;
          const mouseRadiusSq = mouse.radius * mouse.radius;

          if (mDistSq < mouseRadiusSq) {
            const mDist = Math.sqrt(mDistSq);
            const mAlpha = (1 - mDist / mouse.radius) * 0.32;

            ctx.beginPath();
            ctx.strokeStyle = `rgba(184, 146, 204, ${mAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.85;
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            // Gentle repulsion/attraction force
            const force = (1 - mDist / mouse.radius) * 0.15;
            na.x -= (mdx / mDist) * force;
            na.y -= (mdy / mDist) * force;
          }
        }
      }

      // 2. Draw token packets (flowing computation with #745482 amethyst luminescence)
      if (!prefersReducedMotion) {
        for (let k = tokenPackets.length - 1; k >= 0; k--) {
          const p = tokenPackets[k];
          p.progress += p.speed;

          if (p.progress >= 1) {
            tokenPackets.splice(k, 1);
            continue;
          }

          const curX = p.from.x + (p.to.x - p.from.x) * p.progress;
          const curY = p.from.y + (p.to.y - p.from.y) * p.progress;
          const packetAlpha = Math.sin(p.progress * Math.PI) * 0.85;

          ctx.beginPath();
          ctx.arc(curX, curY, 1.6, 0, Math.PI * 2);
          
          // Twilight amethyst tint on alternating packets with subtle glow
          if (p.id % 3 !== 0) {
            ctx.fillStyle = `rgba(195, 158, 220, ${packetAlpha.toFixed(2)})`;
            ctx.shadowColor = 'rgba(116, 84, 130, 0.7)';
            ctx.shadowBlur = 5;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${packetAlpha.toFixed(2)})`;
            ctx.shadowBlur = 0;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // 3. Update & Draw individual nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          // Soft boundary bounce
          if (node.x < 10) { node.x = 10; node.vx *= -1; }
          else if (node.x > width - 10) { node.x = width - 10; node.vx *= -1; }

          if (node.y < 10) { node.y = 10; node.vy *= -1; }
          else if (node.y > height - 10) { node.y = height - 10; node.vy *= -1; }

          node.pulse += node.pulseSpeed;
        }

        const alphaPulse = node.baseAlpha + Math.sin(node.pulse) * 0.12;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234, 234, 234, ${Math.max(0.1, alphaPulse).toFixed(2)})`;
        ctx.fill();
      }

      if (isCanvasVisible && !prefersReducedMotion && isSimulatorEnabled()) {
        animFrameId = requestAnimationFrame(updateAndDraw);
      }
    }

    // Only run animation when canvas container is in viewport to conserve power
    if ('IntersectionObserver' in window) {
      const canvasObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && isSimulatorEnabled()) {
              isCanvasVisible = true;
              if (!animFrameId && !prefersReducedMotion) {
                animFrameId = requestAnimationFrame(updateAndDraw);
              }
            } else {
              isCanvasVisible = false;
              if (animFrameId) {
                cancelAnimationFrame(animFrameId);
                animFrameId = null;
              }
            }
          });
        },
        { threshold: 0.05 }
      );
      canvasObserver.observe(canvasWrap);
    } else {
      if (isSimulatorEnabled()) {
        isCanvasVisible = true;
        requestAnimationFrame(updateAndDraw);
      }
    }

    // Initial setup and resize listener
    resizeCanvas();
    window.addEventListener('resize', () => {
      clearTimeout(window._resizeTimer);
      window._resizeTimer = setTimeout(resizeCanvas, 150);
    });
  }

  /* ── 5. Console Greeting (Editorial Whisper) ───────────────────────────── */
  console.log(
    '%c MERLIN %c A FALACY LABS PRODUCT %c\n Maybe Everything Remains, Long In Nostalgia\n Falco columbarius // Intelligence, without a centre.',
    'background: #745482; color: #FFFFFF; font-weight: bold; padding: 2px 6px; font-family: monospace;',
    'background: #1A1A1A; color: #888888; padding: 2px 6px; font-family: monospace;',
    'color: #B892CC; font-style: italic; font-family: sans-serif;'
  );

})();
