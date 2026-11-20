(function (root) {
  'use strict';

  var THEME_KEY = 'utnimas_theme';

  function getPreferredTheme() {
    try {
      var saved = root.localStorage ? root.localStorage.getItem(THEME_KEY) : null;
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch (e) {}
    if (root.matchMedia && root.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    var mode = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', mode);
    try {
      if (root.localStorage) {
        root.localStorage.setItem(THEME_KEY, mode);
      }
    } catch (e) {}

    var buttons = document.querySelectorAll('[data-utnimas-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      btn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
      var label = btn.querySelector('.theme-label');
      var icon = btn.querySelector('.theme-icon');
      if (label) label.textContent = mode === 'dark' ? 'Modo Claro' : 'Modo Oscuro';
      if (icon) icon.textContent = mode === 'dark' ? '☀️' : '🌙';
    }
  }

  function utnimasToggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  function sidebarActive() {
    var sb = document.getElementById('sidebar');
    if (sb) sb.classList.toggle('active');
    var nu = document.getElementById('nameUser');
    if (nu) nu.classList.toggle('nameUserc');
    var icon = document.getElementById('arrow');
    if (icon) {
      icon.classList.toggle('fa-chevron-left');
      icon.classList.toggle('fa-chevron-right');
    }
  }

  function initCarousel(rootEl) {
    if (!rootEl) return;
    var slides = rootEl.querySelectorAll('.utn-slide');
    var dots = rootEl.querySelectorAll('.utn-dot');
    if (!slides.length) return;

    var index = 0;
    var timer = null;
    var touchStartX = null;

    function show(nextIdx) {
      index = (nextIdx + slides.length) % slides.length;
      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.toggle('is-active', i === index);
        slides[i].setAttribute('aria-hidden', i === index ? 'false' : 'true');
      }
      for (var j = 0; j < dots.length; j++) {
        dots[j].classList.toggle('is-active', j === index);
        dots[j].setAttribute('aria-selected', j === index ? 'true' : 'false');
      }
    }

    function start() {
      stop();
      if (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      timer = setInterval(function () { show(index + 1); }, 5000);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    var prevBtn = rootEl.querySelector('[data-carousel-prev]');
    var nextBtn = rootEl.querySelector('[data-carousel-next]');
    if (prevBtn) prevBtn.addEventListener('click', function () { show(index - 1); start(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); start(); });

    for (var d = 0; d < dots.length; d++) {
      (function (dotIdx) {
        dots[dotIdx].addEventListener('click', function () { show(dotIdx); start(); });
      })(d);
    }

    rootEl.addEventListener('mouseenter', stop);
    rootEl.addEventListener('mouseleave', start);
    rootEl.addEventListener('focusin', stop);
    rootEl.addEventListener('focusout', start);
    rootEl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { show(index - 1); start(); }
      if (e.key === 'ArrowRight') { show(index + 1); start(); }
    });
    rootEl.addEventListener('touchstart', function (e) {
      touchStartX = e.touches && e.touches.length ? e.touches[0].clientX : null;
    }, { passive: true });
    rootEl.addEventListener('touchend', function (e) {
      if (touchStartX == null) return;
      var endX = e.changedTouches && e.changedTouches.length ? e.changedTouches[0].clientX : touchStartX;
      var delta = endX - touchStartX;
      touchStartX = null;
      if (Math.abs(delta) > 40) {
        show(delta < 0 ? index + 1 : index - 1);
        start();
      }
    }, { passive: true });

    show(0);
    start();
  }

  function initProductFilter() {
    var search = document.getElementById('utnCatalogSearch');
    if (!search) return;
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      var cards = document.querySelectorAll('[data-product-card]');
      var visible = 0;
      for (var i = 0; i < cards.length; i++) {
        var text = (cards[i].getAttribute('data-search') || '').toLowerCase();
        var match = !q || text.indexOf(q) !== -1;
        cards[i].style.display = match ? '' : 'none';
        if (match) visible++;
      }
      var emptyMsg = document.getElementById('utnCatalogEmpty');
      if (emptyMsg) emptyMsg.style.display = visible === 0 ? 'block' : 'none';
    });
  }

  root.sidebarActive = sidebarActive;
  root.utnimasToggleTheme = utnimasToggleTheme;

  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getPreferredTheme());
    var carousels = document.querySelectorAll('[data-utn-carousel]');
    for (var i = 0; i < carousels.length; i++) {
      initCarousel(carousels[i]);
    }
    initProductFilter();
  });
})(window);
