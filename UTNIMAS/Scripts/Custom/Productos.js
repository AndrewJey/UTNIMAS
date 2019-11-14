$(document).ready(function () {
    $('#tableProductos').DataTable();
});

/*Here Starts the Magic 2.0*/

function createP() {
    var nameP = document.getElementById("nameP").value;
    var tipoPrecio = document.getElementById("tipoPrecio").value;
    var descript = document.getElementById("descript").value;
    var tel = document.getElementById("foto").value;
    var empresa = document.getElementById("empresa").value;
    var Empresa =
    {
        NOMBRE_PRODUCTO: nameP,
        ID_PRECIO: tipoPrecio,
        DESCRIP_PRODUCTO: descript,
        FOTO_PRODUCTO: foto,
        EMPRESA_ID: empresa,
    };
    console.log(Producto);
    HTTP_POST("/Productos/Create", Empresa, function (response) {
        window.location.href = "/Productos/Index";
    })
}

function callEditView() {
    var id = document.getElementById("Producto_ID").innerText;
    console.log(id);
    if (id) {
        HTTP_GET("/Productos/EditarProducto", null, function (response) {
            window.location.href = "/Productos/Index";
        }, { Id: id })
    }
}

function Delete() {
    var id = document.getElementById("Producto_ID").innerText;
    if (id) {
        HTTP_POST("/Productos/DeleteProducto", { ID: id }, function (response) {
            window.location.href = "/Productos/Index";
        })
    }
}