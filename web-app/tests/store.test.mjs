import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const UtnimasStore = require('../store.js');

function createMemoryStorage() {
  const map = new Map();
  return {
    getItem(k) { return map.has(k) ? map.get(k) : null; },
    setItem(k, v) { map.set(k, String(v)); },
    removeItem(k) { map.delete(k); }
  };
}

test('seed state initializes 5 companies, 8 products, and featured carousel slides', () => {
  const storage = createMemoryStorage();
  const store = UtnimasStore.createStore(storage);
  const st = store.getState();

  assert.equal(st.empresas.length, 5);
  assert.equal(st.productos.length, 8);
  assert.ok(st.mensajes.length >= 1);

  const slides = store.getCarouselSlides();
  assert.equal(slides.length, 5);
  assert.ok(slides[0].image.includes('UTNIMAS/Content/Images/Markets/'));
});

test('empresa CRUD validates inputs, persists across store reload, and cascades product deletion', () => {
  const storage = createMemoryStorage();
  const store = UtnimasStore.createStore(storage);

  assert.equal(store.saveEmpresa({ nombre: '', contacto: 'Ana' }).ok, false);
  assert.equal(store.saveEmpresa({ nombre: 'Panadería Sol', contacto: 'Ana', email: 'bad-email' }).ok, false);

  const created = store.saveEmpresa({
    nombre: 'Panadería Sol',
    sector: 'Alimentación y Bebidas',
    contacto: 'Ana Mora',
    telefono: '+506 8888-1122',
    email: 'hola@panaderiasol.cr',
    logo: 'data:image/png;base64,iVBORw0KGgo='
  });
  assert.equal(created.ok, true);
  assert.equal(created.empresa.nombre, 'Panadería Sol');

  const updated = store.saveEmpresa({
    id: created.empresa.id,
    nombre: 'Panadería Sol Artesanal',
    sector: 'Alimentación y Bebidas',
    contacto: 'Ana Mora',
    telefono: '+506 8888-1122',
    email: 'hola@panaderiasol.cr'
  });
  assert.equal(updated.ok, true);
  assert.equal(updated.empresa.nombre, 'Panadería Sol Artesanal');

  // Create product belonging to the new company
  const prod = store.saveProducto({
    nombre: 'Pan de Masa Madre',
    empresaId: created.empresa.id,
    precio: 3200,
    stock: 12,
    destacado: true,
    imagen: 'data:image/jpeg;base64,/9j/4AAQ='
  });
  assert.equal(prod.ok, true);
  store.toggleFavorito(prod.producto.id);

  // Verify persistence in a brand-new store instance sharing the same storage
  const store2 = UtnimasStore.createStore(storage);
  assert.equal(store2.getEmpresaById(created.empresa.id).nombre, 'Panadería Sol Artesanal');
  assert.ok(store2.getState().productos.some(p => p.id === prod.producto.id));
  assert.ok(store2.getState().favoritos.includes(prod.producto.id));

  // Delete company cascades product and favorite removal
  const del = store2.deleteEmpresa(created.empresa.id);
  assert.equal(del.ok, true);
  assert.equal(store2.getEmpresaById(created.empresa.id), null);
  assert.equal(store2.getState().productos.some(p => p.id === prod.producto.id), false);
  assert.equal(store2.getState().favoritos.includes(prod.producto.id), false);
});

test('filterProductos supports search, sector, company, and price sorting', () => {
  const store = UtnimasStore.createStore(createMemoryStorage());

  const coffee = store.filterProductos({ query: 'café' });
  assert.ok(coffee.length >= 1);
  assert.ok(coffee.every(p => p.empresaId === 'emp-1'));

  const wood = store.filterProductos({ sector: 'Producción Madera' });
  assert.equal(wood.length, 2);

  const asc = store.filterProductos({ sort: 'precio-asc' });
  for (let i = 1; i < asc.length; i++) {
    assert.ok(asc[i].precio >= asc[i - 1].precio);
  }

  const desc = store.filterProductos({ sort: 'precio-desc' });
  for (let i = 1; i < desc.length; i++) {
    assert.ok(desc[i].precio <= desc[i - 1].precio);
  }
});

test('contact links, messages inbox, safe image validation, and JSON export/import round-trip', () => {
  const storage = createMemoryStorage();
  const store = UtnimasStore.createStore(storage);

  assert.equal(UtnimasStore.isSafeImageSrc('javascript:alert(1)'), false);
  assert.equal(UtnimasStore.isSafeImageSrc('data:image/jpeg;base64,abcd'), true);

  const emp = store.getEmpresaById('emp-1');
  const links = UtnimasStore.buildContactLinks(emp, { nombre: 'Café', precio: 4800 });
  assert.ok(links.whatsapp.startsWith('https://wa.me/50688451201?text='));
  assert.ok(links.email.startsWith('mailto:ventas@monteverdecafe.cr?subject='));
  assert.equal(links.tel, 'tel:+50688451201');

  assert.equal(store.addMensaje({ remitente: '', mensaje: 'hola mundo' }).ok, false);
  const msg = store.addMensaje({
    destinatario: emp.nombre,
    empresaId: emp.id,
    remitente: 'Carlos',
    telefono: '8800-9900',
    mensaje: 'Quisiera pedir 3 bolsas de café.'
  });
  assert.equal(msg.ok, true);
  assert.equal(store.markMensajeLeido(msg.mensaje.id, true).ok, true);

  const backup = store.exportJson();
  const storeB = UtnimasStore.createStore(createMemoryStorage());
  const imported = storeB.importJson(backup);
  assert.equal(imported.ok, true);
  assert.equal(storeB.getState().mensajes.some(m => m.id === msg.mensaje.id && m.leido === true), true);
  assert.equal(storeB.importJson('{invalid').ok, false);
});
