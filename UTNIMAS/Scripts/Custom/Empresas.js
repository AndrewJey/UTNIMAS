$(document).ready(function () {
    if ($('#tableEmpresas').length && $.fn.DataTable) {
        $('#tableEmpresas').DataTable();
    }
    var msgEl = document.getElementById('mensaje');
    if (msgEl && msgEl.innerHTML.trim() !== '') {
        alert(msgEl.innerHTML.trim());
    }
});

function createE() {
    var name = ($('#name').val() || '').trim();
    var direction = ($('#direction').val() || '').trim();
    var contactName = ($('#contactName').val() || '').trim();
    var tel = ($('#tel').val() || '').trim();
    var email = ($('#email').val() || '').trim();
    var production = ($('#production').val() || '').trim();

    if (!name || !contactName) {
        alert('Ingrese el nombre de la empresa y el nombre de contacto.');
        return;
    }

    var payload = {
        NOMBRE_EMPRESA: name,
        DIRECCION_EMPRESA: direction,
        NOMBRE_CONTACTO: contactName,
        TELEF_CONTACTO: tel,
        EMAIL_EMPRESA: email,
        SECTOR_PRODUCCION: production,
        ID_CLIENTE: 1
    };

    HTTP_POST('/Empresas/Create', payload, function (response) {
        alert((response && response.Mensaje) ? response.Mensaje : 'Empresa registrada.');
        window.location.href = '/Home/Index';
    });
}

function callEditView() {
    var idEl = document.getElementById('empresa_ID');
    var id = idEl ? idEl.innerText.trim() : '';
    if (id) {
        HTTP_GET('/Empresas/EditarEmpresa', null, function () {
            window.location.href = '/Empresas/Index';
        }, { Id: id });
    }
}

function Delete() {
    var idEl = document.getElementById('empresa_ID');
    var id = idEl ? idEl.innerText.trim() : '';
    if (id && confirm('¿Desea eliminar esta empresa?')) {
        HTTP_POST('/Empresas/DeleteEmpresa', { ID: id }, function () {
            window.location.href = '/Empresas/Index';
        });
    }
}
