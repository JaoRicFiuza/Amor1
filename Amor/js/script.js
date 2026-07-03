document.addEventListener('DOMContentLoaded', () => {

  /* =======================================================
     CONFIGURAÇÕES — mude só o que está aqui embaixo 👇
     ======================================================= */
  const CONFIG = {
    // Data em que vocês começaram (AAAA-MM-DD). Usada no contador.
    dataInicio: '2022-09-03T00:00:00',

    // Seu número com DDI + DDD, só números:
    whatsapp: '5531988964942',

    // Mensagem que chega no seu WhatsApp quando ela clicar em "Sim":
    mensagemSim: 'Sim! Eu quero sair com você! ❤️',

    // (Opcional) Link direto de um .mp3 pra tocar de fundo.
    // Deixe '' pra não mostrar o botão de música.
    musicaUrl: '',
  };
  /* ======================================================= */

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const preloader = document.getElementById('preloader');

  const revealAll = () =>
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));

  const finishLoading = () => {
    preloader && preloader.classList.add('hidden');
    document.body.classList.add('loaded');
  };

  try {
    /* ---------- Preloader ---------- */
    window.addEventListener('load', () => setTimeout(finishLoading, 800));
    setTimeout(finishLoading, 3500); // rede de segurança

    /* ---------- Revelar ao rolar (feito primeiro, à prova de falhas) ---------- */
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    } else {
      revealAll();
    }

    // atraso escalonado (efeito cascata) em grupos de fotos/momentos
    const stagger = (selector, step) =>
      document.querySelectorAll(selector).forEach((el, i) =>
        el.style.setProperty('--d', (i * step) + 's'));
    stagger('.gallery-item', 0.05);
    stagger('.tl-item', 0.08);
    stagger('.count-box', 0.08);

    /* ---------- Rolagem suave (Lenis) ---------- */
    let lenis = null;
    if (typeof Lenis !== 'undefined' && !reduceMotion) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        if (typeof gsap !== 'undefined') gsap.ticker.lagSmoothing(0);
      }
    }

    // navegação suave dos links do menu
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: -70 });
        else target.scrollIntoView({ behavior: 'smooth' });
      });
    });

    /* ---------- Header + barra de progresso ---------- */
    const header = document.getElementById('header');
    const progress = document.getElementById('progress');
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      header && header.classList.toggle('scrolled', y > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Corações flutuantes de fundo ---------- */
    const canvas = document.getElementById('hearts-canvas');
    if (canvas && !reduceMotion) {
      const ctx = canvas.getContext('2d');
      let W, H;
      const hearts = [];
      const colors = ['rgba(243,138,160,', 'rgba(236,182,83,', 'rgba(224,100,127,'];
      const resize = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
      resize();
      window.addEventListener('resize', resize);
      const make = (spread) => ({
        x: Math.random() * W,
        y: spread ? Math.random() * H : H + 20,
        s: 6 + Math.random() * 14,
        sp: 0.4 + Math.random() * 1.1,
        sway: Math.random() * Math.PI * 2,
        a: 0.12 + Math.random() * 0.38,
        c: colors[(Math.random() * colors.length) | 0],
      });
      for (let i = 0; i < 22; i++) hearts.push(make(true));
      const drawHeart = (x, y, s, c, a) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(s / 16, s / 16);
        ctx.beginPath();
        ctx.moveTo(0, 4);
        ctx.bezierCurveTo(0, -2, -8, -2, -8, 4);
        ctx.bezierCurveTo(-8, 9, 0, 13, 0, 16);
        ctx.bezierCurveTo(0, 13, 8, 9, 8, 4);
        ctx.bezierCurveTo(8, -2, 0, -2, 0, 4);
        ctx.fillStyle = c + a + ')';
        ctx.fill();
        ctx.restore();
      };
      const tick = () => {
        ctx.clearRect(0, 0, W, H);
        hearts.forEach((h) => {
          h.y -= h.sp;
          h.sway += 0.01;
          drawHeart(h.x + Math.sin(h.sway) * 18, h.y, h.s, h.c, h.a);
          if (h.y < -20) Object.assign(h, make(false));
        });
        requestAnimationFrame(tick);
      };
      tick();
    }

    /* ---------- Rastro de corações no cursor (desktop) ---------- */
    if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
      let last = 0;
      window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - last < 90) return;
        last = now;
        const el = document.createElement('span');
        el.className = 'cursor-heart';
        el.textContent = '❤';
        el.style.left = e.clientX + 'px';
        el.style.top = e.clientY + 'px';
        el.style.color = Math.random() > 0.5 ? '#f38aa0' : '#ecb653';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
      });
    }

    /* ---------- Contador de tempo juntos ---------- */
    const start = new Date(CONFIG.dataInicio).getTime();
    const elD = document.getElementById('c-days');
    const elH = document.getElementById('c-hours');
    const elM = document.getElementById('c-mins');
    const elS = document.getElementById('c-secs');
    const pad = (n) => String(n).padStart(2, '0');
    const updateCounter = () => {
      let diff = Math.max(0, Date.now() - start);
      const days = Math.floor(diff / 86400000); diff -= days * 86400000;
      const hrs = Math.floor(diff / 3600000); diff -= hrs * 3600000;
      const mins = Math.floor(diff / 60000); diff -= mins * 60000;
      const secs = Math.floor(diff / 1000);
      if (elD) elD.textContent = days;
      if (elH) elH.textContent = pad(hrs);
      if (elM) elM.textContent = pad(mins);
      if (elS) elS.textContent = pad(secs);
    };
    updateCounter();
    setInterval(updateCounter, 1000);

    /* ---------- Lightbox da galeria ---------- */
    const imgs = Array.from(document.querySelectorAll('.gallery-item img'));
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbCounter = document.getElementById('lb-counter');
    let idx = 0;
    const showLb = (i) => {
      idx = (i + imgs.length) % imgs.length;
      lbImg.src = imgs[idx].src;
      lbCounter.textContent = (idx + 1) + ' / ' + imgs.length;
    };
    const openLb = (i) => {
      showLb(i);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    };
    const closeLb = () => {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    };
    imgs.forEach((im, i) => im.parentElement.addEventListener('click', () => openLb(i)));
    document.getElementById('lb-close').addEventListener('click', closeLb);
    document.getElementById('lb-next').addEventListener('click', () => showLb(idx + 1));
    document.getElementById('lb-prev').addEventListener('click', () => showLb(idx - 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') showLb(idx + 1);
      else if (e.key === 'ArrowLeft') showLb(idx - 1);
    });
    let sx = 0;
    lb.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
    lb.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) showLb(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });

    /* ---------- A pergunta: Sim / Não ---------- */
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const wppLink = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(CONFIG.mensagemSim);

    const celebrate = document.getElementById('celebrate');
    const celebrateWpp = document.getElementById('celebrate-wpp');
    if (celebrateWpp) celebrateWpp.setAttribute('href', wppLink);

    const heartsBurst = () => {
      if (reduceMotion) return;
      const emojis = ['❤', '💖', '💛', '🌹', '✨'];
      for (let i = 0; i < 30; i++) {
        const s = document.createElement('span');
        s.textContent = emojis[(Math.random() * emojis.length) | 0];
        Object.assign(s.style, {
          position: 'fixed', left: '50%', top: '50%',
          fontSize: (14 + Math.random() * 22) + 'px',
          zIndex: 2600, pointerEvents: 'none',
        });
        document.body.appendChild(s);
        const ang = Math.random() * Math.PI * 2;
        const dist = 120 + Math.random() * 280;
        const dx = Math.cos(ang) * dist;
        const dy = Math.sin(ang) * dist;
        s.animate([
          { transform: 'translate(-50%,-50%) scale(0.4)', opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.2) rotate(${(Math.random() * 360) | 0}deg)`, opacity: 0 },
        ], { duration: 1100 + Math.random() * 700, easing: 'cubic-bezier(.16,1,.3,1)' });
        setTimeout(() => s.remove(), 1900);
      }
    };

    const openCelebrate = () => {
      celebrate && celebrate.classList.add('open');
      if (lenis) lenis.stop();
      heartsBurst();
    };
    const closeCelebrate = () => {
      celebrate && celebrate.classList.remove('open');
      if (lenis) lenis.start();
    };
    btnYes && btnYes.addEventListener('click', openCelebrate);
    const cClose = document.getElementById('celebrate-close');
    cClose && cClose.addEventListener('click', closeCelebrate);

    /* ---------- Botão "Não" que foge 🙈 ---------- */
    let dodges = 0;
    const noMsgs = ['Não 😅', 'Tem certeza? 🥺', 'Pensa de novo...', 'Vai por mim 😌', 'Diz que sim! 🥰', 'Impossível clicar 👀'];
    const dodge = () => {
      if (!btnNo) return;
      dodges++;
      const wrap = document.querySelector('.proposal-buttons');
      const rect = wrap.getBoundingClientRect();
      btnNo.classList.add('runaway');
      const maxX = Math.max(30, rect.width - btnNo.offsetWidth - 12);
      const x = Math.random() * maxX;
      const y = (Math.random() - 0.5) * 120;
      btnNo.style.left = x + 'px';
      btnNo.style.top = (rect.height / 2 - btnNo.offsetHeight / 2 + y) + 'px';
      btnYes.style.transform = 'scale(' + Math.min(1.7, 1 + dodges * 0.12) + ')';
      if (dodges < noMsgs.length) btnNo.textContent = noMsgs[dodges];
    };
    if (btnNo) {
      btnNo.addEventListener('mouseenter', dodge);
      btnNo.addEventListener('click', (e) => { e.preventDefault(); dodge(); });
      btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); dodge(); }, { passive: false });
    }

    /* ---------- Música de fundo (opcional) ---------- */
    const song = document.getElementById('song');
    const musicBtn = document.getElementById('music-toggle');
    const musicLabel = document.getElementById('music-label');
    if (CONFIG.musicaUrl && song && musicBtn) {
      song.src = CONFIG.musicaUrl;
      musicBtn.style.display = 'inline-flex';
      let playing = false;
      musicBtn.addEventListener('click', () => {
        if (playing) {
          song.pause();
          musicBtn.classList.add('paused');
          if (musicLabel) musicLabel.textContent = 'nossa música';
        } else {
          song.play().catch(() => {});
          musicBtn.classList.remove('paused');
          if (musicLabel) musicLabel.textContent = 'tocando...';
        }
        playing = !playing;
      });
    }

  } catch (err) {
    // Se algo der errado, garante que o conteúdo apareça mesmo assim.
    console.warn('Falha em uma animação, mas o conteúdo foi exibido:', err);
    revealAll();
    finishLoading();
  }
});
