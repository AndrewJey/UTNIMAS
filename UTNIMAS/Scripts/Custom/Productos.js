var fotobase64 = "";

$(document).ready(function () {
    if ($('#tableProductos').length && $.fn.DataTable) {
        $('#tableProductos').DataTable();
    }

    $('#foto').on('change', function (e) {
        encodeImageFileAsURL(this);
    });

    var dropzone = document.getElementById('utnDropzone');
    if (dropzone) {
        ['dragenter', 'dragover'].forEach(function (ev) {
            dropzone.addEventListener(ev, function (e) {
                e.preventDefault();
                dropzone.classList.add('is-dragover');
            });
        });
        ['dragleave', 'drop'].forEach(function (ev) {
            dropzone.addEventListener(ev, function (e) {
                e.preventDefault();
                dropzone.classList.remove('is-dragover');
            });
        });
        dropzone.addEventListener('drop', function (e) {
            var files = e.dataTransfer && e.dataTransfer.files;
            if (files && files.length > 0) {
                previewImageFile(files[0]);
            }
        });
    }
});

function previewImageFile(file) {
    if (!file) return;
    if (!/^image\//.test(file.type)) {
        alert('Seleccione un archivo de imagen válido (JPG, PNG o WebP).');
        return;
    }
    if (file.size > 4 * 1024 * 1024) {
        alert('La imagen excede 4 MB. Seleccione una imagen más liviana.');
        return;
    }
    var reader = new FileReader();
    reader.onload = function (ev) {
        fotobase64 = ev.target.result;
        $('#imgSalida').attr('src', fotobase64);
        $('#imgPreviewMeta').text(file.name + ' (' + Math.round(file.size / 1024) + ' KB)');
    };
    reader.readAsDataURL(file);
}

function encodeImageFileAsURL(element) {
    if (!element || !element.files || !element.files.length) return;
    previewImageFile(element.files[0]);
}

function clearProductImagePreview() {
    fotobase64 = "";
    $('#foto').val('');
    $('#imgSalida').attr('src', '/Content/Images/NoDisponible.jpg');
    $('#imgPreviewMeta').text('Sin imagen seleccionada');
}

function createP() {
    var nameP = ($('#nameP').val() || '').trim();
    var descript = ($('#descript').val() || '').trim();
    var precio = parseInt($('#precioP').val(), 10) || 1;
    var empresa = $('#empresa').val() || '1';

    if (!nameP) {
        alert('Ingrese el nombre del producto.');
        return;
    }

    var payload = {
        NOMBRE_PRODUCTO: nameP,
        DESCRIP_PRODUCTO: descript,
        ID_PRECIO: precio,
        FOTO_PRODUCTO: fotobase64 || '/Content/Images/NoDisponible.jpg',
        EMPRESA_ID: empresa
    };

    HTTP_POST('/Productos/Create', payload, function (response) {
        alert((response && response.Mensaje) ? response.Mensaje : 'Producto procesado.');
        if (response && response.Success) {
            window.location.href = '/Productos/Productos';
        }
    });
}

function openProductPreviewFromEl(el) {
    if (!el) return;
    loadinfimg(
        el.getAttribute('data-foto') || '/Content/Images/NoDisponible.jpg',
        el.getAttribute('data-nombre') || '',
        el.getAttribute('data-desc') || '',
        el.getAttribute('data-empresa-id') || '1',
        el.getAttribute('data-precio') || ''
    );
}

function loadinfimg(foto, nombre, descripcion, idEmpresa, precio) {
    $('#ImgModal').attr('src', foto || '/Content/Images/NoDisponible.jpg');
    $('#NombreProducto').text(nombre || 'Producto');
    $('#Descripcion').text(descripcion || 'Sin descripción');
    if ($('#PrecioModal').length) {
        $('#PrecioModal').text(precio ? ('₡ ' + Number(precio).toLocaleString('es-CR')) : 'Consultar');
    }

    $.ajax({
        url: '/Productos/ObtenerInfo',
        type: 'GET',
        data: { Id: idEmpresa },
        success: function (response) {
            if (!response || !response.Success) return;
            $('#NombreEmpresa').text(response.NOMBRE_EMPRESA || 'Emprendimiento UTN-IMAS');
            $('#Direccion').text(response.DIRECCION_EMPRESA || 'Costa Rica');
            $('#Contacto').text(response.NOMBRE_CONTACTO || 'Atención Comercial');
            $('#Sector').text(response.SECTOR_PRODUCCION || 'Comercio');

            var telDigits = String(response.TELEF_CONTACTO || '').replace(/[^\d]/g, '');
            var email = String(response.EMAIL_EMPRESA || '').trim();
            var waText = encodeURIComponent('Hola, me interesa el producto "' + (nombre || '') + '" visto en UTN-IMAS Ideas Productivas.');

            if ($('#btnContactoWA').length) {
                $('#btnContactoWA').attr('href', telDigits ? ('https://wa.me/' + telDigits + '?text=' + waText) : '#').toggle(!!telDigits);
            }
            if ($('#btnContactoEmail').length) {
                $('#btnContactoEmail').attr('href', email ? ('mailto:' + email + '?subject=' + encodeURIComponent('Consulta: ' + (nombre || ''))) : '#').toggle(!!email);
            }
            if ($('#btnContactoTel').length) {
                $('#btnContactoTel').attr('href', telDigits ? ('tel:+' + telDigits) : '#').toggle(!!telDigits);
            }
        }
    });
}
