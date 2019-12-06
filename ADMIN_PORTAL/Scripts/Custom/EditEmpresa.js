var empresa = document.getElementById("IdEmpresa").innerHTML;
$(document).ready(function () {
    if (empresa) {
        HTTP_GET("/Empresas/GetOnlyEmpresa", null, function (response) {
            FillInformation(response.data);
        }, { Id: empresa })
    }
});

function FillInformation(data) {
    var name = document.getElementById("name");
    var direction = document.getElementById("direction");
    var contactName = document.getElementById("contactName");
    var tel = document.getElementById("tel");
    var email = document.getElementById("email");
    var production = document.getElementById("production");
    var cliente = document.getElementById("cliente");
    var empresaId = document.getElementById("Empresa_ID");
    name.value = data.NOMBRE_EMPRESA;
    direction.value = data.DIRECCION_EMPRESA;
    contactName.value = data.NOMBRE_CONTACTO;
    tel.value = data.TELEF_CONTACTO;
    email.value = data.EMIAL_EMPRESA;
    production.value = data.SECTOR_PRODUCCION;
    cliente.value = data.ID_CLIENTE;
    empresaId.value = data.EMPRESA_ID;
}

function Edit() {
    var name = document.getElementById("name").value;
    var direction = document.getElementById("direction").value;
    var contactName = document.getElementById("contactName").value;
    var tel = document.getElementById("tel").value;
    var email = document.getElementById("email").value;
    var production = document.getElementById("production").value;
    var empresaId = document.getElementById("Empresa_ID").value;
    var cliente = "1";
    console.log(direction);
    console.log(email);
    var Empresa =
    {
        NOMBRE_EMPRESA: name,
        EMPRESA_ID: empresaId,
        DIRECCIÓN_EMPRESA: direction,
        NOMBRE_CONTACTO: contactName,
        TELEF_CONTACTO: tel,
        EMAIL_EMPRESA: email,
        SECTOR_PRODUCCION: production,
        ID_CLIENTE: cliente
    };
    HTTP_POST("/Empresas/EditarEm", { Empresa: Empresa }, function (repsonse) {
        window.location.href = "/Empresas/Index";
    });
}