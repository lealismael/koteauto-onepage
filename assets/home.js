
(() => {
  'use strict';
  // ---- parâmetros do estudo (hipóteses) ----
  const ZOOM = 0.12;                                // aproximação: 1,00 -> 1,12
  const DESCE = 0;                                  // sem deslocamento vertical do carro (hipótese)
  const MIN_H = 520;                                // abaixo disso: fluxo normal
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const root = document.documentElement;
  const track = $('#travessia'), stage = $('.stage'), rig = $('.rig'), flood = $('.flood'), pools = $$('.pool');
  const heroCopy = $('.hero-copy'), cta = $('.cta'), intro = $('.intro');
  const cue = $('.transition-cue'), introHeading = intro.querySelector('h2');
  introHeading.tabIndex = -1;
  const beams = $$('.bm'), glows = $$('.gl'), heroLinks = $$('.hero-copy a');
  const anchorLive = $('#como-funciona-live');
  const mqRM = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ss = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

  const S = { live: null, zoom: true, mouse: true, li: 1 };
  const mqPointer = matchMedia('(hover: hover) and (pointer: fine)');
  const mouseEnabled = new URLSearchParams(location.search).get('mouse') !== '0';
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, time: 0 };
  const resetPointer = () => { pointer.tx = pointer.ty = 0; kick(); };
  stage.addEventListener('pointermove', ev => {
    if (!S.live || !mouseEnabled || !mqPointer.matches || ev.pointerType !== 'mouse') return;
    const r = stage.getBoundingClientRect();
    pointer.tx = clamp((ev.clientX - r.left) / r.width * 2 - 1, -1, 1);
    pointer.ty = clamp((ev.clientY - r.top) / r.height * 2 - 1, -1, 1);
    kick();
  }, { passive: true });
  stage.addEventListener('pointerleave', resetPointer);
  addEventListener('blur', resetPointer);
  mqPointer.addEventListener('change', resetPointer);
  // linha do tempo (hipótese): fração do progresso
  const T = { heroOut: .2, poolA: .06, poolB: .46, floodA: .30, floodB: .46, on: .46, off: .44 };
  let raf = 0, introOn = false, heroH = 0;
  let travel = null;                                // viagem programática ativa (ver abaixo)
  const measure = () => { heroH = heroCopy.offsetHeight; };

  // ---- progresso ----
  function scrollP() {
    const range = track.offsetHeight - stage.offsetHeight;
    if (range <= 0) return 0;
    return clamp(-track.getBoundingClientRect().top / range);
  }

  // ---- renderização: um único progresso ----
  function render() {
    raf = 0;
    if (!S.live) return;
    const p = scrollP();
    const h = stage.offsetHeight;
    const li = S.li;
    const influence = mouseEnabled && mqPointer.matches ? 1 - ss(.12, .40, p) : 0;
    const mx = pointer.x * influence, my = pointer.y * influence;
    const th = -mx * 15;
    const e = ss(0, .66, p);

    // abertura: sai por translação, opaca, como conteúdo que rola (sem fade)
    const out = ss(0, T.heroOut, p);
    heroCopy.style.transform = `translate3d(0,${(-out * (heroH + 24)).toFixed(1)}px,0)`;
    const heroOn = p < T.heroOut;


    // câmera aparente: zoom opcional sobre o conjunto carro + luz (lentes acompanham)
    const s = 1 + (S.zoom ? ZOOM : 0) * e;
    rig.style.transform = `translate3d(0,${(DESCE * h * e).toFixed(1)}px,0) scale(${s.toFixed(4)})`;

    // feixes: nascem das lentes e caem à frente (para baixo na tela); o mouse só gira a direção
    const bo = (.38 + .3 * ss(0, .2, p)) * li;
    beams.forEach(b => { b.style.opacity = clamp(bo).toFixed(3); b.style.transform = `rotate(${(+b.dataset.base + th).toFixed(2)}deg) scaleY(${(1 + my * .22).toFixed(3)})`; });
    const bias = [1 - mx * .10, 1 + mx * .10];
    glows.forEach((g, i) => { g.style.opacity = clamp((.3 + .5 * ss(0, .4, p)) * li * bias[i]).toFixed(3); });
    // a luz no chão cresce e sobe como superfície porcelana, com a frente luminosa
    const k = ss(T.poolA + .02, T.poolB, p);
    const po = ss(T.poolA - .02, T.poolA + .06, p).toFixed(3), pt = `scale(${(1 + .3 * k).toFixed(3)},${(.06 + 1.0 * k).toFixed(3)})`;
    pools.forEach(el => { el.style.opacity = el.classList.contains('pc') ? (+po * ss(.26, .5, p)).toFixed(3) : po; el.style.transform = `translateX(${(mx * 38).toFixed(2)}px) ${pt}`; });
    flood.style.opacity = ss(T.floodA, T.floodB, p).toFixed(3);

    // informação: troca de estado com histerese (não depende de opacidade contínua do scroll)
    if (!introOn && p >= T.on) introOn = true; else if (introOn && p < T.off) introOn = false;
    // A superfície permanece opaca enquanto o resumo está exposto, inclusive no recuo.
    if (introOn) flood.style.opacity = '1';
    const cueOn = !heroOn && !introOn;
    // Expor o destino antes de transferir foco de uma camada que vai desaparecer.
    if (heroOn) { heroCopy.inert = false; heroCopy.removeAttribute('aria-hidden'); }
    if (introOn) { intro.classList.add('on'); intro.inert = false; intro.removeAttribute('aria-hidden'); }
    if (cueOn) cue.hidden = false;
    const active = document.activeElement;
    if ((!heroOn && heroCopy.contains(active)) || (!introOn && intro.contains(active)) || (!cueOn && active === cue)) {
      (introOn ? introHeading : heroOn ? cta : cue).focus({preventScroll:true});
    }
    heroLinks.forEach(a => { a.tabIndex = heroOn ? 0 : -1; });
    heroCopy.style.pointerEvents = heroOn ? '' : 'none';
    heroCopy.inert = !heroOn;
    heroCopy.setAttribute('aria-hidden', String(!heroOn));
    intro.classList.toggle('on', introOn);
    intro.inert = !introOn;
    intro.setAttribute('aria-hidden', String(!introOn));
    cue.hidden = !cueOn;

    root.dataset.p = p.toFixed(3);
  }

  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  function frame(now) {
    const dt = pointer.time ? Math.min(50, now - pointer.time) : 16.67;
    pointer.time = now;
    const canMove = S.live && mouseEnabled && mqPointer.matches && scrollP() < .40;
    if (!canMove) pointer.tx = pointer.ty = 0;
    const alpha = 1 - Math.exp(-dt / 110);
    pointer.x += (pointer.tx - pointer.x) * alpha;
    pointer.y += (pointer.ty - pointer.y) * alpha;
    const moving = Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > .001;
    if (!moving) { pointer.x = pointer.tx; pointer.y = pointer.ty; pointer.time = 0; }
    render();
    if (moving && S.live) kick();
  }

  // ---- modo vivo x fluxo normal ----
  function setLive(on) {
    if (on === S.live) return;
    S.live = on;
    root.classList.toggle('live', on);
    if (on) {
      measure();
      intro.removeAttribute('id'); anchorLive.id = 'como-funciona';
      if (location.hash === '#como-funciona') anchorLive.scrollIntoView({ behavior: 'instant' });
    } else {
      anchorLive.removeAttribute('id'); intro.id = 'como-funciona';
      [heroCopy, rig, flood, ...pools, ...beams, ...glows].forEach(el => el.removeAttribute('style')); heroLinks.forEach(a => a.removeAttribute('tabindex')); intro.classList.remove('on'); introOn = false;
      heroCopy.inert = false; intro.inert = false;
      heroCopy.removeAttribute('aria-hidden'); intro.removeAttribute('aria-hidden');
      if (document.activeElement === cue) introHeading.focus({preventScroll:true});
      cue.hidden = true; cancelTravel();
    }
    kick();
  }
  const introNeed = () => ($('.intro .wrap').offsetHeight + Math.max(36, Math.min(.09 * innerHeight, 100)) + 16);
  const want = () => !mqRM.matches && innerHeight >= MIN_H && innerHeight >= introNeed();
  mqRM.addEventListener('change', () => setLive(want()));
  addEventListener('resize', () => { cancelTravel(); setLive(want()); measure(); kick(); });
  addEventListener('scroll', kick, { passive: true });
  // foco por teclado no CTA com a abertura já apagada: volta ao começo
  cta.addEventListener('focus', () => { if (S.live && scrollP() > T.heroOut) scrollTo({ top: track.offsetTop, behavior: 'instant' }); });
  setLive(want());

  // ---- O percurso: só a decoração anima (linha de luz, pontos); o texto está sempre legível ----
  const how = $('.how'), path = $('#path'), stepEls = $$('.step');
  let howLive = false, howRaf = 0;
  function howRender() {
    howRaf = 0;
    if (!howLive) return;
    const r = path.getBoundingClientRect(), vh = innerHeight, mark = vh * .62;
    const inset = innerWidth <= 800 ? 22 : 28, h = Math.max(1, r.height - 2 * inset);
    const f = clamp((mark - r.top - inset) / h);
    path.style.setProperty('--fill', f.toFixed(4));
    stepEls.forEach(el => el.classList.toggle('reached', el.getBoundingClientRect().top < mark));
  }
  const howKick = () => { if (!howRaf) howRaf = requestAnimationFrame(howRender); };
  function setHow(on) {
    howLive = on; how.classList.toggle('how-live', on);
    if (!on) { path.style.removeProperty('--fill'); stepEls.forEach(el => el.classList.remove('reached')); }
    else howKick();
  }
  setHow(!mqRM.matches);
  mqRM.addEventListener('change', () => setHow(!mqRM.matches));
  addEventListener('scroll', howKick, { passive: true });
  addEventListener('resize', howKick);
  addEventListener('load', () => { measure(); kick(); });
  // ---- viagem até "Como funciona": só após clique explícito no botão ou no menu ----
  // A cena continua derivada da posição real do scroll; aqui só movemos a janela, quadro a quadro.
  const TRAVEL_MS = 1800;
  const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const destY = () => anchorLive.getBoundingClientRect().top + scrollY;
  function cancelTravel(status = 'cancelled') {
    if (!travel) return;
    cancelAnimationFrame(travel.raf); travel = null;
    root.dataset.travel = status;
  }
  function finishTravel(t0) {
    travel = null;
    if (location.hash === '#como-funciona') history.replaceState(null, '', '#como-funciona'); else history.pushState(null, '', '#como-funciona');
    const h = intro.querySelector('h2'); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true });
    root.dataset.travel = 'done'; root.dataset.travelMs = String(Math.round(performance.now() - t0));
    window.dispatchEvent(new CustomEvent('kote:arrived'));
  }
  function startTravel() {
    cancelTravel('replaced');
    const from = scrollY, to = destY(), dist = Math.abs(to - from);
    if (dist < 2) { finishTravel(performance.now()); return; }
    const ref = Math.max(1, to - track.getBoundingClientRect().top - scrollY);        // distância topo -> chegada
    const dur = Math.max(350, Math.min(TRAVEL_MS, TRAVEL_MS * dist / ref));             // sem alongar trechos curtos
    const t0 = performance.now();
    travel = { from, dur, t0, last: from, raf: 0 };
    root.dataset.travel = 'running'; delete root.dataset.travelMs;
    const tick = now => {
      if (!travel) return;
      if (Math.abs(scrollY - travel.last) > 3) { cancelTravel(); return; }             // outra força rolou a página: não puxar de volta
      const k = clamp((now - travel.t0) / travel.dur), y = travel.from + (destY() - travel.from) * easeInOut(k);
      travel.last = y; scrollTo({ top: y, behavior: 'instant' });
      if (k >= 1) { finishTravel(t0); return; }
      travel.raf = requestAnimationFrame(tick);
    };
    travel.raf = requestAnimationFrame(tick);
  }
  function onAnchorClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!S.live || mqRM.matches) return;                  // movimento reduzido / fluxo normal / sem JS: navegação nativa, direta
    e.preventDefault(); startTravel();
  }
  $('.skip').addEventListener('click', e => {
    e.preventDefault(); cancelTravel();
    const target = S.live ? anchorLive : intro;
    target.scrollIntoView({behavior:'instant'}); render();
    const h = intro.querySelector('h2'); h.tabIndex = -1; h.focus({preventScroll:true});
    history.replaceState(null, '', '#como-funciona');
  });
  [cta, $('.nl'), cue].forEach(a => a.addEventListener('click', onAnchorClick));
  // qualquer gesto do usuário interrompe a viagem (sem preventDefault)
  ['wheel', 'touchstart'].forEach(ev => addEventListener(ev, () => cancelTravel(), { passive: true }));
  addEventListener('keydown', e => { if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) cancelTravel(); });
  addEventListener('mousedown', e => { if (e.clientX > document.documentElement.clientWidth) cancelTravel(); });
})();
