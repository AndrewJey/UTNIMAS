var fotobase64;
var pathimage;
var fileByteArray = [];
$(document).ready(function () {
    $('#tableProductos').DataTable();
  
    $(function () {
        $('#foto').change(function (e) {
            fotobase64 = "";
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

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {

        fotobase64 = reader.result
    }
    reader.readAsDataURL(file);
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function getB64Str(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
/*Here Starts the Magic 2.0*/

function createP() {
    var nameP = document.getElementById("nameP").value;
    //var tipoPrecio = document.getElementById("tipoPrecio").value;
    var descript = document.getElementById("descript").value;
    var foto = pathimage;
    var empresa = document.getElementById("empresa").value;
    var Empresa =
    {
        NOMBRE_PRODUCTO: nameP,
        DESCRIP_PRODUCTO: descript,
        ID_PRECIO: 1,
        FOTO_PRODUCTO: fotobase64,
        EMPRESA_ID: empresa,
    };
    console.log(Empresa);
    HTTP_POST("/Productos/Create", Empresa  , function (response) {
        console.log(response);
        showSuccess(response, function () {
            window.location.href = "/Home/Index";
        });
    })
}

function loadinfimg(foto,nombreProductos,Descripcion,IdEmpresa ) {
    HTTP_GET("/Productos/obtenerInfo", null, function (response) {
        document.getElementById("NombreProducto").innerHTML = nombreProductos;
        document.getElementById("Descripcion").innerHTML = Descripcion;
        document.getElementById("Contacto").innerHTML = response.NOMBRE_CONTACTO;
        document.getElementById("NombreEmpresa").innerHTML = response.NOMBRE_EMPRESA;
        document.getElementById("Direccion").innerHTML = response.DIRECCION_EMPRESA;
        document.getElementById("Sector").innerHTML = response.SECTOR_PRODUCCION;
        $('#ImgModal').attr("src", foto);
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