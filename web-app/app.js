/* UTN-IMAS Ideas Productivas — Interactive Marketplace & Admin UI Controller */
(function () {
  'use strict';

  var U = window.UtnimasStore;
  if (!U) return;

  var store = U.createStore(window.localStorage);

  var GALLERY_PRESETS = [
    { label: 'Mercado Artesanal', src: '../UTNIMAS/Content/Images/Markets/340436cf-5092-4e1a-aadc-e2e8c3034e85.jpg' },
    { label: 'Feria Fresca', src: '../UTNIMAS/Content/Images/Markets/Devaraja-Market.jpg' },
    { label: 'Tiendas Locales', src: '../UTNIMAS/Content/Images/Markets/han-market-shops.jpg' },
    { label: 'Productos Madera', src: '../UTNIMAS/Content/Images/Markets/pagePropertiesImage.jpg' },
    { label: 'Bazar Emprendedor', src: '../UTNIMAS/Content/Images/Markets/Strasse-17-Juni-Flea-Market-3-800x400.jpg' }
  ];

  var ui = {
    activeView: 'inicio',
    activeAdminTab: 'empresas',
    carouselIndex: 0,
    carouselTimer: null,
    carouselSlides: [],
    selectedHomeSector: '',
    empLogoData: '',
    prodImageData: '',
    touchStartX: 0
  };

  function $(id) { return document.getElementById(id); }

  function escapeHtml(val) {
    return String(val == null ? '' : val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeImg(src) {
    return U.isSafeImageSrc(src) ? src : U.DEFAULT_IMAGE;
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleString('es-CR', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return String(iso).slice(0, 10);
    }
  }

  function showToast(message) {
    var container = $('toastContainer');
    if (!container) return;
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    container.appendChild(el);
    window.setTimeout(function () {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.25s ease';
      window.setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 260);
    }, 2600);
  }

  /* ==================== THEME ENGINE ==================== */
  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme, persistTheme) {
    var normalized = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', normalized);
    if (persistTheme) {
      try { localStorage.setItem(U.THEME_KEY, normalized); } catch (e) {}
    }
    var btn = $('themeToggleBtn');
    var icon = $('themeIcon');
    var label = $('themeLabel');
    if (btn) btn.setAttribute('aria-pressed', normalized === 'dark' ? 'true' : 'false');
    if (icon) icon.textContent = normalized === 'dark' ? '☀️' : '🌙';
    if (label) label.textContent = normalized === 'dark' ? 'Claro' : 'Oscuro';
  }

  function toggleTheme() {
    var next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    showToast(next === 'dark' ? 'Tema oscuro activado y guardado' : 'Tema claro activado y guardado');
  }

  /* ==================== NAVIGATION ==================== */
  function switchView(viewName) {
    var valid = ['inicio', 'catalogo', 'empresas', 'admin', 'contacto'];
    if (valid.indexOf(viewName) === -1) viewName = 'inicio';
    ui.activeView = viewName;

    document.querySelectorAll('.view-section').forEach(function (sec) {
      sec.classList.toggle('is-active', sec.id === 'view-' + viewName);
    });
    document.querySelectorAll('#mainNav .nav-btn').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-view') === viewName);
    });

    closeMobileMenu();
    if (window.location.hash !== '#' + viewName) {
      try { history.replaceState(null, '', '#' + viewName); } catch (e) {}
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function switchAdminTab(tabName) {
    var valid = ['empresas', 'productos', 'mensajes'];
    if (valid.indexOf(tabName) === -1) tabName = 'empresas';
    ui.activeAdminTab = tabName;

    document.querySelectorAll('[data-admin-tab]').forEach(function (btn) {
      var active = btn.getAttribute('data-admin-tab') === tabName;
      btn.classList.toggle('btn-primary', active);
      btn.classList.toggle('btn-ghost', !active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    document.querySelectorAll('.admin-subview').forEach(function (sub) {
      sub.classList.toggle('is-active', sub.id === 'admin-tab-' + tabName);
    });
  }

  function closeMobileMenu() {
    var nav = $('mainNav');
    var btn = $('mobileMenuBtn');
    if (nav) nav.classList.remove('is-open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  /* ==================== CAROUSEL ==================== */
  function renderCarousel() {
    var track = $('carouselTrack');
    var dots = $('carouselDots');
    if (!track || !dots) return;

    ui.carouselSlides = store.getCarouselSlides();
    if (ui.carouselIndex >= ui.carouselSlides.length) ui.carouselIndex = 0;

    track.innerHTML = ui.carouselSlides.map(function (slide, idx) {
      var ctaHtml = slide.productId
        ? '<button type="button" class="btn btn-light btn-sm" data-open-product="' + escapeHtml(slide.productId) + '">Ver y Contactar</button>' +
          '<button type="button" class="btn btn-primary btn-sm" data-zoom-img="' + escapeHtml(safeImg(slide.image)) + '" data-zoom-title="' + escapeHtml(slide.title) + '">Ampliar foto</button>'
        : '<button type="button" class="btn btn-light btn-sm" data-go-view="admin">Registrar mi empresa</button>';

      return (
        '<article class="carousel-slide" aria-label="Diapositiva ' + (idx + 1) + ' de ' + ui.carouselSlides.length + '">' +
          '<img src="' + escapeHtml(safeImg(slide.image)) + '" alt="' + escapeHtml(slide.title) + '" loading="' + (idx === 0 ? 'eager' : 'lazy') + '" />' +
          '<div class="carousel-overlay">' +
            '<span class="carousel-badge">' + escapeHtml(slide.badge) + ' · ' + escapeHtml(slide.companyName) + '</span>' +
            '<h2>' + escapeHtml(slide.title) + '</h2>' +
            '<p>' + escapeHtml(slide.subtitle) + '</p>' +
            '<div class="carousel-cta">' +
              (slide.priceText ? '<span class="carousel-price">' + escapeHtml(slide.priceText) + '</span>' : '') +
              ctaHtml +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    dots.innerHTML = ui.carouselSlides.map(function (_, idx) {
      return '<button type="button" class="carousel-dot' + (idx === ui.carouselIndex ? ' is-active' : '') +
        '" data-carousel-dot="' + idx + '" aria-label="Ir a diapositiva ' + (idx + 1) + '"></button>';
    }).join('');

    goToSlide(ui.carouselIndex);
    restartCarouselAutoplay();
  }

  function goToSlide(index) {
    var total = ui.carouselSlides.length;
    if (!total) return;
    ui.carouselIndex = ((index % total) + total) % total;
    var track = $('carouselTrack');
    if (track) track.style.transform = 'translateX(-' + (ui.carouselIndex * 100) + '%)';
    document.querySelectorAll('#carouselDots .carousel-dot').forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === ui.carouselIndex);
    });
  }

  function stopCarouselAutoplay() {
    if (ui.carouselTimer) {
      window.clearInterval(ui.carouselTimer);
      ui.carouselTimer = null;
    }
  }

  function restartCarouselAutoplay() {
    stopCarouselAutoplay();
    if (ui.carouselSlides.length <= 1) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    ui.carouselTimer = window.setInterval(function () {
      if (ui.activeView === 'inicio') goToSlide(ui.carouselIndex + 1);
    }, 5200);
  }

  /* ==================== PRODUCT CARD RENDERER ==================== */
  function renderProductCardHtml(p, favoritos) {
    var isFav = favoritos.indexOf(p.id) >= 0;
    var empName = p.empresa ? p.empresa.nombre : 'Empresa UTN-IMAS';
    var empSector = p.empresa ? p.empresa.sector : 'Ideas Productivas';
    var imgSrc = safeImg(p.imagen);

    return (
      '<article class="product-card">' +
        '<div class="card-media">' +
          '<img src="' + escapeHtml(imgSrc) + '" alt="' + escapeHtml(p.nombre) + '" loading="lazy" ' +
            'data-zoom-img="' + escapeHtml(imgSrc) + '" data-zoom-title="' + escapeHtml(p.nombre) + '" />' +
          '<span class="media-pill">' + escapeHtml(p.condicion || 'Nuevo') + '</span>' +
          '<button type="button" class="fav-btn' + (isFav ? ' is-fav' : '') + '" data-toggle-fav="' + escapeHtml(p.id) + '" ' +
            'aria-label="' + (isFav ? 'Quitar de lista de interés' : 'Guardar en lista de interés') + '" aria-pressed="' + (isFav ? 'true' : 'false') + '">' +
            (isFav ? '♥' : '♡') +
          '</button>' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-meta">' +
            '<span>' + escapeHtml(empSector) + '</span>' +
            '<span>Stock: ' + escapeHtml(p.stock) + '</span>' +
          '</div>' +
          '<h3 class="card-title">' + escapeHtml(p.nombre) + '</h3>' +
          '<p class="card-desc">' + escapeHtml(p.descripcion || 'Producto publicado por microempresa verificada.') + '</p>' +
          '<div style="font-size:12.5px; color:var(--text-muted);">Por <strong>' + escapeHtml(empName) + '</strong></div>' +
          '<div class="card-footer">' +
            '<span class="price-tag">' + escapeHtml(U.formatCRC(p.precio)) + '</span>' +
            '<button type="button" class="btn btn-primary btn-sm" data-open-product="' + escapeHtml(p.id) + '">Ver y Contactar</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  /* ==================== VIEW RENDERERS ==================== */
  function renderSelectOptions() {
    var st = store.getState();

    // Populate sector dropdowns
    var sectorOptions = '<option value="">Todos los sectores</option>' +
      U.SECTORES_IMAS.map(function (s) { return '<option value="' + escapeHtml(s) + '">' + escapeHtml(s) + '</option>'; }).join('');
    ['catalogSector', 'empresasSector'].forEach(function (id) {
      var sel = $(id);
      if (!sel) return;
      var cur = sel.value;
      sel.innerHTML = sectorOptions;
      sel.value = cur;
    });

    var empSectorSel = $('empSector');
    if (empSectorSel) {
      var curEmpSector = empSectorSel.value || 'Comercio';
      empSectorSel.innerHTML = U.SECTORES_IMAS.map(function (s) {
        return '<option value="' + escapeHtml(s) + '">' + escapeHtml(s) + '</option>';
      }).join('');
      empSectorSel.value = curEmpSector;
    }

    // Populate company dropdowns
    var catalogEmp = $('catalogEmpresa');
    if (catalogEmp) {
      var curCatEmp = catalogEmp.value;
      catalogEmp.innerHTML = '<option value="">Todas las empresas</option>' +
        st.empresas.map(function (e) { return '<option value="' + escapeHtml(e.id) + '">' + escapeHtml(e.nombre) + '</option>'; }).join('');
      catalogEmp.value = curCatEmp;
    }

    var prodEmp = $('prodEmpresaId');
    if (prodEmp) {
      var curProdEmp = prodEmp.value;
      if (st.empresas.length === 0) {
        prodEmp.innerHTML = '<option value="">Primero registre una empresa</option>';
      } else {
        prodEmp.innerHTML = st.empresas.map(function (e) {
          return '<option value="' + escapeHtml(e.id) + '">' + escapeHtml(e.nombre) + ' (' + escapeHtml(e.sector) + ')</option>';
        }).join('');
        if (curProdEmp && st.empresas.some(function (e) { return e.id === curProdEmp; })) {
          prodEmp.value = curProdEmp;
        }
      }
    }

    var contactDest = $('contactDestinatario');
    if (contactDest) {
      var curDest = contactDest.value;
      contactDest.innerHTML =
        '<option value="UTN-IMAS Ideas Productivas">Coordinación UTN – IMAS</option>' +
        st.empresas.map(function (e) {
          return '<option value="' + escapeHtml(e.id) + '">' + escapeHtml(e.nombre) + ' — ' + escapeHtml(e.contacto) + '</option>';
        }).join('');
      if (curDest) contactDest.value = curDest;
    }
  }

  function renderHome() {
    var st = store.getState();
    var sectoresActivos = {};
    st.empresas.forEach(function (e) { sectoresActivos[e.sector] = true; });
    var carouselCount = st.productos.filter(function (p) { return p.destacado; }).length;

    var kpiGrid = $('homeKpiGrid');
    if (kpiGrid) {
      kpiGrid.innerHTML =
        '<div class="kpi-card"><div class="kpi-label">Productos publicados</div><div class="kpi-value">' + st.productos.length + '</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Empresas registradas</div><div class="kpi-value">' + st.empresas.length + '</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Sectores activos</div><div class="kpi-value">' + Object.keys(sectoresActivos).length + '</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Destacados en carrusel</div><div class="kpi-value">' + carouselCount + '</div></div>';
    }

    var chipRow = $('homeSectorChips');
    if (chipRow) {
      var chips = [''].concat(Object.keys(sectoresActivos).sort());
      chipRow.innerHTML = chips.map(function (sec) {
        var active = ui.selectedHomeSector === sec;
        return '<button type="button" class="chip' + (active ? ' is-active' : '') + '" data-home-sector="' + escapeHtml(sec) + '">' +
          escapeHtml(sec || 'Todos los sectores') + '</button>';
      }).join('');
    }

    var featured = store.filterProductos({
      sector: ui.selectedHomeSector,
      sort: 'destacados'
    }).slice(0, 6);

    var grid = $('homeFeaturedGrid');
    if (grid) {
      if (featured.length === 0) {
        grid.innerHTML = '<div class="empty-state">No hay productos en este sector todavía. Publique el primero desde el Portal Admin.</div>';
      } else {
        grid.innerHTML = featured.map(function (p) { return renderProductCardHtml(p, st.favoritos); }).join('');
      }
    }
  }

  function renderCatalog() {
    var st = store.getState();
    var list = store.filterProductos({
      query: $('catalogSearch') ? $('catalogSearch').value : '',
      sector: $('catalogSector') ? $('catalogSector').value : '',
      empresaId: $('catalogEmpresa') ? $('catalogEmpresa').value : '',
      sort: $('catalogSort') ? $('catalogSort').value : 'destacados'
    });

    var countEl = $('catalogResultCount');
    if (countEl) {
      countEl.textContent = list.length === 1
        ? '1 producto encontrado'
        : list.length + ' productos encontrados';
    }

    var grid = $('catalogGrid');
    if (!grid) return;
    if (list.length === 0) {
      grid.innerHTML = '<div class="empty-state">No se encontraron productos con esos filtros. Intente limpiar la búsqueda o publicar un nuevo artículo.</div>';
      return;
    }
    grid.innerHTML = list.map(function (p) { return renderProductCardHtml(p, st.favoritos); }).join('');
  }

  function renderEmpresas() {
    var st = store.getState();
    var q = ($('empresasSearch') ? $('empresasSearch').value : '').trim().toLowerCase();
    var sec = $('empresasSector') ? $('empresasSector').value : '';

    var counts = {};
    st.productos.forEach(function (p) { counts[p.empresaId] = (counts[p.empresaId] || 0) + 1; });

    var filtered = st.empresas.filter(function (e) {
      if (sec && e.sector !== sec) return false;
      if (q) {
        var hay = (e.nombre + ' ' + e.sector + ' ' + e.contacto + ' ' + e.direccion + ' ' + e.descripcion).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    var grid = $('empresasGrid');
    if (!grid) return;
    if (filtered.length === 0) {
      grid.innerHTML = '<div class="empty-state">No hay empresas registradas que coincidan con la búsqueda.</div>';
      return;
    }

    grid.innerHTML = filtered.map(function (e) {
      var links = U.buildContactLinks(e, null);
      var prodCount = counts[e.id] || 0;
      var logoSrc = safeImg(e.logo);

      return (
        '<article class="company-card">' +
          '<div class="card-body">' +
            '<div class="company-header">' +
              '<img class="company-avatar" src="' + escapeHtml(logoSrc) + '" alt="' + escapeHtml(e.nombre) + '" ' +
                'data-zoom-img="' + escapeHtml(logoSrc) + '" data-zoom-title="' + escapeHtml(e.nombre) + '" style="cursor:zoom-in;" />' +
              '<div>' +
                '<h3 class="card-title">' + escapeHtml(e.nombre) + '</h3>' +
                '<span class="pill-tag">' + escapeHtml(e.sector) + '</span>' +
              '</div>' +
            '</div>' +
            '<p class="card-desc">' + escapeHtml(e.descripcion || 'Microempresa participante del programa Ideas Productivas.') + '</p>' +
            '<ul class="info-list" style="margin:4px 0;">' +
              '<li><strong>Contacto:</strong> ' + escapeHtml(e.contacto) + '</li>' +
              (e.direccion ? '<li><strong>Ubicación:</strong> ' + escapeHtml(e.direccion) + '</li>' : '') +
              '<li><strong>Productos activos:</strong> ' + prodCount + '</li>' +
            '</ul>' +
            '<div class="contact-actions" style="margin:6px 0 0;">' +
              '<button type="button" class="btn btn-primary btn-sm" data-filter-empresa="' + escapeHtml(e.id) + '">Ver productos (' + prodCount + ')</button>' +
              (links.whatsapp ? '<a class="btn btn-success btn-sm" href="' + escapeHtml(links.whatsapp) + '" target="_blank" rel="noopener">WhatsApp</a>' : '') +
              (links.email ? '<a class="btn btn-ghost btn-sm" href="' + escapeHtml(links.email) + '">Correo</a>' : '') +
              (links.tel ? '<a class="btn btn-ghost btn-sm" href="' + escapeHtml(links.tel) + '">Llamar</a>' : '') +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  function renderAdmin() {
    var st = store.getState();
    var unread = st.mensajes.filter(function (m) { return !m.leido; }).length;
    var empMap = {};
    var prodCount = {};
    st.empresas.forEach(function (e) { empMap[e.id] = e; });
    st.productos.forEach(function (p) { prodCount[p.empresaId] = (prodCount[p.empresaId] || 0) + 1; });

    // Badges
    ['adminUnreadNavBadge', 'adminUnreadTabBadge'].forEach(function (id) {
      var b = $(id);
      if (!b) return;
      b.textContent = String(unread);
      b.hidden = unread === 0;
    });

    var kpi = $('adminKpiGrid');
    if (kpi) {
      kpi.innerHTML =
        '<div class="kpi-card"><div class="kpi-label">Empresas activas</div><div class="kpi-value">' + st.empresas.length + '</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Productos en catálogo</div><div class="kpi-value">' + st.productos.length + '</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Consultas sin leer</div><div class="kpi-value">' + unread + '</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Guardados en interés</div><div class="kpi-value">' + st.favoritos.length + '</div></div>';
    }

    // Admin Empresas Table
    var empTbody = $('adminEmpresasTbody');
    if (empTbody) {
      if (st.empresas.length === 0) {
        empTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);">No hay empresas registradas.</td></tr>';
      } else {
        empTbody.innerHTML = st.empresas.map(function (e) {
          var img = safeImg(e.logo);
          return (
            '<tr>' +
              '<td><img class="table-thumb" src="' + escapeHtml(img) + '" alt="' + escapeHtml(e.nombre) + '" data-zoom-img="' + escapeHtml(img) + '" data-zoom-title="' + escapeHtml(e.nombre) + '" style="cursor:zoom-in;" /></td>' +
              '<td><strong>' + escapeHtml(e.nombre) + '</strong><br><span style="font-size:12px;color:var(--text-muted);">' + escapeHtml(e.sector) + '</span></td>' +
              '<td>' + escapeHtml(e.contacto) + '<br><span style="font-size:12px;color:var(--text-muted);">' + escapeHtml(e.telefono || e.email || '—') + '</span></td>' +
              '<td><span class="pill-tag">' + (prodCount[e.id] || 0) + '</span></td>' +
              '<td><div class="toolbar-inline">' +
                '<button type="button" class="btn btn-ghost btn-sm" data-edit-empresa="' + escapeHtml(e.id) + '">Editar</button>' +
                '<button type="button" class="btn btn-danger btn-sm" data-delete-empresa="' + escapeHtml(e.id) + '">Eliminar</button>' +
              '</div></td>' +
            '</tr>'
          );
        }).join('');
      }
    }

    // Admin Productos Table
    var prodTbody = $('adminProductosTbody');
    if (prodTbody) {
      if (st.productos.length === 0) {
        prodTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);">No hay productos publicados.</td></tr>';
      } else {
        prodTbody.innerHTML = st.productos.map(function (p) {
          var emp = empMap[p.empresaId];
          var img = safeImg(p.imagen);
          return (
            '<tr>' +
              '<td><img class="table-thumb" src="' + escapeHtml(img) + '" alt="' + escapeHtml(p.nombre) + '" data-zoom-img="' + escapeHtml(img) + '" data-zoom-title="' + escapeHtml(p.nombre) + '" style="cursor:zoom-in;" /></td>' +
              '<td><strong>' + escapeHtml(p.nombre) + '</strong><br><span style="font-size:12px;color:var(--text-muted);">' + escapeHtml(emp ? emp.nombre : 'Sin empresa') + ' · Stock: ' + p.stock + '</span></td>' +
              '<td><strong>' + escapeHtml(U.formatCRC(p.precio)) + '</strong></td>' +
              '<td>' + (p.destacado ? '<span class="pill-tag is-success">★ Destacado</span>' : '<span style="font-size:12px;color:var(--text-muted);">Estándar</span>') + '</td>' +
              '<td><div class="toolbar-inline">' +
                '<button type="button" class="btn btn-ghost btn-sm" data-edit-producto="' + escapeHtml(p.id) + '">Editar</button>' +
                '<button type="button" class="btn btn-danger btn-sm" data-delete-producto="' + escapeHtml(p.id) + '">Eliminar</button>' +
              '</div></td>' +
            '</tr>'
          );
        }).join('');
      }
    }

    // Admin Mensajes List
    var msgList = $('adminMensajesList');
    if (msgList) {
      if (st.mensajes.length === 0) {
        msgList.innerHTML = '<div class="empty-state">Aún no hay mensajes de compradores. Las consultas enviadas desde productos o la pestaña Contacto aparecerán aquí.</div>';
      } else {
        msgList.innerHTML = st.mensajes.map(function (m) {
          return (
            '<article class="msg-card' + (m.leido ? '' : ' is-unread') + '">' +
              '<div class="msg-card-head">' +
                '<div>' +
                  '<strong>' + escapeHtml(m.remitente) + '</strong> ' +
                  (m.leido ? '<span class="pill-tag">Leído</span>' : '<span class="pill-tag is-warn">Nuevo</span>') +
                  '<div style="font-size:12px;color:var(--text-muted);">Para: ' + escapeHtml(m.destinatario) + (m.productoNombre ? ' · Producto: ' + escapeHtml(m.productoNombre) : '') + '</div>' +
                '</div>' +
                '<span style="font-size:12px;color:var(--text-muted);">' + escapeHtml(formatDate(m.creadoEn)) + '</span>' +
              '</div>' +
              '<p style="margin:0;font-size:14px;">' + escapeHtml(m.mensaje) + '</p>' +
              '<div class="toolbar-inline" style="justify-content:space-between;">' +
                '<span style="font-size:12.5px;color:var(--text-muted);">' +
                  (m.correo ? '✉ ' + escapeHtml(m.correo) + '  ' : '') +
                  (m.telefono ? '☎ ' + escapeHtml(m.telefono) : '') +
                '</span>' +
                '<div class="toolbar-inline">' +
                  '<button type="button" class="btn btn-ghost btn-sm" data-toggle-msg="' + escapeHtml(m.id) + '" data-leido="' + (m.leido ? 'false' : 'true') + '">' +
                    (m.leido ? 'Marcar sin leer' : 'Marcar leído') +
                  '</button>' +
                  '<button type="button" class="btn btn-danger btn-sm" data-delete-msg="' + escapeHtml(m.id) + '">Eliminar</button>' +
                '</div>' +
              '</div>' +
            '</article>'
          );
        }).join('');
      }
    }
  }

  function renderFavoritesBadge() {
    var st = store.getState();
    var badge = $('favCountBadge');
    if (badge) badge.textContent = String(st.favoritos.length);
  }

  function renderAll() {
    renderSelectOptions();
    renderFavoritesBadge();
    renderCarousel();
    renderHome();
    renderCatalog();
    renderEmpresas();
    renderAdmin();
  }

  /* ==================== IMAGE UPLOAD + COMPRESSION + PREVIEW ==================== */
  function compressImageFile(file, maxDim, quality, callback) {
    if (!file || !/^image\//i.test(file.type || '')) {
      callback(new Error('Seleccione únicamente archivos de imagen (JPG, PNG, WebP o GIF).'));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      callback(new Error('La imagen supera el límite de 10 MB.'));
      return;
    }

    var reader = new FileReader();
    reader.onerror = function () { callback(new Error('No se pudo leer el archivo seleccionado.')); };
    reader.onload = function (ev) {
      var rawDataUrl = ev.target.result;
      var img = new Image();
      img.onerror = function () { callback(null, rawDataUrl, Math.round(file.size / 1024)); };
      img.onload = function () {
        try {
          var w = img.width;
          var h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w >= h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          var canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          var compressed = canvas.toDataURL('image/jpeg', quality);
          var approxKb = Math.max(1, Math.round((compressed.length * 0.75) / 1024));
          callback(null, compressed, approxKb);
        } catch (err) {
          callback(null, rawDataUrl, Math.round(file.size / 1024));
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  }

  function setPreview(kind, src, metaText) {
    var isProd = kind === 'prod';
    var wrap = $(isProd ? 'prodPreviewWrap' : 'empLogoPreviewWrap');
    var img = $(isProd ? 'prodPreviewImg' : 'empLogoPreviewImg');
    var meta = $(isProd ? 'prodPreviewMeta' : 'empLogoMeta');

    if (isProd) ui.prodImageData = src || '';
    else ui.empLogoData = src || '';

    if (src && U.isSafeImageSrc(src)) {
      if (img) img.src = src;
      if (meta) meta.textContent = metaText || 'Vista previa lista';
      if (wrap) wrap.classList.add('has-image');
    } else {
      if (img) img.removeAttribute('src');
      if (wrap) wrap.classList.remove('has-image');
    }
  }

  function setupDropzone(kind) {
    var isProd = kind === 'prod';
    var zone = $(isProd ? 'prodDropzone' : 'empDropzone');
    var fileInput = $(isProd ? 'prodImageFile' : 'empLogoFile');
    var urlInput = $(isProd ? 'prodImageUrl' : 'empLogoUrl');
    var clearBtn = $(isProd ? 'prodImageClearBtn' : 'empLogoClearBtn');
    var presetsBox = $(isProd ? 'prodImagePresets' : 'empLogoPresets');

    function handleFile(file) {
      compressImageFile(file, 900, 0.82, function (err, dataUrl, kb) {
        if (err) {
          showToast(err.message);
          return;
        }
        if (urlInput) urlInput.value = '';
        setPreview(kind, dataUrl, file.name + ' · optimizada (~' + kb + ' KB)');
        showToast('Vista previa cargada correctamente');
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
      });
    }

    if (zone) {
      ['dragenter', 'dragover'].forEach(function (evName) {
        zone.addEventListener(evName, function (e) {
          e.preventDefault();
          zone.classList.add('is-dragover');
        });
      });
      ['dragleave', 'drop'].forEach(function (evName) {
        zone.addEventListener(evName, function (e) {
          e.preventDefault();
          zone.classList.remove('is-dragover');
        });
      });
      zone.addEventListener('drop', function (e) {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
        }
      });
    }

    if (urlInput) {
      urlInput.addEventListener('input', function () {
        var val = urlInput.value.trim();
        if (U.isSafeImageSrc(val)) {
          setPreview(kind, val, 'Imagen desde URL / ruta');
        } else if (!val) {
          setPreview(kind, '', '');
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (fileInput) fileInput.value = '';
        if (urlInput) urlInput.value = '';
        setPreview(kind, '', '');
      });
    }

    if (presetsBox) {
      presetsBox.innerHTML = GALLERY_PRESETS.map(function (g) {
        return '<button type="button" class="preset-thumb-btn" data-preset-kind="' + kind + '" data-preset-src="' + escapeHtml(g.src) + '" title="' + escapeHtml(g.label) + '">' +
          '<img src="' + escapeHtml(g.src) + '" alt="' + escapeHtml(g.label) + '" />' +
        '</button>';
      }).join('');
    }
  }

  /* ==================== MODALS & LIGHTBOX ==================== */
  function openModal(id) {
    var el = $(id);
    if (el) el.classList.add('is-open');
  }

  function closeModal(id) {
    var el = $(id);
    if (el) el.classList.remove('is-open');
  }

  function closeAllModals() {
    closeModal('lightboxModal');
    closeModal('productModal');
    closeModal('favModal');
  }

  function openLightbox(src, caption) {
    var img = $('lightboxImg');
    var cap = $('lightboxCaption');
    if (!img) return;
    img.src = safeImg(src);
    img.alt = caption || 'Vista previa ampliada';
    if (cap) cap.textContent = caption || '';
    openModal('lightboxModal');
  }

  function openProductModal(productId) {
    var st = store.getState();
    var prod = null;
    for (var i = 0; i < st.productos.length; i++) {
      if (st.productos[i].id === productId) { prod = st.productos[i]; break; }
    }
    if (!prod) return;

    var emp = store.getEmpresaById(prod.empresaId);
    var links = U.buildContactLinks(emp, prod);
    var isFav = st.favoritos.indexOf(prod.id) >= 0;
    var imgSrc = safeImg(prod.imagen);

    var title = $('productModalTitle');
    if (title) title.textContent = prod.nombre;

    var body = $('productModalBody');
    if (!body) return;

    body.innerHTML =
      '<div class="modal-product-grid">' +
        '<div>' +
          '<img class="modal-product-img" src="' + escapeHtml(imgSrc) + '" alt="' + escapeHtml(prod.nombre) + '" ' +
            'data-zoom-img="' + escapeHtml(imgSrc) + '" data-zoom-title="' + escapeHtml(prod.nombre) + '" />' +
          '<p style="font-size:12px;color:var(--text-muted);margin:6px 0 0;">Haga clic en la foto para verla en pantalla completa.</p>' +
        '</div>' +
        '<div>' +
          '<div class="toolbar-inline" style="margin-bottom:8px;">' +
            '<span class="pill-tag">' + escapeHtml(prod.condicion || 'Nuevo') + '</span>' +
            (emp ? '<span class="pill-tag is-success">' + escapeHtml(emp.sector) + '</span>' : '') +
          '</div>' +
          '<div class="price-tag" style="font-size:24px;margin-bottom:8px;">' + escapeHtml(U.formatCRC(prod.precio)) + '</div>' +
          '<p style="margin:0 0 12px;font-size:14.5px;">' + escapeHtml(prod.descripcion || 'Sin descripción adicional.') + '</p>' +
          '<ul class="info-list">' +
            '<li><strong>Disponibilidad:</strong> ' + escapeHtml(prod.stock) + ' unidades</li>' +
            (emp ? '<li><strong>Empresa:</strong> ' + escapeHtml(emp.nombre) + '</li>' : '') +
            (emp ? '<li><strong>Contacto:</strong> ' + escapeHtml(emp.contacto) + '</li>' : '') +
            (emp && emp.telefono ? '<li><strong>Teléfono:</strong> ' + escapeHtml(emp.telefono) + '</li>' : '') +
            (emp && emp.direccion ? '<li><strong>Ubicación:</strong> ' + escapeHtml(emp.direccion) + '</li>' : '') +
          '</ul>' +
          '<div class="contact-actions">' +
            (links.whatsapp ? '<a class="btn btn-success btn-sm" href="' + escapeHtml(links.whatsapp) + '" target="_blank" rel="noopener">💬 WhatsApp</a>' : '') +
            (links.email ? '<a class="btn btn-primary btn-sm" href="' + escapeHtml(links.email) + '">✉ Correo</a>' : '') +
            (links.tel ? '<a class="btn btn-ghost btn-sm" href="' + escapeHtml(links.tel) + '">☎ Llamar</a>' : '') +
            (emp && emp.telefono ? '<button type="button" class="btn btn-ghost btn-sm" data-copy-text="' + escapeHtml(emp.telefono) + '">📋 Copiar tel.</button>' : '') +
            '<button type="button" class="btn btn-ghost btn-sm" data-toggle-fav="' + escapeHtml(prod.id) + '" data-refresh-modal="' + escapeHtml(prod.id) + '">' +
              (isFav ? '♥ En mi interés' : '♡ Guardar interés') +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<hr class="modal-divider" />' +
      '<form id="quickProductMsgForm" class="form-grid" data-prod-name="' + escapeHtml(prod.nombre) + '" data-emp-id="' + escapeHtml(emp ? emp.id : '') + '" data-emp-name="' + escapeHtml(emp ? emp.nombre : 'UTN-IMAS') + '">' +
        '<h4 style="margin:0;">Enviar mensaje directo al vendedor</h4>' +
        '<div class="form-row-2">' +
          '<input name="remitente" type="text" class="input" required placeholder="Su nombre *" />' +
          '<input name="telefono" type="tel" class="input" placeholder="Su teléfono o WhatsApp" />' +
        '</div>' +
        '<input name="correo" type="email" class="input" placeholder="Su correo electrónico" />' +
        '<textarea name="mensaje" rows="2" class="textarea" required placeholder="Hola, quisiera consultar disponibilidad o envío de este producto..."></textarea>' +
        '<div><button type="submit" class="btn btn-primary btn-sm">Enviar consulta a ' + escapeHtml(emp ? emp.nombre : 'UTN-IMAS') + '</button></div>' +
      '</form>';

    openModal('productModal');
  }

  function openFavoritesModal() {
    var st = store.getState();
    var prodMap = {};
    var empMap = {};
    st.productos.forEach(function (p) { prodMap[p.id] = p; });
    st.empresas.forEach(function (e) { empMap[e.id] = e; });

    var items = st.favoritos.map(function (id) { return prodMap[id]; }).filter(Boolean);
    var body = $('favModalBody');
    var footer = $('favModalFooter');
    if (!body || !footer) return;

    if (items.length === 0) {
      body.innerHTML = '<div class="empty-state">Su lista de interés está vacía. Marque productos con ♡ para guardarlos aquí.</div>';
      footer.innerHTML = '';
    } else {
      var total = 0;
      body.innerHTML = items.map(function (p) {
        total += Number(p.precio) || 0;
        var emp = empMap[p.empresaId];
        return (
          '<div class="fav-item">' +
            '<img src="' + escapeHtml(safeImg(p.imagen)) + '" alt="' + escapeHtml(p.nombre) + '" />' +
            '<div class="fav-item-info">' +
              '<h4>' + escapeHtml(p.nombre) + '</h4>' +
              '<p>' + escapeHtml(emp ? emp.nombre : 'UTN-IMAS') + ' · <strong>' + escapeHtml(U.formatCRC(p.precio)) + '</strong></p>' +
            '</div>' +
            '<div class="toolbar-inline">' +
              '<button type="button" class="btn btn-primary btn-sm" data-open-product="' + escapeHtml(p.id) + '">Ver</button>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-toggle-fav="' + escapeHtml(p.id) + '" data-refresh-fav="1">Quitar</button>' +
            '</div>' +
          '</div>'
        );
      }).join('');

      var summaryText = 'Hola UTN-IMAS, me interesan estos productos: ' +
        items.map(function (p) { return p.nombre + ' (' + U.formatCRC(p.precio) + ')'; }).join(', ') +
        '. Total estimado: ' + U.formatCRC(total) + '.';
      var waUrl = 'https://wa.me/50624355000?text=' + encodeURIComponent(summaryText);

      footer.innerHTML =
        '<div class="toolbar-inline" style="justify-content:space-between;">' +
          '<div><strong>Total estimado:</strong> <span class="price-tag">' + escapeHtml(U.formatCRC(total)) + '</span></div>' +
          '<a class="btn btn-success btn-sm" href="' + escapeHtml(waUrl) + '" target="_blank" rel="noopener">💬 Consultar lista por WhatsApp</a>' +
        '</div>';
    }

    openModal('favModal');
  }

  /* ==================== ADMIN FORMS ==================== */
  function resetEmpresaForm() {
    $('empresaForm').reset();
    $('empId').value = '';
    $('empFormTitle').textContent = 'Registrar nueva empresa';
    $('empSubmitBtn').textContent = 'Guardar empresa';
    $('empCancelEditBtn').hidden = true;
    setPreview('emp', '', '');
  }

  function loadEmpresaIntoForm(id) {
    var emp = store.getEmpresaById(id);
    if (!emp) return;
    $('empId').value = emp.id;
    $('empNombre').value = emp.nombre || '';
    $('empSector').value = emp.sector || 'Comercio';
    $('empContacto').value = emp.contacto || '';
    $('empTelefono').value = emp.telefono || '';
    $('empEmail').value = emp.email || '';
    $('empDireccion').value = emp.direccion || '';
    $('empDescripcion').value = emp.descripcion || '';
    $('empLogoUrl').value = (emp.logo && emp.logo.indexOf('data:') !== 0) ? emp.logo : '';
    setPreview('emp', emp.logo, 'Imagen actual de la empresa');
    $('empFormTitle').textContent = 'Editando: ' + emp.nombre;
    $('empSubmitBtn').textContent = 'Actualizar empresa';
    $('empCancelEditBtn').hidden = false;
    switchView('admin');
    switchAdminTab('empresas');
  }

  function resetProductoForm() {
    $('productoForm').reset();
    $('prodId').value = '';
    $('prodStock').value = '10';
    $('prodDestacado').checked = true;
    $('prodFormTitle').textContent = 'Publicar nuevo producto';
    $('prodSubmitBtn').textContent = 'Publicar producto';
    $('prodCancelEditBtn').hidden = true;
    setPreview('prod', '', '');
  }

  function loadProductoIntoForm(id) {
    var st = store.getState();
    var prod = null;
    for (var i = 0; i < st.productos.length; i++) {
      if (st.productos[i].id === id) { prod = st.productos[i]; break; }
    }
    if (!prod) return;
    $('prodId').value = prod.id;
    $('prodNombre').value = prod.nombre || '';
    $('prodEmpresaId').value = prod.empresaId || '';
    $('prodPrecio').value = prod.precio;
    $('prodStock').value = prod.stock;
    $('prodCondicion').value = prod.condicion || 'Nuevo';
    $('prodDescripcion').value = prod.descripcion || '';
    $('prodDestacado').checked = Boolean(prod.destacado);
    $('prodImageUrl').value = (prod.imagen && prod.imagen.indexOf('data:') !== 0) ? prod.imagen : '';
    setPreview('prod', prod.imagen, 'Imagen actual del producto');
    $('prodFormTitle').textContent = 'Editando: ' + prod.nombre;
    $('prodSubmitBtn').textContent = 'Actualizar producto';
    $('prodCancelEditBtn').hidden = false;
    switchView('admin');
    switchAdminTab('productos');
  }

  /* ==================== EVENT WIRING ==================== */
  function bindEvents() {
    applyTheme(getCurrentTheme(), false);

    $('themeToggleBtn').addEventListener('click', toggleTheme);
    $('openFavBtn').addEventListener('click', openFavoritesModal);
    $('fabContactBtn').addEventListener('click', function () { switchView('contacto'); });

    $('brandHomeLink').addEventListener('click', function (e) {
      e.preventDefault();
      switchView('inicio');
    });

    $('mobileMenuBtn').addEventListener('click', function () {
      var nav = $('mainNav');
      var open = nav.classList.toggle('is-open');
      $('mobileMenuBtn').setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    $('mainNav').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-view]');
      if (btn) switchView(btn.getAttribute('data-view'));
    });

    $('goCatalogBtn').addEventListener('click', function () { switchView('catalogo'); });
    $('goAdminFromHomeBtn').addEventListener('click', function () {
      switchView('admin');
      switchAdminTab('empresas');
    });
    $('goRegisterCompanyBtn').addEventListener('click', function () {
      switchView('admin');
      switchAdminTab('empresas');
      $('empNombre').focus();
    });

    // Carousel controls
    $('carouselPrev').addEventListener('click', function () { goToSlide(ui.carouselIndex - 1); restartCarouselAutoplay(); });
    $('carouselNext').addEventListener('click', function () { goToSlide(ui.carouselIndex + 1); restartCarouselAutoplay(); });
    $('heroCarousel').addEventListener('mouseenter', stopCarouselAutoplay);
    $('heroCarousel').addEventListener('mouseleave', restartCarouselAutoplay);
    $('heroCarousel').addEventListener('focusin', stopCarouselAutoplay);
    $('heroCarousel').addEventListener('focusout', restartCarouselAutoplay);
    $('heroCarousel').addEventListener('touchstart', function (e) {
      if (e.touches && e.touches[0]) ui.touchStartX = e.touches[0].clientX;
    }, { passive: true });
    $('heroCarousel').addEventListener('touchend', function (e) {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      var dx = e.changedTouches[0].clientX - ui.touchStartX;
      if (Math.abs(dx) > 40) {
        goToSlide(ui.carouselIndex + (dx < 0 ? 1 : -1));
        restartCarouselAutoplay();
      }
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeAllModals();
        closeMobileMenu();
        return;
      }
      var tag = document.activeElement && document.activeElement.tagName;
      if (ui.activeView === 'inicio' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        if (e.key === 'ArrowRight') { goToSlide(ui.carouselIndex + 1); restartCarouselAutoplay(); }
        if (e.key === 'ArrowLeft') { goToSlide(ui.carouselIndex - 1); restartCarouselAutoplay(); }
      }
    });

    // Filters
    ['catalogSearch', 'catalogSector', 'catalogEmpresa', 'catalogSort'].forEach(function (id) {
      var el = $(id);
      if (el) {
        el.addEventListener('input', renderCatalog);
        el.addEventListener('change', renderCatalog);
      }
    });
    $('catalogClearFilters').addEventListener('click', function () {
      $('catalogSearch').value = '';
      $('catalogSector').value = '';
      $('catalogEmpresa').value = '';
      $('catalogSort').value = 'destacados';
      renderCatalog();
    });

    ['empresasSearch', 'empresasSector'].forEach(function (id) {
      var el = $(id);
      if (el) {
        el.addEventListener('input', renderEmpresas);
        el.addEventListener('change', renderEmpresas);
      }
    });

    // Admin forms
    setupDropzone('emp');
    setupDropzone('prod');

    $('empresaForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var res = store.saveEmpresa({
        id: $('empId').value.trim(),
        nombre: $('empNombre').value,
        sector: $('empSector').value,
        contacto: $('empContacto').value,
        telefono: $('empTelefono').value,
        email: $('empEmail').value,
        direccion: $('empDireccion').value,
        descripcion: $('empDescripcion').value,
        logo: ui.empLogoData || $('empLogoUrl').value.trim()
      });
      if (!res.ok) {
        showToast(res.error);
        return;
      }
      var wasEdit = Boolean($('empId').value.trim());
      resetEmpresaForm();
      renderAll();
      showToast(wasEdit ? 'Empresa actualizada correctamente' : 'Empresa registrada y guardada');
    });
    $('empCancelEditBtn').addEventListener('click', resetEmpresaForm);

    $('productoForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var res = store.saveProducto({
        id: $('prodId').value.trim(),
        nombre: $('prodNombre').value,
        empresaId: $('prodEmpresaId').value,
        precio: $('prodPrecio').value,
        stock: $('prodStock').value,
        condicion: $('prodCondicion').value,
        descripcion: $('prodDescripcion').value,
        destacado: $('prodDestacado').checked,
        imagen: ui.prodImageData || $('prodImageUrl').value.trim()
      });
      if (!res.ok) {
        showToast(res.error);
        return;
      }
      var wasEdit = Boolean($('prodId').value.trim());
      resetProductoForm();
      renderAll();
      showToast(wasEdit ? 'Producto actualizado correctamente' : 'Producto publicado y guardado');
    });
    $('prodCancelEditBtn').addEventListener('click', resetProductoForm);

    // Backup JSON Export / Import / Reset Demo
    $('exportJsonBtn').addEventListener('click', function () {
      var blob = new Blob([store.exportJson()], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'utnimas-respaldo-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Respaldo JSON descargado');
    });

    $('importJsonInput').addEventListener('change', function () {
      var file = this.files && this.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        var res = store.importJson(ev.target.result);
        if (!res.ok) {
          showToast(res.error);
        } else {
          renderAll();
          showToast('Importados ' + res.countEmpresas + ' empresas y ' + res.countProductos + ' productos');
        }
      };
      reader.readAsText(file);
      this.value = '';
    });

    $('resetDemoBtn').addEventListener('click', function () {
      if (!window.confirm('¿Restaurar los datos de demostración originales? Esto reemplazará los cambios locales actuales.')) return;
      store.resetDemo();
      resetEmpresaForm();
      resetProductoForm();
      renderAll();
      showToast('Datos de demostración restaurados');
    });

    // Contact form
    $('contactForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var destVal = $('contactDestinatario').value;
      var emp = store.getEmpresaById(destVal);
      var res = store.addMensaje({
        destinatario: emp ? emp.nombre : 'Coordinación UTN – IMAS',
        empresaId: emp ? emp.id : '',
        remitente: $('contactNombre').value,
        correo: $('contactCorreo').value,
        telefono: $('contactTelefono').value,
        mensaje: $('contactMensaje').value
      });
      if (!res.ok) {
        showToast(res.error);
        return;
      }
      $('contactForm').reset();
      renderAdmin();
      showToast('Consulta enviada y registrada en la bandeja del Portal Admin');
    });

    // Modal close handlers
    $('productModalClose').addEventListener('click', function () { closeModal('productModal'); });
    $('favModalClose').addEventListener('click', function () { closeModal('favModal'); });
    $('lightboxClose').addEventListener('click', function () { closeModal('lightboxModal'); });

    ['productModal', 'favModal', 'lightboxModal'].forEach(function (id) {
      $(id).addEventListener('click', function (e) {
        if (e.target.id === id) closeModal(id);
      });
    });

    // Global delegated clicks & forms
    document.addEventListener('click', function (e) {
      var dot = e.target.closest('[data-carousel-dot]');
      if (dot) {
        goToSlide(parseInt(dot.getAttribute('data-carousel-dot'), 10));
        restartCarouselAutoplay();
        return;
      }

      var homeChip = e.target.closest('[data-home-sector]');
      if (homeChip) {
        ui.selectedHomeSector = homeChip.getAttribute('data-home-sector');
        renderHome();
        return;
      }

      var zoom = e.target.closest('[data-zoom-img]');
      if (zoom) {
        openLightbox(zoom.getAttribute('data-zoom-img'), zoom.getAttribute('data-zoom-title'));
        return;
      }

      var openProd = e.target.closest('[data-open-product]');
      if (openProd) {
        closeModal('favModal');
        openProductModal(openProd.getAttribute('data-open-product'));
        return;
      }

      var toggleFav = e.target.closest('[data-toggle-fav]');
      if (toggleFav) {
        var pid = toggleFav.getAttribute('data-toggle-fav');
        var r = store.toggleFavorito(pid);
        renderFavoritesBadge();
        renderHome();
        renderCatalog();
        renderAdmin();
        if (toggleFav.getAttribute('data-refresh-modal')) openProductModal(pid);
        if (toggleFav.getAttribute('data-refresh-fav')) openFavoritesModal();
        showToast(r.added ? 'Agregado a tu lista de interés' : 'Quitado de tu lista de interés');
        return;
      }

      var copyBtn = e.target.closest('[data-copy-text]');
      if (copyBtn) {
        var txt = copyBtn.getAttribute('data-copy-text');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(txt).then(function () { showToast('Copiado: ' + txt); });
        } else {
          showToast('Teléfono: ' + txt);
        }
        return;
      }

      var filterEmp = e.target.closest('[data-filter-empresa]');
      if (filterEmp) {
        $('catalogEmpresa').value = filterEmp.getAttribute('data-filter-empresa');
        $('catalogSector').value = '';
        $('catalogSearch').value = '';
        renderCatalog();
        switchView('catalogo');
        return;
      }

      var adminTab = e.target.closest('[data-admin-tab]');
      if (adminTab) {
        switchAdminTab(adminTab.getAttribute('data-admin-tab'));
        return;
      }

      var jumpAdmin = e.target.closest('[data-jump-admin]');
      if (jumpAdmin) {
        switchView('admin');
        switchAdminTab(jumpAdmin.getAttribute('data-jump-admin'));
        return;
      }

      var goView = e.target.closest('[data-go-view]');
      if (goView) {
        switchView(goView.getAttribute('data-go-view'));
        return;
      }

      var preset = e.target.closest('[data-preset-src]');
      if (preset) {
        var pKind = preset.getAttribute('data-preset-kind');
        var pSrc = preset.getAttribute('data-preset-src');
        var urlEl = $(pKind === 'prod' ? 'prodImageUrl' : 'empLogoUrl');
        if (urlEl) urlEl.value = pSrc;
        setPreview(pKind, pSrc, 'Imagen de galería seleccionada');
        return;
      }

      var editEmp = e.target.closest('[data-edit-empresa]');
      if (editEmp) { loadEmpresaIntoForm(editEmp.getAttribute('data-edit-empresa')); return; }

      var delEmp = e.target.closest('[data-delete-empresa]');
      if (delEmp) {
        if (!window.confirm('¿Eliminar esta empresa y sus productos asociados?')) return;
        store.deleteEmpresa(delEmp.getAttribute('data-delete-empresa'));
        renderAll();
        showToast('Empresa eliminada');
        return;
      }

      var editProd = e.target.closest('[data-edit-producto]');
      if (editProd) { loadProductoIntoForm(editProd.getAttribute('data-edit-producto')); return; }

      var delProd = e.target.closest('[data-delete-producto]');
      if (delProd) {
        if (!window.confirm('¿Eliminar este producto del catálogo?')) return;
        store.deleteProducto(delProd.getAttribute('data-delete-producto'));
        renderAll();
        showToast('Producto eliminado');
        return;
      }

      var toggleMsg = e.target.closest('[data-toggle-msg]');
      if (toggleMsg) {
        store.markMensajeLeido(toggleMsg.getAttribute('data-toggle-msg'), toggleMsg.getAttribute('data-leido') === 'true');
        renderAdmin();
        return;
      }

      var delMsg = e.target.closest('[data-delete-msg]');
      if (delMsg) {
        store.deleteMensaje(delMsg.getAttribute('data-delete-msg'));
        renderAdmin();
        showToast('Mensaje eliminado');
      }
    });

    // Quick message submit inside Product Modal
    document.addEventListener('submit', function (e) {
      if (e.target && e.target.id === 'quickProductMsgForm') {
        e.preventDefault();
        var f = e.target;
        var res = store.addMensaje({
          destinatario: f.getAttribute('data-emp-name'),
          empresaId: f.getAttribute('data-emp-id'),
          productoNombre: f.getAttribute('data-prod-name'),
          remitente: f.elements.remitente.value,
          correo: f.elements.correo.value,
          telefono: f.elements.telefono.value,
          mensaje: f.elements.mensaje.value
        });
        if (!res.ok) {
          showToast(res.error);
          return;
        }
        f.reset();
        renderAdmin();
        showToast('Mensaje enviado a ' + f.getAttribute('data-emp-name'));
      }
    });

    // Cross-tab persistence synchronization
    window.addEventListener('storage', function (e) {
      if (e.key === U.STORAGE_KEY) {
        store.reload();
        renderAll();
      } else if (e.key === U.THEME_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
        applyTheme(e.newValue, false);
      }
    });
  }

  function init() {
    bindEvents();
    renderAll();
    var initialHash = (window.location.hash || '').replace(/^#/, '');
    if (initialHash) switchView(initialHash);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
