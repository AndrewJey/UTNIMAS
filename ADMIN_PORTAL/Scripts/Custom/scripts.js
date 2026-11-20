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

  root.sidebarActive = sidebarActive;
  root.utnimasToggleTheme = utnimasToggleTheme;

  applyTheme(getPreferredTheme());
  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getPreferredTheme());
  });
})(window);
