/* UTN-IMAS Ideas Productivas — Persistent Marketplace & Admin Store (Browser + Node UMD) */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.UtnimasStore = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var STORAGE_KEY = 'utnimas_marketplace_v2';
  var THEME_KEY = 'utnimas_theme';

  var SECTORES_IMAS = [
    'Agricultura',
    'Alimentación y Bebidas',
    'Apicultura y Pesca',
    'Artísticas y Entretenimiento',
    'Comercio',
    'Construcción',
    'Electrónica',
    'Enseñanza / Educación',
    'Ganadería',
    'Hotelería',
    'Manufactura',
    'Medicina, Salud y Farmacéutica',
    'Mercadeo',
    'Producción Madera',
    'Productos Químicos y de Limpieza',
    'Reciclaje',
    'Reparación y Mantenimiento',
    'Servicio Técnico',
    'Servicios Profesionales',
    'Textiles y Ropa',
    'Transportes',
    'Turismo'
  ];

  var DEFAULT_IMAGE = '../UTNIMAS/Content/Images/NoDisponible.jpg';

  function createSeedState() {
    var empresas = [
      {
        id: 'emp-1',
        nombre: 'Cafetalera Monte Verde',
        sector: 'Alimentación y Bebidas',
        contacto: 'María Fernanda Solís',
        telefono: '+506 8845-1201',
        email: 'ventas@monteverdecafe.cr',
        direccion: 'Alajuela Centro, 200m norte de la UTN',
        descripcion: 'Tostadora familiar de café de altura con prácticas sostenibles y venta directa.',
        logo: '../UTNIMAS/Content/Images/Markets/340436cf-5092-4e1a-aadc-e2e8c3034e85.jpg',
        verificada: true,
        creadaEn: '2026-11-01T09:00:00Z'
      },
      {
        id: 'emp-2',
        nombre: 'Feria Verde del Valle',
        sector: 'Agricultura',
        contacto: 'Carlos Alberto Rojas',
        telefono: '+506 8712-3402',
        email: 'pedidos@feriaverde.cr',
        direccion: 'Grecia, Alajuela, costado norte del Mercado',
        descripcion: 'Canastas orgánicas, miel pura y hortalizas cosechadas cada semana.',
        logo: '../UTNIMAS/Content/Images/Markets/Devaraja-Market.jpg',
        verificada: true,
        creadaEn: '2026-11-02T10:30:00Z'
      },
      {
        id: 'emp-3',
        nombre: 'Taller Textil Manos Creativas',
        sector: 'Textiles y Ropa',
        contacto: 'Laura Vanessa Mora',
        telefono: '+506 8620-7789',
        email: 'contacto@manoscreativas.cr',
        direccion: 'San Ramón, Alajuela',
        descripcion: 'Confección artesanal de bolsos, delantales y bordados personalizados.',
        logo: '../UTNIMAS/Content/Images/Markets/han-market-shops.jpg',
        verificada: true,
        creadaEn: '2026-11-04T14:15:00Z'
      },
      {
        id: 'emp-4',
        nombre: 'Ebanistería Raíces Ticas',
        sector: 'Producción Madera',
        contacto: 'Diego Andrés Chaves',
        telefono: '+506 8540-9011',
        email: 'info@raicesticas.cr',
        direccion: 'Sarchí Norte, Alajuela',
        descripcion: 'Tablas de cocina, muebles modulares y decoración con madera certificada.',
        logo: '../UTNIMAS/Content/Images/Markets/pagePropertiesImage.jpg',
        verificada: true,
        creadaEn: '2026-11-06T08:45:00Z'
      },
      {
        id: 'emp-5',
        nombre: 'Bazar Emprende UTN-IMAS',
        sector: 'Comercio',
        contacto: 'Sofía Jiménez',
        telefono: '+506 8990-4455',
        email: 'hola@bazaremprende.cr',
        direccion: 'Villa Bonita, Alajuela',
        descripcion: 'Vitrina cooperativa de bisutería, cerámica y regalos hechos a mano.',
        logo: '../UTNIMAS/Content/Images/Markets/Strasse-17-Juni-Flea-Market-3-800x400.jpg',
        verificada: true,
        creadaEn: '2026-11-08T11:20:00Z'
      }
    ];

    var productos = [
      {
        id: 'prod-1',
        empresaId: 'emp-1',
        nombre: 'Café Artesanal Monte Verde 500g',
        descripcion: 'Grano entero o molido tueste medio con notas a cacao y caramelo. Empaque con válvula fresca.',
        precio: 4800,
        stock: 24,
        condicion: 'Nuevo',
        destacado: true,
        imagen: '../UTNIMAS/Content/Images/Markets/340436cf-5092-4e1a-aadc-e2e8c3034e85.jpg',
        creadoEn: '2026-11-10T09:00:00Z'
      },
      {
        id: 'prod-2',
        empresaId: 'emp-2',
        nombre: 'Canasta Orgánica Familiar Semanal',
        descripcion: 'Incluye 12 variedades de frutas y vegetales locales recién cosechados más frasco de miel pura.',
        precio: 13500,
        stock: 15,
        condicion: 'Fresco',
        destacado: true,
        imagen: '../UTNIMAS/Content/Images/Markets/Devaraja-Market.jpg',
        creadoEn: '2026-11-11T10:00:00Z'
      },
      {
        id: 'prod-3',
        empresaId: 'emp-3',
        nombre: 'Bolso Tote Bordado a Mano',
        descripcion: 'Lona de algodón reforzada con bordado botánico costarricense y bolsillo interno con cierre.',
        precio: 18500,
        stock: 9,
        condicion: 'Artesanal',
        destacado: true,
        imagen: '../UTNIMAS/Content/Images/Markets/han-market-shops.jpg',
        creadoEn: '2026-11-12T11:00:00Z'
      },
      {
        id: 'prod-4',
        empresaId: 'emp-4',
        nombre: 'Tabla de Servir en Madera de Guanacaste',
        descripcion: 'Acabado con aceite mineral grado alimenticio. Ideal para quesos, parrilla y presentaciones.',
        precio: 24000,
        stock: 6,
        condicion: 'Artesanal',
        destacado: true,
        imagen: '../UTNIMAS/Content/Images/Markets/pagePropertiesImage.jpg',
        creadoEn: '2026-11-13T12:00:00Z'
      },
      {
        id: 'prod-5',
        empresaId: 'emp-5',
        nombre: 'Set de Regalo Bazar Creativo (3 piezas)',
        descripcion: 'Vela aromática de soya, taza cerámica esmaltada y libreta ecológica encuadernada a mano.',
        precio: 14900,
        stock: 18,
        condicion: 'Nuevo',
        destacado: true,
        imagen: '../UTNIMAS/Content/Images/Markets/Strasse-17-Juni-Flea-Market-3-800x400.jpg',
        creadoEn: '2026-11-14T15:00:00Z'
      },
      {
        id: 'prod-6',
        empresaId: 'emp-1',
        nombre: 'Cold Brew Concentrado 750ml',
        descripcion: 'Extracción en frío por 18 horas, listo para mezclar con agua, hielo o leche vegetal.',
        precio: 6200,
        stock: 12,
        condicion: 'Fresco',
        destacado: false,
        imagen: '../UTNIMAS/Content/Images/Markets/340436cf-5092-4e1a-aadc-e2e8c3034e85.jpg',
        creadoEn: '2026-11-15T09:30:00Z'
      },
      {
        id: 'prod-7',
        empresaId: 'emp-3',
        nombre: 'Delantal de Cocina Personalizado',
        descripcion: 'Tela resistente de fácil lavado con correas ajustables y bordado con nombre o logotipo.',
        precio: 11500,
        stock: 14,
        condicion: 'Bajo pedido',
        destacado: false,
        imagen: '../UTNIMAS/Content/Images/Markets/han-market-shops.jpg',
        creadoEn: '2026-11-16T16:10:00Z'
      },
      {
        id: 'prod-8',
        empresaId: 'emp-4',
        nombre: 'Soporte Ergonómico de Laptop en Madera',
        descripcion: 'Diseño liviano y ventilado, fabricado a mano con madera reforestada de Sarchí.',
        precio: 19500,
        stock: 8,
        condicion: 'Nuevo',
        destacado: false,
        imagen: '../UTNIMAS/Content/Images/Markets/pagePropertiesImage.jpg',
        creadoEn: '2026-11-17T17:00:00Z'
      }
    ];

    var mensajes = [
      {
        id: 'msg-1',
        destinatario: 'Cafetalera Monte Verde',
        empresaId: 'emp-1',
        productoNombre: 'Café Artesanal Monte Verde 500g',
        remitente: 'Andrea Quesada',
        correo: 'andrea.q@correo.cr',
        telefono: '+506 8811-2233',
        mensaje: 'Hola, ¿tienen envío a San Carlos para pedidos de 5 bolsas?',
        leido: false,
        creadoEn: '2026-11-18T14:20:00Z'
      }
    ];

    return {
      version: 2,
      empresas: empresas,
      productos: productos,
      mensajes: mensajes,
      favoritos: ['prod-1', 'prod-3']
    };
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function generateId(prefix) {
    return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
  }

  function sanitizeDigits(phone) {
    return String(phone || '').replace(/[^\d]/g, '');
  }

  function formatCRC(amount) {
    var num = Number(amount);
    if (!Number.isFinite(num) || num < 0) return 'Consultar';
    return '₡ ' + Math.round(num).toLocaleString('es-CR');
  }

  function isValidEmail(email) {
    var s = String(email || '').trim();
    if (!s) return true;
    var at = s.indexOf('@');
    var dot = s.lastIndexOf('.');
    return at > 0 && dot > at + 1 && dot < s.length - 1;
  }

  function isSafeImageSrc(src) {
    var s = String(src || '').trim();
    if (!s) return false;
    return /^(data:image\/(png|jpeg|jpg|webp|gif);base64,|https?:\/\/|\.\.?\/|\/)/i.test(s);
  }

  function buildContactLinks(empresa, producto) {
    var emp = empresa || {};
    var digits = sanitizeDigits(emp.telefono);
    var email = String(emp.email || '').trim();
    var prodText = producto && producto.nombre
      ? 'el producto "' + producto.nombre + '" (' + formatCRC(producto.precio) + ')'
      : 'sus productos publicados en UTN-IMAS Ideas Productivas';
    var waMsg = 'Hola ' + (emp.contacto || emp.nombre || '') + ', me interesa ' + prodText + '. ¿Podría brindarme más información?';
    var subject = producto && producto.nombre
      ? 'Consulta sobre ' + producto.nombre + ' — UTN-IMAS'
      : 'Contacto comercial — ' + (emp.nombre || 'UTN-IMAS');

    return {
      whatsapp: digits ? 'https://wa.me/' + digits + '?text=' + encodeURIComponent(waMsg) : '',
      email: email ? 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(waMsg) : '',
      tel: digits ? 'tel:+' + digits : ''
    };
  }

  function createStore(storageAdapter) {
    var storage = storageAdapter || (typeof localStorage !== 'undefined' ? localStorage : null);
    var state = load();

    function load() {
      if (storage) {
        try {
          var raw = storage.getItem(STORAGE_KEY);
          if (raw) {
            var parsed = JSON.parse(raw);
            if (parsed && Array.isArray(parsed.empresas) && Array.isArray(parsed.productos)) {
              return {
                version: 2,
                empresas: parsed.empresas,
                productos: parsed.productos,
                mensajes: Array.isArray(parsed.mensajes) ? parsed.mensajes : [],
                favoritos: Array.isArray(parsed.favoritos) ? parsed.favoritos : []
              };
            }
          }
        } catch (e) {}
      }
      return createSeedState();
    }

    function persist() {
      if (!storage) return true;
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(state));
        return true;
      } catch (e) {
        return false;
      }
    }

    function reload() {
      state = load();
      return getState();
    }

    function getState() {
      return clone(state);
    }

    function resetDemo() {
      state = createSeedState();
      persist();
      return getState();
    }

    function getEmpresaById(id) {
      for (var i = 0; i < state.empresas.length; i++) {
        if (state.empresas[i].id === id) return clone(state.empresas[i]);
      }
      return null;
    }

    function saveEmpresa(input) {
      var nombre = String((input && input.nombre) || '').trim();
      var contacto = String((input && input.contacto) || '').trim();
      var sector = String((input && input.sector) || 'Comercio').trim();
      var telefono = String((input && input.telefono) || '').trim();
      var email = String((input && input.email) || '').trim();
      var direccion = String((input && input.direccion) || '').trim();
      var descripcion = String((input && input.descripcion) || '').trim();
      var logo = isSafeImageSrc(input && input.logo) ? String(input.logo).trim() : DEFAULT_IMAGE;

      if (!nombre) return { ok: false, error: 'El nombre de la empresa es obligatorio.' };
      if (!contacto) return { ok: false, error: 'El nombre de contacto es obligatorio.' };
      if (!isValidEmail(email)) return { ok: false, error: 'El correo electrónico no tiene un formato válido.' };

      var existingIdx = -1;
      if (input && input.id) {
        for (var i = 0; i < state.empresas.length; i++) {
          if (state.empresas[i].id === input.id) {
            existingIdx = i;
            break;
          }
        }
      }

      var record;
      if (existingIdx >= 0) {
        record = Object.assign({}, state.empresas[existingIdx], {
          nombre: nombre,
          sector: sector,
          contacto: contacto,
          telefono: telefono,
          email: email,
          direccion: direccion,
          descripcion: descripcion,
          logo: logo,
          verificada: input.verificada !== false
        });
        state.empresas[existingIdx] = record;
      } else {
        record = {
          id: generateId('emp'),
          nombre: nombre,
          sector: sector,
          contacto: contacto,
          telefono: telefono,
          email: email,
          direccion: direccion,
          descripcion: descripcion,
          logo: logo,
          verificada: true,
          creadaEn: new Date().toISOString()
        };
        state.empresas.unshift(record);
      }

      if (!persist()) {
        return { ok: false, error: 'El almacenamiento local está lleno. Use una imagen más liviana.' };
      }
      return { ok: true, empresa: clone(record) };
    }

    function deleteEmpresa(id) {
      var before = state.empresas.length;
      state.empresas = state.empresas.filter(function (e) { return e.id !== id; });
      if (state.empresas.length === before) return { ok: false, error: 'Empresa no encontrada.' };
      var removedProdIds = {};
      state.productos = state.productos.filter(function (p) {
        if (p.empresaId === id) {
          removedProdIds[p.id] = true;
          return false;
        }
        return true;
      });
      state.favoritos = state.favoritos.filter(function (fid) { return !removedProdIds[fid]; });
      persist();
      return { ok: true };
    }

    function saveProducto(input) {
      var nombre = String((input && input.nombre) || '').trim();
      var empresaId = String((input && input.empresaId) || '').trim();
      var descripcion = String((input && input.descripcion) || '').trim();
      var precio = Number(input && input.precio);
      var stock = parseInt(input && input.stock, 10);
      var condicion = String((input && input.condicion) || 'Nuevo').trim();
      var destacado = Boolean(input && input.destacado);
      var imagen = isSafeImageSrc(input && input.imagen) ? String(input.imagen).trim() : DEFAULT_IMAGE;

      if (!nombre) return { ok: false, error: 'El nombre del producto es obligatorio.' };
      if (!getEmpresaById(empresaId)) return { ok: false, error: 'Seleccione una empresa registrada válida.' };
      if (!Number.isFinite(precio) || precio < 0) return { ok: false, error: 'El precio debe ser un número mayor o igual a cero.' };
      if (!Number.isFinite(stock) || stock < 0) stock = 1;

      var existingIdx = -1;
      if (input && input.id) {
        for (var i = 0; i < state.productos.length; i++) {
          if (state.productos[i].id === input.id) {
            existingIdx = i;
            break;
          }
        }
      }

      var record;
      if (existingIdx >= 0) {
        record = Object.assign({}, state.productos[existingIdx], {
          empresaId: empresaId,
          nombre: nombre,
          descripcion: descripcion,
          precio: Math.round(precio),
          stock: stock,
          condicion: condicion,
          destacado: destacado,
          imagen: imagen
        });
        state.productos[existingIdx] = record;
      } else {
        record = {
          id: generateId('prod'),
          empresaId: empresaId,
          nombre: nombre,
          descripcion: descripcion,
          precio: Math.round(precio),
          stock: stock,
          condicion: condicion,
          destacado: destacado,
          imagen: imagen,
          creadoEn: new Date().toISOString()
        };
        state.productos.unshift(record);
      }

      if (!persist()) {
        return { ok: false, error: 'No hay espacio suficiente en el navegador para esa imagen. Intente una imagen más pequeña.' };
      }
      return { ok: true, producto: clone(record) };
    }

    function deleteProducto(id) {
      var before = state.productos.length;
      state.productos = state.productos.filter(function (p) { return p.id !== id; });
      if (state.productos.length === before) return { ok: false, error: 'Producto no encontrado.' };
      state.favoritos = state.favoritos.filter(function (fid) { return fid !== id; });
      persist();
      return { ok: true };
    }

    function toggleFavorito(prodId) {
      var idx = state.favoritos.indexOf(prodId);
      var added;
      if (idx >= 0) {
        state.favoritos.splice(idx, 1);
        added = false;
      } else {
        state.favoritos.push(prodId);
        added = true;
      }
      persist();
      return { ok: true, added: added, count: state.favoritos.length };
    }

    function addMensaje(input) {
      var remitente = String((input && input.remitente) || '').trim();
      var correo = String((input && input.correo) || '').trim();
      var telefono = String((input && input.telefono) || '').trim();
      var mensaje = String((input && input.mensaje) || '').trim();
      var destinatario = String((input && input.destinatario) || 'UTN-IMAS Ideas Productivas').trim();
      var empresaId = String((input && input.empresaId) || '').trim();
      var productoNombre = String((input && input.productoNombre) || '').trim();

      if (!remitente) return { ok: false, error: 'Ingrese su nombre.' };
      if (!correo && !telefono) return { ok: false, error: 'Ingrese al menos un correo o teléfono de respuesta.' };
      if (!isValidEmail(correo)) return { ok: false, error: 'El correo electrónico no es válido.' };
      if (!mensaje || mensaje.length < 5) return { ok: false, error: 'Escriba un mensaje de al menos 5 caracteres.' };

      var record = {
        id: generateId('msg'),
        destinatario: destinatario,
        empresaId: empresaId,
        productoNombre: productoNombre,
        remitente: remitente,
        correo: correo,
        telefono: telefono,
        mensaje: mensaje,
        leido: false,
        creadoEn: new Date().toISOString()
      };
      state.mensajes.unshift(record);
      persist();
      return { ok: true, mensaje: clone(record) };
    }

    function markMensajeLeido(id, leido) {
      for (var i = 0; i < state.mensajes.length; i++) {
        if (state.mensajes[i].id === id) {
          state.mensajes[i].leido = leido !== false;
          persist();
          return { ok: true };
        }
      }
      return { ok: false };
    }

    function deleteMensaje(id) {
      state.mensajes = state.mensajes.filter(function (m) { return m.id !== id; });
      persist();
      return { ok: true };
    }

    function filterProductos(opts) {
      var o = opts || {};
      var q = String(o.query || '').trim().toLowerCase();
      var sector = String(o.sector || '').trim();
      var empresaId = String(o.empresaId || '').trim();
      var sort = String(o.sort || 'destacados');

      var empMap = {};
      state.empresas.forEach(function (e) { empMap[e.id] = e; });

      var list = state.productos.filter(function (p) {
        var emp = empMap[p.empresaId];
        if (empresaId && p.empresaId !== empresaId) return false;
        if (sector && (!emp || emp.sector !== sector)) return false;
        if (q) {
          var hay = (p.nombre + ' ' + p.descripcion + ' ' + (emp ? emp.nombre + ' ' + emp.sector : '')).toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      }).map(function (p) {
        return Object.assign({}, p, { empresa: empMap[p.empresaId] || null });
      });

      if (sort === 'precio-asc') {
        list.sort(function (a, b) { return a.precio - b.precio; });
      } else if (sort === 'precio-desc') {
        list.sort(function (a, b) { return b.precio - a.precio; });
      } else if (sort === 'recientes') {
        list.sort(function (a, b) { return String(b.creadoEn).localeCompare(String(a.creadoEn)); });
      } else {
        list.sort(function (a, b) {
          if (a.destacado !== b.destacado) return a.destacado ? -1 : 1;
          return String(b.creadoEn).localeCompare(String(a.creadoEn));
        });
      }
      return list;
    }

    function getCarouselSlides() {
      var featured = filterProductos({ sort: 'destacados' }).filter(function (p) { return p.destacado; });
      var slides = featured.slice(0, 6).map(function (p) {
        return {
          id: p.id,
          productId: p.id,
          badge: p.empresa ? p.empresa.sector : 'Ideas Productivas',
          title: p.nombre,
          subtitle: p.descripcion,
          priceText: formatCRC(p.precio),
          companyName: p.empresa ? p.empresa.nombre : 'UTN – IMAS',
          image: p.imagen || DEFAULT_IMAGE
        };
      });

      if (slides.length === 0) {
        slides.push({
          id: 'slide-default',
          productId: null,
          badge: 'UTN – IMAS',
          title: 'Compra y Venta de Emprendimientos Locales',
          subtitle: 'Registra tu microempresa y publica productos con vista previa de imágenes.',
          priceText: '',
          companyName: 'Ideas Productivas Costa Rica',
          image: '../UTNIMAS/Content/Images/Markets/340436cf-5092-4e1a-aadc-e2e8c3034e85.jpg'
        });
      }
      return slides;
    }

    function exportJson() {
      return JSON.stringify(state, null, 2);
    }

    function importJson(rawText) {
      try {
        var parsed = JSON.parse(String(rawText || ''));
        if (!parsed || !Array.isArray(parsed.empresas) || !Array.isArray(parsed.productos)) {
          return { ok: false, error: 'El archivo JSON no tiene una estructura válida de UTNIMAS.' };
        }
        state = {
          version: 2,
          empresas: parsed.empresas,
          productos: parsed.productos,
          mensajes: Array.isArray(parsed.mensajes) ? parsed.mensajes : [],
          favoritos: Array.isArray(parsed.favoritos) ? parsed.favoritos : []
        };
        persist();
        return { ok: true, countEmpresas: state.empresas.length, countProductos: state.productos.length };
      } catch (e) {
        return { ok: false, error: 'No se pudo leer el JSON: ' + e.message };
      }
    }

    return {
      STORAGE_KEY: STORAGE_KEY,
      THEME_KEY: THEME_KEY,
      SECTORES_IMAS: SECTORES_IMAS,
      DEFAULT_IMAGE: DEFAULT_IMAGE,
      getState: getState,
      reload: reload,
      resetDemo: resetDemo,
      getEmpresaById: getEmpresaById,
      saveEmpresa: saveEmpresa,
      deleteEmpresa: deleteEmpresa,
      saveProducto: saveProducto,
      deleteProducto: deleteProducto,
      toggleFavorito: toggleFavorito,
      addMensaje: addMensaje,
      markMensajeLeido: markMensajeLeido,
      deleteMensaje: deleteMensaje,
      filterProductos: filterProductos,
      getCarouselSlides: getCarouselSlides,
      exportJson: exportJson,
      importJson: importJson
    };
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    THEME_KEY: THEME_KEY,
    SECTORES_IMAS: SECTORES_IMAS,
    DEFAULT_IMAGE: DEFAULT_IMAGE,
    formatCRC: formatCRC,
    isValidEmail: isValidEmail,
    isSafeImageSrc: isSafeImageSrc,
    buildContactLinks: buildContactLinks,
    createSeedState: createSeedState,
    createStore: createStore
  };
});
