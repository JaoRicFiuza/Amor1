// Registra o service worker (permite "adicionar à tela inicial" como app).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

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

    // Cápsula do tempo: só pode ser aberta a partir dessa data (AAAA-MM-DD).
    capsula: {
      dataAbertura: '2026-09-03T00:00:00',
      mensagem: 'Se você está lendo isso, é porque chegou o dia que eu separei pra te dizer mais uma coisa: eu ainda te amo do jeitinho que amava quando escrevi essa cartinha, só que agora um tanto maior. Obrigado por continuar escolhendo a gente todos os dias. Feliz mais um tempo juntos, meu amor 💛',
    },
  };
  /* ======================================================= */

  // Perguntas do quiz do casal (edite pergunta, opções e qual é a correta).
  // "correta" é o índice da opção certa dentro de "opcoes" (0 = primeira).
  const QUIZ = [
    {
      pergunta: 'Que dia do mês é o nosso "dia do casal"?',
      opcoes: ['Dia 14', 'Dia 3', 'Dia 20'],
      correta: 1,
      certo: 'Isso aí! Todo dia 3 é nosso 💛',
      errado: 'Quase! Mas fica de olho no dia 3 😉',
    },
    {
      pergunta: 'Qual apelido ele mais usa pra te chamar?',
      opcoes: ['Xuxu', 'Totoza', 'Docinho'],
      correta: 1,
      certo: 'Com certeza, minha totoza 🥰',
      errado: 'Haha, quase! Mas "totoza" é o queridinho aqui 💛',
    },
    {
      pergunta: 'Desde quando a gente tá junto?',
      opcoes: ['14/02/2024', '01/01/2023', '03/09/2022'],
      correta: 2,
      certo: 'Isso, desde 03/09/2022 e contando ❤️',
      errado: 'Quase! A nossa data é 03/09/2022 🌹',
    },
    {
      pergunta: 'O que ele mais gosta de fazer com você?',
      opcoes: ['Do nosso jeitinho, nas coisas simples', 'Assistir série sozinho', 'Dormir cedo sem falar nada'],
      correta: 0,
      certo: 'Exatamente, o nosso jeitinho é o melhor 💛',
      errado: 'Quase! O nosso jeitinho de sempre é o favorito 🥹',
    },
    {
      pergunta: 'No fim das contas, o que ele sente por você?',
      opcoes: ['Só um carinho', 'Um amor gigante, pra sempre', 'Não sei ao certo'],
      correta: 1,
      certo: 'Isso mesmo, um amor gigante, pra sempre 💛',
      errado: 'A resposta certa é: um amor gigante, pra sempre 🌹',
    },
  ];

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

    /* ---------- Nossa história: carrossel cinematográfico ---------- */
    const storyCarousel = document.getElementById('story-carousel');
    if (storyCarousel) {
      const slides = Array.from(storyCarousel.querySelectorAll('.story-slide'));
      const dotsWrap = document.getElementById('story-dots');
      const storyPrev = document.getElementById('story-prev');
      const storyNext = document.getElementById('story-next');
      let storyIndex = 0;
      let storyScrollTrigger = null;

      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'story-dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Momento ' + (i + 1));
        dot.addEventListener('click', () => goToStorySlide(i));
        dotsWrap.appendChild(dot);
      });
      const storyDots = Array.from(dotsWrap.querySelectorAll('.story-dot'));

      const clearStoryDrag = () => {
        slides.forEach((s) => { s.style.transition = ''; s.style.transform = ''; });
      };

      const setActiveStorySlide = (i) => {
        storyIndex = i;
        clearStoryDrag();
        slides.forEach((s, idx) => s.classList.toggle('is-active', idx === i));
        storyDots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));
      };

      const goToStorySlide = (i) => {
        i = Math.max(0, Math.min(slides.length - 1, i));
        if (storyScrollTrigger) {
          const y = storyScrollTrigger.start +
            (storyScrollTrigger.end - storyScrollTrigger.start) * (i / (slides.length - 1));
          if (lenis) lenis.scrollTo(y, { duration: 1 });
          else window.scrollTo({ top: y, behavior: 'smooth' });
        } else {
          setActiveStorySlide(i);
        }
      };

      storyPrev && storyPrev.addEventListener('click', () => goToStorySlide(storyIndex - 1));
      storyNext && storyNext.addEventListener('click', () => goToStorySlide(storyIndex + 1));

      /* arrastar com o dedo (ou mouse) para trocar de momento */
      const DRAG_THRESHOLD = 60;
      const DRAG_MAX_VISUAL = 140;
      let dragging = false;
      let dragStartX = 0;
      let dragDeltaX = 0;
      let dragSlide = null;

      const onStoryPointerDown = (e) => {
        if (e.target.closest('.story-arrow, .story-dot')) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        dragging = true;
        dragStartX = e.clientX;
        dragDeltaX = 0;
        dragSlide = slides[storyIndex];
        if (dragSlide) dragSlide.style.transition = 'none';
        if (storyCarousel.setPointerCapture) {
          try { storyCarousel.setPointerCapture(e.pointerId); } catch (err) {}
        }
      };

      const onStoryPointerMove = (e) => {
        if (!dragging || !dragSlide) return;
        dragDeltaX = e.clientX - dragStartX;
        const visual = Math.max(-DRAG_MAX_VISUAL, Math.min(DRAG_MAX_VISUAL, dragDeltaX * 0.6));
        dragSlide.style.transform = 'translateX(' + visual + 'px)';
      };

      const onStoryPointerUp = () => {
        if (!dragging) return;
        dragging = false;
        const advance = Math.abs(dragDeltaX) > DRAG_THRESHOLD;
        clearStoryDrag();
        if (advance) goToStorySlide(storyIndex + (dragDeltaX < 0 ? 1 : -1));
        dragSlide = null;
      };

      storyCarousel.addEventListener('pointerdown', onStoryPointerDown);
      storyCarousel.addEventListener('pointermove', onStoryPointerMove);
      storyCarousel.addEventListener('pointerup', onStoryPointerUp);
      storyCarousel.addEventListener('pointercancel', onStoryPointerUp);

      // com movimento reduzido ou sem GSAP/ScrollTrigger, o carrossel vira manual (seta/swipe), sem prender a rolagem
      if (!reduceMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && slides.length > 1) {
        storyScrollTrigger = ScrollTrigger.create({
          trigger: storyCarousel,
          start: 'top top',
          end: () => '+=' + (slides.length - 1) * window.innerHeight,
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            const i = Math.round(self.progress * (slides.length - 1));
            if (i !== storyIndex) setActiveStorySlide(i);
          },
        });
      }
    }

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

    /* ---------- Quiz do casal ---------- */
    const quizCard = document.getElementById('quiz-card');
    const quizQuestionEl = document.getElementById('quiz-question');
    const quizOptionsEl = document.getElementById('quiz-options');
    const quizFeedbackEl = document.getElementById('quiz-feedback');
    const quizNextBtn = document.getElementById('quiz-next');
    const quizStepEl = document.getElementById('quiz-step');
    const quizBarEl = document.getElementById('quiz-progress-bar');
    const quizResultEl = document.getElementById('quiz-result');

    if (quizCard && quizQuestionEl && QUIZ.length) {
      let qi = 0;
      let acertos = 0;
      let answered = false;

      const renderQuestion = () => {
        answered = false;
        const q = QUIZ[qi];
        quizStepEl.textContent = 'pergunta ' + (qi + 1) + ' de ' + QUIZ.length;
        quizBarEl.style.width = ((qi) / QUIZ.length) * 100 + '%';
        quizQuestionEl.textContent = q.pergunta;
        quizFeedbackEl.textContent = '';
        quizFeedbackEl.className = 'quiz-feedback';
        quizNextBtn.style.display = 'none';
        quizOptionsEl.innerHTML = '';
        q.opcoes.forEach((opcao, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'quiz-option';
          b.textContent = opcao;
          b.addEventListener('click', () => selectOption(i, b));
          quizOptionsEl.appendChild(b);
        });
      };

      const selectOption = (i, btn) => {
        if (answered) return;
        answered = true;
        const q = QUIZ[qi];
        const opts = quizOptionsEl.querySelectorAll('.quiz-option');
        opts.forEach((o, idx) => {
          o.classList.add('disabled');
          if (idx === q.correta) o.classList.add('correct');
        });
        if (i === q.correta) {
          acertos++;
          quizFeedbackEl.textContent = q.certo || 'Isso aí! Você me conhece bem 🥰';
          quizFeedbackEl.classList.add('is-correct');
        } else {
          btn.classList.add('wrong');
          quizFeedbackEl.textContent = q.errado || 'Quase! Mas o amor continua o mesmo 💛';
          quizFeedbackEl.classList.add('is-wrong');
        }
        quizBarEl.style.width = ((qi + 1) / QUIZ.length) * 100 + '%';
        quizNextBtn.textContent = qi < QUIZ.length - 1 ? 'Próxima pergunta →' : 'Ver resultado 💛';
        quizNextBtn.style.display = 'inline-flex';
      };

      const finishQuiz = () => {
        quizCard.style.display = 'none';
        quizResultEl.classList.add('show');
        const total = QUIZ.length;
        document.getElementById('quiz-result-title').textContent =
          acertos === total ? 'Gabaritou! Vocês são a dupla perfeita 💯' : 'Vocês são perfeitos um pro outro 💛';
        document.getElementById('quiz-result-text').textContent =
          'Acertou ' + acertos + ' de ' + total + ' — mas a gente já sabe que esse amor não precisa de nota pra ser o melhor.';
      };

      quizNextBtn.addEventListener('click', () => {
        qi++;
        if (qi < QUIZ.length) renderQuestion();
        else finishQuiz();
      });

      renderQuestion();
    }

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

    /* ---------- Cápsula do tempo ---------- */
    const capsuleCard = document.getElementById('capsule-card');
    if (capsuleCard) {
      const capLocked = document.getElementById('capsule-locked');
      const capOpenBtn = document.getElementById('capsule-open');
      const capMessage = document.getElementById('capsule-message');
      const capText = document.getElementById('capsule-text');
      const capD = document.getElementById('cap-days');
      const capH = document.getElementById('cap-hours');
      const capM = document.getElementById('cap-mins');
      const capS = document.getElementById('cap-secs');
      const unlockAt = new Date(CONFIG.capsula.dataAbertura).getTime();
      capText.textContent = CONFIG.capsula.mensagem;

      let capsuleInterval = null;
      const tickCapsule = () => {
        const diff = unlockAt - Date.now();
        if (diff > 0) {
          let rest = diff;
          const days = Math.floor(rest / 86400000); rest -= days * 86400000;
          const hrs = Math.floor(rest / 3600000); rest -= hrs * 3600000;
          const mins = Math.floor(rest / 60000); rest -= mins * 60000;
          const secs = Math.floor(rest / 1000);
          capD.textContent = days;
          capH.textContent = pad(hrs);
          capM.textContent = pad(mins);
          capS.textContent = pad(secs);
        } else {
          if (capsuleInterval) clearInterval(capsuleInterval);
          capLocked.style.display = 'none';
          capOpenBtn.style.display = 'inline-flex';
        }
      };
      tickCapsule();
      capsuleInterval = setInterval(tickCapsule, 1000);

      capOpenBtn.addEventListener('click', () => {
        capOpenBtn.classList.add('opening');
        setTimeout(() => {
          capOpenBtn.style.display = 'none';
          capMessage.classList.add('open');
        }, 350);
      });
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
