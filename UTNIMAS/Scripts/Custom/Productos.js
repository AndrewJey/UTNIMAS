$(document).ready(function () {
    $('#tableProductos').DataTable();

    $(function () {
        $('#file-input').change(function (e) {
            addImage(e);
        });

        function addImage(e) {
            var file = e.target.files[0],
                imageType = /image.*/;

            if (!file.type.match(imageType))
                return;

            var reader = new FileReader();
            reader.onload = fileOnload;
            reader.readAsDataURL(file);
        }

        function fileOnload(e) {
            var result = e.target.result;
            $('#imgSalida').attr("src", result);
        }
    });
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
        console.log(response);
    })
}

function loadinfimg(nombreProductos,Descripcion,IdEmpresa ) {
    HTTP_GET("/Productos/obtenerInfo", null, function (response) {
        document.getElementById("NombreProducto").innerHTML = nombreProductos;
        document.getElementById("Descripcion").innerHTML = Descripcion;
        document.getElementById("Contacto").innerHTML = response.NOMBRE_CONTACTO;
        document.getElementById("NombreEmpresa").innerHTML = response.NOMBRE_EMPRESA;
        document.getElementById("Direccion").innerHTML = response.DIRECCION_EMPRESA;
        document.getElementById("Sector").innerHTML = response.SECTOR_PRODUCCION;
    }, { Id: IdEmpresa })
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