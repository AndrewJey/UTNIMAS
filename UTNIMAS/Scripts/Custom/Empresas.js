$(document).ready(function () {
    $('#tableEmpresas').DataTable();
    if (document.getElementById("mensaje").innerHTML != "") {
        alert(document.getElementById("mensaje").innerHTML);
    }
});

/*Here Starts the Magic*/
function createE() {
    var name = document.getElementById("name").value;
    var direction = document.getElementById("direction").value;
    var contactName = document.getElementById("contactName").value;
    var tel = document.getElementById("tel").value;
    var email = document.getElementById("email").value;
    var production = document.getElementById("production").value;
    var cliente = 1;
    var Empresa =
    {
        NOMBRE_EMPRESA: name,
        DIRECCION_EMPRESA: direction,
        NOMBRE_CONTACTO: contactName,
        TELEF_CONTACTO: tel,
        EMAIL_EMPRESA: email,
        SECTOR_PRODUCCION: production,
        ID_CLIENTE: cliente
    };
    console.log(Empresa);
    HTTP_POST("/Empresas/Create", Empresa, function (response) {
        if (response.Success) {
            alert(response.Mensaje);
        } else {
            alert(response.Mensaje);
        }
        window.location.href = "/Home/Index";
    })
}

function callEditView() {
    var id = document.getElementById("empresa_ID").innerText;
    console.log(id);
    if (id) {
        HTTP_GET("/Empresas/EditarEmpresa", null, function (response) {
            window.location.href = "/Empresas/Index";
        }, { Id: id })
    }
}

function Delete() {
    var id = document.getElementById("empresa_ID").innerText;
    if (id) {
        HTTP_POST("/Empresas/DeleteEmpresa", { ID: id }, function (response) {
            window.location.href = "/Empresas/Index";
        })
    }

}