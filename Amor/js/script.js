document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Configuração do Lenis para rolagem suave
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Integração do Lenis com o ScrollTrigger do GSAP
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.lagSmoothing(0);

    // Animação do Header
    gsap.from("header", {
        y: -100,
        duration: 1,
        ease: "power3.out",
        delay: 0.5
    });

    // Animação da seção Hero
    gsap.to("#hero .hero-content h1", {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1,
        ease: "power3.out"
    });
    gsap.to("#hero .hero-content p", {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1.2,
        ease: "power3.out"
    });

    // Rolagem padrão sem pin para melhor compatibilidade com Lenis

    // Animação da Galeria
    gsap.to("#gallery h2", {
        scrollTrigger: {
            trigger: "#gallery",
            start: "top center",
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.to(".gallery-item", {
        scrollTrigger: {
            trigger: ".gallery-grid",
            start: "top center",
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Animação da Mensagem
    gsap.to("#message h2", {
        scrollTrigger: {
            trigger: "#message",
            start: "top center",
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.to("#message .message-content p", {
        scrollTrigger: {
            trigger: "#message .message-content",
            start: "top center",
        },
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out"
    });

    // Animação da Proposta
    gsap.to(".proposal-content h2", {
        scrollTrigger: {
            trigger: "#proposal",
            start: "top center",
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.to(".btn", {
        scrollTrigger: {
            trigger: ".proposal-buttons",
            start: "top center",
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Botões de Proposta
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const phoneNumber = '5531988964942'; // Formato internacional com código do Brasil

    btnYes.addEventListener('click', () => {
        const message = encodeURIComponent('Sim! Eu quero sair com você! ❤️');
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    });

    btnNo.addEventListener('click', () => {
        const message = encodeURIComponent('Não 😅');
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    });
});
